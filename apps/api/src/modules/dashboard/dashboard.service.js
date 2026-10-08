import prisma from "../../lib/prisma.js";

// Kader otomatis dibatasi ke posyandunya; admin bisa filter lewat ?posyanduId=
async function getStats(user, query) {
  const pid = user.role === "KADER" ? user.posyanduId : query.posyanduId;

  const wargaWhere = { aktif: true, ...(pid && { posyanduId: pid }) };
  const enamPuluhTahunLalu = new Date();
  enamPuluhTahunLalu.setFullYear(enamPuluhTahunLalu.getFullYear() - 60);

  const [totalWarga, totalBalita, kehamilanAktif, totalLansia, totalKegiatan, giziBBTB] =
    await Promise.all([
      prisma.warga.count({ where: wargaWhere }),
      prisma.balita.count({ where: pid ? { warga: { posyanduId: pid } } : {} }),
      prisma.kehamilan.count({
        where: { status: "AKTIF", ...(pid && { ibu: { posyanduId: pid } }) },
      }),
      prisma.warga.count({
        where: { ...wargaWhere, tanggalLahir: { lte: enamPuluhTahunLalu } },
      }),
      prisma.kegiatan.count({ where: pid ? { posyanduId: pid } : {} }),
      prisma.penimbangan.groupBy({
        by: ["statusBBTB"],
        _count: { _all: true },
        where: pid ? { balita: { warga: { posyanduId: pid } } } : {},
      }),
    ]);

  return {
    totalWarga,
    totalBalita,
    kehamilanAktif,
    totalLansia,
    totalKegiatan,
    statusGiziBBTB: giziBBTB.map((g) => ({ status: g.statusBBTB, jumlah: g._count._all })),
  };
}

export { getStats };
