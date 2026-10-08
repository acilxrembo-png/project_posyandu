import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiOutlineCalendar, HiOutlineChartBar, HiOutlineClipboardList, HiOutlineHeart, HiOutlineLocationMarker, HiOutlinePhone, HiOutlineShieldCheck, HiOutlineUserGroup } from 'react-icons/hi';
import api from '../services/api';

const HIGHLIGHTS = [
  { teks: 'Pendampingan ibu & anak', ikon: HiOutlineHeart, warna: 'bg-[#f1eee6] text-[#2b4764]' },
  { teks: 'Pertumbuhan terpantau', ikon: HiOutlineChartBar, warna: 'bg-[#f2e8d3] text-[#8a5a14]' },
  { teks: 'Didukung kader setempat', ikon: HiOutlineUserGroup, warna: 'bg-[#f1eee6] text-[#2b4764]' },
  { teks: 'Informasi layanan berkala', ikon: HiOutlineCalendar, warna: 'bg-[#f2e8d3] text-[#8a5a14]' },
];

const LAYANAN = [
  { nama: 'Penimbangan balita', isi: 'Pantau berat dan tinggi badan anak secara berkala bersama kader.', ikon: HiOutlineChartBar, warna: 'bg-[#f1eee6] text-[#2b4764]' },
  { nama: 'Imunisasi', isi: 'Dapatkan informasi imunisasi untuk membantu melindungi kesehatan anak.', ikon: HiOutlineShieldCheck, warna: 'bg-[#f2e8d3] text-[#8a5a14]' },
  { nama: 'Kesehatan ibu', isi: 'Dukungan pemeriksaan dan edukasi kesehatan selama kehamilan.', ikon: HiOutlineHeart, warna: 'bg-[#f1eee6] text-[#2b4764]' },
  { nama: 'Edukasi keluarga', isi: 'Berbagi informasi seputar gizi, tumbuh kembang, dan hidup sehat.', ikon: HiOutlineClipboardList, warna: 'bg-[#f2e8d3] text-[#8a5a14]' },
];

// Warna aksen: biru kabut tua (pengganti hijau) dan emas hangat, diambil dari gradasi referensi
const cincin = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b4764] focus-visible:ring-offset-2';
const kaca = 'border border-white/70 bg-white/65 backdrop-blur-md shadow-lg shadow-[#2b4764]/10';

const formatTanggal = (tanggal) => new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
}).format(new Date(`${tanggal.slice(0, 10)}T00:00:00`));

