import bcrypt from "bcryptjs";

import prisma from "../../lib/prisma.js";
import httpError from "../../utils/http-error.util.js";
import { parsePagination, buildMeta } from "../../utils/crud.util.js";

const userSelect = {
  id: true,
  nama: true,
  email: true,
  telepon: true,
  role: true,
  aktif: true,
  posyanduId: true,
  posyandu: { select: { id: true, nama: true } },
  puskesmasId: true,
  createdAt: true,
  updatedAt: true,
};

async function list(query) {
  const { page, limit, skip } = parsePagination(query);

  const where = { role: "KADER" };
  if (query.search) {
    const term = String(query.search);
    where.OR = [
      { nama: { contains: term, mode: "insensitive" } },
      { email: { contains: term, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: userSelect,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return { data, meta: buildMeta(page, limit, total) };
}

async function getById(id) {
  const user = await prisma.user.findFirst({ where: { id, role: "KADER" }, select: userSelect });
  if (!user) throw httpError(404, "User tidak ditemukan");
  return user;
}

async function create(input) {
  const posyandu = await prisma.posyandu.findFirst({
    where: { id: input.posyanduId, aktif: true },
    select: { id: true },
  });
  if (!posyandu) throw httpError(400, "Pilih Posyandu yang aktif untuk akun Kader");

  const data = {
    ...input,
    role: "KADER",
    aktif: true,
    password: await bcrypt.hash(input.password, 10),
  };
  return prisma.user.create({ data, select: userSelect });
}

async function remove(id) {
  const kader = await prisma.user.findFirst({
    where: { id, role: "KADER" },
    select: { id: true },
  });
  if (!kader) throw httpError(404, "Akun Kader tidak ditemukan");
  await prisma.user.delete({ where: { id: kader.id } });
}

export { list, getById, create, remove };
