// Memuat .env lebih dulu, sebelum modul lain (termasuk Prisma) dipakai.
import "dotenv/config";

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigins: (process.env.CORS_ORIGIN || "http://localhost:5173").split(","),
};

if (!env.jwtSecret) {
  console.error("JWT_SECRET belum diisi di .env");
  process.exit(1);
}

export default env;