function BagianPembuka() {
  return (
    <section className="relative overflow-hidden">
      {/* Cahaya emas di kiri atas dan kabut biru di kanan: inti gradasi */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_8%_0%,rgba(255,206,120,0.75),transparent_70%),radial-gradient(ellipse_55%_60%_at_100%_55%,rgba(110,140,178,0.38),transparent_70%)]"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-10 lg:gap-12 lg:py-24 xl:gap-16">
        <div className="relative z-10 min-w-0">
          <span className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-[#2b4764] sm:text-sm">
            <span className="h-px w-8 bg-amber-600" />
            Posyandu RW 08
          </span>
          <h1 className="mt-6 max-w-2xl text-[2.6rem] font-semibold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl xl:text-[3.7rem]">
            Tumbuh sehat, <span className="font-serif font-medium italic text-[#8a5a14]">bersama keluarga.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-700 sm:text-lg">Ruang layanan dan informasi kesehatan ibu-anak yang dekat dengan keluarga di lingkungan RW 08.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/layanan"
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2b4764] px-6 py-3 font-semibold text-white shadow-lg shadow-[#2b4764]/25 transition duration-200 hover:-translate-y-0.5 hover:bg-[#1f3650] ${cincin}`}
            >
              Kenali layanan <HiArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/informasi" className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-slate-800 transition duration-200 hover:bg-white/90 ${kaca} ${cincin}`}>
              Lihat jadwal <HiOutlineCalendar className="h-5 w-5" />
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-3 border-t border-slate-900/10 pt-6">
            <div className="flex -space-x-2" aria-hidden="true">
              <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-white/80 bg-rose-100 text-rose-700">
                <HiOutlineHeart className="h-4 w-4" />
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-white/80 bg-sky-100 text-sky-700">
                <HiOutlineUserGroup className="h-4 w-4" />
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-white/80 bg-amber-100 text-amber-800">
                <HiOutlineShieldCheck className="h-4 w-4" />
              </span>
            </div>
            <p className="text-sm leading-5 text-slate-700">
              Informasi kesehatan yang <span className="font-semibold text-slate-900">dekat, ramah, dan mudah dijangkau.</span>
            </p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl min-w-0 lg:justify-self-end">
          <figure className="group relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-[#d9e1e8] shadow-xl shadow-[#2b4764]/15 ring-1 ring-white/80 sm:aspect-[3/2]">
              <img src="/foto%20layanan.jpg" alt="Ilustrasi kader kesehatan sedang memeriksa anak di posyandu" fetchPriority="high" className="h-full w-full object-cover object-[center_44%] transition duration-700 group-hover:scale-[1.02]" />
            </div>
            <figcaption className="mt-4 flex items-center gap-4 rounded-2xl border border-white/80 bg-white/75 px-5 py-4 shadow-lg shadow-[#2b4764]/10 backdrop-blur-sm sm:px-6">
              <span className="h-10 w-1 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
              <span>
                <span className="block text-xs font-bold uppercase tracking-[0.16em] text-[#8a5a14]">Bersama untuk keluarga</span>
                <span className="mt-1 block text-base font-semibold leading-snug text-[#2b4764] sm:text-lg">Setiap tumbuh kembang berarti.</span>
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function SorotanLayanan() {
  return (
    <section className="relative z-10 -mt-6 px-5 sm:px-8">
      <ul className={`mx-auto grid max-w-6xl grid-cols-1 gap-3 rounded-2xl p-3 sm:grid-cols-2 lg:grid-cols-4 ${kaca}`}>
        {HIGHLIGHTS.map(({ teks, ikon: Ikon, warna }) => (
          <li key={teks} className="flex items-center gap-3 rounded-2xl p-4">
            <span className={`rounded-xl p-2.5 ${warna}`}>
              <Ikon className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold text-slate-800">{teks}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DaftarLayanan() {
  return (
    <section>
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 md:py-24 lg:grid-cols-[0.8fr_2.2fr]">
        <div className="self-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2b4764]">Dukungan keluarga</span>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl">Layanan kesehatan, lebih dekat untuk semua.</h2>
          <p className="mt-4 leading-7 text-slate-700">Kenali layanan dasar Posyandu untuk mendukung tumbuh kembang anak dan kesehatan ibu.</p>
          <Link to="/layanan" className={`mt-6 inline-flex items-center gap-2 font-semibold text-[#2b4764] transition hover:gap-3 hover:text-[#1f3650] ${cincin}`}>
            Lihat semua layanan <HiArrowRight />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {LAYANAN.map(({ nama, isi, ikon: Ikon, warna }) => (
            <Link key={nama} to="/layanan" className={`group rounded-xl p-5 transition duration-200 hover:-translate-y-0.5 hover:bg-white/85 sm:p-6 ${kaca} ${cincin}`}>
              <div className={`inline-flex rounded-xl p-3 ${warna}`}>
                <Ikon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-semibold text-slate-900">{nama}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">{isi}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2b4764] transition group-hover:gap-3">
                Selengkapnya <HiArrowRight />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function JadwalKegiatan() {
  const [agenda, setAgenda] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    api.get('/informasi/kegiatan')
      .then(({ data }) => {
        if (active) setAgenda(data.data.slice(0, 3));
      })
      .catch(() => {
        if (active) setError('Jadwal belum dapat dimuat. Silakan buka halaman informasi atau hubungi kader.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="px-5 pb-20 pt-8 sm:px-8 md:pb-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.35fr_0.85fr]">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#1f3650]">Catat tanggalnya</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Agenda Posyandu</h2>
          <p className="mt-3 max-w-xl leading-7 text-slate-800">Jadwal mendatang yang ditampilkan diambil dari kegiatan yang dicatat petugas. Konfirmasikan perubahan kepada kader.</p>
          {loading && <p role="status" className="mt-7 rounded-xl bg-white/70 p-5 text-sm text-slate-600">Memuat jadwal kegiatan...</p>}
          {error && <p role="alert" className="mt-7 rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">{error}</p>}
          {!loading && !error && agenda.length === 0 && (
            <p className="mt-7 rounded-xl border border-white/70 bg-white/70 p-5 leading-relaxed text-slate-600">
              Belum ada jadwal mendatang yang diumumkan. Silakan periksa kembali nanti atau hubungi kader untuk konfirmasi.
            </p>
          )}
          {!loading && !error && agenda.length > 0 && (
            <ul className="mt-7 space-y-3">
            {agenda.map((kegiatan) => (
              <li key={kegiatan.id}>
                <Link to="/informasi" className={`group flex items-center gap-4 rounded-xl p-4 transition duration-200 hover:bg-white/85 sm:p-5 ${kaca} ${cincin}`}>
                  <span className="flex h-[4.5rem] w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-xl bg-amber-100/90 text-[#8a5a14]">
                    <span className="text-lg font-semibold leading-none">{formatTanggal(kegiatan.tanggal)}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold leading-snug text-slate-900">{kegiatan.tema || 'Kegiatan Posyandu'}</span>
                    {kegiatan.lokasi && (
                      <span className="mt-2 flex items-center gap-1.5 text-sm text-slate-600">
                        <HiOutlineLocationMarker className="h-4 w-4 text-[#2b4764]" />
                        {kegiatan.lokasi}
                      </span>
                    )}
                  </span>
                  <HiArrowRight className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#2b4764]" />
                </Link>
              </li>
            ))}
            </ul>
          )}
          <Link to="/informasi" className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1f3650] transition hover:gap-3 ${cincin}`}>
            Lihat informasi lainnya <HiArrowRight />
          </Link>
        </div>

        <aside className="flex flex-col justify-between rounded-2xl bg-[#2b4764]/95 p-7 text-white shadow-xl shadow-[#1f3650]/30 ring-1 ring-white/20 sm:p-9">
          <div>
            <span className="inline-flex rounded-xl bg-white/10 p-3 text-amber-200">
              <HiOutlineLocationMarker className="h-6 w-6" />
            </span>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-amber-200">Kami siap membantu</p>
            <h3 className="mt-3 text-2xl font-semibold leading-snug sm:text-3xl">Ada pertanyaan seputar layanan?</h3>
            <p className="mt-3 leading-7 text-white/80">Hubungi kader atau kunjungi Balai Warga RW 08 untuk mendapatkan informasi.</p>
            <p className="mt-5 flex items-center gap-2 text-sm font-medium text-white/90">
              <HiOutlineLocationMarker className="h-5 w-5 text-amber-200" />
              Balai Warga RW 08
            </p>
          </div>
          <Link
            to="/kontak"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#1f3650] transition hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2b4764]"
          >
            <HiOutlinePhone /> Hubungi kami <HiArrowRight />
          </Link>
        </aside>
      </div>
    </section>
  );
}

export default function Beranda() {
  return (
    // Gradasi lembut menyatukan aksen emas hangat dan biru kabut.
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbf8f0_0%,#f5f3ed_34%,#e8edf1_72%,#dce5ec_100%)] font-sans selection:bg-amber-100">
      <BagianPembuka />
      <SorotanLayanan />
      <DaftarLayanan />
      <JadwalKegiatan />
    </main>
  );
}
