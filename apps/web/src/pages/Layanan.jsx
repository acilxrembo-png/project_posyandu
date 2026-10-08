import { HiOutlineUserGroup, HiOutlineShieldCheck, HiOutlineClipboardList, HiOutlineChatAlt2, HiOutlineScale } from 'react-icons/hi';

const Layanan = () => {
  const daftarLayanan = [
    {
      id: 1,
      title: 'Penimbangan & Pengukuran',
      desc: 'Pemantauan rutin berat dan tinggi badan balita setiap bulan untuk memastikan kurva pertumbuhan anak berada di garis yang sehat dan mencegah stunting sejak dini.',
      icon: HiOutlineScale,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      target: 'Balita (0-5 Tahun)',
    },
    {
      id: 2,
      title: 'Imunisasi Dasar & Lanjutan',
      desc: 'Pemberian vaksinasi lengkap sesuai jadwal Kemenkes (BCG, DPT, Polio, Campak) untuk melindungi anak dari berbagai penyakit menular berbahaya.',
      icon: HiOutlineShieldCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      target: 'Bayi & Balita',
    },
    {
      id: 3,
      title: 'Kesehatan Ibu Hamil (KIA)',
      desc: 'Pemeriksaan kehamilan rutin, pengukuran tekanan darah, pemberian tablet tambah darah (Fe), serta edukasi persiapan persalinan yang aman.',
      icon: HiOutlineClipboardList,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      target: 'Ibu Hamil',
    },
    {
      id: 4,
      title: 'Keluarga Berencana (KB)',
      desc: 'Pelayanan dan konsultasi pemilihan alat kontrasepsi (pil, suntik, kondom) untuk mengatur jarak kelahiran demi kesejahteraan ibu dan anak.',
      icon: HiOutlineUserGroup,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      target: 'Pasangan Usia Subur',
    },
    {
      id: 5,
      title: 'Penyuluhan Kesehatan',
      desc: 'Sesi edukasi interaktif mengenai Perilaku Hidup Bersih dan Sehat (PHBS), pemenuhan gizi seimbang, dan sanitasi lingkungan.',
      icon: HiOutlineChatAlt2,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      target: 'Seluruh Warga',
    },
  ];

  return (
    <div className="min-h-screen font-sans bg-white selection:bg-blue-100">
      <main>
        {/* HEADER SECTION */}
        <section className="px-6 py-16 mx-auto max-w-7xl md:py-24 text-center">
          <h1 className="text-4xl font-extrabold md:text-5xl text-slate-900 mb-6">Layanan Kesehatan Kami</h1>
          <p className="max-w-2xl mx-auto text-lg leading-relaxed text-slate-600">
            Kami menyediakan berbagai program kesehatan dasar yang terpadu untuk memastikan setiap keluarga di RW 08 mendapatkan pemantauan dan perawatan yang optimal.
          </p>
        </section>

        {/* DAFTAR LAYANAN SECTION */}
        <section className="px-6 pb-24 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {daftarLayanan.map((layanan) => (
              <div key={layanan.id} className="flex flex-col sm:flex-row gap-6 p-8 transition-shadow bg-white border border-slate-100 rounded-3xl hover:shadow-xl hover:shadow-slate-100/50">
                <div className={`flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl ${layanan.bg} ${layanan.color}`}>
                  <layanan.icon className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{layanan.title}</h3>
                  </div>
                  <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-slate-600 bg-slate-100 rounded-full">Target: {layanan.target}</span>
                  <p className="leading-relaxed text-slate-600">{layanan.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="px-6 pb-24 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-8 p-10 text-center bg-blue-600 md:flex-row md:text-left rounded-3xl">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Ingin melihat jadwal layanan bulan ini?</h2>
              <p className="text-blue-100">Pastikan Anda tidak terlewat jadwal posyandu untuk buah hati Anda.</p>
            </div>
            <button className="px-8 py-3.5 font-bold text-blue-600 transition-colors bg-white rounded-full hover:bg-blue-50 whitespace-nowrap">Lihat Jadwal</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Layanan;
