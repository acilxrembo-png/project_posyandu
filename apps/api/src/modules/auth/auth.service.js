import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import env from "../../config/env.config.js";
import prisma from "../../lib/prisma.js";
import httpError from "../../utils/http-error.util.js";

const publicUser = {
  id: true,
  nama: true,
  email: true,
  telepon: true,
  role: true,
  aktif: true,
  posyanduId: true,
  puskesmasId: true,
  wargaId: true,
  posyandu: { select: { id: true, nama: true, kode: true } },
  puskesmas: { select: { id: true, nama: true, kode: true } },
};

const signToken = (userId) =>
  jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

async function register(input) {
  const password = await bcrypt.hash(input.password, 10);
  await prisma.$transaction(async (tx) => {
    const exists = await tx.user.findUnique({ where: { email: input.email }, select: { id: true } });
    if (exists) throw httpError(409, "Email sudah terdaftar");

    const posyandu = await tx.posyandu.findFirst({
      where: { id: input.posyanduId, aktif: true },
      select: { id: true },
    });
    if (!posyandu) throw httpError(400, "Posyandu tidak tersedia");

    const existingWarga = await tx.warga.findUnique({
      where: { nik: input.nik },
      select: {
        posyanduId: true,
        akun: { select: { id: true } },
      },
    });
    if (existingWarga?.posyanduId !== undefined && existingWarga.posyanduId !== input.posyanduId) {
      throw httpError(409, "NIK sudah terdaftar pada Posyandu lain");
    }
    if (existingWarga?.akun) throw httpError(409, "NIK sudah terhubung ke akun lain");

    await tx.user.create({
      data: {
        nama: input.nama,
        email: input.email,
        telepon: input.telepon || null,
        password,
        role: "Masyarakat",
        aktif: false,
        posyanduId: input.posyanduId,
        pendaftaran: {
          create: {
            nama: input.nama,
            nik: input.nik,
            tanggalLahir: new Date(`${input.tanggalLahir}T00:00:00.000Z`),
            jenisKelamin: input.jenisKelamin,
            telepon: input.telepon || null,
            posyanduId: input.posyanduId,
          },
        },
      },
    });
  });

  return { message: "Pendaftaran diterima dan menunggu verifikasi Kader." };
}

async function listRegistrationPosyandu() {
  const data = await prisma.posyandu.findMany({
    where: { aktif: true },
    select: { id: true, nama: true, desa: true, kecamatan: true, kabupaten: true },
    orderBy: { nama: "asc" },
  });
  return { data };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  const valid = user && (await bcrypt.compare(password, user.password));

  if (!valid) throw httpError(401, "Email atau password salah");
  if (!user.aktif) {
    if (user.role === "Masyarakat") {
      throw httpError(403, "Pendaftaran Anda masih menunggu verifikasi Kader.");
    }
    throw httpError(403, "Akun nonaktif");
  }

  const profile = await getProfile(user.id);
  return { token: signToken(user.id), user: profile };
}

function getProfile(userId) {
  return prisma.user.findUnique({ where: { id: userId }, select: publicUser });
}

export { register, listRegistrationPosyandu, login, getProfile };
