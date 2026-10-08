import { Link } from 'react-router-dom';
import { HiOutlinePhotograph } from 'react-icons/hi';

const Galeri = () => (
  <main className="min-h-screen px-6 pb-24">
    <section className="mx-auto max-w-7xl py-16 text-center md:py-24">
      <span className="mb-6 inline-flex rounded-2xl bg-[#f1eee6] p-3 text-[#2b4764]">
        <HiOutlinePhotograph className="h-8 w-8" aria-hidden="true" />
      </span>
      <h1 className="mb-6 text-4xl font-extrabold text-slate-900 md:text-5xl">Galeri kegiatan</h1>
      <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600">
        Dokumentasi kegiatan Posyandu RW 08 akan ditampilkan di sini setelah tersedia.
      </p>
    </section>

    <section className="mx-auto max-w-4xl rounded-3xl border border-dashed border-[#cbb995] bg-white/70 px-6 py-14 text-center">
      <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#f1eee6] text-[#2b4764]">
        <HiOutlinePhotograph className="h-8 w-8" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-xl font-semibold text-slate-900">Belum ada foto kegiatan</h2>
      <p className="mx-auto mt-2 max-w-xl leading-relaxed text-slate-600">
        Galeri belum memiliki dokumentasi untuk ditampilkan. Lihat jadwal kegiatan atau tanyakan
        informasi terbaru kepada kader.
      </p>
      <Link to="/informasi" className="mt-6 inline-flex rounded-xl bg-[#2b4764] px-5 py-3 font-semibold text-white transition hover:bg-[#1f3650] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b4764] focus-visible:ring-offset-2">
        Lihat jadwal kegiatan
      </Link>
    </section>
  </main>
);

export default Galeri;
