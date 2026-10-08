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
  posyandu: { select: { id: true, nama: true, kode: true } },
  puskesmas: { select: { id: true, nama: true, kode: true } },
};

const signToken = (userId) =>
  jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

// Registrasi publik: selalu berperan sebagai "Masyarakat".
// Akun ADMIN / KADER dibuat oleh admin lewat POST /api/users.
async function register(input) {
  const exists = await prisma.user.findUnique({ where: { email: input.email } });
  if (exists) throw httpError(409, "Email sudah terdaftar");

  const user = await prisma.user.create({
    data: {
      ...input,
      password: await bcrypt.hash(input.password, 10),
      role: "Masyarakat",
    },
    select: publicUser,
  });

  return { token: signToken(user.id), user };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  const valid = user && (await bcrypt.compare(password, user.password));

  if (!valid) throw httpError(401, "Email atau password salah");
  if (!user.aktif) throw httpError(403, "Akun nonaktif");

  const profile = await getProfile(user.id);
  return { token: signToken(user.id), user: profile };
}

function getProfile(userId) {
  return prisma.user.findUnique({ where: { id: userId }, select: publicUser });
}

export { register, login, getProfile };
