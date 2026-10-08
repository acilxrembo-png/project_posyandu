import { HiOutlinePhotograph } from 'react-icons/hi';

const Galeri = () => {
  // Data dummy untuk foto kegiatan
  const dokumentasi = [
    {
      id: 1,
      kegiatan: 'Pekan Imunisasi Nasional',
      tanggal: 'Agustus 2026',
      // Menggunakan placeholder, ganti URL ini dengan path gambar Anda (misal: /assets/kegiatan1.jpg)
      imgUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=Foto+Imunisasi',
    },
    {
      id: 2,
      kegiatan: 'Pemeriksaan Ibu Hamil',
      tanggal: 'Juli 2026',
      imgUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=Foto+Bumil',
    },
    {
      id: 3,
      kegiatan: 'Penyuluhan Gizi & MPASI',
      tanggal: 'Juni 2026',
      imgUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=Foto+Penyuluhan',
    },
    {
      id: 4,
      kegiatan: 'Pembagian Vitamin A',
      tanggal: 'Februari 2026',
      imgUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=Foto+Vitamin',
    },
    {
      id: 5,
      kegiatan: 'Senam Sehat Warga',
      tanggal: 'Januari 2026',
      imgUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=Foto+Senam',
    },
    {
      id: 6,
      kegiatan: 'Pelatihan Kader Posyandu',
      tanggal: 'Desember 2025',
      imgUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=Foto+Kader',
    },
  ];

  return (
    <div className="min-h-screen font-sans bg-white selection:bg-blue-100">
      <main>
        {/* HEADER SECTION */}
        <section className="px-6 py-16 mx-auto max-w-7xl md:py-24 text-center">
          <div className="inline-flex items-center justify-center p-3 mb-6 text-blue-600 bg-blue-50 rounded-2xl">
            <HiOutlinePhotograph className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold md:text-5xl text-slate-900 mb-6">Galeri Kegiatan</h1>
          <p className="max-w-2xl mx-auto text-lg leading-relaxed text-slate-600">Dokumentasi berbagai momen pelayanan kesehatan dan kegiatan kebersamaan warga di Posyandu RW 08.</p>
        </section>

        {/* GALLERY GRID SECTION */}
        <section className="px-6 pb-24 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {dokumentasi.map((item) => (
              <div key={item.id} className="group relative overflow-hidden bg-slate-100 rounded-3xl cursor-pointer">
                {/* Gambar dengan efek zoom saat di-hover */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={item.imgUrl} alt={item.kegiatan} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>

                {/* Overlay gradient & Teks informasi */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-6">
                  <span className="text-blue-300 text-sm font-medium mb-1">{item.tanggal}</span>
                  <h3 className="text-white text-lg font-bold">{item.kegiatan}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Galeri;
