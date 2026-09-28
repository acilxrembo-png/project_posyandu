import { HiOutlineClock, HiOutlineLocationMarker, HiArrowRight } from 'react-icons/hi';

const Informasi = () => {
  // Data dummy jadwal kegiatan
  const jadwalKegiatan = [
    {
      id: 1,
      tanggal: '15',
      bulan: 'Okt',
      kegiatan: 'Posyandu Balita & Imunisasi',
      waktu: '08:00 - 11:00 WIB',
      lokasi: 'Balai Warga RW 08',
      status: 'Akan Datang',
    },
    {
      id: 2,
      tanggal: '22',
      bulan: 'Okt',
      kegiatan: 'Kelas Ibu Hamil',
      waktu: '09:00 - 10:30 WIB',
      lokasi: 'Puskesmas Pembantu',
      status: 'Akan Datang',
    },
  ];

  // Data dummy berita/pengumuman
  const daftarBerita = [
    {
      id: 1,
      kategori: 'Pengumuman',
      tanggal: '10 Oktober 2026',
      judul: 'Pemberian Vitamin A Gratis untuk Balita Bulan Ini',
      deskripsi: 'Jangan lewatkan pemberian Vitamin A rutin bulan Oktober. Bawa buku KIA dan datangi posyandu sesuai jadwal yang telah ditentukan.',
    },
    {
      id: 2,
      kategori: 'Edukasi Kesehatan',
      tanggal: '05 Oktober 2026',
      judul: 'Pentingnya MPASI Bergizi untuk Cegah Stunting',
      deskripsi: 'Pemberian Makanan Pendamping ASI (MPASI) yang tepat sangat penting saat bayi memasuki usia 6 bulan. Simak panduan lengkapnya di sini.',
    },
    {
      id: 3,
      kategori: 'Berita',
      tanggal: '28 September 2026',
      judul: 'Rekap Kegiatan Posyandu Bulan September',
      deskripsi: 'Alhamdulillah, partisipasi warga RW 08 pada posyandu bulan lalu mencapai 95%. Terima kasih atas antusiasme ibu-ibu sekalian.',
    },
  ];

  return (
    <div className="min-h-screen font-sans bg-white selection:bg-blue-100">
      <main>
        {/* HEADER SECTION */}
        <section className="px-6 py-16 mx-auto max-w-7xl md:py-24">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">Pusat Informasi</span>
            <h1 className="text-4xl font-extrabold md:text-5xl text-slate-900 mb-6">Berita & Jadwal Kegiatan Posyandu</h1>
            <p className="text-lg leading-relaxed text-slate-600">Dapatkan informasi terbaru seputar jadwal layanan, pengumuman warga, dan artikel edukasi kesehatan langsung dari kader Posyandu RW 08.</p>
          </div>
        </section>

        {/* JADWAL KEGIATAN SECTION */}
        <section className="px-6 py-16 mx-auto bg-slate-50 max-w-7xl rounded-3xl mb-24">
          <div className="md:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Jadwal Terdekat</h2>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Lihat Semua Jadwal</button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {jadwalKegiatan.map((jadwal) => (
                <div key={jadwal.id} className="flex flex-col sm:flex-row items-start gap-6 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  {/* Tanggal Box */}
                  <div className="flex flex-col items-center justify-center w-20 h-20 text-blue-600 bg-blue-50 rounded-xl flex-shrink-0">
                    <span className="text-2xl font-black">{jadwal.tanggal}</span>
                    <span className="text-sm font-medium uppercase">{jadwal.bulan}</span>
                  </div>

                  {/* Info Jadwal */}
                  <div className="flex-1">
                    <span className="inline-block px-2.5 py-1 mb-2 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-md">{jadwal.status}</span>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{jadwal.kegiatan}</h3>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <HiOutlineClock className="w-4 h-4 text-slate-400" />
                        <span>{jadwal.waktu}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HiOutlineLocationMarker className="w-4 h-4 text-slate-400" />
                        <span>{jadwal.lokasi}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BERITA & PENGUMUMAN SECTION */}
        <section className="px-6 pb-24 mx-auto max-w-7xl">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Pengumuman & Edukasi</h2>
            <p className="text-slate-600">Baca informasi dan tips kesehatan terbaru untuk keluarga Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {daftarBerita.map((berita) => (
              <div key={berita.id} className="group flex flex-col justify-between p-6 transition-all bg-white border border-slate-100 rounded-2xl hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50">
                <div>
                  <div className="flex items-center gap-3 mb-4 text-sm">
                    <span className="font-semibold text-blue-600">{berita.kategori}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-slate-500">{berita.tanggal}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{berita.judul}</h3>
                  <p className="leading-relaxed text-slate-600 mb-6 line-clamp-3">{berita.deskripsi}</p>
                </div>
                <button className="flex items-center gap-2 font-medium text-blue-600 w-fit hover:gap-3 transition-all">
                  Baca Selengkapnya <HiArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Informasi;
