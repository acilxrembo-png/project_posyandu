import { useState } from 'react';
import { NavLink } from 'react-router-dom';

// ====== DATA CONTOH (ganti dengan data dari API / Prisma) ======
const MENU_ADMIN = [
  { label: 'Dashboard', to: '/admin', icon: '🏠' },
  { label: 'Data Balita', to: '/admin/balita', icon: '👶' },
  { label: 'Data Kader', to: '/admin/kader', icon: '🧑‍⚕️' },
  { label: 'Data Pengguna', to: '/admin/pengguna', icon: '👥' },
  { label: 'Pemeriksaan', to: '/admin/pemeriksaan', icon: '⚖️' },
  { label: 'Imunisasi', to: '/admin/imunisasi', icon: '💉' },
  { label: 'Monitoring', to: '/admin/monitoring', icon: '📈' },
  { label: 'Jadwal & Informasi', to: '/admin/informasi', icon: '📅' },
  { label: 'Galeri', to: '/admin/galeri', icon: '🖼️' },
  { label: 'Laporan', to: '/admin/laporan', icon: '📄' },
  { label: 'Log Aktivitas', to: '/admin/log', icon: '🕘' },
  { label: 'Pengaturan', to: '/admin/pengaturan', icon: '⚙️' },
];

const STATS = [
  { label: 'Total Balita', value: 250, note: '+12 dari bulan lalu', color: '#2563eb' },
  { label: 'Total Kader', value: 15, note: '+1 dari bulan lalu', color: '#0d9488' },
  { label: 'Pengguna Umum', value: 312, note: '+24 dari bulan lalu', color: '#7c3aed' },
  { label: 'Pemeriksaan Bulan Ini', value: 85, note: '+18 dari bulan lalu', color: '#ea580c' },
  { label: 'Imunisasi Bulan Ini', value: 70, note: '+10 dari bulan lalu', color: '#db2777' },
  { label: 'Akun Menunggu Verifikasi', value: 6, note: 'Perlu ditinjau', color: '#dc2626' },
];

const BERAT = [
  { w: 'Minggu 1', v: 8.2 },
  { w: 'Minggu 2', v: 9.6 },
  { w: 'Minggu 3', v: 8.9 },
  { w: 'Minggu 4', v: 10.8 },
];

const GIZI = [
  { label: 'Gizi baik', n: 198, color: '#16a34a' },
  { label: 'Gizi kurang', n: 32, color: '#eab308' },
  { label: 'Stunting', n: 14, color: '#f97316' },
  { label: 'Gizi buruk', n: 6, color: '#dc2626' },
];

const PEMERIKSAAN = [
  { nama: 'Aisyah Putri', tgl: '25 Mei 2026', bb: '10.8 kg', oleh: 'Kader Siti' },
  { nama: 'Nanda Pratama', tgl: '25 Mei 2026', bb: '9.2 kg', oleh: 'Kader Rina' },
  { nama: 'Zahra Aulia', tgl: '25 Mei 2026', bb: '11.1 kg', oleh: 'Kader Siti' },
];

const VERIFIKASI = [
  { nama: 'Dewi Lestari', role: 'Kader' },
  { nama: 'Budi Santoso', role: 'Umum' },
  { nama: 'Rina Marlina', role: 'Umum' },
];

const LOG = ['Kader Siti menambah pemeriksaan Aisyah Putri', 'Admin mengubah jadwal imunisasi Juni', 'Pengguna baru mendaftar: Budi Santoso'];

