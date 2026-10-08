import prisma from "../../lib/prisma.js";
import httpError from "../../utils/http-error.util.js";
import { cleanBody, buildSearch, parsePagination, buildMeta } from "../../utils/crud.util.js";

// ---------- Konfigurasi modul ----------
// Field tanggal yang diubah dari string ke Date sebelum disimpan
const DATE_FIELDS = ["tanggal"];
// Query string yang boleh dipakai sebagai filter, mis. ?wargaId=...
const FILTERS = ["wargaId", "kegiatanId"];
// Field yang dicari lewat ?search=...
const SEARCH_FIELDS = ["warga.nama", "warga.nik"];
const ORDER_BY = { tanggal: "desc" };
const INCLUDE = {
  warga: { select: { id: true, nama: true } },
  kegiatan: { select: { id: true, tanggal: true } },
  petugas: { select: { id: true, nama: true } },
};

function scopeWhere(user) {
  if (user.role !== "KADER") return {};
  if (!user.posyanduId) throw httpError(403, "Akun kader belum terhubung ke posyandu");
  return { warga: { posyanduId: user.posyanduId } };
}

async function validateRelations(data, user, existing = {}) {
  if (data.tanggal === null || (existing.id === undefined && !data.tanggal)) {
    throw httpError(400, "Tanggal pemeriksaan wajib diisi");
  }
  const wargaId = data.wargaId === undefined ? existing.wargaId : data.wargaId;
  if (!wargaId) throw httpError(400, "Warga lansia wajib dipilih");
  if (user.role === "KADER" && !user.posyanduId) {
    throw httpError(403, "Akun kader belum terhubung ke posyandu");
  }

  const warga = await prisma.warga.findFirst({
    where: { id: wargaId, ...(user.role === "KADER" ? { posyanduId: user.posyanduId } : {}) },
    select: { id: true, posyanduId: true },
  });
  if (!warga) throw httpError(404, "Data warga tidak ditemukan");

  const kegiatanId = data.kegiatanId === undefined ? existing.kegiatanId : data.kegiatanId;
  if (kegiatanId) {
    const kegiatan = await prisma.kegiatan.findFirst({
      where: { id: kegiatanId, ...(user.role === "KADER" ? { posyanduId: user.posyanduId } : {}) },
      select: { id: true, posyanduId: true },
    });
    if (!kegiatan || kegiatan.posyanduId !== warga.posyanduId) {
      throw httpError(404, "Kegiatan tidak ditemukan pada Posyandu warga");
    }
  }
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
    prisma.pemeriksaanLansia.findMany({ where, include: INCLUDE, orderBy: ORDER_BY, skip, take: limit }),
    prisma.pemeriksaanLansia.count({ where }),
  ]);

  return { data, meta: buildMeta(page, limit, total) };
}

// GET /:id  -> detail satu data
async function getById(id, user) {
  const item = await prisma.pemeriksaanLansia.findFirst({
    where: { id, ...scopeWhere(user) },
    include: INCLUDE,
  });
  if (!item) throw httpError(404, "Data tidak ditemukan");
  return item;
}

// POST /  -> tambah data baru
async function create(body, user) {
  const data = cleanBody(body, DATE_FIELDS);
  await validateRelations(data, user);

  data.petugasId = user.id;

  return prisma.pemeriksaanLansia.create({ data, include: INCLUDE });
}

// PATCH/PUT /:id  -> ubah data
async function update(id, body, user) {
  const data = cleanBody(body, DATE_FIELDS);
  delete data.petugasId;
  const existing = await prisma.pemeriksaanLansia.findFirst({
    where: { id, ...scopeWhere(user) },
    select: { id: true, wargaId: true, kegiatanId: true },
  });
  if (!existing) throw httpError(404, "Data tidak ditemukan");
  await validateRelations(data, user, existing);

  return prisma.pemeriksaanLansia.update({ where: { id }, data, include: INCLUDE });
}

// DELETE /:id  -> hapus data
async function remove(id, user) {
  const existing = await prisma.pemeriksaanLansia.findFirst({
    where: { id, ...scopeWhere(user) },
    select: { id: true },
  });
  if (!existing) throw httpError(404, "Data tidak ditemukan");
  await prisma.pemeriksaanLansia.delete({ where: { id } });
}

export { list, getById, create, update, remove };
