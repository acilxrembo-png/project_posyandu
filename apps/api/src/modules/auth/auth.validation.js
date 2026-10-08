import { z } from "zod";

const registerSchema = z.object({
  nama: z.string().trim().min(3, "Nama minimal 3 karakter").max(120),
  email: z.string().trim().toLowerCase().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  telepon: z.string().trim().optional().nullable(),
  nik: z.string().trim().regex(/^\d{16}$/, "NIK harus terdiri dari 16 digit"),
  tanggalLahir: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal lahir tidak valid")
    .refine((value) => {
      const date = new Date(`${value}T00:00:00.000Z`);
      return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
    }, "Tanggal lahir tidak valid"),
  jenisKelamin: z.enum(["LAKI_LAKI", "PEREMPUAN"]),
  posyanduId: z.string().min(1, "Posyandu wajib dipilih"),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export { registerSchema, loginSchema };
