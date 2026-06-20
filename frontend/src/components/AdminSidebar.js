'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import EmailIcon from '@mui/icons-material/Email';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import GroupsIcon from '@mui/icons-material/Groups';
import RateReviewIcon from '@mui/icons-material/RateReview';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LogoutIcon from '@mui/icons-material/Logout';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const links = [
    { href: '/admin/estadisticas', label: 'Estadisticas', icon: <DashboardIcon style={{ fontSize: 20 }} /> },
    { href: '/admin/productos', label: 'Productos', icon: <Inventory2Icon style={{ fontSize: 20 }} /> },
    { href: '/admin/categorias', label: 'Categorias', icon: <CategoryIcon style={{ fontSize: 20 }} /> },
    { href: '/admin/pedidos', label: 'Pedidos', icon: <ShoppingBagIcon style={{ fontSize: 20 }} /> },
    { href: '/admin/usuarios', label: 'Usuarios', icon: <GroupsIcon style={{ fontSize: 20 }} /> },
    { href: '/admin/testimonios', label: 'Testimonios', icon: <RateReviewIcon style={{ fontSize: 20 }} /> },
    { href: '/admin/mensajes', label: 'Mensajes', icon: <EmailIcon style={{ fontSize: 20 }} /> },
    { href: '/admin/newsletter', label: 'Newsletter', icon: <MarkEmailUnreadIcon style={{ fontSize: 20 }} /> },
  ];

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      router.push('/login');
    }
  };

  return (
    <aside className="w-64 bg-gray-900 min-h-screen flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-gray-800 flex flex-col items-center overflow-hidden">
        <div style={{ width: '160px', height: '50px', position: 'relative', transform: 'scale(1.8)' }}>
          <Image
            src="/logo.png"
            alt="Shopwise"
            fill
            sizes="160px"
            style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
          />
        </div>
        <p className="text-gray-500 uppercase tracking-widest font-semibold mt-3" style={{ fontSize: '10px' }}>Panel Admin</p>
      </div>

      {/* Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ' + (
              pathname === link.href
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            )}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}

        <div className="pt-4 mt-4 border-t border-gray-800">
          <Link
            href="/explorar"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <StorefrontIcon style={{ fontSize: 20 }} />
            Ver tienda
          </Link>
        </div>
      </nav>

      {/* Usuario */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.nombre?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-sm font-semibold truncate">{user?.nombre || 'Admin'}</p>
            <p className="text-gray-500 text-xs truncate">{user?.email || 'admin@shopwise.com'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogoutIcon style={{ fontSize: 18 }} />
          Cerrar sesion
        </button>
      </div>
    </aside>
  );
}