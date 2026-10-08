import { useEffect, useState } from 'react';
import api from '../services/api';

const hariIni = () => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
      .formatToParts(new Date())
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value }) => [type, value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
};

const tanggalLokal = (tanggal) => new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date(`${tanggal.slice(0, 10)}T00:00:00`));

const pesanError = (error, fallback) => error.response?.data?.message || fallback;

export default function KelolaKegiatan({ role }) {
  const isAdmin = role === 'ADMIN';
  const [kegiatan, setKegiatan] = useState([]);
  const [posyandu, setPosyandu] = useState([]);
  const [tanggal, setTanggal] = useState(hariIni);
  const [tema, setTema] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [posyanduId, setPosyanduId] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;

    const requests = [api.get('/kegiatan?limit=100')];
    if (isAdmin) requests.push(api.get('/posyandu?limit=100'));

    Promise.all(requests)
      .then(([activitiesResponse, posyanduResponse]) => {
        if (!active) return;
        setKegiatan(activitiesResponse.data.data);
        if (isAdmin) {
          const locations = posyanduResponse.data.data.filter((item) => item.aktif);
          setPosyandu(locations);
          setPosyanduId((current) => current || locations[0]?.id || '');
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(pesanError(requestError, 'Daftar kegiatan belum dapat dimuat. Coba muat ulang halaman.'));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isAdmin]);

  const resetForm = () => {
    setTanggal(hariIni());
    setTema('');
    setLokasi('');
    setEditId(null);
  };

  const handleEdit = (item) => {
    setTanggal(new Date(item.tanggal).toISOString().slice(0, 10));
    setTema(item.tema || '');
    setLokasi(item.lokasi || '');
    setEditId(item.id);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (isAdmin && !posyanduId) {
      setError('Tambahkan dan aktifkan Posyandu sebelum mencatat kegiatan.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        tanggal,
        tema: tema.trim(),
        lokasi: lokasi.trim(),
        ...(isAdmin ? { posyanduId } : {}),
      };

      if (editId) {
        await api.put(`/kegiatan/${editId}`, payload);
      } else {
        await api.post('/kegiatan', payload);
      }

      const { data } = await api.get('/kegiatan?limit=100');
      setKegiatan(data.data);
      setSuccess(editId ? 'Kegiatan berhasil diperbarui.' : 'Kegiatan berhasil ditambahkan.');
      resetForm();
    } catch (requestError) {
      setError(pesanError(requestError, 'Kegiatan gagal disimpan. Periksa data dan koneksi API.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Hapus kegiatan "${item.tema || 'Kegiatan Posyandu'}" pada ${tanggalLokal(item.tanggal)}?`)) return;

    setError('');
    setSuccess('');
    try {
      await api.delete(`/kegiatan/${item.id}`);
      setKegiatan((current) => current.filter((entry) => entry.id !== item.id));
      if (editId === item.id) resetForm();
      setSuccess('Kegiatan berhasil dihapus.');
    } catch (requestError) {
      setError(pesanError(requestError, 'Kegiatan gagal dihapus. Coba lagi.'));
    }
  };

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="kelola-kegiatan-title">
      <div className="mb-6">
        <h2 id="kelola-kegiatan-title" className="text-lg font-semibold text-slate-900">Kelola jadwal kegiatan</h2>
        <p className="mt-1 text-sm text-slate-600">Kegiatan yang dicatat di sini akan tampil pada halaman informasi publik.</p>
      </div>

      {error && <p role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
      {success && <p role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{success}</p>}

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-xl bg-[#f7f5ef] p-4 sm:grid-cols-2 sm:p-5">
        <div>
          <label htmlFor="kegiatan-tanggal" className="mb-1.5 block text-sm font-medium text-slate-700">Tanggal</label>
          <input
            id="kegiatan-tanggal"
            type="date"
            value={tanggal}
            onChange={(event) => setTanggal(event.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-[#2b4764] focus:outline-none focus:ring-2 focus:ring-[#2b4764]/20"
          />
        </div>

        {isAdmin && (
          <div>
            <label htmlFor="kegiatan-posyandu" className="mb-1.5 block text-sm font-medium text-slate-700">Posyandu</label>
            <select
              id="kegiatan-posyandu"
              value={posyanduId}
              onChange={(event) => setPosyanduId(event.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-[#2b4764] focus:outline-none focus:ring-2 focus:ring-[#2b4764]/20"
            >
              <option value="">Pilih Posyandu</option>
              {posyandu.map((item) => <option key={item.id} value={item.id}>{item.nama}</option>)}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="kegiatan-tema" className="mb-1.5 block text-sm font-medium text-slate-700">Nama kegiatan</label>
          <input
            id="kegiatan-tema"
            type="text"
            value={tema}
            onChange={(event) => setTema(event.target.value)}
            maxLength={160}
            required
            placeholder="Contoh: Posyandu balita"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-[#2b4764] focus:outline-none focus:ring-2 focus:ring-[#2b4764]/20"
          />
        </div>

        <div>
          <label htmlFor="kegiatan-lokasi" className="mb-1.5 block text-sm font-medium text-slate-700">Lokasi (opsional)</label>
          <input
            id="kegiatan-lokasi"
            type="text"
            value={lokasi}
            onChange={(event) => setLokasi(event.target.value)}
            maxLength={160}
            placeholder="Lokasi pelayanan"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-[#2b4764] focus:outline-none focus:ring-2 focus:ring-[#2b4764]/20"
          />
        </div>

        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <button type="submit" disabled={saving || loading} className="rounded-lg bg-[#2b4764] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f3650] disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? 'Menyimpan...' : editId ? 'Simpan perubahan' : 'Tambah kegiatan'}
          </button>
          {editId && (
            <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Batal
            </button>
          )}
        </div>
      </form>

      <div className="mt-6">
        <h3 className="mb-3 font-semibold text-slate-900">Kegiatan tercatat</h3>
        {loading && <p role="status" className="text-sm text-slate-600">Memuat kegiatan...</p>}
        {!loading && kegiatan.length === 0 && (
          <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Belum ada kegiatan tercatat.</p>
        )}
        {!loading && kegiatan.length > 0 && (
          <ul className="divide-y divide-slate-200">
            {kegiatan.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div className="min-w-0">
                  <p className="font-medium text-slate-900">{item.tema || 'Kegiatan Posyandu'}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {tanggalLokal(item.tanggal)}{item.lokasi ? ` · ${item.lokasi}` : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => handleEdit(item)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Ubah
                  </button>
                  <button type="button" onClick={() => handleDelete(item)} className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50">
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
