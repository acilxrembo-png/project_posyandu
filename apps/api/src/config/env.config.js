// Memuat .env lebih dulu, sebelum modul lain (termasuk Prisma) dipakai.
import "dotenv/config";

const nodeEnv = process.env.NODE_ENV || "development";
const configuredCorsOrigins = process.env.CORS_ORIGIN;

const env = {
  nodeEnv,
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigins: (configuredCorsOrigins || "http://localhost:5173,http://127.0.0.1:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

if (!env.jwtSecret || (nodeEnv === "production" && env.jwtSecret.length < 32)) {
  console.error("JWT_SECRET wajib diisi dan harus minimal 32 karakter di production.");
  process.exit(1);
}

if (nodeEnv === "production" && !configuredCorsOrigins) {
  console.error("CORS_ORIGIN wajib diatur di production.");
  process.exit(1);
}

if (nodeEnv === "production") {
  if (env.corsOrigins.length === 0) {
    console.error("CORS_ORIGIN production harus berisi setidaknya satu origin.");
    process.exit(1);
  }

  const invalidOrigin = env.corsOrigins.some((origin) => {
    try {
      const parsed = new URL(origin);
      return parsed.protocol !== "https:"
        || parsed.origin !== origin
        || parsed.hostname === "localhost"
        || parsed.hostname === "127.0.0.1"
        || parsed.hostname === "::1";
    } catch {
      return true;
    }
  });
  if (invalidOrigin) {
    console.error("CORS_ORIGIN production harus berisi origin HTTPS yang valid tanpa localhost.");
    process.exit(1);
  }
}

export default env;
