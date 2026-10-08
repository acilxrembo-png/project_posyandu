import prisma from "../../lib/prisma.js";
import httpError from "../../utils/http-error.util.js";
import { cleanBody, buildSearch, parsePagination, buildMeta } from "../../utils/crud.util.js";

// ---------- Konfigurasi modul ----------
// Query string yang boleh dipakai sebagai filter, mis. ?balitaId=...
const FILTERS = ["balitaId", "kegiatanId"];
// Field yang dicari lewat ?search=...
const SEARCH_FIELDS = ["balita.warga.nama"];
const ORDER_BY = { createdAt: "desc" };
const INCLUDE = {
  balita: { include: { warga: { select: { id: true, nama: true } } } },
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

  if (query.search) {
    where.OR = buildSearch(SEARCH_FIELDS, String(query.search));
  }

  const [data, total] = await Promise.all([
    prisma.penimbangan.findMany({ where, include: INCLUDE, orderBy: ORDER_BY, skip, take: limit }),
    prisma.penimbangan.count({ where }),
  ]);

  return { data, meta: buildMeta(page, limit, total) };
}

// GET /:id  -> detail satu data
async function getById(id) {
  const item = await prisma.penimbangan.findUnique({
    where: { id },
    include: INCLUDE,
  });
  if (!item) throw httpError(404, "Data tidak ditemukan");
  return item;
}

// POST /  -> tambah data baru
async function create(body, user) {
  const data = cleanBody(body);

  // Petugas diisi otomatis dari user yang sedang login
  if (!data.petugasId) data.petugasId = user.id;

  return prisma.penimbangan.create({ data, include: INCLUDE });
}

// PATCH/PUT /:id  -> ubah data
async function update(id, body) {
  const data = cleanBody(body);

  // Error P2025 (data tidak ada) otomatis menjadi 404 di error middleware
  return prisma.penimbangan.update({ where: { id }, data, include: INCLUDE });
}

// DELETE /:id  -> hapus data
async function remove(id) {
  await prisma.penimbangan.delete({ where: { id } });
}

export { list, getById, create, update, remove };
