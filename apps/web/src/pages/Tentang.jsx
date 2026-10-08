import { HiOutlineHeart, HiOutlineLightBulb, HiOutlineUserGroup } from 'react-icons/hi';
// Asumsikan Navbar sudah dipisah menjadi komponen tersendiri
// import Navbar from '../components/Navbar';

const Tentang = () => {
  return (
    <div className="min-h-screen font-sans bg-white selection:bg-blue-100">
      {/* <Navbar /> */} {/* Buka komentar ini jika tidak menggunakan Layout di App.jsx */}
      <main>
        {/* HERO SECTION TENTANG */}
        <section className="px-6 py-20 mx-auto max-w-7xl md:py-24 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">Mengenal Kami Lebih Dekat</span>
          <h1 className="text-4xl font-extrabold md:text-5xl text-slate-900 mb-6">Tentang Posyandu RW 08</h1>
          <p className="max-w-2xl mx-auto text-lg leading-relaxed text-slate-600">
            Kami adalah pusat pelayanan kesehatan masyarakat tingkat dasar yang berdedikasi untuk meningkatkan kesejahteraan ibu, anak, dan keluarga di lingkungan RW 08.
          </p>
        </section>

        {/* VISI & MISI SECTION */}
        <section className="px-6 py-16 mx-auto bg-slate-50 rounded-3xl max-w-7xl mb-24">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:px-12">
            {/* Visi */}
            <div className="space-y-4">
              <div className="inline-flex p-3 text-blue-600 bg-blue-100 rounded-xl mb-2">
                <HiOutlineLightBulb className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Visi Kami</h2>
              <p className="leading-relaxed text-slate-600">Mewujudkan masyarakat RW 08 yang sehat, mandiri, dan peduli terhadap pertumbuhan dan perkembangan generasi penerus melalui pelayanan kesehatan yang optimal dan terpadu.</p>
            </div>

            {/* Misi */}
            <div className="space-y-4">
              <div className="inline-flex p-3 text-rose-600 bg-rose-100 rounded-xl mb-2">
                <HiOutlineHeart className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Misi Kami</h2>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 mt-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                  Memberikan pelayanan kesehatan dasar yang mudah diakses.
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 mt-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                  Meningkatkan kesadaran masyarakat tentang pentingnya gizi dan imunisasi.
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 mt-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                  Memberdayakan kader-kader posyandu agar tanggap dan profesional.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* PROFIL KADER SECTION */}
        <section className="px-6 pb-24 mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Pengurus & Kader</h2>
            <p className="text-slate-600">Mengenal lebih dekat para penggerak Posyandu RW 08</p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            {/* Card Kader (Bisa di-map dari array data) */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="p-6 text-center transition-all bg-white border border-slate-100 rounded-2xl hover:shadow-lg hover:shadow-slate-100">
                <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <HiOutlineUserGroup className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Nama Kader {item}</h3>
                <p className="text-sm font-medium text-blue-600 mb-3">Jabatan</p>
                <p className="text-sm text-slate-500">Berdedikasi dalam pelayanan kesehatan lingkungan.</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Tentang;
