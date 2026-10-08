import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const MASTER_DATA = {
  warga: {
    title: 'Warga',
    endpoint: '/warga',
    columns: [
      { key: 'nama', label: 'Nama' },
      { key: 'nik', label: 'NIK' },
      { key: 'tanggalLahir', label: 'Tanggal lahir', format: dateLabel },
      { key: 'jenisKelamin', label: 'Jenis kelamin', format: enumLabel },
      { key: 'keluarga', label: 'Nomor KK', format: (value) => value?.nomorKk || '—' },
      { key: 'aktif', label: 'Status', format: (value) => value ? 'Aktif' : 'Tidak aktif' },
    ],
    fields: [
      { key: 'nama', label: 'Nama lengkap', required: true },
      { key: 'nik', label: 'NIK', maxLength: 16 },
      { key: 'tempatLahir', label: 'Tempat lahir' },
      { key: 'tanggalLahir', label: 'Tanggal lahir', type: 'date', required: true },
      { key: 'jenisKelamin', label: 'Jenis kelamin', type: 'select', required: true, options: [['LAKI_LAKI', 'Laki-laki'], ['PEREMPUAN', 'Perempuan']] },
      { key: 'golonganDarah', label: 'Golongan darah', type: 'select', options: [['A', 'A'], ['B', 'B'], ['AB', 'AB'], ['O', 'O'], ['TIDAK_TAHU', 'Tidak diketahui']] },
      { key: 'telepon', label: 'Nomor telepon', type: 'tel' },
      { key: 'hubungan', label: 'Hubungan keluarga', type: 'select', options: [['KEPALA_KELUARGA', 'Kepala keluarga'], ['ISTRI', 'Istri'], ['SUAMI', 'Suami'], ['ANAK', 'Anak'], ['ORANG_TUA', 'Orang tua'], ['LAINNYA', 'Lainnya']] },
      { key: 'keluargaId', label: 'Keluarga', type: 'family', optional: true },
      { key: 'aktif', label: 'Status aktif', type: 'checkbox', defaultValue: true },
      { key: 'posyanduId', label: 'Posyandu', type: 'posyandu', adminOnly: true, required: true },
    ],
  },
  keluarga: {
    title: 'Keluarga',
    endpoint: '/keluarga',
    columns: [
      { key: 'nomorKk', label: 'Nomor KK' },
      { key: 'kepalaKeluarga', label: 'Kepala keluarga' },
      { key: '_count', label: 'Anggota', format: (value) => value?.anggota ?? 0 },
      { key: 'alamat', label: 'Alamat', format: (value) => value || '—' },
    ],
    fields: [
      { key: 'nomorKk', label: 'Nomor KK', required: true, maxLength: 16 },
      { key: 'kepalaKeluarga', label: 'Nama kepala keluarga', required: true },
      { key: 'alamat', label: 'Alamat', type: 'textarea' },
      { key: 'rt', label: 'RT', maxLength: 3 },
      { key: 'rw', label: 'RW', maxLength: 3 },
      { key: 'posyanduId', label: 'Posyandu', type: 'posyandu', adminOnly: true, required: true },
    ],
  },
  balita: {
    title: 'Profil balita',
    endpoint: '/balita',
    columns: [
      { key: 'warga', label: 'Nama balita', format: (value) => value?.nama || '—' },
      { key: 'nomorKia', label: 'Nomor KIA', format: (value) => value || '—' },
      { key: 'ibu', label: 'Nama ibu', format: (value) => value?.nama || '—' },
      { key: 'anakKe', label: 'Anak ke', format: (value) => value ?? '—' },
    ],
    fields: [
      { key: 'wargaId', label: 'Warga (anak)', type: 'warga', required: true },
      { key: 'ibuId', label: 'Ibu (opsional)', type: 'warga', optional: true, femaleOnly: true },
      { key: 'nomorKia', label: 'Nomor KIA' },
      { key: 'anakKe', label: 'Anak ke', type: 'number', min: 1, step: 1 },
      { key: 'beratLahir', label: 'Berat lahir (kg)', type: 'number', min: 0, step: 0.01 },
      { key: 'panjangLahir', label: 'Panjang lahir (cm)', type: 'number', min: 0, step: 0.1 },
      { key: 'imd', label: 'IMD', type: 'checkbox' },
      { key: 'asiEksklusif', label: 'ASI eksklusif', type: 'checkbox' },
    ],
  },
  penimbangan: {
    title: 'Penimbangan',
    endpoint: '/penimbangan',
    columns: [
      { key: 'balita', label: 'Nama balita', format: (value) => value?.warga?.nama || '—' },
      { key: 'kegiatan', label: 'Tanggal kegiatan', format: (value) => value?.tanggal ? dateLabel(value.tanggal) : '—' },
      { key: 'umurBulan', label: 'Umur (bulan)', format: (value) => value ?? '—' },
      { key: 'berat', label: 'Berat (kg)', format: (value) => value ?? '—' },
      { key: 'tinggi', label: 'Tinggi (cm)', format: (value) => value ?? '—' },
      { key: 'statusBBTB', label: 'Status gizi', format: enumLabel },
    ],
    fields: [
      { key: 'balitaId', label: 'Balita', type: 'balita', required: true },
      { key: 'kegiatanId', label: 'Kegiatan', type: 'activity', required: true },
      { key: 'umurBulan', label: 'Umur saat ditimbang (bulan)', type: 'number', min: 0, step: 1, required: true },
      { key: 'berat', label: 'Berat badan (kg)', type: 'number', min: 0, step: 0.01, required: true },
      { key: 'tinggi', label: 'Tinggi badan (cm)', type: 'number', min: 0, step: 0.1 },
      { key: 'lingkarKepala', label: 'Lingkar kepala (cm)', type: 'number', min: 0, step: 0.1 },
      { key: 'lila', label: 'Lingkar lengan atas (cm)', type: 'number', min: 0, step: 0.1 },
      { key: 'caraUkur', label: 'Cara ukur', type: 'select', options: [['berbaring', 'Berbaring'], ['berdiri', 'Berdiri']] },
      { key: 'naikBB', label: 'Berat naik dibanding bulan lalu', type: 'boolean-select' },
      { key: 'statusBBU', label: 'Status berat menurut umur', type: 'select', options: [['BERAT_BADAN_SANGAT_KURANG', 'Berat badan sangat kurang'], ['BERAT_BADAN_KURANG', 'Berat badan kurang'], ['BERAT_BADAN_NORMAL', 'Berat badan normal'], ['RISIKO_BERAT_BADAN_LEBIH', 'Risiko berat badan lebih']] },
      { key: 'statusTBU', label: 'Status tinggi menurut umur', type: 'select', options: [['SANGAT_PENDEK', 'Sangat pendek'], ['PENDEK', 'Pendek'], ['NORMAL', 'Normal'], ['TINGGI', 'Tinggi']] },
      { key: 'statusBBTB', label: 'Status berat menurut tinggi', type: 'select', options: [['GIZI_BURUK', 'Gizi buruk'], ['GIZI_KURANG', 'Gizi kurang'], ['GIZI_BAIK', 'Gizi baik'], ['BERISIKO_GIZI_LEBIH', 'Berisiko gizi lebih'], ['GIZI_LEBIH', 'Gizi lebih'], ['OBESITAS', 'Obesitas']] },
      { key: 'catatan', label: 'Catatan', type: 'textarea' },
    ],
  },
  kehamilan: {
    title: 'Kehamilan',
    endpoint: '/kehamilan',
    columns: [
      { key: 'ibu', label: 'Nama ibu', format: (value) => value?.nama || '—' },
      { key: 'hpht', label: 'HPHT', format: dateLabel },
      { key: 'hpl', label: 'HPL', format: dateLabel },
      { key: 'status', label: 'Status', format: enumLabel },
    ],
    fields: [
      { key: 'ibuId', label: 'Ibu', type: 'warga', femaleOnly: true, required: true },
      { key: 'hpht', label: 'Hari pertama haid terakhir (HPHT)', type: 'date', required: true },
      { key: 'hpl', label: 'Hari perkiraan lahir (HPL)', type: 'date', optional: true },
      { key: 'gravida', label: 'Jumlah kehamilan', type: 'number', min: 1, step: 1 },
      { key: 'paritas', label: 'Jumlah persalinan', type: 'number', min: 0, step: 1 },
      { key: 'abortus', label: 'Jumlah keguguran', type: 'number', min: 0, step: 1 },
      { key: 'status', label: 'Status kehamilan', type: 'select', required: true, options: [['AKTIF', 'Aktif'], ['MELAHIRKAN', 'Melahirkan'], ['KEGUGURAN', 'Keguguran']] },
      { key: 'tanggalAkhir', label: 'Tanggal akhir kehamilan (opsional)', type: 'date', optional: true },
      { key: 'penolongPersalinan', label: 'Penolong persalinan', optional: true },
      { key: 'tempatPersalinan', label: 'Tempat persalinan', optional: true },
    ],
  },
  imunisasi: {
    title: 'Imunisasi balita',
    endpoint: '/imunisasi',
    columns: [
      { key: 'balita', label: 'Nama balita', format: (value) => value?.warga?.nama || '—' },
      { key: 'vaksin', label: 'Vaksin', format: (value) => value?.nama || '—' },
      { key: 'tanggal', label: 'Tanggal', format: dateLabel },
      { key: 'dosisKe', label: 'Dosis ke' },
      { key: 'batchNo', label: 'Nomor batch', format: (value) => value || '—' },
    ],
    fields: [
      { key: 'balitaId', label: 'Balita', type: 'balita', required: true },
      { key: 'vaksinId', label: 'Vaksin', type: 'vaccine', required: true },
      { key: 'tanggal', label: 'Tanggal imunisasi', type: 'date', required: true },
      { key: 'dosisKe', label: 'Dosis ke', type: 'number', min: 1, step: 1, required: true, defaultValue: 1 },
      { key: 'kegiatanId', label: 'Kegiatan (opsional)', type: 'activity', optional: true },
      { key: 'batchNo', label: 'Nomor batch', optional: true },
      { key: 'catatan', label: 'Catatan', type: 'textarea', optional: true },
    ],
  },
  suplemen: {
    title: 'Pemberian suplemen',
    endpoint: '/suplemen',
    columns: [
      { key: 'balita', label: 'Nama balita', format: (value) => value?.warga?.nama || '—' },
      { key: 'jenis', label: 'Jenis suplemen', format: (value) => value === 'PMT' ? 'PMT' : enumLabel(value) },
      { key: 'tanggal', label: 'Tanggal', format: dateLabel },
      { key: 'jumlah', label: 'Jumlah', format: (value) => value ?? '—' },
      { key: 'kegiatan', label: 'Kegiatan', format: (value) => value?.tanggal ? dateLabel(value.tanggal) : '—' },
    ],
    fields: [
      { key: 'balitaId', label: 'Balita', type: 'balita', required: true },
      { key: 'jenis', label: 'Jenis suplemen', type: 'select', required: true, options: [['VITAMIN_A_BIRU', 'Vitamin A biru'], ['VITAMIN_A_MERAH', 'Vitamin A merah'], ['OBAT_CACING', 'Obat cacing'], ['PMT', 'Pemberian makanan tambahan'], ['TABLET_TAMBAH_DARAH', 'Tablet tambah darah']] },
      { key: 'tanggal', label: 'Tanggal pemberian', type: 'date', required: true },
      { key: 'jumlah', label: 'Jumlah', type: 'number', min: 1, step: 1, optional: true },
      { key: 'kegiatanId', label: 'Kegiatan (opsional)', type: 'activity', optional: true },
      { key: 'catatan', label: 'Catatan', type: 'textarea', optional: true },
    ],
  },
  pemeriksaanKehamilan: {
    title: 'Pemeriksaan kehamilan',
    endpoint: '/pemeriksaan-kehamilan',
    columns: [
      { key: 'kehamilan', label: 'Ibu', format: (value) => value?.ibu?.nama || '—' },
      { key: 'tanggal', label: 'Tanggal', format: dateLabel },
      { key: 'usiaKehamilanMinggu', label: 'Usia (minggu)', format: (value) => value ?? '—' },
      { key: 'lila', label: 'LiLA (cm)', format: (value) => value ?? '—' },
      { key: 'risikoTinggi', label: 'Risiko tinggi', format: (value) => value ? 'Ya' : 'Tidak' },
      { key: 'dirujuk', label: 'Dirujuk', format: (value) => value ? 'Ya' : 'Tidak' },
    ],
    fields: [
      { key: 'kehamilanId', label: 'Ibu hamil aktif', type: 'pregnancy', required: true },
      { key: 'tanggal', label: 'Tanggal pemeriksaan', type: 'date', required: true },
      { key: 'usiaKehamilanMinggu', label: 'Usia kehamilan (minggu)', type: 'number', min: 0, step: 1, optional: true },
      { key: 'berat', label: 'Berat badan (kg)', type: 'number', min: 0, step: 0.01, optional: true },
      { key: 'tinggi', label: 'Tinggi badan (cm)', type: 'number', min: 0, step: 0.1, optional: true },
      { key: 'lila', label: 'LiLA (cm)', type: 'number', min: 0, step: 0.1, optional: true },
      { key: 'sistol', label: 'Tekanan darah sistolik', type: 'number', min: 0, step: 1, optional: true },
      { key: 'diastol', label: 'Tekanan darah diastolik', type: 'number', min: 0, step: 1, optional: true },
      { key: 'tinggiFundus', label: 'Tinggi fundus (cm)', type: 'number', min: 0, step: 0.1, optional: true },
      { key: 'hemoglobin', label: 'Hemoglobin (g/dL)', type: 'number', min: 0, step: 0.1, optional: true },
      { key: 'jumlahTabletFe', label: 'Jumlah tablet Fe', type: 'number', min: 0, step: 1, optional: true },
      { key: 'imunisasiTT', label: 'Imunisasi TT', type: 'checkbox' },
      { key: 'risikoTinggi', label: 'Risiko tinggi', type: 'checkbox' },
      { key: 'dirujuk', label: 'Dirujuk', type: 'checkbox' },
      { key: 'kegiatanId', label: 'Kegiatan (opsional)', type: 'activity', optional: true },
      { key: 'keluhan', label: 'Keluhan', type: 'textarea', optional: true },
      { key: 'catatan', label: 'Catatan', type: 'textarea', optional: true },
    ],
  },
  lansia: {
    title: 'Pemeriksaan lansia',
    endpoint: '/pemeriksaan-lansia',
    columns: [
      { key: 'warga', label: 'Nama lansia', format: (value) => value?.nama || '—' },
      { key: 'tanggal', label: 'Tanggal', format: dateLabel },
      { key: 'sistol', label: 'Sistolik', format: (value) => value ?? '—' },
      { key: 'diastol', label: 'Diastolik', format: (value) => value ?? '—' },
      { key: 'gulaDarah', label: 'Gula darah', format: (value) => value ?? '—' },
      { key: 'dirujuk', label: 'Dirujuk', format: (value) => value ? 'Ya' : 'Tidak' },
    ],
    fields: [
      { key: 'wargaId', label: 'Warga lansia', type: 'warga', olderOnly: true, required: true },
      { key: 'tanggal', label: 'Tanggal pemeriksaan', type: 'date', required: true },
      { key: 'berat', label: 'Berat badan (kg)', type: 'number', min: 0, step: 0.01, optional: true },
      { key: 'tinggi', label: 'Tinggi badan (cm)', type: 'number', min: 0, step: 0.1, optional: true },
      { key: 'lingkarPerut', label: 'Lingkar perut (cm)', type: 'number', min: 0, step: 0.1, optional: true },
      { key: 'sistol', label: 'Tekanan darah sistolik', type: 'number', min: 0, step: 1, optional: true },
      { key: 'diastol', label: 'Tekanan darah diastolik', type: 'number', min: 0, step: 1, optional: true },
      { key: 'gulaDarah', label: 'Gula darah (mg/dL)', type: 'number', min: 0, step: 0.1, optional: true },
      { key: 'kolesterol', label: 'Kolesterol (mg/dL)', type: 'number', min: 0, step: 0.1, optional: true },
      { key: 'asamUrat', label: 'Asam urat (mg/dL)', type: 'number', min: 0, step: 0.1, optional: true },
      { key: 'dirujuk', label: 'Dirujuk', type: 'checkbox' },
      { key: 'kegiatanId', label: 'Kegiatan (opsional)', type: 'activity', optional: true },
      { key: 'keluhan', label: 'Keluhan', type: 'textarea', optional: true },
      { key: 'catatan', label: 'Catatan', type: 'textarea', optional: true },
    ],
  },
};