// ====== KOMPONEN ======
function LineChart({ data }) {
  const W = 520,
    H = 200,
    P = 32;
  const max = 12;
  const pts = data.map((d, i) => [P + (i * (W - 2 * P)) / (data.length - 1), H - P - (d.v / max) * (H - 2 * P)]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="da-chart" role="img" aria-label="Grafik rata-rata berat badan balita per minggu">
      {[0, 4, 8, 12].map((t) => {
        const y = H - P - (t / max) * (H - 2 * P);
        return (
          <g key={t}>
            <line x1={P} x2={W - P} y1={y} y2={y} stroke="#e5e7eb" />
            <text x={P - 6} y={y + 4} fontSize="10" textAnchor="end" fill="#6b7280">
              {t}
            </text>
          </g>
        );
      })}
      <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke="#2563eb" strokeWidth="2.5" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="4" fill="#2563eb" />
          <text x={p[0]} y={H - 10} fontSize="10" textAnchor="middle" fill="#6b7280">
            {data[i].w}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function DashboardAdmin() {
  const [open, setOpen] = useState(false);
  const totalGizi = GIZI.reduce((a, g) => a + g.n, 0);
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="da">
      <style>{CSS}</style>

      <aside className={`da-side ${open ? 'is-open' : ''}`}>
        <div className="da-brand">
          <span className="da-logo">🍼</span>
          <div>
            POSYANDU
            <br />
            RW 8
          </div>
        </div>
        <nav>
          {MENU_ADMIN.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.to === '/admin'} className={({ isActive }) => (isActive ? 'active' : '')}>
              <span aria-hidden>{m.icon}</span> {m.label}
            </NavLink>
          ))}
        </nav>
        <NavLink to="/login" className="da-logout">
          🚪 Logout
        </NavLink>
      </aside>

      <div className="da-main">
        <header className="da-top">
          <button className="da-burger" onClick={() => setOpen(!open)} aria-label="Buka menu">
            ☰
          </button>
          <div className="da-user">
            <div>
              <strong>Admin</strong>
              <small>Administrator Sistem</small>
            </div>
            <span className="da-avatar">A</span>
          </div>
        </header>

        <main className="da-content">
          <div className="da-head">
            <h1>Dashboard Admin</h1>
            <span>{today}</span>
          </div>

          <section className="da-stats">
            {STATS.map((s) => (
              <div className="da-card da-stat" key={s.label} style={{ borderTopColor: s.color }}>
                <small>{s.label}</small>
                <b>{s.value}</b>
                <em>{s.note}</em>
              </div>
            ))}
          </section>

          <section className="da-grid2">
            <div className="da-card">
              <h2>Grafik Berat Badan (Bulan Ini)</h2>
              <LineChart data={BERAT} />
              <small className="da-muted">Rata-rata berat balita (kg)</small>
            </div>

            <div className="da-card">
              <h2>Status Gizi Balita</h2>
              <div className="da-bar">
                {GIZI.map((g) => (
                  <i key={g.label} style={{ width: `${(g.n / totalGizi) * 100}%`, background: g.color }} title={`${g.label}: ${g.n}`} />
                ))}
              </div>
              <ul className="da-legend">
                {GIZI.map((g) => (
                  <li key={g.label}>
                    <i style={{ background: g.color }} /> {g.label} <b>{g.n}</b>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="da-grid3">
            <div className="da-card">
              <h2>Pemeriksaan Terbaru</h2>
              <ul className="da-list">
                {PEMERIKSAAN.map((p) => (
                  <li key={p.nama}>
                    <div>
                      <b>{p.nama}</b>
                      <small>
                        {p.tgl} • {p.oleh}
                      </small>
                    </div>
                    <span>{p.bb}</span>
                  </li>
                ))}
              </ul>
              <NavLink className="da-link" to="/admin/pemeriksaan">
                Lihat semua
              </NavLink>
            </div>

            <div className="da-card">
              <h2>Akun Menunggu Verifikasi</h2>
              <ul className="da-list">
                {VERIFIKASI.map((v) => (
                  <li key={v.nama}>
                    <div>
                      <b>{v.nama}</b>
                      <small>Daftar sebagai {v.role}</small>
                    </div>
                    <span className="da-actions">
                      <button className="ok">Setujui</button>
                      <button className="no">Tolak</button>
                    </span>
                  </li>
                ))}
              </ul>
              <NavLink className="da-link" to="/admin/pengguna">
                Kelola pengguna
              </NavLink>
            </div>

            <div className="da-card">
              <h2>Aktivitas Terakhir</h2>
              <ul className="da-list da-log">
                {LOG.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <NavLink className="da-link" to="/admin/log">
                Lihat log
              </NavLink>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

const CSS = `
.da{--blue:#2563eb;--ink:#111827;--mut:#6b7280;--line:#e5e7eb;display:flex;min-height:100vh;background:#f3f5f9;color:var(--ink);font-family:Poppins,system-ui,sans-serif}
.da *{box-sizing:border-box}
.da-side{width:240px;background:var(--blue);color:#fff;display:flex;flex-direction:column;padding:20px 12px;position:sticky;top:0;height:100vh;overflow-y:auto}
.da-brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:13px;padding:0 8px 20px}
.da-logo{font-size:26px}
.da-side nav{display:flex;flex-direction:column;gap:2px;flex:1}
.da-side a{color:#dbeafe;text-decoration:none;padding:10px 12px;border-radius:8px;font-size:14px}
.da-side a:hover{background:rgba(255,255,255,.12)}
.da-side a.active{background:rgba(255,255,255,.2);color:#fff;font-weight:600}
.da-logout{margin-top:12px}
.da-main{flex:1;min-width:0}
.da-top{display:flex;justify-content:space-between;align-items:center;background:#fff;padding:12px 24px;border-bottom:1px solid var(--line)}
.da-burger{display:none;border:0;background:none;font-size:22px;cursor:pointer}
.da-user{display:flex;align-items:center;gap:10px;margin-left:auto;text-align:right}
.da-user small{display:block;color:var(--mut);font-size:12px}
.da-avatar{width:36px;height:36px;border-radius:50%;background:var(--blue);color:#fff;display:grid;place-items:center;font-weight:600}
.da-content{padding:24px}
.da-head{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px;margin-bottom:16px}
.da-head h1{font-size:22px;margin:0}
.da-head span{color:var(--mut);font-size:13px}
.da-card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:16px}
.da-card h2{font-size:15px;margin:0 0 12px}
.da-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:16px}
.da-stat{border-top:4px solid;display:flex;flex-direction:column;gap:2px}
.da-stat small{color:var(--mut);font-size:12px}
.da-stat b{font-size:28px;line-height:1.2}
.da-stat em{font-style:normal;font-size:11px;color:var(--mut)}
.da-grid2{display:grid;grid-template-columns:2fr 1fr;gap:12px;margin-bottom:16px}
.da-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.da-chart{width:100%;height:auto}
.da-muted{color:var(--mut)}
.da-bar{display:flex;height:14px;border-radius:7px;overflow:hidden;margin:8px 0 14px}
.da-bar i{display:block}
.da-legend{list-style:none;margin:0;padding:0;display:grid;gap:8px;font-size:13px}
.da-legend li{display:flex;align-items:center;gap:8px}
.da-legend li b{margin-left:auto}
.da-legend i{width:10px;height:10px;border-radius:50%}
.da-list{list-style:none;margin:0 0 10px;padding:0;display:grid;gap:10px}
.da-list li{display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:13px}
.da-list small{display:block;color:var(--mut);font-size:11px}
.da-log li{display:block;padding-left:10px;border-left:3px solid var(--line);color:#374151}
.da-actions{display:flex;gap:6px}
.da-actions button{border:0;border-radius:6px;padding:4px 8px;font-size:11px;cursor:pointer;color:#fff}
.da-actions .ok{background:#16a34a}
.da-actions .no{background:#dc2626}
.da-link{font-size:12px;color:var(--blue);text-decoration:none;font-weight:600}
.da-side a:focus-visible,.da-link:focus-visible,.da-actions button:focus-visible,.da-burger:focus-visible{outline:2px solid #f59e0b;outline-offset:2px}
@media(max-width:1000px){.da-grid3{grid-template-columns:1fr}.da-grid2{grid-template-columns:1fr}}
@media(max-width:760px){
  .da-side{position:fixed;z-index:20;left:0;transform:translateX(-100%);transition:transform .2s}
  .da-side.is-open{transform:none}
  .da-burger{display:block}
  .da-content{padding:16px}
}
@media(prefers-reduced-motion:reduce){.da-side{transition:none}}
`;
