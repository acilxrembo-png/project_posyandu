import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // 1. Tampilkan loading spinner jika status Auth masih dicek (misal saat refresh halaman)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm font-medium text-slate-500">Memuat data...</span>
        </div>
      </div>
    );
  }

  // 2. Jika tidak ada yang login, lempar ke halaman login
  // Simpan rute yang sedang dicoba diakses ke state, agar bisa di-redirect balik setelah sukses login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. (Opsional) Jika aplikasi Anda menggunakan sistem Role (Kader, Bidan, Admin)
  // Cek apakah role user saat ini diizinkan untuk mengakses halaman ini
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Lempar ke halaman "Tidak Memiliki Akses" atau kembali ke Beranda
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Jika lolos semua pengecekan, tampilkan komponen/halaman yang diminta (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
