import Link from 'next/link';
import Image from 'next/image';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import CreditCardIcon from '@mui/icons-material/CreditCard';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Logo y descripción */}
          <div className="md:col-span-2">
            <Image
            src="/logo.png"
            alt="Shopwise"
            width={180}
            height={50}
            style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: '-16px' }}
            />
            <p className="mt-4 text-sm leading-relaxed max-w-xs">
              Tu tienda inteligente. Encuentra los mejores productos al mejor precio con entrega rápida y segura.
            </p>
            {/* Redes sociales */}
            <div className="flex gap-3 mt-6">
              <button className="w-9 h-9 bg-gray-700 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors text-white">
                <FacebookIcon style={{ fontSize: 18 }} />
              </button>
              <button className="w-9 h-9 bg-gray-700 rounded-xl flex items-center justify-center hover:bg-pink-600 transition-colors text-white">
                <InstagramIcon style={{ fontSize: 18 }} />
              </button>
              <button className="w-9 h-9 bg-gray-700 rounded-xl flex items-center justify-center hover:bg-sky-500 transition-colors text-white">
                <TwitterIcon style={{ fontSize: 18 }} />
              </button>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Navegación</h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/carrito', label: 'Carrito', icon: <ShoppingCartIcon style={{ fontSize: 16 }} /> },
                { href: '/pedidos', label: 'Mis pedidos', icon: <ListAltIcon style={{ fontSize: 16 }} /> },
                { href: '/favoritos', label: 'Favoritos', icon: <FavoriteIcon style={{ fontSize: 16 }} /> },
                { href: '/perfil', label: 'Mi perfil', icon: <PersonIcon style={{ fontSize: 16 }} /> },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="text-blue-500 group-hover:text-blue-400">{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Contacto</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <EmailIcon style={{ fontSize: 16 }} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Email</p>
                  <p className="text-gray-300 hover:text-white transition-colors">matias.galvan@tecsup.edu.pe</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <PhoneIcon style={{ fontSize: 16 }} className="text-green-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Teléfono</p>
                  <p className="text-gray-300 hover:text-white transition-colors">+51 949 510 535</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <LocationOnIcon style={{ fontSize: 16 }} className="text-red-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Ubicación</p>
                  <p className="text-gray-300">Lima, Perú</p>
                </div>
              </li>
              <li className="mt-2">
                <span className="inline-flex items-center gap-2 bg-green-500 bg-opacity-20 text-green-400 text-xs px-3 py-1.5 rounded-full border border-green-500 border-opacity-30">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Soporte en línea
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">© 2026 Shopwise. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <div className="flex gap-2 items-center">
                <CreditCardIcon style={{ fontSize: 16 }} className="text-gray-500" />
                {['VISA', 'MC', 'AMEX', 'PayPal'].map((pago) => (
                  <span key={pago} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded font-mono">
                    {pago}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 text-xs text-gray-500">
                <span className="hover:text-white cursor-pointer transition-colors">Términos</span>
                <span className="hover:text-white cursor-pointer transition-colors">Privacidad</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}