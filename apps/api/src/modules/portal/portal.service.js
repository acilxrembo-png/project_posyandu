import prisma from "../../lib/prisma.js";
import httpError from "../../utils/http-error.util.js";

async function listChildren(user) {
  if (!user.wargaId) throw httpError(403, "Akun belum terhubung ke profil warga");

  const data = await prisma.balita.findMany({
    where: { ibuId: user.wargaId },
    select: {
      id: true,
      nomorKia: true,
      warga: { select: { id: true, nama: true, tanggalLahir: true } },
      penimbangan: {
        orderBy: { createdAt: "desc" },
        take: 24,
        select: {
          id: true,
          umurBulan: true,
          berat: true,
          tinggi: true,
          statusBBU: true,
          statusTBU: true,
          statusBBTB: true,
          createdAt: true,
          kegiatan: { select: { tanggal: true } },
        },
      },
      imunisasi: {
        orderBy: { tanggal: "desc" },
        take: 24,
        select: {
          id: true,
          tanggal: true,
          dosisKe: true,
          vaksin: { select: { nama: true } },
        },
      },
      suplemen: {
        orderBy: { tanggal: "desc" },
        take: 24,
        select: { id: true, tanggal: true, jenis: true, jumlah: true },
      },
    },
    orderBy: { warga: { nama: "asc" } },
  });

  return { data };
}

export { listChildren };
