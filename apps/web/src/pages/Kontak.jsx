import { Link } from 'react-router-dom';
import { HiOutlineLocationMarker, HiOutlineUserGroup, HiOutlineCalendar } from 'react-icons/hi';

const Kontak = () => (
  <main className="min-h-screen px-6 pb-24">
    <section className="mx-auto max-w-7xl py-16 text-center md:py-24">
      <span className="mb-6 inline-block rounded-full bg-[#f1eee6] px-4 py-1.5 text-sm font-medium text-[#2b4764]">
        Posyandu RW 08
      </span>
      <h1 className="mb-6 text-4xl font-extrabold text-slate-900 md:text-5xl">Hubungi kader</h1>
      <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600">
        Untuk memastikan informasi tetap akurat, tanyakan jadwal dan layanan secara langsung kepada
        kader Posyandu RW 08.
      </p>
    </section>

    <section className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2" aria-label="Cara mendapatkan informasi">
      <article className="rounded-3xl border border-[#e8dcc2] bg-white/80 p-8 shadow-sm">
        <span className="inline-flex rounded-2xl bg-[#f1eee6] p-3 text-[#2b4764]">
          <HiOutlineUserGroup className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-xl font-bold text-slate-900">Tanyakan kepada kader</h2>
        <p className="mt-3 leading-relaxed text-slate-600">
          Temui kader Posyandu di lingkungan RW 08 untuk informasi layanan, pendaftaran, atau
          perubahan jadwal. Situs ini belum menyediakan pengiriman pesan langsung.
        </p>
      </article>

      <article className="rounded-3xl border border-[#e8dcc2] bg-white/80 p-8 shadow-sm">
        <span className="inline-flex rounded-2xl bg-[#f1eee6] p-3 text-[#2b4764]">
          <HiOutlineLocationMarker className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-xl font-bold text-slate-900">Lokasi pelayanan</h2>
        <p className="mt-3 leading-relaxed text-slate-600">
          Kegiatan dilaksanakan di lokasi yang ditetapkan untuk setiap jadwal. Periksa informasi
          kegiatan atau konfirmasikan lokasi kepada kader sebelum berangkat.
        </p>
      </article>
    </section>

    <nav aria-label="Tautan informasi" className="mx-auto mt-10 flex max-w-5xl flex-wrap gap-3">
      <Link to="/informasi" className="inline-flex items-center gap-2 rounded-xl bg-[#2b4764] px-5 py-3 font-semibold text-white transition hover:bg-[#1f3650] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b4764] focus-visible:ring-offset-2">
        <HiOutlineCalendar className="h-5 w-5" aria-hidden="true" />
        Lihat jadwal kegiatan
      </Link>
      <Link to="/layanan" className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b4764]">
        Lihat layanan
      </Link>
    </nav>
  </main>
);

export default Kontak;
