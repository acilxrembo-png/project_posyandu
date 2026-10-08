import prisma from "../../lib/prisma.js";
import httpError from "../../utils/http-error.util.js";
import { cleanBody, buildSearch, parsePagination, buildMeta } from "../../utils/crud.util.js";

// ---------- Konfigurasi modul ----------
// Field tanggal yang diubah dari string ke Date sebelum disimpan
const DATE_FIELDS = ["tanggalLahir"];
// Query string yang boleh dipakai sebagai filter, mis. ?jenisKelamin=...
const FILTERS = ["jenisKelamin", "keluargaId", "hubungan"];
// Field yang dicari lewat ?search=...
const SEARCH_FIELDS = ["nama", "nik"];
const ORDER_BY = { createdAt: "desc" };
const INCLUDE = {
  keluarga: { select: { id: true, nomorKk: true, kepalaKeluarga: true } },
  profilBalita: { select: { id: true } },
};

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

  for (const field of FILTERS) {
    if (query[field]) where[field] = String(query[field]);
  }

  if (query.search) {
    where.OR = buildSearch(SEARCH_FIELDS, String(query.search));
  }

  const [data, total] = await Promise.all([
    prisma.warga.findMany({ where, include: INCLUDE, orderBy: ORDER_BY, skip, take: limit }),
    prisma.warga.count({ where }),
  ]);

  return { data, meta: buildMeta(page, limit, total) };
}

// GET /:id  -> detail satu data
async function getById(id, user) {
  const item = await prisma.warga.findFirst({
    where: { id, ...scopeWhere(user) },
    include: INCLUDE,
  });
  if (!item) throw httpError(404, "Data tidak ditemukan");
  return item;
}

// POST /  -> tambah data baru
async function create(body, user) {
  const data = cleanBody(body, DATE_FIELDS);

  // Kader: data otomatis masuk ke posyandunya
  if (user.role === "KADER") data.posyanduId = scopeWhere(user).posyanduId;

  return prisma.warga.create({ data, include: INCLUDE });
}

// PATCH/PUT /:id  -> ubah data
async function update(id, body, user) {
  const exists = await prisma.warga.findFirst({
    where: { id, ...scopeWhere(user) },
    select: { id: true },
  });
  if (!exists) throw httpError(404, "Data tidak ditemukan");

  const data = cleanBody(body, DATE_FIELDS);
  if (user.role === "KADER") delete data.posyanduId; // kader tidak boleh pindah posyandu

  return prisma.warga.update({ where: { id }, data, include: INCLUDE });
}

// DELETE /:id  -> hapus data
async function remove(id, user) {
  const exists = await prisma.warga.findFirst({
    where: { id, ...scopeWhere(user) },
    select: { id: true },
  });
  if (!exists) throw httpError(404, "Data tidak ditemukan");

  await prisma.warga.delete({ where: { id } });
}

export { list, getById, create, update, remove };
