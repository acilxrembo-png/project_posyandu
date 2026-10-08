import env from "../config/env.config.js";

function notFound(req, res) {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} tidak ditemukan` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.name === "ZodError") {
    return res.status(400).json({
      message: "Validasi gagal",
      errors: err.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
    });
  }

  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }

  // Error Prisma
  if (err.code === "P2002") {
    return res.status(409).json({
      message: `Data sudah ada (duplikat pada: ${[].concat(err.meta?.target || "").join(", ")})`,
    });
  }
  if (err.code === "P2025") {
    return res.status(404).json({ message: "Data tidak ditemukan" });
  }
  if (err.code === "P2003") {
    return res.status(400).json({
      message: "Relasi tidak valid: data terkait tidak ada, atau data masih dipakai data lain",
    });
  }
  if (err.name === "PrismaClientValidationError") {
    return res.status(400).json({
      message: "Data tidak valid (cek nama field, tipe data, atau field wajib)",
      ...(env.nodeEnv !== "production" && { detail: err.message }),
    });
  }

  console.error(err);
  res.status(500).json({ message: "Terjadi kesalahan pada server" });
}

export { notFound, errorHandler };
