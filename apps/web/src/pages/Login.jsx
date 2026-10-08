import { useState } from 'react'; // <-- Tambahkan useState di sini
// --- MULAI DARI SINI: Tambahkan import lainnya yang dibutuhkan ---
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
// --- BATAS IMPORT ---

const Login = () => {
  // --- MULAI DARI SINI: Masukkan logika JavaScript dan State di dalam fungsi, SEBELUM return ---
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };
  // --- BATAS LOGIKA ---

  return (
    // --- MULAI DARI SINI: Hapus <div></div> bawaan rafc, timpa dengan kode UI Tailwind ---
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <img
            src="/Logo.svg"
            alt="Logo Posyandu"
            className="w-24 h-24 object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Posyandu RW 08</h2>
        </div>
        <p className="max-w-sm mx-auto mt-3 text-sm leading-6 text-gray-600">Masuk ke akun Anda untuk mengakses sistem informasi pelayanan</p>
      </div>

      {/* Main Card */}
      <div className="w-full sm:max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        <div className="p-6 sm:p-8">
          {/* Alert Message */}
          {errorMessage && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-2 animate-pulse">
              <span className="font-semibold">Perhatian:</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Alamat Email
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <HiOutlineMail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@posyandurw08.id"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <HiOutlineLockClosed className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                  {showPassword ? <HiOutlineEyeOff className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600">
                <input type="checkbox" name="rememberMe" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors cursor-pointer" />
                <span>Ingat saya</span>
              </label>
              <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Lupa sandi?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-medium bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-lg shadow-blue-500/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Akun</span>
                </>
              )}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Belum punya akun?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
    // --- BATAS KODE UI TAMPILAN ---
  );
};

export default Login;
