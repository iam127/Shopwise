'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  return (
    <footer className="bg-gray-900 text-gray-400">

      {/* Newsletter banner */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white text-xl font-extrabold mb-1">Suscribete a nuestro newsletter</h3>
              <p className="text-gray-400 text-sm">Recibe ofertas exclusivas y novedades directamente en tu correo</p>
            </div>
            {enviado ? (
              <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-5 py-3 rounded-2xl border border-green-500/30">
                <CheckCircleIcon style={{ fontSize: 20 }} />
                <span className="text-sm font-semibold">Gracias por suscribirte!</span>
              </div>
            ) : (
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-1 md:w-64 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  onClick={() => { if (email) setEnviado(true); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  Suscribirme
                  <ArrowForwardIcon style={{ fontSize: 16 }} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">

          {/* Logo y descripcion */}
          <div className="md:col-span-4">
            <Image
              src="/logo.png"
              alt="Shopwise"
              width={160}
              height={45}
              style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: '-12px' }}
            />
            <p className="mt-4 text-sm leading-relaxed text-gray-400 max-w-xs">
              Tu tienda inteligente. Encuentra los mejores productos al mejor precio con entrega rapida y segura.
            </p>
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

          {/* Navegacion publica */}
          <div className="md:col-span-2">
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Explorar</h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/categorias', label: 'Categorias' },
                { href: '/explorar', label: 'Productos' },
                { href: '/nosotros', label: 'Nosotros' },
                { href: '/contacto', label: 'Contacto' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-2 transition-all"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navegacion privada */}
          <div className="md:col-span-2">
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Mi cuenta</h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/login', label: 'Iniciar sesion' },
                { href: '/register', label: 'Registrarse' },
                { href: '/carrito', label: 'Carrito' },
                { href: '/pedidos', label: 'Mis pedidos' },
                { href: '/favoritos', label: 'Favoritos' },
                { href: '/perfil', label: 'Mi perfil' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-2 transition-all"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="md:col-span-4">
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Contacto</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <EmailIcon style={{ fontSize: 16 }} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Email</p>
                  <p className="text-gray-300 hover:text-white transition-colors text-xs">matias.galvan@tecsup.edu.pe</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <PhoneIcon style={{ fontSize: 16 }} className="text-green-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Telefono</p>
                  <p className="text-gray-300 hover:text-white transition-colors">+51 949 510 535</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <LocationOnIcon style={{ fontSize: 16 }} className="text-red-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Ubicacion</p>
                  <p className="text-gray-300">Lima, Peru - Tecsup</p>
                </div>
              </li>
              <li>
                <span className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 text-xs px-3 py-1.5 rounded-full border border-green-500/30">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Soporte en linea
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
                {['VISA', 'MC', 'AMEX', 'PayPal'].map((pago) => (
                  <span key={pago} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded font-mono hover:bg-gray-600 transition-colors">
                    {pago}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 text-xs text-gray-500">
                <span className="hover:text-white cursor-pointer transition-colors">Terminos</span>
                <span className="hover:text-white cursor-pointer transition-colors">Privacidad</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}