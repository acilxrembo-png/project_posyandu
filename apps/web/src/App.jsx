import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './layouts/Navbar';
import Login from './pages/Login';
import Beranda from './pages/Beranda';
import Tentang from './pages/Tentang';
import Layanan from './pages/Layanan';
import Informasi from './pages/Informasi';
import Galeri from './pages/Galeri';
import Kontak from './pages/Kontak';
import Register from './pages/Register';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import DashboardKader from './pages/kader/DashboardKader';
import DashboardWarga from './pages/warga/DashboardWarga';

const AREA_INTERNAL = ['/admin', '/kader', '/warga'];

const AppContent = () => {
  const { pathname } = useLocation();
  const internal = AREA_INTERNAL.some((p) => pathname.startsWith(p));

  return (
    <div className={`min-h-screen flex flex-col ${internal ? 'bg-slate-50' : 'public-site'}`}>
      {!internal && <Navbar />}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tentang" element={<Tentang />} />
          <Route path="/layanan" element={<Layanan />} />
          <Route path="/informasi" element={<Informasi />} />
          <Route path="/galeri" element={<Galeri />} />
          <Route path="/kontak" element={<Kontak />} />

          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
            <Route path="/admin/*" element={<DashboardAdmin />} />
          </Route>

          <Route element={<ProtectedRoute roles={['ADMIN', 'KADER']} />}>
            <Route path="/kader/*" element={<DashboardKader />} />
          </Route>

          <Route element={<ProtectedRoute roles={['Masyarakat']} />}>
            <Route path="/warga/*" element={<DashboardWarga />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <AppContent />
    </Router>
  </AuthProvider>
);

export default App;