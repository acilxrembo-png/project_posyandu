import prisma from "../../lib/prisma.js";
import httpError from "../../utils/http-error.util.js";
import { cleanBody, buildSearch, parsePagination, buildMeta } from "../../utils/crud.util.js";

// ---------- Konfigurasi modul ----------
// Field yang dicari lewat ?search=...
const SEARCH_FIELDS = ["kode", "nama"];
const ORDER_BY = { umurAnjuranBulan: "asc" };

// GET /  -> daftar data (pagination, filter, search)
async function list(query) {
  const { page, limit, skip } = parsePagination(query);

  const where = {};

  if (query.search) {
    where.OR = buildSearch(SEARCH_FIELDS, String(query.search));
  }

  const [data, total] = await Promise.all([
    prisma.vaksin.findMany({ where, orderBy: ORDER_BY, skip, take: limit }),
    prisma.vaksin.count({ where }),
  ]);

  return { data, meta: buildMeta(page, limit, total) };
}

// GET /:id  -> detail satu data
async function getById(id) {
  const item = await prisma.vaksin.findUnique({
    where: { id },
  });
  if (!item) throw httpError(404, "Data tidak ditemukan");
  return item;
}

// POST /  -> tambah data baru
async function create(body) {
  const data = cleanBody(body);

  return prisma.vaksin.create({ data });
}

// PATCH/PUT /:id  -> ubah data
async function update(id, body) {
  const data = cleanBody(body);

  // Error P2025 (data tidak ada) otomatis menjadi 404 di error middleware
  return prisma.vaksin.update({ where: { id }, data });
}

// DELETE /:id  -> hapus data
async function remove(id) {
  await prisma.vaksin.delete({ where: { id } });
}

export { list, getById, create, update, remove };
