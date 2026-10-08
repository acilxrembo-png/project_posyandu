import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineLockClosed } from 'react-icons/hi';
import { useAuth } from '../context/useAuth';
import AuthLayout from '../components/AuthLayout';
import FormField, { PasswordToggle } from '../components/FormField';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (formData.name.trim().length < 3) return 'Nama lengkap minimal 3 karakter.';
    if (formData.phone && !/^(\+62|62|0)8[0-9]{7,12}$/.test(formData.phone)) {
      return 'Nomor HP tidak valid. Contoh: 081234567890.';
    }
    if (formData.password.length < 8) return 'Kata sandi minimal 8 karakter.';
    if (formData.password !== formData.confirmPassword) return 'Konfirmasi kata sandi tidak cocok.';
    if (!agree) return 'Anda harus menyetujui syarat dan ketentuan.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsLoading(true);
    try {
      await register({
        nama: formData.name.trim(),
        email: formData.email.trim(),
        telepon: formData.phone.trim(),
        password: formData.password,
      });
      navigate('/login', { replace: true, state: { registered: true } });
    } catch (error) {
      const message = error?.response?.data?.message
        || (error?.request
          ? 'Server API tidak dapat dihubungi. Pastikan API sedang berjalan.'
          : 'Pendaftaran gagal. Silakan coba lagi.');
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Buat akun"
      subtitle="Daftar untuk mengakses informasi dan layanan Posyandu RW 08."
      footer={
        <>
          Sudah punya akun?{' '}
          <Link to="/login" className="font-semibold text-teal-700 transition-colors hover:text-teal-800 hover:underline">
            Masuk
          </Link>
        </>
      }
    >
      {errorMessage && (
        <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField
          id="name"
          name="name"
          label="Nama lengkap"
          icon={HiOutlineUser}
          type="text"
          required
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nama sesuai KTP"
        />

        <FormField
          id="email"
          name="email"
          label="Alamat email"
          icon={HiOutlineMail}
          type="email"
          required
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="nama@email.com"
        />

        <FormField
          id="phone"
          name="phone"
          label="Nomor HP"
          optional
          icon={HiOutlinePhone}
          type="tel"
          autoComplete="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="081234567890"
        />

        <FormField
          id="password"
          name="password"
          label="Kata sandi"
          icon={HiOutlineLockClosed}
          type={showPassword ? 'text' : 'password'}
          required
          minLength={8}
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Minimal 8 karakter"
          trailing={<PasswordToggle visible={showPassword} onToggle={() => setShowPassword((prev) => !prev)} />}
        />

        <FormField
          id="confirmPassword"
          name="confirmPassword"
          label="Konfirmasi kata sandi"
          icon={HiOutlineLockClosed}
          type={showConfirm ? 'text' : 'password'}
          required
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Ulangi kata sandi"
          trailing={<PasswordToggle visible={showConfirm} onToggle={() => setShowConfirm((prev) => !prev)} />}
        />

        <label className="flex cursor-pointer select-none items-start gap-2.5 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-4 w-4 cursor-pointer rounded border-slate-300 text-teal-600 focus:ring-teal-600"
          />
          <span>Saya menyetujui syarat dan ketentuan penggunaan sistem Posyandu RW 08.</span>
        </label>

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
            <span>Daftar</span>
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Register;