import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

export const PasswordToggle = ({ visible, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
  >
    {visible ? <HiOutlineEyeOff className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}
  </button>
);

const FormField = ({ id, label, icon: Icon, optional = false, trailing = null, ...inputProps }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
      {label}
      {optional && <span className="ml-1 font-normal text-slate-400">(opsional)</span>}
    </label>
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      <input
        id={id}
        name={id}
        {...inputProps}
        className={`block w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20 ${
          trailing ? 'pr-12' : 'pr-4'
        }`}
      />
      {trailing && <div className="absolute inset-y-0 right-1.5 flex items-center">{trailing}</div>}
    </div>
  </div>
);

export default FormField;