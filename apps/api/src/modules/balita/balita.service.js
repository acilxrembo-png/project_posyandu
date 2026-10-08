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
    prisma.balita.findMany({ where, include: INCLUDE, orderBy: ORDER_BY, skip, take: limit }),
    prisma.balita.count({ where }),
  ]);

  return { data, meta: buildMeta(page, limit, total) };
}

// GET /:id  -> detail satu data
async function getById(id) {
  const item = await prisma.balita.findUnique({
    where: { id },
    include: INCLUDE,
  });
  if (!item) throw httpError(404, "Data tidak ditemukan");
  return item;
}

// POST /  -> tambah data baru
async function create(body) {
  const data = cleanBody(body);

  return prisma.balita.create({ data, include: INCLUDE });
}

// PATCH/PUT /:id  -> ubah data
async function update(id, body) {
  const data = cleanBody(body);

  // Error P2025 (data tidak ada) otomatis menjadi 404 di error middleware
  return prisma.balita.update({ where: { id }, data, include: INCLUDE });
}

// DELETE /:id  -> hapus data
async function remove(id) {
  await prisma.balita.delete({ where: { id } });
}

export { list, getById, create, update, remove };
