import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import FormField, { PasswordToggle } from '../components/FormField';

const Login = () => {
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
  const justRegistered = Boolean(location.state?.registered);

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

  return (
    <AuthLayout
      title="Masuk"
      subtitle="Gunakan akun Anda untuk mengakses sistem informasi Posyandu RW 08."
      footer={
        <>
          Belum punya akun?{' '}
          <Link to="/register" className="font-semibold text-teal-700 transition-colors hover:text-teal-800 hover:underline">
            Daftar
          </Link>
        </>
      }
    >
      {justRegistered && !errorMessage && (
        <div role="status" className="mb-6 rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800">
          Akun berhasil dibuat. Silakan masuk dengan email dan kata sandi Anda.
        </div>
      )}

      {errorMessage && (
        <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField
          id="email"
          label="Alamat email"
          icon={HiOutlineMail}
          type="email"
          required
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="admin@posyandurw08.id"
        />

        <FormField
          id="password"
          label="Kata sandi"
          icon={HiOutlineLockClosed}
          type={showPassword ? 'text' : 'password'}
          required
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Masukkan kata sandi"
          trailing={<PasswordToggle visible={showPassword} onToggle={() => setShowPassword((prev) => !prev)} />}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer select-none items-center gap-2 text-slate-600">
            <input
              type="checkbox"
              name="rememberMe"
              className="h-4 w-4 cursor-pointer rounded border-slate-300 text-teal-600 focus:ring-teal-600"
            />
            <span>Ingat saya</span>
          </label>
          <Link to="/forgot-password" className="font-medium text-teal-700 transition-colors hover:text-teal-800 hover:underline">
            Lupa sandi?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Memproses...</span>
            </>
          ) : (
            <span>Masuk</span>
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;