import prisma from "../../lib/prisma.js";
import httpError from "../../utils/http-error.util.js";
import { cleanBody, buildSearch, parsePagination, buildMeta } from "../../utils/crud.util.js";

// ---------- Konfigurasi modul ----------
// Field tanggal yang diubah dari string ke Date sebelum disimpan
const DATE_FIELDS = ["hpht", "hpl", "tanggalAkhir"];
// Query string yang boleh dipakai sebagai filter, mis. ?ibuId=...
const FILTERS = ["ibuId", "status"];
// Field yang dicari lewat ?search=...
const SEARCH_FIELDS = ["ibu.nama"];
const ORDER_BY = { createdAt: "desc" };
const INCLUDE = { ibu: { select: { id: true, nama: true, nik: true } } };
const HARI = 24 * 60 * 60 * 1000;

function scopeWhere(user) {
  if (user.role !== "KADER") return {};
  if (!user.posyanduId) {
    throw httpError(403, "Akun kader belum terhubung ke posyandu");
  }
  return { ibu: { posyanduId: user.posyanduId } };
}

async function validateIbu(ibuId, user) {
  if (user.role !== "KADER") return;
  if (!user.posyanduId) {
    throw httpError(403, "Akun kader belum terhubung ke posyandu");
  }
  const ibu = await prisma.warga.findFirst({
    where: { id: ibuId, posyanduId: user.posyanduId, jenisKelamin: "PEREMPUAN" },
    select: { id: true },
  });
  if (!ibu) throw httpError(404, "Data ibu tidak ditemukan");
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
    prisma.kehamilan.findMany({ where, include: INCLUDE, orderBy: ORDER_BY, skip, take: limit }),
    prisma.kehamilan.count({ where }),
  ]);

  return { data, meta: buildMeta(page, limit, total) };
}

// GET /:id  -> detail satu data
async function getById(id, user) {
  const item = await prisma.kehamilan.findFirst({
    where: { id, ...scopeWhere(user) },
    include: INCLUDE,
  });
  if (!item) throw httpError(404, "Data tidak ditemukan");
  return item;
}

// POST /  -> tambah data baru
async function create(body, user) {
  const data = cleanBody(body, DATE_FIELDS);
  await validateIbu(data.ibuId, user);

  // Jika HPL kosong, hitung otomatis dari HPHT (+280 hari, rumus Naegele)
  if (data.hpht && !data.hpl) {
    data.hpl = new Date(data.hpht.getTime() + 280 * HARI);
  }

  return prisma.kehamilan.create({ data, include: INCLUDE });
}

// PATCH/PUT /:id  -> ubah data
async function update(id, body, user) {
  const data = cleanBody(body, DATE_FIELDS);
  const existing = await prisma.kehamilan.findFirst({
    where: { id, ...scopeWhere(user) },
    select: { id: true },
  });
  if (!existing) throw httpError(404, "Data tidak ditemukan");
  if (data.ibuId) await validateIbu(data.ibuId, user);

  // Error P2025 (data tidak ada) otomatis menjadi 404 di error middleware
  return prisma.kehamilan.update({ where: { id }, data, include: INCLUDE });
}

// DELETE /:id  -> hapus data
async function remove(id, user) {
  const existing = await prisma.kehamilan.findFirst({
    where: { id, ...scopeWhere(user) },
    select: { id: true },
  });
  if (!existing) throw httpError(404, "Data tidak ditemukan");
  await prisma.kehamilan.delete({ where: { id } });
}

export { list, getById, create, update, remove };
