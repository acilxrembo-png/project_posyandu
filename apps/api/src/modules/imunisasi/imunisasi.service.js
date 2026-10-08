import prisma from "../../lib/prisma.js";
import httpError from "../../utils/http-error.util.js";
import { cleanBody, buildSearch, parsePagination, buildMeta } from "../../utils/crud.util.js";

// ---------- Konfigurasi modul ----------
// Field tanggal yang diubah dari string ke Date sebelum disimpan
const DATE_FIELDS = ["tanggal"];
// Query string yang boleh dipakai sebagai filter, mis. ?balitaId=...
const FILTERS = ["balitaId", "vaksinId", "kegiatanId"];
const SEARCH_FIELDS = ["balita.warga.nama", "vaksin.nama", "vaksin.kode"];
const DOSIS_MINIMUM = 1;
const ORDER_BY = { tanggal: "desc" };
const INCLUDE = {
  balita: { include: { warga: { select: { id: true, nama: true } } } },
  vaksin: { select: { id: true, kode: true, nama: true } },
  kegiatan: { select: { id: true, tanggal: true } },
  petugas: { select: { id: true, nama: true } },
};

function scopeWhere(user) {
  if (user.role !== "KADER") return {};
  if (!user.posyanduId) throw httpError(403, "Akun kader belum terhubung ke posyandu");
  return { balita: { warga: { posyanduId: user.posyanduId } } };
}

async function validateRelations(data, user, existing = {}) {
  if (data.tanggal === null || (existing.id === undefined && !data.tanggal)) {
    throw httpError(400, "Tanggal imunisasi wajib diisi");
  }
  if (data.dosisKe !== undefined && data.dosisKe !== null
    && (!Number.isInteger(data.dosisKe) || data.dosisKe < DOSIS_MINIMUM)) {
    throw httpError(400, "Dosis harus berupa bilangan bulat minimal 1");
  }
  const balitaId = data.balitaId === undefined ? existing.balitaId : data.balitaId;
  const vaksinId = data.vaksinId === undefined ? existing.vaksinId : data.vaksinId;
  if (!balitaId) throw httpError(400, "Balita wajib dipilih");
  if (!vaksinId) throw httpError(400, "Vaksin wajib dipilih");
  if (user.role === "KADER" && !user.posyanduId) {
    throw httpError(403, "Akun kader belum terhubung ke posyandu");
  }

  const kegiatanId = data.kegiatanId === undefined ? existing.kegiatanId : data.kegiatanId;
  const [balita, vaksin] = await Promise.all([
    prisma.balita.findFirst({
      where: { id: balitaId, ...(user.role === "KADER" ? { warga: { posyanduId: user.posyanduId } } : {}) },
      select: { id: true, warga: { select: { posyanduId: true } } },
    }),
    prisma.vaksin.findUnique({ where: { id: vaksinId }, select: { id: true } }),
  ]);
  if (!balita) throw httpError(404, "Data balita tidak ditemukan");
  if (!vaksin) throw httpError(404, "Data vaksin tidak ditemukan");

  if (kegiatanId) {
    const kegiatan = await prisma.kegiatan.findFirst({
      where: { id: kegiatanId, ...(user.role === "KADER" ? { posyanduId: user.posyanduId } : {}) },
      select: { id: true, posyanduId: true },
    });
    if (!kegiatan || kegiatan.posyanduId !== balita.warga.posyanduId) {
      throw httpError(404, "Kegiatan tidak ditemukan pada Posyandu balita");
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
  if (query.search) where.OR = buildSearch(SEARCH_FIELDS, String(query.search));

  const [data, total] = await Promise.all([
    prisma.imunisasiBalita.findMany({ where, include: INCLUDE, orderBy: ORDER_BY, skip, take: limit }),
    prisma.imunisasiBalita.count({ where }),
  ]);

  return { data, meta: buildMeta(page, limit, total) };
}

// GET /:id  -> detail satu data
async function getById(id, user) {
  const item = await prisma.imunisasiBalita.findFirst({
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

  return prisma.imunisasiBalita.create({ data, include: INCLUDE });
}

// PATCH/PUT /:id  -> ubah data
async function update(id, body, user) {
  const data = cleanBody(body, DATE_FIELDS);
  delete data.petugasId;
  const existing = await prisma.imunisasiBalita.findFirst({
    where: { id, ...scopeWhere(user) },
    select: { id: true, balitaId: true, vaksinId: true, kegiatanId: true },
  });
  if (!existing) throw httpError(404, "Data tidak ditemukan");
  await validateRelations(data, user, existing);

  return prisma.imunisasiBalita.update({ where: { id }, data, include: INCLUDE });
}

// DELETE /:id  -> hapus data
async function remove(id, user) {
  const existing = await prisma.imunisasiBalita.findFirst({
    where: { id, ...scopeWhere(user) },
    select: { id: true },
  });
  if (!existing) throw httpError(404, "Data tidak ditemukan");
  await prisma.imunisasiBalita.delete({ where: { id } });
}

export { list, getById, create, update, remove };
