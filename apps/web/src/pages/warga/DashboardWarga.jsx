import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineCalendar, HiOutlineClipboardList, HiOutlineLogout } from 'react-icons/hi';
import { useAuth } from '../../context/useAuth';

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
            <p className="mt-1 text-sm text-slate-600">Akses informasi dan layanan Posyandu dari sini.</p>
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
