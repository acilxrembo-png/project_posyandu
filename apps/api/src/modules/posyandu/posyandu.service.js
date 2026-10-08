import prisma from "../../lib/prisma.js";
import httpError from "../../utils/http-error.util.js";
import { cleanBody, buildSearch, parsePagination, buildMeta } from "../../utils/crud.util.js";

// ---------- Konfigurasi modul ----------
// Query string yang boleh dipakai sebagai filter, mis. ?puskesmasId=...
const FILTERS = ["puskesmasId"];
// Field yang dicari lewat ?search=...
const SEARCH_FIELDS = ["nama", "kode", "desa"];
const ORDER_BY = { createdAt: "desc" };
const INCLUDE = { puskesmas: { select: { id: true, nama: true } } };

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
    prisma.posyandu.findMany({ where, include: INCLUDE, orderBy: ORDER_BY, skip, take: limit }),
    prisma.posyandu.count({ where }),
  ]);

  return { data, meta: buildMeta(page, limit, total) };
}

// GET /:id  -> detail satu data
async function getById(id) {
  const item = await prisma.posyandu.findUnique({
    where: { id },
    include: INCLUDE,
  });
  if (!item) throw httpError(404, "Data tidak ditemukan");
  return item;
}

// POST /  -> tambah data baru
async function create(body) {
  const data = cleanBody(body);

  return prisma.posyandu.create({ data, include: INCLUDE });
}

// PATCH/PUT /:id  -> ubah data
async function update(id, body) {
  const data = cleanBody(body);

  // Error P2025 (data tidak ada) otomatis menjadi 404 di error middleware
  return prisma.posyandu.update({ where: { id }, data, include: INCLUDE });
}

// DELETE /:id  -> hapus data
async function remove(id) {
  await prisma.posyandu.delete({ where: { id } });
}

export { list, getById, create, update, remove };
