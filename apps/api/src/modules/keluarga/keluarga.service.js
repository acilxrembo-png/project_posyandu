import prisma from "../../lib/prisma.js";
import httpError from "../../utils/http-error.util.js";
import { cleanBody, buildSearch, parsePagination, buildMeta } from "../../utils/crud.util.js";

// ---------- Konfigurasi modul ----------
// Field yang dicari lewat ?search=...
const SEARCH_FIELDS = ["nomorKk", "kepalaKeluarga"];
const ORDER_BY = { createdAt: "desc" };
const INCLUDE = { _count: { select: { anggota: true } } };

// Kader hanya boleh mengakses data posyandu miliknya
function scopeWhere(user) {
  if (user.role !== "KADER") return {};
  if (!user.posyanduId) {
    throw httpError(403, "Akun kader belum terhubung ke posyandu");
  }
  return { posyanduId: user.posyanduId };
}

// GET /  -> daftar data (pagination, filter, search)
async function list(query, user) {
  const { page, limit, skip } = parsePagination(query);

  const where = { ...scopeWhere(user) };

  if (query.search) {
    where.OR = buildSearch(SEARCH_FIELDS, String(query.search));
  }

  const [data, total] = await Promise.all([
    prisma.keluarga.findMany({ where, include: INCLUDE, orderBy: ORDER_BY, skip, take: limit }),
    prisma.keluarga.count({ where }),
  ]);

  return { data, meta: buildMeta(page, limit, total) };
}

// GET /:id  -> detail satu data
async function getById(id, user) {
  const item = await prisma.keluarga.findFirst({
    where: { id, ...scopeWhere(user) },
    include: INCLUDE,
  });
  if (!item) throw httpError(404, "Data tidak ditemukan");
  return item;
}

// POST /  -> tambah data baru
async function create(body, user) {
  const data = cleanBody(body);

  // Kader: data otomatis masuk ke posyandunya
  if (user.role === "KADER") data.posyanduId = scopeWhere(user).posyanduId;

  return prisma.keluarga.create({ data, include: INCLUDE });
}

// PATCH/PUT /:id  -> ubah data
async function update(id, body, user) {
  const exists = await prisma.keluarga.findFirst({
    where: { id, ...scopeWhere(user) },
    select: { id: true },
  });
  if (!exists) throw httpError(404, "Data tidak ditemukan");

  const data = cleanBody(body);
  if (user.role === "KADER") delete data.posyanduId; // kader tidak boleh pindah posyandu

  return prisma.keluarga.update({ where: { id }, data, include: INCLUDE });
}

// DELETE /:id  -> hapus data
async function remove(id, user) {
  const exists = await prisma.keluarga.findFirst({
    where: { id, ...scopeWhere(user) },
    select: { id: true },
  });
  if (!exists) throw httpError(404, "Data tidak ditemukan");

  await prisma.keluarga.delete({ where: { id } });
}

export { list, getById, create, update, remove };
