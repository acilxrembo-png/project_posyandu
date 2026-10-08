import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../src/lib/prisma.js";

async function createAdmin() {
  if (process.env.NODE_ENV !== "production") {
    throw new Error("Admin awal hanya boleh dibuat saat NODE_ENV=production.");
  }

  const nama = process.env.BOOTSTRAP_ADMIN_NAME?.trim();
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!nama || !email || !password) {
    throw new Error("BOOTSTRAP_ADMIN_NAME, BOOTSTRAP_ADMIN_EMAIL, dan BOOTSTRAP_ADMIN_PASSWORD wajib diisi.");
  }
  if (password.length < 12) {
    throw new Error("Kata sandi admin awal harus minimal 12 karakter.");
  }

  const existingAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: { id: true },
  });
  if (existingAdmin) {
    throw new Error("Admin sudah tersedia; bootstrap awal tidak dapat dijalankan kembali.");
  }

  const existingEmail = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existingEmail) {
    throw new Error("Email tersebut sudah digunakan akun lain.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { nama, email, password: passwordHash, role: "ADMIN", aktif: true },
  });

  console.log(`Admin awal berhasil dibuat untuk ${email}. Hapus variabel bootstrap dari shell.`);
}

try {
  await createAdmin();
} catch (error) {
  console.error(`Gagal membuat admin awal: ${error.message}`);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
