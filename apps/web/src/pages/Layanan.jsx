import { Link } from 'react-router-dom';
import {
  HiOutlineUserGroup,
  HiOutlineShieldCheck,
  HiOutlineClipboardList,
  HiOutlineChatAlt2,
  HiOutlineScale,
} from 'react-icons/hi';

const daftarLayanan = [
  {
    title: 'Penimbangan dan pengukuran',
    desc: 'Pemantauan berkala berat dan tinggi badan balita bersama kader untuk mendukung pencatatan tumbuh kembang.',
    icon: HiOutlineScale,
    target: 'Balita',
  },
  {
    title: 'Informasi imunisasi',
    desc: 'Informasi dan pendampingan terkait imunisasi anak. Jadwal serta ketersediaan layanan perlu dikonfirmasi kepada kader.',
    icon: HiOutlineShieldCheck,
    target: 'Bayi dan balita',
  },
  {
    title: 'Pendampingan kesehatan ibu',
    desc: 'Dukungan pemeriksaan dan edukasi kesehatan ibu, termasuk selama masa kehamilan.',
    icon: HiOutlineClipboardList,
    target: 'Ibu',
  },
  {
    title: 'Edukasi kesehatan keluarga',
    desc: 'Penyampaian informasi kesehatan keluarga dan kebiasaan hidup sehat melalui kegiatan Posyandu.',
    icon: HiOutlineChatAlt2,
    target: 'Seluruh keluarga',
  },
  {
    title: 'Pendampingan warga',
    desc: 'Kader membantu warga memperoleh informasi layanan dan mengetahui langkah selanjutnya sesuai kebutuhan.',
    icon: HiOutlineUserGroup,
    target: 'Warga RW 08',
  },
];

const Layanan = () => (
  <main className="min-h-screen px-6 pb-24">
    <section className="mx-auto max-w-7xl py-16 text-center md:py-24">
      <span className="mb-6 inline-block rounded-full bg-[#f1eee6] px-4 py-1.5 text-sm font-medium text-[#2b4764]">
        Layanan Posyandu RW 08
      </span>
      <h1 className="mb-6 text-4xl font-extrabold text-slate-900 md:text-5xl">Layanan kesehatan keluarga</h1>
      <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600">
        Kenali bentuk pendampingan yang tersedia. Jenis layanan, jadwal, dan ketersediaannya dapat
        berbeda; konfirmasikan kepada kader sebelum berkunjung.
      </p>
    </section>

    <section aria-label="Daftar layanan" className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
      {daftarLayanan.map(({ title, desc, icon: Icon, target }) => (
        <article key={title} className="flex gap-5 rounded-3xl border border-[#e8dcc2] bg-white/80 p-7 shadow-sm transition-shadow hover:shadow-md">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f1eee6] text-[#2b4764]">
            <Icon className="h-7 w-7" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <span className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Sasaran: {target}
            </span>
            <p className="mt-3 leading-relaxed text-slate-600">{desc}</p>
          </div>
        </article>
      ))}
    </section>

    <section className="mx-auto mt-12 flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl bg-[#2b4764] p-8 text-white md:flex-row md:items-center md:p-10">
      <div>
        <h2 className="text-2xl font-bold">Perlu memastikan jadwal layanan?</h2>
        <p className="mt-2 text-slate-200">Periksa kegiatan mendatang atau hubungi kader sebelum berkunjung.</p>
      </div>
      <Link to="/informasi" className="shrink-0 rounded-xl bg-white px-5 py-3 font-semibold text-[#2b4764] transition hover:bg-[#f1eee6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
        Lihat jadwal
      </Link>
    </section>
  </main>
);

export default Layanan;
