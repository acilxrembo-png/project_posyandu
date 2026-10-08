import httpError from "./http-error.util.js";

const PROTECTED_FIELDS = ["id", "createdAt", "updatedAt"];

// Bersihkan body: buang field yang tidak boleh diubah, "" -> null, string tanggal -> Date
function cleanBody(body, dateFields = []) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw httpError(400, "Body harus berupa objek JSON");
  }

  const data = {};
  for (const [key, value] of Object.entries(body)) {
    if (PROTECTED_FIELDS.includes(key)) continue;
    data[key] = value === "" ? null : value;
  }

  for (const field of dateFields) {
    if (data[field] === undefined || data[field] === null) continue;
    const date = new Date(data[field]);
    if (Number.isNaN(date.getTime())) {
      throw httpError(400, `Format tanggal tidak valid: ${field}`);
    }
    data[field] = date;
  }

  return data;
}

// "balita.warga.nama" -> { balita: { warga: { nama: { contains } } } }
function buildSearch(fields, term) {
  return fields.map((path) => {
    const parts = path.split(".");
    const leaf = { [parts.pop()]: { contains: term, mode: "insensitive" } };
    return parts.reduceRight((acc, key) => ({ [key]: acc }), leaf);
  });
}

function parsePagination(query) {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit) || 20, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
}

function buildMeta(page, limit, total) {
  return { page, limit, total, totalPages: Math.ceil(total / limit) };
}

export { cleanBody, buildSearch, parsePagination, buildMeta };
