-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'KADER', 'Masyarakat');

-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('LAKI_LAKI', 'PEREMPUAN');

-- CreateEnum
CREATE TYPE "GolonganDarah" AS ENUM ('A', 'B', 'AB', 'O', 'TIDAK_TAHU');

-- CreateEnum
CREATE TYPE "StatusKehamilan" AS ENUM ('AKTIF', 'MELAHIRKAN', 'KEGUGURAN');

-- CreateEnum
CREATE TYPE "JenisSuplemen" AS ENUM ('VITAMIN_A_BIRU', 'VITAMIN_A_MERAH', 'OBAT_CACING', 'PMT', 'TABLET_TAMBAH_DARAH');

-- CreateEnum
CREATE TYPE "HubunganKeluarga" AS ENUM ('KEPALA_KELUARGA', 'ISTRI', 'SUAMI', 'ANAK', 'ORANG_TUA', 'LAINNYA');

-- CreateEnum
CREATE TYPE "StatusGiziBBU" AS ENUM ('BERAT_BADAN_SANGAT_KURANG', 'BERAT_BADAN_KURANG', 'BERAT_BADAN_NORMAL', 'RISIKO_BERAT_BADAN_LEBIH');

-- CreateEnum
CREATE TYPE "StatusGiziTBU" AS ENUM ('SANGAT_PENDEK', 'PENDEK', 'NORMAL', 'TINGGI');

-- CreateEnum
CREATE TYPE "StatusGiziBBTB" AS ENUM ('GIZI_BURUK', 'GIZI_KURANG', 'GIZI_BAIK', 'BERISIKO_GIZI_LEBIH', 'GIZI_LEBIH', 'OBESITAS');

