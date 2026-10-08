import { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

// 1. Buat Context
const AuthContext = createContext();

// 2. Buat Provider untuk membungkus aplikasi (digunakan di main.jsx atau App.jsx)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cek token setiap kali aplikasi pertama kali dimuat (Refresh Halaman)
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          // Validasi token ke backend dan ambil data user terbaru
          // const userData = await AuthService.getCurrentUser(); // <-- Buka komen ini jika API backend sudah siap

          // Simulasi jika backend belum siap (ambil dari localStorage sementara)
          const savedUser = JSON.parse(localStorage.getItem('user'));
          setUser(savedUser);
          setIsAuthenticated(true);
        } catch (error) {
          // Jika token kadaluarsa atau tidak valid
          console.error('Sesi telah habis:', error);
          AuthService.logout();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false); // Selesai loading
    };

    checkAuth();
  }, []);

  // Fungsi wrapper untuk login (dipanggil dari halaman Login.jsx)
  const login = async (email, password) => {
    const data = await AuthService.login(email, password);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  // Fungsi wrapper untuk logout (dipanggil dari Navbar/Sidebar)
  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>{children}</AuthContext.Provider>;
};

// 3. Custom Hook agar lebih mudah digunakan di komponen lain
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};