function dateLabel(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    .format(new Date(`${String(value).slice(0, 10)}T00:00:00`));
}

function enumLabel(value) {
  return value ? value.replaceAll('_', ' ').toLowerCase().replace(/\b\p{L}/gu, (letter) => letter.toUpperCase()) : '—';
}

function isSenior(resident) {
  if (!resident.tanggalLahir) return false;
  const birthDate = new Date(`${String(resident.tanggalLahir).slice(0, 10)}T00:00:00`);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const beforeBirthday = today.getMonth() < birthDate.getMonth()
    || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
  if (beforeBirthday) age -= 1;
  return age >= 60;
}

function errorMessage(error, fallback) {
  return error.response?.data?.message || fallback;
}

function createEmptyForm(fields) {
  return Object.fromEntries(fields.map((field) => [field.key, field.defaultValue ?? '']));
}

export default function DataKependudukan({ role }) {
  const isAdmin = role === 'ADMIN';
  const canManage = role === 'KADER';
  const [resourceKey, setResourceKey] = useState('warga');
  const resource = MASTER_DATA[resourceKey];
  const visibleFields = useMemo(
    () => resource.fields.filter((field) => !field.adminOnly || isAdmin),
    [isAdmin, resource],
  );
  const [records, setRecords] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [families, setFamilies] = useState([]);
  const [residents, setResidents] = useState([]);
  const [balitaProfiles, setBalitaProfiles] = useState([]);
  const [activities, setActivities] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [pregnancies, setPregnancies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState(() => createEmptyForm(MASTER_DATA.warga.fields));
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadRecords = useCallback(async (requestedPage = page, term = search) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(requestedPage), limit: '20' });
      if (term.trim()) params.set('search', term.trim());
      const { data } = await api.get(`${resource.endpoint}?${params.toString()}`);
      setRecords(data.data);
      setMeta(data.meta);
    } catch (requestError) {
      setError(errorMessage(requestError, `Data ${resource.title.toLowerCase()} belum dapat dimuat.`));
    } finally {
      setLoading(false);
    }
  }, [page, resource, search]);

  const loadOptions = useCallback(async () => {
    try {
      const requests = [];
      if (resourceKey === 'warga') requests.push(api.get('/keluarga?limit=100'));
      if (resourceKey === 'balita') requests.push(api.get('/warga?limit=100'));
      if (resourceKey === 'kehamilan') requests.push(api.get('/warga?limit=100'));
      if (resourceKey === 'penimbangan') {
        requests.push(api.get('/balita?limit=100'));
        requests.push(api.get('/kegiatan?limit=100'));
      }
      if (['imunisasi', 'suplemen'].includes(resourceKey)) {
        requests.push(api.get('/balita?limit=100'));
        if (resourceKey === 'imunisasi') requests.push(api.get('/vaksin?limit=100'));
        requests.push(api.get('/kegiatan?limit=100'));
      }
      if (resourceKey === 'pemeriksaanKehamilan') {
        requests.push(api.get('/kehamilan?status=AKTIF&limit=100'));
        requests.push(api.get('/kegiatan?limit=100'));
      }
      if (resourceKey === 'lansia') {
        requests.push(api.get('/warga?limit=100'));
        requests.push(api.get('/kegiatan?limit=100'));
      }
      if (isAdmin && ['warga', 'keluarga'].includes(resourceKey)) requests.push(api.get('/posyandu?limit=100'));
      const responses = await Promise.all(requests);
      let responseIndex = 0;
      if (resourceKey === 'warga') {
        setFamilies(responses[responseIndex].data.data);
        responseIndex += 1;
      }
      if (resourceKey === 'balita') {
        setResidents(responses[responseIndex].data.data);
        responseIndex += 1;
      }
      if (resourceKey === 'kehamilan') {
        setResidents(responses[responseIndex].data.data);
        responseIndex += 1;
      }
      if (resourceKey === 'penimbangan') {
        setBalitaProfiles(responses[responseIndex].data.data);
        setActivities(responses[responseIndex + 1].data.data);
        responseIndex += 2;
      }
      if (['imunisasi', 'suplemen'].includes(resourceKey)) {
        setBalitaProfiles(responses[responseIndex].data.data);
        responseIndex += 1;
        if (resourceKey === 'imunisasi') {
          setVaccines(responses[responseIndex].data.data);
          responseIndex += 1;
        }
        setActivities(responses[responseIndex].data.data);
        responseIndex += 1;
      }
      if (resourceKey === 'pemeriksaanKehamilan') {
        setPregnancies(responses[responseIndex].data.data);
        setActivities(responses[responseIndex + 1].data.data);
        responseIndex += 2;
      }
      if (resourceKey === 'lansia') {
        setResidents(responses[responseIndex].data.data);
        setActivities(responses[responseIndex + 1].data.data);
        responseIndex += 2;
      }
      if (isAdmin && ['warga', 'keluarga'].includes(resourceKey)) {
        setLocations(responses[responseIndex].data.data.filter((location) => location.aktif));
      }
    } catch (requestError) {
      setError(errorMessage(requestError, 'Data pilihan form belum dapat dimuat.'));
    }
  }, [isAdmin, resourceKey]);

  useEffect(() => {
    let active = true;
    const requests = [];
    if (resourceKey === 'warga') requests.push(api.get('/keluarga?limit=100'));
    if (resourceKey === 'balita') requests.push(api.get('/warga?limit=100'));
    if (resourceKey === 'kehamilan') requests.push(api.get('/warga?limit=100'));
    if (resourceKey === 'penimbangan') {
      requests.push(api.get('/balita?limit=100'));
      requests.push(api.get('/kegiatan?limit=100'));
    }
    if (['imunisasi', 'suplemen'].includes(resourceKey)) {
      requests.push(api.get('/balita?limit=100'));
      if (resourceKey === 'imunisasi') requests.push(api.get('/vaksin?limit=100'));
      requests.push(api.get('/kegiatan?limit=100'));
    }
    if (resourceKey === 'pemeriksaanKehamilan') {
      requests.push(api.get('/kehamilan?status=AKTIF&limit=100'));
      requests.push(api.get('/kegiatan?limit=100'));
    }
    if (resourceKey === 'lansia') {
      requests.push(api.get('/warga?limit=100'));
      requests.push(api.get('/kegiatan?limit=100'));
    }
    if (isAdmin && ['warga', 'keluarga'].includes(resourceKey)) requests.push(api.get('/posyandu?limit=100'));

    Promise.all(requests)
      .then((responses) => {
        if (!active) return;
        let responseIndex = 0;
        if (resourceKey === 'warga') {
          setFamilies(responses[responseIndex].data.data);
          responseIndex += 1;
        }
        if (resourceKey === 'balita') {
          setResidents(responses[responseIndex].data.data);
          responseIndex += 1;
        }
        if (resourceKey === 'kehamilan') {
          setResidents(responses[responseIndex].data.data);
          responseIndex += 1;
        }
        if (resourceKey === 'penimbangan') {
          setBalitaProfiles(responses[responseIndex].data.data);
          setActivities(responses[responseIndex + 1].data.data);
          responseIndex += 2;
        }
        if (['imunisasi', 'suplemen'].includes(resourceKey)) {
          setBalitaProfiles(responses[responseIndex].data.data);
          responseIndex += 1;
          if (resourceKey === 'imunisasi') {
            setVaccines(responses[responseIndex].data.data);
            responseIndex += 1;
          }
          setActivities(responses[responseIndex].data.data);
          responseIndex += 1;
        }
        if (resourceKey === 'pemeriksaanKehamilan') {
          setPregnancies(responses[responseIndex].data.data);
          setActivities(responses[responseIndex + 1].data.data);
          responseIndex += 2;
        }
        if (resourceKey === 'lansia') {
          setResidents(responses[responseIndex].data.data);
          setActivities(responses[responseIndex + 1].data.data);
          responseIndex += 2;
        }
        if (isAdmin && ['warga', 'keluarga'].includes(resourceKey)) {
          setLocations(responses[responseIndex].data.data.filter((location) => location.aktif));
        }
      })
      .catch((requestError) => {
        if (active) setError(errorMessage(requestError, 'Data pilihan form belum dapat dimuat.'));
      });

    return () => {
      active = false;
    };
  }, [isAdmin, resourceKey]);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search.trim()) params.set('search', search.trim());

    api.get(`${resource.endpoint}?${params.toString()}`)
      .then(({ data }) => {
        if (!active) return;
        setRecords(data.data);
        setMeta(data.meta);
      })
      .catch((requestError) => {
        if (active) setError(errorMessage(requestError, `Data ${resource.title.toLowerCase()} belum dapat dimuat.`));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, resource, search]);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => {
    setForm(createEmptyForm(resource.fields));
    setEditingId(null);
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const payload = {};
      for (const field of visibleFields) {
        let value = form[field.key];
        if (field.type === 'checkbox') value = Boolean(value);
        else if (field.type === 'number') value = value === '' ? null : Number(value);
        else if (field.type === 'boolean-select') value = value === '' ? null : value === 'true';
        else if (typeof value === 'string') value = value.trim() || (field.optional ? null : '');
        if (value !== '' && value !== undefined) payload[field.key] = value;
      }

      if (editingId) await api.put(`${resource.endpoint}/${editingId}`, payload);
      else await api.post(resource.endpoint, payload);

      setSuccess(editingId ? `${resource.title} berhasil diperbarui.` : `${resource.title} berhasil ditambahkan.`);
      resetForm();
      await loadRecords(page, search);
      await loadOptions();
    } catch (requestError) {
      setError(errorMessage(requestError, `Data ${resource.title.toLowerCase()} gagal disimpan. Periksa isian dan koneksi API.`));
    } finally {
      setSaving(false);
    }
  };

  const editRecord = (record) => {
    const nextForm = createEmptyForm(resource.fields);
    for (const field of resource.fields) {
      const value = record[field.key];
      if (field.type === 'date' && value) nextForm[field.key] = String(value).slice(0, 10);
      else if (field.type === 'checkbox') nextForm[field.key] = Boolean(value);
      else if (field.key === 'wargaId') nextForm[field.key] = record.warga?.id || '';
      else if (field.key === 'ibuId') nextForm[field.key] = record.ibu?.id || '';
      else if (field.key === 'balitaId') nextForm[field.key] = record.balitaId || record.balita?.id || '';
      else if (field.key === 'kegiatanId') nextForm[field.key] = record.kegiatanId || record.kegiatan?.id || '';
      else if (field.key === 'keluargaId') nextForm[field.key] = record.keluargaId || '';
      else if (field.type === 'boolean-select' && value !== null && value !== undefined) nextForm[field.key] = String(value);
      else if (value !== null && value !== undefined) nextForm[field.key] = String(value);
    }
    setForm(nextForm);
    setEditingId(record.id);
    setError('');
    setSuccess('');
  };

  const deleteRecord = async (record) => {
    const label = record.nama || record.kepalaKeluarga || record.warga?.nama || record.nomorKk || 'data ini';
    if (!window.confirm(`Hapus ${label}? Data terkait mungkin ikut terdampak.`)) return;
    setError('');
    setSuccess('');
    try {
      await api.delete(`${resource.endpoint}/${record.id}`);
      setSuccess(`${resource.title} berhasil dihapus.`);
      if (editingId === record.id) resetForm();
      await loadRecords(page, search);
      await loadOptions();
    } catch (requestError) {
      setError(errorMessage(requestError, `Data tidak dapat dihapus. Pastikan tidak ada data layanan yang masih terkait.`));
    }
  };

  const fieldControl = (field) => {
    const className = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-[#2b4764] focus:outline-none focus:ring-2 focus:ring-[#2b4764]/20';
    const common = {
      id: `data-${field.key}`,
      value: form[field.key] ?? '',
      required: field.required,
      maxLength: field.maxLength,
      onChange: (event) => updateField(field.key, event.target.value),
      className,
    };

    if (field.type === 'checkbox') {
      return (
        <input
          id={common.id}
          type="checkbox"
          checked={Boolean(form[field.key])}
          onChange={(event) => updateField(field.key, event.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-[#2b4764] focus:ring-[#2b4764]"
        />
      );
    }
    if (field.type === 'textarea') {
      return <textarea {...common} rows={3} />;
    }
    if (field.type === 'select') {
      return (
        <select {...common}>
          <option value="">Pilih {field.label.toLowerCase()}</option>
          {field.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      );
    }
    if (field.type === 'boolean-select') {
      return (
        <select {...common}>
          <option value="">Belum dicatat</option>
          <option value="true">Ya</option>
          <option value="false">Tidak</option>
        </select>
      );
    }
    if (field.type === 'posyandu' || field.type === 'family' || field.type === 'warga' || field.type === 'balita' || field.type === 'activity' || field.type === 'vaccine' || field.type === 'pregnancy') {
      const options = field.type === 'posyandu'
        ? locations.map((item) => [item.id, item.nama])
        : field.type === 'family'
          ? families.map((item) => [item.id, `${item.nomorKk} — ${item.kepalaKeluarga}`])
          : field.type === 'activity'
            ? activities.map((item) => [item.id, `${dateLabel(item.tanggal)} — ${item.tema || 'Kegiatan Posyandu'}`])
            : field.type === 'vaccine'
              ? vaccines.map((item) => [item.id, `${item.nama} (${item.kode})`])
              : field.type === 'pregnancy'
                ? pregnancies.map((item) => [item.id, `${item.ibu?.nama || 'Ibu'} — HPL ${dateLabel(item.hpl)}`])
            : field.type === 'balita'
              ? balitaProfiles.map((item) => [item.id, item.warga?.nama || 'Balita'])
              : residents
                .filter((item) => (!field.femaleOnly || item.jenisKelamin === 'PEREMPUAN') && (!field.olderOnly || isSenior(item)))
                .map((item) => [item.id, `${item.nama}${item.nik ? ` — ${item.nik}` : ''}`]);
      return (
        <select {...common}>
          <option value="">{field.optional ? 'Tidak dipilih' : `Pilih ${field.label.toLowerCase()}`}</option>
          {options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      );
    }
    return (
      <input
        {...common}
        type={field.type || 'text'}
        min={field.min}
        step={field.step}
        inputMode={field.key === 'nik' ? 'numeric' : undefined}
      />
    );
  };

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="data-kependudukan-title">
      <div className="mb-5">
        <h2 id="data-kependudukan-title" className="text-lg font-semibold text-slate-900">Data layanan</h2>
        <p className="mt-1 text-sm text-slate-600">
          {canManage ? 'Kelola data dan pemeriksaan warga pada Posyandu Anda.' : 'Lihat data dan laporan layanan Posyandu.'}
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Jenis data">
        {Object.entries(MASTER_DATA).map(([key, item]) => (
          <button
            key={key}
            id={`tab-${key}`}
            type="button"
            role="tab"
            aria-selected={resourceKey === key}
            aria-controls="panel-data"
            onClick={() => {
              setResourceKey(key);
              setForm(createEmptyForm(item.fields));
              setEditingId(null);
              setSearch('');
              setPage(1);
              setLoading(true);
              setError('');
              setSuccess('');
            }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${resourceKey === key ? 'bg-[#2b4764] text-white' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            {item.title}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
      {success && <p role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{success}</p>}

      <div id="panel-data" role="tabpanel" aria-labelledby={`tab-${resourceKey}`}>
        {canManage && (
          <form onSubmit={submitForm} className="grid gap-4 rounded-xl bg-[#f7f5ef] p-4 sm:grid-cols-2 sm:p-5">
            {visibleFields.map((field) => (
              <div key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <label htmlFor={`data-${field.key}`} className="mb-1.5 block text-sm font-medium text-slate-700">
                  {field.label}{field.required ? ' *' : ''}
                </label>
                {fieldControl(field)}
              </div>
            ))}
            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button type="submit" disabled={saving || loading} className="rounded-lg bg-[#2b4764] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f3650] disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? 'Menyimpan...' : editingId ? 'Simpan perubahan' : `Tambah ${resource.title.toLowerCase()}`}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Batal
                </button>
              )}
            </div>
          </form>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-semibold text-slate-900">{resource.title} terdaftar <span className="font-normal text-slate-500">({meta.total})</span></h3>
          <form onSubmit={(event) => { event.preventDefault(); setPage(1); void loadRecords(1, search); }} className="flex gap-2">
            <label className="sr-only" htmlFor="data-search">Cari data</label>
            <input id="data-search" type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); setLoading(true); setError(''); }} placeholder={`Cari ${resource.title.toLowerCase()}...`} className="min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2b4764] focus:outline-none focus:ring-2 focus:ring-[#2b4764]/20" />
            <button type="submit" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cari</button>
          </form>
        </div>

        {loading && <p role="status" className="mt-4 text-sm text-slate-600">Memuat data...</p>}
        {!loading && records.length === 0 && (
          <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Belum ada data yang cocok.</p>
        )}
        {!loading && records.length > 0 && (
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  {resource.columns.map((column) => <th key={column.key} scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">{column.label}</th>)}
                  {canManage && <th scope="col" className="px-4 py-3 font-semibold">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {records.map((record) => (
                  <tr key={record.id} className="align-top">
                    {resource.columns.map((column) => {
                      const value = record[column.key];
                      return (
                        <td key={column.key} className="whitespace-nowrap px-4 py-3 text-slate-700">
                          {column.format ? column.format(value, record) : value || '—'}
                        </td>
                      );
                    })}
                    {canManage && (
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex gap-2">
                          <button type="button" onClick={() => editRecord(record)} className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Ubah</button>
                          <button type="button" onClick={() => void deleteRecord(record)} className="rounded-md border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50">Hapus</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-slate-600">Halaman {meta.page} dari {Math.max(meta.totalPages, 1)}</p>
          <div className="flex gap-2">
            <button type="button" disabled={loading || page <= 1} onClick={() => { setPage((current) => Math.max(current - 1, 1)); setLoading(true); }} className="rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Sebelumnya</button>
            <button type="button" disabled={loading || page >= meta.totalPages} onClick={() => { setPage((current) => current + 1); setLoading(true); }} className="rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Berikutnya</button>
          </div>
        </div>
      </div>
    </section>
  );
}