-- CreateTable
CREATE TABLE "puskesmas" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT,
    "telepon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "puskesmas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posyandu" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT,
    "rt" TEXT,
    "rw" TEXT,
    "desa" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "kabupaten" TEXT NOT NULL,
    "provinsi" TEXT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "puskesmasId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posyandu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telepon" TEXT,
    "role" "Role" NOT NULL DEFAULT 'KADER',
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "posyanduId" TEXT,
    "puskesmasId" TEXT,
    "wargaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keluarga" (
    "id" TEXT NOT NULL,
    "nomorKk" TEXT NOT NULL,
    "kepalaKeluarga" TEXT NOT NULL,
    "alamat" TEXT,
    "rt" TEXT,
    "rw" TEXT,
    "posyanduId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "keluarga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warga" (
    "id" TEXT NOT NULL,
    "nik" TEXT,
    "nama" TEXT NOT NULL,
    "tempatLahir" TEXT,
    "tanggalLahir" DATE NOT NULL,
    "jenisKelamin" "JenisKelamin" NOT NULL,
    "golonganDarah" "GolonganDarah" NOT NULL DEFAULT 'TIDAK_TAHU',
    "hubungan" "HubunganKeluarga",
    "telepon" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "posyanduId" TEXT NOT NULL,
    "keluargaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pendaftaran_warga" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "tanggalLahir" DATE NOT NULL,
    "jenisKelamin" "JenisKelamin" NOT NULL,
    "telepon" TEXT,
    "userId" TEXT NOT NULL,
    "posyanduId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pendaftaran_warga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "balita" (
    "id" TEXT NOT NULL,
    "nomorKia" TEXT,
    "anakKe" INTEGER,
    "beratLahir" DECIMAL(4,2),
    "panjangLahir" DECIMAL(5,1),
    "imd" BOOLEAN NOT NULL DEFAULT false,
    "asiEksklusif" BOOLEAN NOT NULL DEFAULT false,
    "wargaId" TEXT NOT NULL,
    "ibuId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "balita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kegiatan" (
    "id" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "tema" TEXT,
    "lokasi" TEXT,
    "catatan" TEXT,
    "posyanduId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kegiatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penimbangan" (
    "id" TEXT NOT NULL,
    "umurBulan" INTEGER NOT NULL,
    "berat" DECIMAL(4,2) NOT NULL,
    "tinggi" DECIMAL(5,1),
    "lingkarKepala" DECIMAL(4,1),
    "lila" DECIMAL(4,1),
    "caraUkur" TEXT,
    "naikBB" BOOLEAN,
    "statusBBU" "StatusGiziBBU",
    "statusTBU" "StatusGiziTBU",
    "statusBBTB" "StatusGiziBBTB",
    "catatan" TEXT,
    "kegiatanId" TEXT NOT NULL,
    "balitaId" TEXT NOT NULL,
    "petugasId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "penimbangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vaksin" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "umurAnjuranBulan" INTEGER,
    "jumlahDosis" INTEGER NOT NULL DEFAULT 1,
    "keterangan" TEXT,

    CONSTRAINT "vaksin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imunisasi_balita" (
    "id" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "dosisKe" INTEGER NOT NULL DEFAULT 1,
    "batchNo" TEXT,
    "catatan" TEXT,
    "balitaId" TEXT NOT NULL,
    "vaksinId" TEXT NOT NULL,
    "kegiatanId" TEXT,
    "petugasId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "imunisasi_balita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pemberian_suplemen" (
    "id" TEXT NOT NULL,
    "jenis" "JenisSuplemen" NOT NULL,
    "tanggal" DATE NOT NULL,
    "jumlah" INTEGER,
    "catatan" TEXT,
    "balitaId" TEXT NOT NULL,
    "kegiatanId" TEXT,
    "petugasId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pemberian_suplemen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kehamilan" (
    "id" TEXT NOT NULL,
    "hpht" DATE NOT NULL,
    "hpl" DATE,
    "gravida" INTEGER,
    "paritas" INTEGER,
    "abortus" INTEGER,
    "status" "StatusKehamilan" NOT NULL DEFAULT 'AKTIF',
    "tanggalAkhir" DATE,
    "penolongPersalinan" TEXT,
    "tempatPersalinan" TEXT,
    "ibuId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kehamilan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pemeriksaan_kehamilan" (
    "id" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "usiaKehamilanMinggu" INTEGER,
    "berat" DECIMAL(5,2),
    "tinggi" DECIMAL(5,1),
    "lila" DECIMAL(4,1),
    "sistol" INTEGER,
    "diastol" INTEGER,
    "tinggiFundus" DECIMAL(4,1),
    "hemoglobin" DECIMAL(4,1),
    "jumlahTabletFe" INTEGER,
    "imunisasiTT" BOOLEAN NOT NULL DEFAULT false,
    "risikoTinggi" BOOLEAN NOT NULL DEFAULT false,
    "dirujuk" BOOLEAN NOT NULL DEFAULT false,
    "keluhan" TEXT,
    "catatan" TEXT,
    "kehamilanId" TEXT NOT NULL,
    "kegiatanId" TEXT,
    "petugasId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pemeriksaan_kehamilan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pemeriksaan_lansia" (
    "id" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "berat" DECIMAL(5,2),
    "tinggi" DECIMAL(5,1),
    "lingkarPerut" DECIMAL(5,1),
    "sistol" INTEGER,
    "diastol" INTEGER,
    "gulaDarah" DECIMAL(5,1),
    "kolesterol" DECIMAL(5,1),
    "asamUrat" DECIMAL(4,1),
    "keluhan" TEXT,
    "dirujuk" BOOLEAN NOT NULL DEFAULT false,
    "catatan" TEXT,
    "wargaId" TEXT NOT NULL,
    "kegiatanId" TEXT,
    "petugasId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pemeriksaan_lansia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "puskesmas_kode_key" ON "puskesmas"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "posyandu_kode_key" ON "posyandu"("kode");

-- CreateIndex
CREATE INDEX "posyandu_puskesmasId_idx" ON "posyandu"("puskesmasId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_wargaId_key" ON "users"("wargaId");

-- CreateIndex
CREATE INDEX "users_posyanduId_idx" ON "users"("posyanduId");

-- CreateIndex
CREATE INDEX "users_puskesmasId_idx" ON "users"("puskesmasId");

-- CreateIndex
CREATE UNIQUE INDEX "keluarga_nomorKk_key" ON "keluarga"("nomorKk");

-- CreateIndex
CREATE INDEX "keluarga_posyanduId_idx" ON "keluarga"("posyanduId");

-- CreateIndex
CREATE UNIQUE INDEX "warga_nik_key" ON "warga"("nik");

-- CreateIndex
CREATE INDEX "warga_posyanduId_idx" ON "warga"("posyanduId");

-- CreateIndex
CREATE INDEX "warga_keluargaId_idx" ON "warga"("keluargaId");

-- CreateIndex
CREATE INDEX "warga_nama_idx" ON "warga"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "pendaftaran_warga_nik_key" ON "pendaftaran_warga"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "pendaftaran_warga_userId_key" ON "pendaftaran_warga"("userId");

-- CreateIndex
CREATE INDEX "pendaftaran_warga_posyanduId_createdAt_idx" ON "pendaftaran_warga"("posyanduId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "balita_nomorKia_key" ON "balita"("nomorKia");

-- CreateIndex
CREATE UNIQUE INDEX "balita_wargaId_key" ON "balita"("wargaId");

-- CreateIndex
CREATE INDEX "balita_ibuId_idx" ON "balita"("ibuId");

-- CreateIndex
CREATE UNIQUE INDEX "kegiatan_posyanduId_tanggal_key" ON "kegiatan"("posyanduId", "tanggal");

-- CreateIndex
CREATE INDEX "penimbangan_balitaId_idx" ON "penimbangan"("balitaId");

-- CreateIndex
CREATE UNIQUE INDEX "penimbangan_kegiatanId_balitaId_key" ON "penimbangan"("kegiatanId", "balitaId");

-- CreateIndex
CREATE UNIQUE INDEX "vaksin_kode_key" ON "vaksin"("kode");

-- CreateIndex
CREATE INDEX "imunisasi_balita_kegiatanId_idx" ON "imunisasi_balita"("kegiatanId");

-- CreateIndex
CREATE UNIQUE INDEX "imunisasi_balita_balitaId_vaksinId_dosisKe_key" ON "imunisasi_balita"("balitaId", "vaksinId", "dosisKe");

-- CreateIndex
CREATE INDEX "pemberian_suplemen_balitaId_jenis_idx" ON "pemberian_suplemen"("balitaId", "jenis");

-- CreateIndex
CREATE INDEX "kehamilan_ibuId_status_idx" ON "kehamilan"("ibuId", "status");

-- CreateIndex
CREATE INDEX "pemeriksaan_kehamilan_kehamilanId_idx" ON "pemeriksaan_kehamilan"("kehamilanId");

-- CreateIndex
CREATE INDEX "pemeriksaan_lansia_wargaId_idx" ON "pemeriksaan_lansia"("wargaId");

-- CreateIndex
CREATE INDEX "pemeriksaan_lansia_kegiatanId_idx" ON "pemeriksaan_lansia"("kegiatanId");

-- AddForeignKey
ALTER TABLE "posyandu" ADD CONSTRAINT "posyandu_puskesmasId_fkey" FOREIGN KEY ("puskesmasId") REFERENCES "puskesmas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "posyandu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_puskesmasId_fkey" FOREIGN KEY ("puskesmasId") REFERENCES "puskesmas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_wargaId_fkey" FOREIGN KEY ("wargaId") REFERENCES "warga"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keluarga" ADD CONSTRAINT "keluarga_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "posyandu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warga" ADD CONSTRAINT "warga_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "posyandu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warga" ADD CONSTRAINT "warga_keluargaId_fkey" FOREIGN KEY ("keluargaId") REFERENCES "keluarga"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendaftaran_warga" ADD CONSTRAINT "pendaftaran_warga_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendaftaran_warga" ADD CONSTRAINT "pendaftaran_warga_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "posyandu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balita" ADD CONSTRAINT "balita_wargaId_fkey" FOREIGN KEY ("wargaId") REFERENCES "warga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balita" ADD CONSTRAINT "balita_ibuId_fkey" FOREIGN KEY ("ibuId") REFERENCES "warga"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kegiatan" ADD CONSTRAINT "kegiatan_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "posyandu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penimbangan" ADD CONSTRAINT "penimbangan_kegiatanId_fkey" FOREIGN KEY ("kegiatanId") REFERENCES "kegiatan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penimbangan" ADD CONSTRAINT "penimbangan_balitaId_fkey" FOREIGN KEY ("balitaId") REFERENCES "balita"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penimbangan" ADD CONSTRAINT "penimbangan_petugasId_fkey" FOREIGN KEY ("petugasId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imunisasi_balita" ADD CONSTRAINT "imunisasi_balita_balitaId_fkey" FOREIGN KEY ("balitaId") REFERENCES "balita"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imunisasi_balita" ADD CONSTRAINT "imunisasi_balita_vaksinId_fkey" FOREIGN KEY ("vaksinId") REFERENCES "vaksin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imunisasi_balita" ADD CONSTRAINT "imunisasi_balita_kegiatanId_fkey" FOREIGN KEY ("kegiatanId") REFERENCES "kegiatan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imunisasi_balita" ADD CONSTRAINT "imunisasi_balita_petugasId_fkey" FOREIGN KEY ("petugasId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pemberian_suplemen" ADD CONSTRAINT "pemberian_suplemen_balitaId_fkey" FOREIGN KEY ("balitaId") REFERENCES "balita"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pemberian_suplemen" ADD CONSTRAINT "pemberian_suplemen_kegiatanId_fkey" FOREIGN KEY ("kegiatanId") REFERENCES "kegiatan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pemberian_suplemen" ADD CONSTRAINT "pemberian_suplemen_petugasId_fkey" FOREIGN KEY ("petugasId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kehamilan" ADD CONSTRAINT "kehamilan_ibuId_fkey" FOREIGN KEY ("ibuId") REFERENCES "warga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pemeriksaan_kehamilan" ADD CONSTRAINT "pemeriksaan_kehamilan_kehamilanId_fkey" FOREIGN KEY ("kehamilanId") REFERENCES "kehamilan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pemeriksaan_kehamilan" ADD CONSTRAINT "pemeriksaan_kehamilan_kegiatanId_fkey" FOREIGN KEY ("kegiatanId") REFERENCES "kegiatan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pemeriksaan_kehamilan" ADD CONSTRAINT "pemeriksaan_kehamilan_petugasId_fkey" FOREIGN KEY ("petugasId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pemeriksaan_lansia" ADD CONSTRAINT "pemeriksaan_lansia_wargaId_fkey" FOREIGN KEY ("wargaId") REFERENCES "warga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pemeriksaan_lansia" ADD CONSTRAINT "pemeriksaan_lansia_kegiatanId_fkey" FOREIGN KEY ("kegiatanId") REFERENCES "kegiatan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pemeriksaan_lansia" ADD CONSTRAINT "pemeriksaan_lansia_petugasId_fkey" FOREIGN KEY ("petugasId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
