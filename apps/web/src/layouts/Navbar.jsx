import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HiMenu,
  HiX,
  HiOutlineHome,
  HiOutlineInformationCircle,
  HiOutlinePhotograph,
  HiOutlinePhone,
  HiOutlineLogin,
  HiOutlineLogout,
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import Logo from '../assets/Logo.svg';

const menuItems = [
  { label: 'Beranda', href: '/', icon: HiOutlineHome },
  { label: 'Informasi', href: '/informasi', icon: HiOutlineInformationCircle },
  { label: 'Galeri', href: '/galeri', icon: HiOutlinePhotograph },
  { label: 'Kontak', href: '/kontak', icon: HiOutlinePhone },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // Beri bayangan & efek blur setelah halaman di-scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Tutup menu mobile saat pindah halaman
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Tutup menu mobile dengan tombol Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const desktopLink = ({ isActive }) =>
    `relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
      isActive
        ? 'bg-teal-50 text-teal-700'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  const mobileLink = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
      isActive
        ? 'bg-teal-50 text-teal-700'
        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled || isOpen
          ? 'bg-white/90 backdrop-blur-md border-slate-200 shadow-sm'
          : 'bg-white border-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navigasi utama">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <NavLink
            to="/"
            className="flex items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            <img
              src={Logo}
              alt="Logo Posyandu RW 08"
              className="h-10 w-10 rounded-full object-contain ring-2 ring-teal-100 bg-white"
            />
            <span className="flex flex-col leading-tight">
              <span className="text-lg font-bold text-slate-900">Posyandu RW 08</span>
              <span className="hidden sm:block text-xs text-slate-500">
                Sehat bersama, tumbuh bersama
              </span>
            </span>
          </NavLink>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map(({ label, href }) => (
              <NavLink key={label} to={href} end={href === '/'} className={desktopLink}>
                {label}
              </NavLink>
            ))}

            <span className="mx-3 h-6 w-px bg-slate-200" aria-hidden="true" />

            {isAuthenticated ? (
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <HiOutlineLogout className="h-4 w-4" />
                Keluar
              </button>
            ) : (
              <NavLink
                to="/login"
                className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                <HiOutlineLogin className="h-4 w-4" />
                Login
              </NavLink>
            )}
          </div>

          {/* Tombol menu mobile */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={isOpen}
            aria-controls="menu-mobile"
          >
            {isOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menu mobile */}
        <div
          id="menu-mobile"
          className={`md:hidden grid transition-[grid-template-rows] duration-300 ease-out ${
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-1 pb-4 pt-2" inert={!isOpen ? '' : undefined}>
              {menuItems.map(({ label, href, icon: Icon }) => (
                <NavLink key={label} to={href} end={href === '/'} className={mobileLink}>
                  <Icon className="h-5 w-5" />
                  {label}
                </NavLink>
              ))}

              <div className="mt-2 border-t border-slate-200 pt-3">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-base font-semibold text-slate-700 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                  >
                    <HiOutlineLogout className="h-5 w-5" />
                    Keluar
                  </button>
                ) : (
                  <NavLink
                    to="/login"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  >
                    <HiOutlineLogin className="h-5 w-5" />
                    Login
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;