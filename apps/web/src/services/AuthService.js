import axios from 'axios';

// Konfigurasi dasar Axios (Sesuaikan dengan URL Backend Anda)
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menyisipkan token ke setiap request API secara otomatis
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AuthService = {
  // Fungsi untuk Login
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });

    // Simpan token ke localStorage jika login berhasil
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // Bisa juga menyimpan data user dasar
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Fungsi untuk Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Fungsi untuk mendapatkan profil user yang sedang login dari database
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

export default AuthService;
