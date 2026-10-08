import { Link } from 'react-router-dom';
import { HiOutlineCalendar, HiOutlineHeart, HiOutlineClipboardList } from 'react-icons/hi';
import Logo from '../assets/Logo.svg';

const highlights = [
  {
    icon: HiOutlineCalendar,
    title: 'Jadwal kegiatan',
    text: 'Lihat jadwal posyandu dan imunisasi di lingkungan RW 08.',
  },
  {
    icon: HiOutlineHeart,
    title: 'Tumbuh kembang balita',
    text: 'Berat dan tinggi badan anak tercatat rapi dari bulan ke bulan.',
  },
  {
    icon: HiOutlineClipboardList,
    title: 'Ibu hamil dan lansia',
    text: 'Hasil pemeriksaan tersimpan dan mudah dicari kembali.',
  },
];

const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="min-h-screen bg-white lg:grid lg:grid-cols-[5fr_6fr]">
    {/* Panel kiri (desktop) */}
    <aside className="relative hidden overflow-hidden bg-teal-800 p-12 text-white lg:flex lg:flex-col lg:justify-between">
      {/* Bentuk dekoratif */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-700/60" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-teal-900/50" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-40 right-10 h-24 w-24 rounded-full border-4 border-amber-300/70" aria-hidden="true" />

      <Link to="/" className="relative flex items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <img src={Logo} alt="Logo Posyandu RW 08" className="h-12 w-12 rounded-full bg-white object-contain p-0.5" />
        <span className="text-xl font-bold">Posyandu RW 08</span>
      </Link>

      <div className="relative">
        <h2 className="max-w-md text-4xl font-bold leading-tight">
          Pelayanan kesehatan warga, lebih tertata.
        </h2>
        <p className="mt-4 max-w-md text-base leading-7 text-teal-100">
          Satu tempat untuk melihat informasi dan layanan posyandu di lingkungan kita.
        </p>

        <ul className="mt-10 space-y-6">
          {highlights.map(({ icon: Icon, title: itemTitle, text }) => (
            <li key={itemTitle} className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <Icon className="h-6 w-6 text-amber-300" />
              </span>
              <div>
                <p className="font-semibold">{itemTitle}</p>
                <p className="mt-0.5 text-sm leading-6 text-teal-100">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-sm text-teal-200">&copy; {new Date().getFullYear()} Posyandu RW 08</p>
    </aside>

    {/* Panel form */}
    <main className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
      <div className="w-full max-w-md">
        {/* Brand (mobile) */}
        <Link to="/" className="mb-8 flex items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 lg:hidden">
          <img src={Logo} alt="Logo Posyandu RW 08" className="h-11 w-11 rounded-full object-contain ring-2 ring-teal-100" />
          <span className="text-lg font-bold text-slate-900">Posyandu RW 08</span>
        </Link>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>

        <div className="mt-8">{children}</div>

        {footer && <p className="mt-8 text-center text-sm text-slate-600">{footer}</p>}
      </div>
    </main>
  </div>
);

export default AuthLayout;