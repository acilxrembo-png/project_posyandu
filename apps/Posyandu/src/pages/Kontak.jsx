import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail } from 'react-icons/hi';

const Kontak = () => {
  return (
    <div className="min-h-screen font-sans bg-white selection:bg-blue-100">
      <main>
        {/* HEADER SECTION */}
        <section className="px-6 py-16 mx-auto max-w-7xl md:py-24 text-center">
          <h1 className="text-4xl font-extrabold md:text-5xl text-slate-900 mb-6">Hubungi Kami</h1>
          <p className="max-w-2xl mx-auto text-lg leading-relaxed text-slate-600">Punya pertanyaan seputar layanan atau jadwal kegiatan Posyandu RW 08? Jangan ragu untuk menghubungi kami melalui kontak di bawah ini.</p>
        </section>

        {/* KONTAK & FORM SECTION */}
        <section className="px-6 pb-24 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Informasi Kontak Kiri */}
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Informasi Kontak</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 text-blue-600 bg-blue-50 rounded-xl">
                      <HiOutlineLocationMarker className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Alamat Posyandu</h3>
                      <p className="text-slate-600 mt-1">
                        Balai Warga RW 08, Jl. Cihampelas No. 123,
                        <br />
                        Bandung, Jawa Barat
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 text-emerald-600 bg-emerald-50 rounded-xl">
                      <HiOutlinePhone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Nomor Telepon / WhatsApp</h3>
                      <p className="text-slate-600 mt-1">+62 812-3456-7890 (Kader Jaga)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 text-rose-600 bg-rose-50 rounded-xl">
                      <HiOutlineMail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Email</h3>
                      <p className="text-slate-600 mt-1">posyandurw08@example.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex min-h-48 items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50 px-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <HiOutlineLocationMarker className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Lokasi Pelayanan</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">Balai Warga RW 08 menjadi pusat kegiatan dan pelayanan Posyandu.</p>
                </div>
              </div>
            </div>

            {/* Form Pesan Kanan */}
            <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Kirim Pesan</h2>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label htmlFor="nama" className="block text-sm font-medium text-slate-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input type="text" id="nama" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder="Masukkan nama Anda" />
                </div>
                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-700 mb-2">
                    No. WhatsApp
                  </label>
                  <input type="tel" id="whatsapp" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder="Contoh: 0812..." />
                </div>
                <div>
                  <label htmlFor="pesan" className="block text-sm font-medium text-slate-700 mb-2">
                    Pesan Anda
                  </label>
                  <textarea
                    id="pesan"
                    rows="4"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                    placeholder="Tulis pertanyaan atau masukan Anda di sini..."
                  ></textarea>
                </div>
                <button type="submit" className="w-full px-8 py-3.5 font-bold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200">
                  Kirim Pesan Sekarang
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Kontak;
