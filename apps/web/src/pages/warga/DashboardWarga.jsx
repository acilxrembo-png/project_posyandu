import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineCalendar, HiOutlineClipboardList, HiOutlineLogout } from 'react-icons/hi';
import { useAuth } from '../../context/useAuth';
import api from '../../services/api';

const tautan = [
  {
    to: '/informasi',
    judul: 'Jadwal dan pengumuman',
    deskripsi: 'Periksa agenda pelayanan dan informasi terbaru.',
    ikon: HiOutlineCalendar,
  },
  {
    to: '/layanan',
    judul: 'Layanan Posyandu',
    deskripsi: 'Kenali layanan kesehatan yang tersedia untuk keluarga.',
    ikon: HiOutlineClipboardList,
  },
];

export default function DashboardWarga() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.get('/portal/anak')
      .then(({ data }) => {
        if (active) setChildren(data.data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || 'Perkembangan anak belum dapat dimuat.');
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
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <Link to="/" className="text-sm font-semibold text-[#2b4764] hover:underline">
              Posyandu RW 08
            </Link>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Selamat datang, {user?.nama || 'Warga'}</h1>
            <p className="mt-1 text-sm text-slate-600">Lihat perkembangan anak yang terhubung ke profil warga Anda.</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b4764]"
          >
            <HiOutlineLogout className="h-4 w-4" />
            Keluar
          </button>
        </header>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="anak-title">
          <div className="mb-5">
            <h2 id="anak-title" className="text-lg font-semibold text-slate-900">Perkembangan anak</h2>
            <p className="mt-1 text-sm text-slate-600">Data penimbangan, imunisasi, dan suplemen dari layanan Posyandu.</p>
          </div>
          {loading && <p role="status" className="text-sm text-slate-600">Memuat perkembangan anak...</p>}
          {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
          {!loading && !error && children.length === 0 && (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Belum ada profil anak yang ditautkan ke profil Ibu Anda. Hubungi Kader Posyandu untuk memastikan hubungan anak sudah dicatat.</p>
          )}
          {!loading && !error && children.length > 0 && (
            <div className="space-y-5">
              {children.map((child) => (
                <article key={child.id} className="rounded-xl border border-slate-200 p-4 sm:p-5">
                  <h3 className="font-semibold text-slate-900">{child.warga.nama}</h3>
                  <p className="mt-1 text-sm text-slate-600">Nomor KIA: {child.nomorKia || 'Belum dicatat'}</p>

                  <div className="mt-5 grid gap-5 lg:grid-cols-3">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">Penimbangan terbaru</h4>
                      {child.penimbangan.length === 0 ? <p className="mt-2 text-sm text-slate-500">Belum ada catatan penimbangan.</p> : (
                        <ul className="mt-2 space-y-2">
                          {child.penimbangan.slice(0, 6).map((item) => (
                            <li key={item.id} className="rounded-lg bg-slate-50 p-3 text-sm">
                              <p className="font-medium text-slate-800">{item.kegiatan?.tanggal ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(`${String(item.kegiatan.tanggal).slice(0, 10)}T00:00:00`)) : 'Tanggal tidak tersedia'}</p>
                              <p className="mt-1 text-slate-600">{item.berat} kg{item.tinggi ? ` · ${item.tinggi} cm` : ''} · usia {item.umurBulan} bulan</p>
                              <p className="mt-1 text-xs text-slate-500">Status gizi: {item.statusBBTB?.replaceAll('_', ' ') || 'Belum diklasifikasi'}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">Imunisasi</h4>
                      {child.imunisasi.length === 0 ? <p className="mt-2 text-sm text-slate-500">Belum ada catatan imunisasi.</p> : (
                        <ul className="mt-2 space-y-2">
                          {child.imunisasi.slice(0, 6).map((item) => (
                            <li key={item.id} className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                              {item.vaksin.nama} · dosis {item.dosisKe} · {new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(`${String(item.tanggal).slice(0, 10)}T00:00:00`))}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">Suplemen</h4>
                      {child.suplemen.length === 0 ? <p className="mt-2 text-sm text-slate-500">Belum ada catatan pemberian suplemen.</p> : (
                        <ul className="mt-2 space-y-2">
                          {child.suplemen.slice(0, 6).map((item) => (
                            <li key={item.id} className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                              {item.jenis.replaceAll('_', ' ')} · {new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(`${String(item.tanggal).slice(0, 10)}T00:00:00`))}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          {tautan.map(({ to, judul, deskripsi, ikon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b4764]"
            >
              <span className="inline-flex rounded-xl bg-[#f1eee6] p-3 text-[#2b4764]">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">{judul}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{deskripsi}</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
