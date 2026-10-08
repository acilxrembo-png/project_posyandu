import { Link } from 'react-router-dom';
import { HiOutlineHeart, HiOutlineLightBulb, HiOutlineUserGroup } from 'react-icons/hi';

const Tentang = () => (
  <main className="min-h-screen px-6 pb-24">
    <section className="mx-auto max-w-7xl py-16 text-center md:py-24">
      <span className="mb-6 inline-block rounded-full bg-[#f1eee6] px-4 py-1.5 text-sm font-medium text-[#2b4764]">
        Mengenal kami lebih dekat
      </span>
      <h1 className="mb-6 text-4xl font-extrabold text-slate-900 md:text-5xl">Tentang Posyandu RW 08</h1>
      <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600">
        Posyandu mendukung keluarga melalui kegiatan kesehatan berbasis masyarakat, pendampingan
        kader, dan informasi layanan di lingkungan RW 08.
      </p>
    </section>

    <section className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
      <article className="rounded-3xl border border-[#e8dcc2] bg-white/80 p-8 shadow-sm">
        <span className="inline-flex rounded-2xl bg-[#f1eee6] p-3 text-[#2b4764]">
          <HiOutlineLightBulb className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-2xl font-bold text-slate-900">Tujuan</h2>
        <p className="mt-3 leading-relaxed text-slate-600">
          Mendekatkan informasi dan pendampingan kesehatan ibu, anak, serta keluarga kepada warga.
          Pelayanan diberikan sesuai kegiatan dan tenaga yang tersedia.
        </p>
      </article>
      <article className="rounded-3xl border border-[#e8dcc2] bg-white/80 p-8 shadow-sm">
        <span className="inline-flex rounded-2xl bg-[#f1eee6] p-3 text-[#8a5a14]">
          <HiOutlineHeart className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-2xl font-bold text-slate-900">Pendampingan bersama</h2>
        <p className="mt-3 leading-relaxed text-slate-600">
          Kader membantu warga mendapatkan informasi kegiatan dan layanan. Untuk kebutuhan
          pemeriksaan atau saran medis, warga dapat berkonsultasi dengan tenaga kesehatan.
        </p>
      </article>
    </section>

    <section className="mx-auto mt-12 max-w-7xl rounded-3xl bg-[#2b4764] p-8 text-white md:flex md:items-center md:justify-between md:gap-8 md:p-10">
      <div className="flex items-start gap-4">
        <HiOutlineUserGroup className="mt-1 h-7 w-7 shrink-0 text-amber-200" aria-hidden="true" />
        <div>
          <h2 className="text-2xl font-bold">Cari tahu kegiatan Posyandu</h2>
          <p className="mt-2 leading-relaxed text-slate-200">
            Jadwal dan lokasi kegiatan diumumkan setelah dicatat oleh petugas. Konfirmasikan
            informasi kepada kader sebelum berkunjung.
          </p>
        </div>
      </div>
      <Link to="/informasi" className="mt-6 inline-flex shrink-0 rounded-xl bg-white px-5 py-3 font-semibold text-[#2b4764] transition hover:bg-[#f1eee6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:mt-0">
        Lihat jadwal
      </Link>
    </section>
  </main>
);

export default Tentang;
