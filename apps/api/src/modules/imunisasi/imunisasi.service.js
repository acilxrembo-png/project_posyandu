import prisma from "../../lib/prisma.js";
import httpError from "../../utils/http-error.util.js";
import { cleanBody, parsePagination, buildMeta } from "../../utils/crud.util.js";

// ---------- Konfigurasi modul ----------
// Field tanggal yang diubah dari string ke Date sebelum disimpan
const DATE_FIELDS = ["tanggal"];
// Query string yang boleh dipakai sebagai filter, mis. ?balitaId=...
const FILTERS = ["balitaId", "vaksinId", "kegiatanId"];
const ORDER_BY = { tanggal: "desc" };
const INCLUDE = {
  balita: { include: { warga: { select: { id: true, nama: true } } } },
  vaksin: { select: { id: true, kode: true, nama: true } },
  kegiatan: { select: { id: true, tanggal: true } },
  petugas: { select: { id: true, nama: true } },
};

// GET /  -> daftar data (pagination, filter, search)
async function list(query) {
  const { page, limit, skip } = parsePagination(query);

  const where = {};

  for (const field of FILTERS) {
    if (query[field]) where[field] = String(query[field]);
  }

  const [data, total] = await Promise.all([
    prisma.imunisasiBalita.findMany({ where, include: INCLUDE, orderBy: ORDER_BY, skip, take: limit }),
    prisma.imunisasiBalita.count({ where }),
  ]);

  return { data, meta: buildMeta(page, limit, total) };
}

// GET /:id  -> detail satu data
async function getById(id) {
  const item = await prisma.imunisasiBalita.findUnique({
    where: { id },
    include: INCLUDE,
  });
  if (!item) throw httpError(404, "Data tidak ditemukan");
  return item;
}

// POST /  -> tambah data baru
async function create(body, user) {
  const data = cleanBody(body, DATE_FIELDS);

  // Petugas diisi otomatis dari user yang sedang login
  if (!data.petugasId) data.petugasId = user.id;

  return prisma.imunisasiBalita.create({ data, include: INCLUDE });
}

// PATCH/PUT /:id  -> ubah data
async function update(id, body) {
  const data = cleanBody(body, DATE_FIELDS);

  // Error P2025 (data tidak ada) otomatis menjadi 404 di error middleware
  return prisma.imunisasiBalita.update({ where: { id }, data, include: INCLUDE });
}

// DELETE /:id  -> hapus data
async function remove(id) {
  await prisma.imunisasiBalita.delete({ where: { id } });
}

export { list, getById, create, update, remove };
