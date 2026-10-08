import { z } from "zod";

const createUserSchema = z.object({
  nama: z.string().trim().min(1, "Nama wajib diisi"),
  email: z.string().trim().toLowerCase().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  telepon: z.string().trim().optional().nullable(),
  role: z.literal("KADER").optional(),
  posyanduId: z.string().min(1, "Posyandu wajib dipilih"),
});

export { createUserSchema };
