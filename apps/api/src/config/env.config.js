// Memuat .env lebih dulu, sebelum modul lain (termasuk Prisma) dipakai.
import "dotenv/config";

const nodeEnv = process.env.NODE_ENV || "development";
const configuredCorsOrigins = process.env.CORS_ORIGIN;
const port = process.env.PORT === undefined ? 3000 : Number(process.env.PORT);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error("PORT harus berupa angka antara 1 dan 65535.");
  process.exit(1);
}

const env = {
  nodeEnv,
  port,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigins: (configuredCorsOrigins || "http://localhost:5173,http://127.0.0.1:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

if (!env.jwtSecret) {
  console.error("JWT_SECRET belum diisi di .env");
  process.exit(1);
}

export default env;
