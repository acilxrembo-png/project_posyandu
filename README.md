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

### Akun contoh untuk pengembangan lokal

| Peran | Email | Kata sandi |
|---|---|---|
| Admin | `admin@posyandu.test` | `password123` |
| Kader | `kader@posyandu.test` | `password123` |
| Warga | `warga@posyandu.test` | `password123` |

Kredensial tersebut hanya untuk pengembangan lokal. Jangan gunakan data contoh atau kredensial ini untuk deployment production.

## Deploy production ke VPS (Docker)

Deployment menggunakan Docker Compose, PostgreSQL 16, Nginx, dan Caddy untuk HTTPS otomatis. Domain harus sudah mengarah ke IP VPS, dan port TCP 80/443 serta UDP 443 harus diizinkan firewall. Docker Engine dan Docker Compose v2 harus terpasang di VPS.

1. Salin repository ke VPS, lalu buat konfigurasi rahasia. Jangan commit file ini:

   ```sh
   cp .env.production.example .env.production
   chmod 600 .env.production
   ```

   Ganti `APP_DOMAIN` dengan domain sebenarnya; gunakan nama domain yang sama pada `CORS_ORIGIN` dengan awalan `https://`. Buat dua secret berbeda menggunakan `openssl rand -hex 32` untuk `POSTGRES_PASSWORD` dan `openssl rand -hex 48` untuk `JWT_SECRET`. Isi `POSTGRES_DB` dan `POSTGRES_USER` sesuai kebutuhan. Hindari karakter khusus pada password database karena nilainya juga dipakai dalam URL koneksi.

2. Bangun dan jalankan layanan:

   ```sh
   docker compose --env-file .env.production up -d --build
   docker compose --env-file .env.production ps
   docker compose --env-file .env.production logs --tail=100 api migrate caddy
   ```

   Migrasi Prisma dijalankan sebelum API mulai. Database hanya berada di jaringan internal Docker dan tidak membuka port ke internet. Caddy memperoleh dan memperbarui sertifikat HTTPS setelah DNS dan firewall siap. Seed akun/data contoh **tidak** dijalankan pada production.

   Migrasi awal pada `packages/database/prisma/migrations` ditujukan untuk database production baru. Untuk database yang sudah berisi data tetapi belum memiliki riwayat migrasi Prisma, jangan langsung menjalankan baseline: buat backup, bandingkan skema secara menyeluruh, lalu tandai baseline sebagai applied hanya jika skema database benar-benar cocok.

3. Buat admin pertama setelah migrasi selesai. Masukkan nilai dengan prompt tersembunyi, lalu jalankan perintah berikut dari shell Bash di VPS:

   ```sh
   read -r -p "Nama admin: " BOOTSTRAP_ADMIN_NAME
   read -r -p "Email admin: " BOOTSTRAP_ADMIN_EMAIL
   read -r -s -p "Password admin (min. 12 karakter): " BOOTSTRAP_ADMIN_PASSWORD
   printf '\n'
   export BOOTSTRAP_ADMIN_NAME BOOTSTRAP_ADMIN_EMAIL BOOTSTRAP_ADMIN_PASSWORD
   docker compose --env-file .env.production run --rm --no-deps \
     -e BOOTSTRAP_ADMIN_NAME -e BOOTSTRAP_ADMIN_EMAIL -e BOOTSTRAP_ADMIN_PASSWORD \
     api pnpm --filter api bootstrap:admin
   unset BOOTSTRAP_ADMIN_NAME BOOTSTRAP_ADMIN_EMAIL BOOTSTRAP_ADMIN_PASSWORD
   ```

   Perintah bootstrap menolak berjalan di luar production, mengharuskan password minimal 12 karakter, dan tidak dapat membuat admin kedua. Setelah admin berhasil dibuat, masuk dan tambahkan akun Kader dari dashboard.

4. Verifikasi `https://<domain>/` dan `https://<domain>/api/health`. Periksa status layanan dan log jika gagal; jangan menaruh secret pada issue, chat, atau log publik. Pastikan backup PostgreSQL otomatis disimpan terenkripsi di lokasi terpisah dari VPS dan lakukan uji pemulihan secara berkala. Contoh membuat backup manual:

   ```sh
   docker compose --env-file .env.production exec -T db sh -c \
     'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' > posyandu-$(date +%F).dump
   ```

   Simpan backup tersebut secara aman di luar VPS; file dump berisi data pribadi warga. Jangan gunakan `docker compose down -v` untuk menghentikan layanan karena opsi tersebut menghapus volume database.
