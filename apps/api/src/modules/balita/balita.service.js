import prisma from "../../lib/prisma.js";
import httpError from "../../utils/http-error.util.js";
import { cleanBody, buildSearch, parsePagination, buildMeta } from "../../utils/crud.util.js";

// ---------- Konfigurasi modul ----------
// Query string yang boleh dipakai sebagai filter, mis. ?ibuId=...
const FILTERS = ["ibuId"];
// Field yang dicari lewat ?search=...
const SEARCH_FIELDS = ["nomorKia", "warga.nama"];
const ORDER_BY = { createdAt: "desc" };
const INCLUDE = {
  warga: true,
  ibu: { select: { id: true, nama: true } },
};

function scopeWhere(user) {
  if (user.role !== "KADER") return {};
  if (!user.posyanduId) {
    throw httpError(403, "Akun kader belum terhubung ke posyandu");
  }
  return { warga: { posyanduId: user.posyanduId } };
}

// GET /  -> daftar data (pagination, filter, search)
async function list(query, user) {
  const { page, limit, skip } = parsePagination(query);

  const where = { ...scopeWhere(user) };

  for (const field of FILTERS) {
    if (query[field]) where[field] = String(query[field]);
  }

  if (query.search) {
    where.OR = buildSearch(SEARCH_FIELDS, String(query.search));
  }

  const [data, total] = await Promise.all([
    prisma.balita.findMany({ where, include: INCLUDE, orderBy: ORDER_BY, skip, take: limit }),
    prisma.balita.count({ where }),
  ]);

  return { data, meta: buildMeta(page, limit, total) };
}

// GET /:id  -> detail satu data
async function getById(id, user) {
  const item = await prisma.balita.findFirst({
    where: { id, ...scopeWhere(user) },
    include: INCLUDE,
  });
  if (!item) throw httpError(404, "Data tidak ditemukan");
  return item;
}

// POST /  -> tambah data baru
async function create(body, user) {
  const data = cleanBody(body);
  if (user.role === "KADER") {
    const allowedWhere = { posyanduId: user.posyanduId };
    const warga = await prisma.warga.findFirst({
      where: { id: data.wargaId, ...allowedWhere },
      select: { id: true },
    });
    if (!warga) throw httpError(404, "Data warga tidak ditemukan");
    if (data.ibuId) {
      const ibu = await prisma.warga.findFirst({
        where: { id: data.ibuId, ...allowedWhere },
        select: { id: true },
      });
      if (!ibu) throw httpError(404, "Data ibu tidak ditemukan");
    }
  }

  return prisma.balita.create({ data, include: INCLUDE });
}

// PATCH/PUT /:id  -> ubah data
async function update(id, body, user) {
  const data = cleanBody(body);
  const existing = await prisma.balita.findFirst({
    where: { id, ...scopeWhere(user) },
    select: { id: true },
  });
  if (!existing) throw httpError(404, "Data tidak ditemukan");
  if (user.role === "KADER" && data.wargaId) {
    const warga = await prisma.warga.findFirst({
      where: { id: data.wargaId, posyanduId: user.posyanduId },
      select: { id: true },
    });
    if (!warga) throw httpError(404, "Data warga tidak ditemukan");
  }
  if (user.role === "KADER" && data.ibuId) {
    const ibu = await prisma.warga.findFirst({
      where: { id: data.ibuId, posyanduId: user.posyanduId },
      select: { id: true },
    });
    if (!ibu) throw httpError(404, "Data ibu tidak ditemukan");
  }

  // Error P2025 (data tidak ada) otomatis menjadi 404 di error middleware
  return prisma.balita.update({ where: { id }, data, include: INCLUDE });
}

// DELETE /:id  -> hapus data
async function remove(id, user) {
  const existing = await prisma.balita.findFirst({
    where: { id, ...scopeWhere(user) },
    select: { id: true },
  });
  if (!existing) throw httpError(404, "Data tidak ditemukan");
  await prisma.balita.delete({ where: { id } });
}

export { list, getById, create, update, remove };
