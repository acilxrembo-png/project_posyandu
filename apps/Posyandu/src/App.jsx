import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Import Context & Pelindung Halaman
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import Komponen & Halaman Anda
import Navbar from './layouts/Navbar';
import Login from './pages/Login';
import Beranda from './pages/Beranda'; // Pastikan file ini ada di folder pages
import Tentang from './pages/Tentang';
import Layanan from './pages/Layanan';
import Informasi from './pages/Informasi';
import Galeri from './pages/Galeri';
import Kontak from './pages/Kontak';

const AppContent = () => {
  const location = useLocation();
  const hideNavbar = ['/tentang', '/layanan'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {!hideNavbar && <Navbar />}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tentang" element={<Tentang />} />
          <Route path="/layanan" element={<Layanan />} />
          <Route path="/informasi" element={<Informasi />} />
          <Route path="/galeri" element={<Galeri />} />
          <Route path="/kontak" element={<Kontak />} />

          <Route element={<ProtectedRoute />}>
            {/* Tambahkan halaman internal yang membutuhkan login di dalam route ini. */}
            {/* <Route path="/data-balita" element={<DataBalita />} /> */}
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
