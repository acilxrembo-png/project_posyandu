# Posyandu RW 08

## Persyaratan

- Node.js 20.19+ atau 22.12+
- pnpm 10
- PostgreSQL yang dapat dijangkau dari aplikasi

## Menyiapkan lokal

1. Install dependency dari folder repository:

   ```sh
   pnpm install --frozen-lockfile
   ```

2. Buat `apps/api/.env` dari `apps/api/.env.example` dan `packages/database/.env` dari `packages/database/.env.example`. Isi `DATABASE_URL` dengan koneksi PostgreSQL yang sama pada kedua file dan atur `JWT_SECRET` di `apps/api/.env` menggunakan nilai acak yang kuat.
3. Siapkan Prisma dan data contoh:

   ```sh
   pnpm db:generate
   pnpm db:push
   pnpm db:seed
   ```

   `db:push` menyelaraskan skema Prisma dengan database. Jalankan hanya pada database lokal/pengembangan yang memang akan digunakan aplikasi. Seed berisi akun dan data contoh, dan tidak dapat dijalankan ketika `NODE_ENV=production`.

4. Jalankan API dan web bersama-sama:

   ```sh
   pnpm dev
   ```

   Web biasanya tersedia di `http://localhost:5173`, API di `http://localhost:3000`, dan health check API di `http://localhost:3000/api/health`. Jika port web sedang dipakai, Vite otomatis memilih port berikutnya (misalnya `5174`). Proxy Vite meneruskan permintaan `/api` ke server API lokal.

   Jadwal kegiatan mendatang ditampilkan di beranda dan halaman informasi dari `GET /api/informasi/kegiatan`. Endpoint publik ini hanya mengembalikan tanggal, tema, dan lokasi; tanggal dibandingkan menurut zona waktu `Asia/Jakarta`.

   **Hak akses:** Admin hanya dapat memantau ringkasan dan membaca laporan, serta menambah atau menghapus akun Kader. Kader mengelola data dan pemeriksaan warga pada Posyandu yang ditautkan ke akunnya, termasuk memverifikasi pendaftaran Warga. Warga mendaftar dengan identitas dan Posyandu, lalu menunggu verifikasi Kader sebelum dapat masuk. Setelah diverifikasi, Warga hanya dapat melihat catatan anak yang profilnya tertaut sebagai anak dari profil Ibu tersebut.

   Kader dapat mengelola jadwal kegiatan, keluarga, warga, profil balita, penimbangan, imunisasi, pemberian suplemen, data dan pemeriksaan kehamilan, serta pemeriksaan lansia. Akun Kader harus ditautkan ke Posyandu. Akun Warga yang telah disetujui dapat melihat perkembangan anak; profil balita perlu mencatat profil Ibu agar catatan tampil pada akun yang benar.

Login contoh setelah seed:

| Peran | Email | Kata sandi |
|---|---|---|
| Admin | `admin@posyandu.test` | `password123` |
| Kader | `kader@posyandu.test` | `password123` |
| Warga | `warga@posyandu.test` | `password123` |

Ganti kredensial contoh dan jangan gunakan data contoh untuk deployment production.
