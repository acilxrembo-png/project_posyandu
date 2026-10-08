import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineCalendar, HiOutlineLogout, HiOutlineUserGroup } from 'react-icons/hi';
import api from '../services/api';
import { useAuth } from '../context/useAuth';
import KelolaKegiatan from './KelolaKegiatan';
import DataKependudukan from './DataKependudukan';
import KelolaAkun from './KelolaAkun';

const metrik = [
  { key: 'totalWarga', label: 'Warga terdaftar', ikon: HiOutlineUserGroup },
  { key: 'totalBalita', label: 'Balita terdaftar', ikon: HiOutlineUserGroup },
  { key: 'kehamilanAktif', label: 'Kehamilan aktif', ikon: HiOutlineUserGroup },
  { key: 'totalLansia', label: 'Warga lansia', ikon: HiOutlineUserGroup },
  { key: 'totalKegiatan', label: 'Kegiatan tercatat', ikon: HiOutlineCalendar },
];

export default function DashboardRingkasan({ title, description }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    api.get('/dashboard/stats')
      .then(({ data }) => {
        if (active) setStats(data.data);
      })
      .catch((requestError) => {
        if (active) {
          setError(
            requestError.response?.data?.message
              || 'Ringkasan belum dapat dimuat. Periksa koneksi API, lalu coba lagi.',
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#f5f5f1] px-4 py-8 text-slate-800 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <Link to="/" className="text-sm font-semibold text-[#2b4764] hover:underline">
              Posyandu RW 08
            </Link>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">{user?.nama || user?.email}</p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b4764]"
            >
              <HiOutlineLogout className="h-4 w-4" />
              Keluar
            </button>
          </div>
        </header>

        <section className="mt-8" aria-labelledby="ringkasan-title">
          <div className="mb-4">
            <h2 id="ringkasan-title" className="text-lg font-semibold text-slate-900">Ringkasan Posyandu</h2>
            <p className="mt-1 text-sm text-slate-600">Data terbaru dari sistem.</p>
          </div>

          {loading && <p role="status" className="rounded-xl bg-white p-5 text-sm text-slate-600">Memuat ringkasan...</p>}

          {error && (
            <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
              {error}
            </div>
          )}

          {stats && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {metrik.map(({ key, label, ikon: Icon }) => (
                  <article key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-slate-600">{label}</p>
                      <span className="rounded-xl bg-[#f1eee6] p-2 text-[#2b4764]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </div>
                    <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                      {Number(stats[key] || 0).toLocaleString('id-ID')}
                    </p>
                  </article>
                ))}
              </div>

              <article className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="font-semibold text-slate-900">Status gizi balita</h2>
                {stats.statusGiziBBTB?.length ? (
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {stats.statusGiziBBTB.map(({ status, jumlah }) => (
                      <li key={status || 'belum-diklasifikasi'} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                        <span>{(status || 'Belum diklasifikasi').replaceAll('_', ' ')}</span>
                        <strong className="text-slate-900">{jumlah.toLocaleString('id-ID')}</strong>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-slate-600">Belum ada data status gizi.</p>
                )}
              </article>
            </>
          )}
        </section>

        <KelolaKegiatan role={user?.role} />
        <DataKependudukan role={user?.role} />
        {user?.role === 'ADMIN' && <KelolaAkun user={user} />}

        <nav aria-label="Tautan cepat" className="mt-8 flex flex-wrap gap-3">
          <Link to="/layanan" className="rounded-xl bg-[#2b4764] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f3650]">
            Lihat layanan
          </Link>
          <Link to="/informasi" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Lihat informasi dan jadwal
          </Link>
        </nav>
      </div>
    </main>
  );
}
