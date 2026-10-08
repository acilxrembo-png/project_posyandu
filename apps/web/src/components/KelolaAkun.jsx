import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';

const getErrorMessage = (error) => error.response?.data?.message
  || 'Permintaan belum berhasil. Periksa data dan koneksi API.';

const emptyForm = () => ({
  nama: '',
  email: '',
  password: '',
  telepon: '',
  posyanduId: '',
});

export default function KelolaAkun() {
  const [users, setUsers] = useState([]);
  const [posyandu, setPosyandu] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadUsers = useCallback(async (requestedPage = page, term = search) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(requestedPage), limit: '20' });
      if (term.trim()) params.set('search', term.trim());
      const { data } = await api.get(`/users?${params.toString()}`);
      setUsers(data.data);
      setTotalPages(data.meta.totalPages);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    let active = true;
    api.get('/posyandu?limit=100')
      .then(({ data }) => {
        if (!active) return;
        setPosyandu(data.data.filter((item) => item.aktif));
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search.trim()) params.set('search', search.trim());
    api.get(`/users?${params.toString()}`)
      .then(({ data }) => {
        if (!active) return;
        setUsers(data.data);
        setTotalPages(data.meta.totalPages);
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, search]);

  const resetForm = () => {
    setForm(emptyForm());
  };

  const updateForm = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      if (!form.posyanduId) {
        throw new Error('Pilih Posyandu untuk akun kader agar akses data dapat dibatasi dengan benar.');
      }

      const payload = {
        nama: form.nama.trim(),
        email: form.email.trim(),
        telepon: form.telepon.trim() || null,
        posyanduId: form.posyanduId || null,
      };
      if (form.password) payload.password = form.password;

      if (!payload.password) throw new Error('Kata sandi wajib diisi untuk akun baru.');
      await api.post('/users', payload);

      setSuccess('Akun Kader berhasil dibuat.');
      resetForm();
      await loadUsers(page, search);
    } catch (requestError) {
      setError(requestError.message || getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (account) => {
    if (!window.confirm(`Hapus akun ${account.nama} (${account.email})?`)) return;
    setError('');
    setSuccess('');
    try {
      await api.delete(`/users/${account.id}`);
      setSuccess('Akun Kader berhasil dihapus.');
      await loadUsers(page, search);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-[#2b4764] focus:outline-none focus:ring-2 focus:ring-[#2b4764]/20';

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="kelola-akun-title">
      <div className="mb-5">
        <h2 id="kelola-akun-title" className="text-lg font-semibold text-slate-900">Kelola akun pengguna</h2>
        <p className="mt-1 text-sm text-slate-600">Tambahkan atau hapus akun Kader. Hak akses dan Posyandu Kader ditetapkan oleh sistem.</p>
      </div>

      {error && <p role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
      {success && <p role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{success}</p>}

      <form onSubmit={submit} className="grid gap-4 rounded-xl bg-[#f7f5ef] p-4 sm:grid-cols-2 sm:p-5">
        <div>
          <label htmlFor="account-name" className="mb-1.5 block text-sm font-medium text-slate-700">Nama lengkap *</label>
          <input id="account-name" value={form.nama} onChange={(event) => updateForm('nama', event.target.value)} required maxLength={120} className={inputClass} />
        </div>
        <div>
          <label htmlFor="account-email" className="mb-1.5 block text-sm font-medium text-slate-700">Email *</label>
          <input id="account-email" type="email" value={form.email} onChange={(event) => updateForm('email', event.target.value)} required autoComplete="email" className={inputClass} />
        </div>
        <div>
          <label htmlFor="account-password" className="mb-1.5 block text-sm font-medium text-slate-700">
            Kata sandi *
          </label>
          <input id="account-password" type="password" value={form.password} onChange={(event) => updateForm('password', event.target.value)} required minLength={8} autoComplete="new-password" className={inputClass} />
        </div>
        <div>
          <label htmlFor="account-phone" className="mb-1.5 block text-sm font-medium text-slate-700">Nomor telepon</label>
          <input id="account-phone" type="tel" value={form.telepon} onChange={(event) => updateForm('telepon', event.target.value)} maxLength={30} className={inputClass} />
        </div>
        <div>
          <label htmlFor="account-posyandu" className="mb-1.5 block text-sm font-medium text-slate-700">Posyandu *</label>
          <select id="account-posyandu" value={form.posyanduId} onChange={(event) => updateForm('posyanduId', event.target.value)} required className={inputClass}>
            <option value="">Pilih Posyandu untuk Kader</option>
            {posyandu.map((item) => <option key={item.id} value={item.id}>{item.nama}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <button type="submit" disabled={saving || loading} className="rounded-lg bg-[#2b4764] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f3650] disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? 'Menyimpan...' : 'Tambah akun Kader'}
          </button>
        </div>
      </form>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-semibold text-slate-900">Akun terdaftar</h3>
        <form onSubmit={(event) => { event.preventDefault(); setPage(1); void loadUsers(1, search); }} className="flex gap-2">
          <label htmlFor="account-search" className="sr-only">Cari akun</label>
          <input id="account-search" type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); setLoading(true); setError(''); }} placeholder="Cari nama atau email" className={inputClass} />
          <button type="submit" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cari</button>
        </form>
      </div>

      {loading && <p role="status" className="mt-4 text-sm text-slate-600">Memuat akun...</p>}
      {!loading && users.length === 0 && <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Tidak ada akun yang cocok.</p>}
      {!loading && users.length > 0 && (
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Nama</th>
                <th scope="col" className="px-4 py-3 font-semibold">Email</th>
                <th scope="col" className="px-4 py-3 font-semibold">Posyandu</th>
                <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                <th scope="col" className="px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {users.map((account) => (
                <tr key={account.id}>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">{account.nama}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">{account.email}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">{account.posyandu?.nama || '—'}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">{account.aktif ? 'Aktif' : 'Nonaktif'}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => void deleteUser(account)} className="rounded-md border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50">Hapus akun Kader</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-sm">
        <p className="text-slate-600">Halaman {page} dari {Math.max(totalPages, 1)}</p>
        <div className="flex gap-2">
          <button type="button" disabled={loading || page <= 1} onClick={() => { setPage((current) => current - 1); setLoading(true); }} className="rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Sebelumnya</button>
          <button type="button" disabled={loading || page >= totalPages} onClick={() => { setPage((current) => current + 1); setLoading(true); }} className="rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Berikutnya</button>
        </div>
      </div>
    </section>
  );
}
