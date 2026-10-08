import { useEffect, useState } from 'react';
import api from '../services/api';

const tanggal = (value) => new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date(`${String(value).slice(0, 10)}T00:00:00`));

export default function VerifikasiPendaftaran() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;
    api.get('/warga/pendaftaran')
      .then(({ data }) => {
        if (active) setRequests(data.data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || 'Pendaftaran warga belum dapat dimuat.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const verify = async (request) => {
    const confirmed = window.confirm(`Verifikasi identitas ${request.nama} (NIK ${request.nik})? Pastikan data telah dicocokkan dengan dokumen warga.`);
    if (!confirmed) return;
    setVerifyingId(request.userId);
    setError('');
    setSuccess('');
    try {
      const { data } = await api.post(`/warga/pendaftaran/${request.userId}/verifikasi`);
      setRequests((current) => current.filter((item) => item.userId !== request.userId));
      setSuccess(data.message);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Pendaftaran tidak dapat diverifikasi.');
    } finally {
      setVerifyingId('');
    }
  };

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="verifikasi-title">
      <div className="mb-5">
        <h2 id="verifikasi-title" className="text-lg font-semibold text-slate-900">Verifikasi pendaftaran Warga</h2>
        <p className="mt-1 text-sm text-slate-600">Cocokkan identitas dengan dokumen resmi sebelum mengaktifkan akun.</p>
      </div>
      {error && <p role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
      {success && <p role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{success}</p>}
      {loading && <p role="status" className="text-sm text-slate-600">Memuat pendaftaran...</p>}
      {!loading && requests.length === 0 && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Tidak ada pendaftaran yang menunggu verifikasi.</p>}
      {!loading && requests.length > 0 && (
        <ul className="divide-y divide-slate-200">
          {requests.map((request) => (
            <li key={request.userId} className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div>
                <p className="font-semibold text-slate-900">{request.nama}</p>
                <p className="mt-1 text-sm text-slate-600">NIK {request.nik} · Lahir {tanggal(request.tanggalLahir)} · {request.jenisKelamin === 'PEREMPUAN' ? 'Perempuan' : 'Laki-laki'}</p>
                <p className="mt-1 text-sm text-slate-600">{request.email}{request.telepon ? ` · ${request.telepon}` : ''}</p>
                <p className="mt-1 text-xs text-slate-500">Posyandu {request.posyandu.nama}</p>
              </div>
              <button type="button" disabled={Boolean(verifyingId)} onClick={() => void verify(request)} className="rounded-lg bg-[#2b4764] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1f3650] disabled:cursor-not-allowed disabled:opacity-60">
                {verifyingId === request.userId ? 'Memverifikasi...' : 'Verifikasi'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
