const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const tanggal = (str) => new Date(`${str}T00:00:00.000Z`);

async function main() {
  console.log("🌱 Mulai seeding...");

  // ---------------------------------------------------
  // 1. PUSKESMAS
  // ---------------------------------------------------
  const puskesmas = await prisma.puskesmas.upsert({
    where: { kode: "PKM-001" },
    update: {},
    create: {
      kode: "PKM-001",
      nama: "Puskesmas Contoh",
      alamat: "Jl. Kesehatan No. 1",
      telepon: "0266-123456",
    },
  });

  // ---------------------------------------------------
  // 2. POSYANDU
  // ---------------------------------------------------
  const posyandu = await prisma.posyandu.upsert({
    where: { kode: "POS-001" },
    update: {},
    create: {
      kode: "POS-001",
      nama: "Posyandu Melati",
      alamat: "Balai Desa Contoh",
      rt: "01",
      rw: "01",
      desa: "Desa Contoh",
      kecamatan: "Kecamatan Contoh",
      kabupaten: "Kabupaten Contoh",
      provinsi: "Jawa Barat",
      puskesmasId: puskesmas.id,
    },
  });

  // ---------------------------------------------------
  // 3. USER (password di-hash)
  // ---------------------------------------------------
  const passwordHash = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: "admin@posyandu.test" },
    update: {},
    create: {
      nama: "Admin Puskesmas",
      email: "admin@posyandu.test",
      password: passwordHash,
      telepon: "081200000001",
      role: "ADMIN",
      puskesmasId: puskesmas.id,
    },
  });

  const kader = await prisma.user.upsert({
    where: { email: "kader@posyandu.test" },
    update: {},
    create: {
      nama: "Kader Melati",
      email: "kader@posyandu.test",
      password: passwordHash,
      telepon: "081200000002",
      role: "KADER",
      posyanduId: posyandu.id,
      puskesmasId: puskesmas.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "warga@posyandu.test" },
    update: {},
    create: {
      nama: "Warga Contoh",
      email: "warga@posyandu.test",
      password: passwordHash,
      telepon: "081200000003",
      role: "Masyarakat",
      posyanduId: posyandu.id,
    },
  });

  // ---------------------------------------------------
  // 4. MASTER VAKSIN
  // ---------------------------------------------------
  const daftarVaksin = [
    { kode: "HB0", nama: "Hepatitis B (<24 jam)", umurAnjuranBulan: 0, jumlahDosis: 1 },
    { kode: "BCG", nama: "BCG", umurAnjuranBulan: 1, jumlahDosis: 1 },
    { kode: "POLIO1", nama: "Polio Tetes 1", umurAnjuranBulan: 1, jumlahDosis: 1 },
    { kode: "DPT-HB-HIB1", nama: "DPT-HB-Hib 1", umurAnjuranBulan: 2, jumlahDosis: 1 },
    { kode: "POLIO2", nama: "Polio Tetes 2", umurAnjuranBulan: 2, jumlahDosis: 1 },
    { kode: "DPT-HB-HIB2", nama: "DPT-HB-Hib 2", umurAnjuranBulan: 3, jumlahDosis: 1 },
    { kode: "POLIO3", nama: "Polio Tetes 3", umurAnjuranBulan: 3, jumlahDosis: 1 },
    { kode: "DPT-HB-HIB3", nama: "DPT-HB-Hib 3", umurAnjuranBulan: 4, jumlahDosis: 1 },
    { kode: "POLIO4", nama: "Polio Tetes 4 / IPV", umurAnjuranBulan: 4, jumlahDosis: 1 },
    { kode: "CAMPAK", nama: "Campak / MR", umurAnjuranBulan: 9, jumlahDosis: 1 },
    { kode: "DPT-HB-HIB-LANJUTAN", nama: "DPT-HB-Hib Lanjutan", umurAnjuranBulan: 18, jumlahDosis: 1 },
    { kode: "CAMPAK-LANJUTAN", nama: "Campak / MR Lanjutan", umurAnjuranBulan: 18, jumlahDosis: 1 },
  ];

  const vaksinMap = {};
  for (const v of daftarVaksin) {
    vaksinMap[v.kode] = await prisma.vaksin.upsert({
      where: { kode: v.kode },
      update: {},
      create: v,
    });
  }

  // ---------------------------------------------------
  // 5. KELUARGA & WARGA
  // ---------------------------------------------------
  const keluarga = await prisma.keluarga.upsert({
    where: { nomorKk: "3201000000000001" },
    update: {},
    create: {
      nomorKk: "3201000000000001",
      kepalaKeluarga: "Budi Santoso",
      alamat: "Jl. Mawar No. 5",
      rt: "01",
      rw: "01",
      posyanduId: posyandu.id,
    },
  });

  const ayah = await prisma.warga.upsert({
    where: { nik: "3201000000000011" },
    update: {},
    create: {
      nik: "3201000000000011",
      nama: "Budi Santoso",
      tempatLahir: "Sukabumi",
      tanggalLahir: tanggal("1990-03-12"),
      jenisKelamin: "LAKI_LAKI",
      golonganDarah: "O",
      hubungan: "KEPALA_KELUARGA",
      posyanduId: posyandu.id,
      keluargaId: keluarga.id,
    },
  });

  const ibu = await prisma.warga.upsert({
    where: { nik: "3201000000000012" },
    update: {},
    create: {
      nik: "3201000000000012",
      nama: "Siti Aminah",
      tempatLahir: "Sukabumi",
      tanggalLahir: tanggal("1993-07-21"),
      jenisKelamin: "PEREMPUAN",
      golonganDarah: "A",
      hubungan: "ISTRI",
      telepon: "081200000010",
      posyanduId: posyandu.id,
      keluargaId: keluarga.id,
    },
  });

  const anak = await prisma.warga.upsert({
    where: { nik: "3201000000000013" },
    update: {},
    create: {
      nik: "3201000000000013",
      nama: "Rafi Santoso",
      tempatLahir: "Sukabumi",
      tanggalLahir: tanggal("2026-02-10"),
      jenisKelamin: "LAKI_LAKI",
      hubungan: "ANAK",
      posyanduId: posyandu.id,
      keluargaId: keluarga.id,
    },
  });

  const lansia = await prisma.warga.upsert({
    where: { nik: "3201000000000014" },
    update: {},
    create: {
      nik: "3201000000000014",
      nama: "Hj. Rohmah",
      tempatLahir: "Sukabumi",
      tanggalLahir: tanggal("1958-11-02"),
      jenisKelamin: "PEREMPUAN",
      golonganDarah: "B",
      hubungan: "ORANG_TUA",
      posyanduId: posyandu.id,
      keluargaId: keluarga.id,
    },
  });

  // ---------------------------------------------------
  // 6. PROFIL BALITA
  // ---------------------------------------------------
  const balita = await prisma.balita.upsert({
    where: { wargaId: anak.id },
    update: {},
    create: {
      nomorKia: "KIA-0001",
      anakKe: 1,
      beratLahir: 3.2,
      panjangLahir: 49.5,
      imd: true,
      asiEksklusif: true,
      wargaId: anak.id,
      ibuId: ibu.id,
    },
  });

  // ---------------------------------------------------
  // 7. KEGIATAN (hari buka posyandu)
  // ---------------------------------------------------
  const kegiatan = await prisma.kegiatan.upsert({
    where: {
      posyanduId_tanggal: {
        posyanduId: posyandu.id,
        tanggal: tanggal("2026-10-01"),
      },
    },
    update: {},
    create: {
      tanggal: tanggal("2026-10-01"),
      tema: "Penimbangan & Imunisasi Rutin",
      lokasi: "Balai Desa Contoh",
      posyanduId: posyandu.id,
    },
  });

  // ---------------------------------------------------
  // 8. LAYANAN BALITA
  // ---------------------------------------------------
  await prisma.penimbangan.upsert({
    where: {
      kegiatanId_balitaId: { kegiatanId: kegiatan.id, balitaId: balita.id },
    },
    update: {},
    create: {
      umurBulan: 7,
      berat: 8.1,
      tinggi: 67.5,
      lingkarKepala: 43.2,
      lila: 14.0,
      caraUkur: "berbaring",
      naikBB: true,
      statusBBU: "BERAT_BADAN_NORMAL",
      statusTBU: "NORMAL",
      statusBBTB: "GIZI_BAIK",
      kegiatanId: kegiatan.id,
      balitaId: balita.id,
      petugasId: kader.id,
    },
  });

  const imunisasiAwal = [
    { kode: "HB0", tgl: "2026-02-10" },
    { kode: "BCG", tgl: "2026-03-10" },
    { kode: "POLIO1", tgl: "2026-03-10" },
  ];

  for (const im of imunisasiAwal) {
    await prisma.imunisasiBalita.upsert({
      where: {
        balitaId_vaksinId_dosisKe: {
          balitaId: balita.id,
          vaksinId: vaksinMap[im.kode].id,
          dosisKe: 1,
        },
      },
      update: {},
      create: {
        tanggal: tanggal(im.tgl),
        dosisKe: 1,
        balitaId: balita.id,
        vaksinId: vaksinMap[im.kode].id,
        petugasId: kader.id,
      },
    });
  }

  const sudahAdaSuplemen = await prisma.pemberianSuplemen.count({
    where: { balitaId: balita.id },
  });
  if (sudahAdaSuplemen === 0) {
    await prisma.pemberianSuplemen.create({
      data: {
        jenis: "PMT",
        tanggal: tanggal("2026-10-01"),
        jumlah: 1,
        balitaId: balita.id,
        kegiatanId: kegiatan.id,
        petugasId: kader.id,
      },
    });
  }

  // ---------------------------------------------------
  // 9. LAYANAN IBU HAMIL
  // ---------------------------------------------------
  // Contoh kehamilan baru untuk ibu yang sama (anak ke-2)
  let kehamilan = await prisma.kehamilan.findFirst({
    where: { ibuId: ibu.id, status: "AKTIF" },
  });

  if (!kehamilan) {
    kehamilan = await prisma.kehamilan.create({
      data: {
        hpht: tanggal("2026-06-15"),
        hpl: tanggal("2027-03-22"),
        gravida: 2,
        paritas: 1,
        abortus: 0,
        status: "AKTIF",
        ibuId: ibu.id,
      },
    });
  }

  const sudahAdaPemeriksaanHamil = await prisma.pemeriksaanKehamilan.count({
    where: { kehamilanId: kehamilan.id },
  });
  if (sudahAdaPemeriksaanHamil === 0) {
    await prisma.pemeriksaanKehamilan.create({
      data: {
        tanggal: tanggal("2026-10-01"),
        usiaKehamilanMinggu: 15,
        berat: 58.5,
        tinggi: 155.0,
        lila: 25.0,
        sistol: 110,
        diastol: 70,
        tinggiFundus: 14.0,
        hemoglobin: 11.8,
        jumlahTabletFe: 30,
        imunisasiTT: true,
        kehamilanId: kehamilan.id,
        kegiatanId: kegiatan.id,
        petugasId: kader.id,
      },
    });
  }

  // ---------------------------------------------------
  // 10. LAYANAN LANSIA
  // ---------------------------------------------------
  const sudahAdaPemeriksaanLansia = await prisma.pemeriksaanLansia.count({
    where: { wargaId: lansia.id },
  });
  if (sudahAdaPemeriksaanLansia === 0) {
    await prisma.pemeriksaanLansia.create({
      data: {
        tanggal: tanggal("2026-10-01"),
        berat: 60.0,
        tinggi: 152.0,
        lingkarPerut: 88.0,
        sistol: 135,
        diastol: 85,
        gulaDarah: 110.0,
        kolesterol: 190.0,
        asamUrat: 5.5,
        keluhan: "Pegal-pegal pada lutut",
        wargaId: lansia.id,
        kegiatanId: kegiatan.id,
        petugasId: kader.id,
      },
    });
  }

  console.log("✅ Seeding selesai.");
  console.log("   Login contoh (password: password123):");
  console.log("   - admin@posyandu.test");
  console.log("   - kader@posyandu.test");
  console.log("   - warga@posyandu.test");
}

main()
  .catch((e) => {
    console.error("❌ Seeding gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });