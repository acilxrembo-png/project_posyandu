import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiOutlineLocationMarker } from 'react-icons/hi';
import api from '../services/api';

const formatTanggal = (tanggal) => new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date(`${tanggal.slice(0, 10)}T00:00:00`));

const Informasi = () => {
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    api.get('/informasi/kegiatan')
      .then(({ data }) => {
        if (active) setJadwal(data.data);
      })
      .catch(() => {
        if (active) setError('Jadwal belum dapat dimuat. Silakan coba lagi nanti atau hubungi kader Posyandu.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen px-6 pb-24">
      <section className="mx-auto max-w-7xl py-16 md:py-24">
        <div className="max-w-3xl">
          <span className="mb-6 inline-block rounded-full bg-[#f1eee6] px-4 py-1.5 text-sm font-medium text-[#2b4764]">
            Pusat Informasi
          </span>
          <h1 className="mb-6 text-4xl font-extrabold text-slate-900 md:text-5xl">
            Jadwal kegiatan Posyandu
          </h1>
          <p className="text-lg leading-relaxed text-slate-600">
            Jadwal di halaman ini berasal dari kegiatan yang dicatat oleh petugas. Untuk perubahan atau
            konfirmasi jadwal, silakan hubungi kader Posyandu RW 08.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl rounded-3xl border border-[#e8dcc2] bg-white/80 p-6 shadow-sm md:p-10" aria-labelledby="jadwal-title">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#8a5a14]">Informasi layanan</p>
          <h2 id="jadwal-title" className="mt-2 text-2xl font-bold text-slate-900">Kegiatan mendatang</h2>
        </div>

        {loading && <p role="status" className="text-slate-600">Memuat jadwal kegiatan...</p>}
        {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">{error}</p>}
        {!loading && !error && jadwal.length === 0 && (
          <p className="rounded-2xl bg-[#f7f5ef] p-6 leading-relaxed text-slate-600">
            Belum ada kegiatan mendatang yang diumumkan. Periksa kembali nanti atau hubungi kader untuk
            memastikan jadwal layanan.
          </p>
        )}

        {!loading && !error && jadwal.length > 0 && (
          <ul className="grid gap-4 md:grid-cols-2">
            {jadwal.map((kegiatan) => (
              <li key={kegiatan.id} className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-sm font-semibold text-[#8a5a14]">{formatTanggal(kegiatan.tanggal)}</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">{kegiatan.tema || 'Kegiatan Posyandu'}</h3>
                {kegiatan.lokasi && (
                  <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                    <HiOutlineLocationMarker className="h-5 w-5 text-[#2b4764]" aria-hidden="true" />
                    {kegiatan.lokasi}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mx-auto mt-12 max-w-7xl rounded-3xl bg-[#2b4764] p-8 text-white md:flex md:items-center md:justify-between md:gap-8 md:p-10">
        <div>
          <h2 className="text-2xl font-bold">Bersiap sebelum datang</h2>
          <p className="mt-2 max-w-2xl leading-relaxed text-slate-200">
            Bawa buku KIA atau KMS bila tersedia. Konfirmasikan waktu dan lokasi kegiatan kepada kader,
            terutama jika ada perubahan jadwal.
          </p>
        </div>
        <Link to="/kontak" className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#2b4764] transition hover:bg-[#f1eee6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:mt-0">
          Hubungi kader
          <HiArrowRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
};

export default Informasi;
