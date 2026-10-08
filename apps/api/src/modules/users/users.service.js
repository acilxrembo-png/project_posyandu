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
  puskesmasId: true,
  createdAt: true,
  updatedAt: true,
};

async function list(query) {
  const { page, limit, skip } = parsePagination(query);

  const where = {};
  if (query.role) where.role = String(query.role);
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
  const user = await prisma.user.findUnique({ where: { id }, select: userSelect });
  if (!user) throw httpError(404, "User tidak ditemukan");
  return user;
}

async function create(input) {
  const data = { ...input, password: await bcrypt.hash(input.password, 10) };
  return prisma.user.create({ data, select: userSelect });
}

async function update(id, input, actingUser) {
  // Cegah admin menonaktifkan / menurunkan role dirinya sendiri
  if (id === actingUser.id && (input.aktif === false || (input.role && input.role !== "ADMIN"))) {
    throw httpError(400, "Tidak bisa menonaktifkan atau menurunkan role akun sendiri");
  }

  const data = { ...input };
  if (data.password) data.password = await bcrypt.hash(data.password, 10);

  return prisma.user.update({ where: { id }, data, select: userSelect });
}

async function remove(id, actingUser) {
  if (id === actingUser.id) throw httpError(400, "Tidak bisa menghapus akun sendiri");
  await prisma.user.delete({ where: { id } });
}

export { list, getById, create, update, remove };
