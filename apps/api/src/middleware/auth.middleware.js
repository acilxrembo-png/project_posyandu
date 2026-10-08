import jwt from "jsonwebtoken";
import env from "../config/env.config.js";
import prisma from "../lib/prisma.js";

async function authenticate(req, res, next) {
  const [scheme, token] = (req.headers.authorization || "").split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    return res.status(401).json({ message: "Token tidak valid atau kedaluwarsa" });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      nama: true,
      email: true,
      role: true,
      aktif: true,
      posyanduId: true,
      puskesmasId: true,
      wargaId: true,
    },
  });

  if (!user || !user.aktif) {
    return res.status(401).json({ message: "Akun tidak ditemukan atau nonaktif" });
  }

  req.user = user;
  next();
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Anda tidak memiliki akses" });
    }
    next();
  };
}

function staffReadOnlyAdmin(req, res, next) {
  if (req.user.role === "ADMIN" && !["GET", "HEAD"].includes(req.method)) {
    return res.status(403).json({ message: "Admin hanya dapat melihat data. Untuk perubahan data, hubungi Kader." });
  }
  next();
}

export { authenticate, authorize, staffReadOnlyAdmin };
