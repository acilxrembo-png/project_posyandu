import {useState} from 'react'
import {HiMenu, HiX, HiOutlineHome, HiOutlineUser, HiOutlineInformationCircle} from 'react-icons/hi'
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const menuItems = [
    { label: 'Beranda', href: '/', icon: <HiOutlineHome /> },
    { label: 'Tentang', href: '/tentang', icon: <HiOutlineInformationCircle /> },
  ]
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
                    <span className="font-bold text-xl">Posyandu RW 08</span>
                </div>

                {/* menu desktop */}
                <div className="hidden md:flex items-center gap-8">
                    {menuItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-gray-700 font-medium hover:text-blue-500 transition-colors"
                        >
                            {item.label}
                        </a>
                    ))}
                    <a href="#Login" className="text-gray-700 font-medium hover:text-blue-500 transition-colors">
                        <HiOutlineUser className='h-5 w-5' />
                        Login
                    </a>
                </div>
                <button 
                onclick={() => setIsOpen(!isOpen)}
                classname="md:hidden flex items-center justify-center w-10 h-10 text-gray-700 hover:text-blue-500 transition-colors focus:outline-none">
                    {isOpen ? <HiX className="h-5 w-5" /> : <HiMenu className="h-5 w-5" />}
                </button>
            </div>

            {/* menu mobile */}
            {isOpen && (
                <div className="md:hidden pb-4 flex flex-col gap-3">
                    {menuItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            onclick={() => setIsOpen(false)}
                            className="text-gray-700 font-medium hover:text-blue-500 transition-colors"
                        >
                            {item.icon}
                            {item.label}
                        </a>
                    ))}
                    <a href="#Login"
                        onclick={() => setIsOpen(false)}
                    className="text-gray-700 font-medium hover:text-blue-500 transition-colors">
                        <HiOutlineUser className='h-5 w-5' />
                        Login
                    </a>
                </div>
            )}
        </div>
    </nav>
  )
}

export default Navbar
