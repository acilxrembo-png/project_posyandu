import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HiMenu, HiX, HiOutlineHome, HiOutlineUser, HiOutlineInformationCircle, HiOutlinePhotograph, HiOutlinePhone } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import Logo from '../assets/Logo.svg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const menuItems = [
    { label: 'Beranda', href: '/', icon: <HiOutlineHome /> },
    { label: 'Informasi', href: '/informasi', icon: <HiOutlineInformationCircle /> },
    { label: 'Galeri', href: '/galeri', icon: <HiOutlinePhotograph /> },
    { label: 'Kontak', href: '/kontak', icon: <HiOutlinePhone /> },
  ];
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Logo Posyandu RW 08" className="h-10 w-10 object-contain" />
            <span className="font-bold text-xl">Posyandu RW 08</span>
          </div>

          {/* menu desktop */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <NavLink key={item.label} to={item.href} end={item.href === '/'} className={({ isActive }) => `font-medium transition-colors ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-500'}`}>
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <button type="button" onClick={logout} className="text-gray-700 font-medium hover:text-blue-500 transition-colors">
                Keluar
              </button>
            ) : (
              <NavLink to="/login" className={({ isActive }) => `flex items-center gap-2 font-medium transition-colors ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-500'}`}>
                <HiOutlineUser className="h-5 w-5" />
                Login
              </NavLink>
            )}
          </div>
          <button type="button" onClick={() => setIsOpen(!isOpen)} className="md:hidden flex items-center justify-center w-10 h-10 text-gray-700 hover:text-blue-500 transition-colors focus:outline-none" aria-label="Buka menu">
            {isOpen ? <HiX className="h-5 w-5" /> : <HiMenu className="h-5 w-5" />}
          </button>
        </div>

        {/* menu mobile */}
        {isOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            {menuItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                end={item.href === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `flex items-center gap-2 font-medium transition-colors ${isActive ? 'text-blue-600 bg-blue-50 rounded-lg px-3 py-2' : 'text-gray-700 hover:text-blue-500'}`}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="text-left text-gray-700 font-medium hover:text-blue-500 transition-colors"
              >
                Keluar
              </button>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `flex items-center gap-2 font-medium transition-colors ${isActive ? 'text-blue-600 bg-blue-50 rounded-lg px-3 py-2' : 'text-gray-700 hover:text-blue-500'}`}
              >
                <HiOutlineUser className="h-5 w-5" />
                Login
              </NavLink>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
