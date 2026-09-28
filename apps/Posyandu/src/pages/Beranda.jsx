import { HiOutlineUserGroup, HiOutlineClipboardList, HiOutlineShieldCheck, HiOutlineHeart, HiArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';

// --- KOMPONEN HERO SECTION ---
const HeroSection = () => (
  <section className="px-6 py-20 md:py-32 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
    <div className="flex-1 space-y-8">
      <span className="inline-block px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">Sehat Anak, Kuat Masa Depan</span>
      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.15]">
        Langkah Kecil untuk <br />
        <span className="text-blue-600">Masa Depan Lebih Sehat</span>
      </h1>
      <p className="text-lg leading-relaxed text-slate-600 max-w-xl">Kami hadir untuk mendukung kesehatan ibu, balita, dan keluarga melalui layanan yang mudah, dekat, dan terpercaya di lingkungan RW 08.</p>
      <div className="flex flex-wrap gap-4 pt-4">
        <Link to="/layanan" className="flex items-center gap-2 px-8 py-3.5 font-semibold text-white transition-all bg-blue-600 rounded-full hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200">
          Lihat Layanan <HiArrowRight />
        </Link>
        <Link to="/tentang" className="px-8 py-3.5 font-semibold transition-all bg-white border-2 rounded-full text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50">
          Tentang Kami
        </Link>
      </div>
    </div>
    <div className="flex h-[400px] flex-1 w-full items-center justify-center overflow-hidden rounded-[2rem] border border-blue-100 bg-blue-50 shadow-sm">
      <div className="max-w-xs px-8 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-blue-600 shadow-sm">
          <HiOutlineHeart className="h-10 w-10" />
        </div>
        <p className="text-lg font-semibold text-slate-800">Bersama menjaga kesehatan keluarga RW 08</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">Pelayanan dekat, ramah, dan terpercaya untuk warga.</p>
      </div>
    </div>
  </section>
);

// --- KOMPONEN STATISTIK ---
const StatsSection = () => {
  const stats = [
    { label: 'Keluarga Terlayani', value: '250+', icon: HiOutlineUserGroup, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Balita Aktif', value: '120+', icon: HiOutlineHeart, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Ibu Hamil Terpantau', value: '80+', icon: HiOutlineClipboardList, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <section className="px-6 py-12 mx-auto max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex items-center gap-5 p-6 bg-white border shadow-sm border-slate-100 rounded-2xl">
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
              <p className="font-medium text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// --- KOMPONEN LAYANAN KAMI ---
const ServicesSection = () => {
  const services = [
    {
      title: 'Penimbangan Balita',
      desc: 'Memantau pertumbuhan dan perkembangan anak secara rutin setiap bulan.',
      icon: HiOutlineUserGroup,
    },
    {
      title: 'Imunisasi Lengkap',
      desc: 'Perlindungan dari berbagai penyakit untuk masa depan anak yang lebih sehat.',
      icon: HiOutlineShieldCheck,
    },
    {
      title: 'Pemeriksaan Ibu Hamil',
      desc: 'Menjaga kesehatan ibu dan janin selama masa kehamilan hingga persalinan.',
      icon: HiOutlineClipboardList,
    },
  ];

  return (
    <section id="layanan" className="px-6 py-24 mx-auto max-w-7xl">
      <div className="mb-16 text-center md:text-left md:flex md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Layanan Kesehatan Keluarga</h2>
          <p className="text-lg text-slate-600">Berbagai layanan pendukung tumbuh kembang anak, kesehatan ibu, dan kesejahteraan keluarga.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {services.map((srv, idx) => (
          <div key={idx} className="p-8 transition-shadow bg-white border border-slate-100 rounded-[2rem] hover:shadow-xl hover:shadow-slate-100/50">
            <div className="inline-flex p-4 mb-6 text-blue-600 bg-blue-50 rounded-2xl">
              <srv.icon className="w-8 h-8" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">{srv.title}</h3>
            <p className="leading-relaxed text-slate-600">{srv.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// --- HALAMAN UTAMA ---
const BerandaLanding = () => {
  return (
    <div className="min-h-screen font-sans bg-white selection:bg-blue-100">
      <main>
        <HeroSection />
        <StatsSection />
        <ServicesSection />
      </main>
    </div>
  );
};

export default BerandaLanding;
