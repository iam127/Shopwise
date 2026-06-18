'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

export default function NavbarPublic() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { label: 'Inicio', href: '/' },
    { label: 'Categorias', href: '/categorias' },
    { label: 'Productos', href: '/explorar' },
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Contacto', href: '/contacto' },
  ];

  return (
    <nav className={'bg-white sticky top-0 z-50 transition-all duration-300 ' + (scrolled ? 'shadow-lg border-b border-gray-100' : 'shadow-sm border-b border-gray-100')}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image src="/logo.png" alt="Shopwise" width={140} height={35} style={{ objectFit: 'contain' }} />
        </Link>

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href}
              className={'text-sm font-medium px-4 py-2 rounded-xl transition-all relative ' + (pathname === link.href ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50')}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></span>
              )}
            </Link>
          ))}
        </div>

        {/* Botones desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/login"
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all">
            <AccountCircleOutlinedIcon style={{ fontSize: 18 }} />
            Iniciar sesion
          </Link>
          <Link href="/register"
            className="flex items-center gap-2 text-sm font-semibold text-white bg-blue-600 px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            <ShoppingBagIcon style={{ fontSize: 18 }} />
            Registrarse gratis
          </Link>
        </div>

        {/* Boton menu mobile */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
          {menuOpen ? <CloseIcon style={{ fontSize: 20 }} /> : <MenuIcon style={{ fontSize: 20 }} />}
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4">
          <div className="space-y-1 mb-4">
            {links.map((link) => (
              <Link key={link.href} href={link.href}
                onClick={() => setMenuOpen(false)}
                className={'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ' + (pathname === link.href ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600')}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 border border-gray-200 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
              <AccountCircleOutlinedIcon style={{ fontSize: 18 }} />
              Iniciar sesion
            </Link>
            <Link href="/register" onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 text-sm font-semibold text-white bg-blue-600 px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors">
              <ShoppingBagIcon style={{ fontSize: 18 }} />
              Registrarse gratis
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}