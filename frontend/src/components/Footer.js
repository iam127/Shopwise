import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo y descripción */}
          <div className="md:col-span-2">
            <Image src="/logo.png" alt="Shopwise" width={130} height={32} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            <p className="mt-4 text-sm leading-relaxed">
              Tu tienda inteligente. Encuentra los mejores productos al mejor precio con entrega rápida y segura.
            </p>
            {/* Redes sociales */}
            <div className="flex gap-3 mt-4">
              {['Facebook', 'Instagram', 'Twitter', 'TikTok'].map((red) => (
                <div key={red} className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer text-xs font-bold text-white">
                  {red.charAt(0)}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navegación</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/productos" className="hover:text-white transition-colors">Productos</Link></li>
              <li><Link href="/carrito" className="hover:text-white transition-colors">Carrito</Link></li>
              <li><Link href="/pedidos" className="hover:text-white transition-colors">Mis pedidos</Link></li>
              <li><Link href="/favoritos" className="hover:text-white transition-colors">Favoritos</Link></li>
              <li><Link href="/perfil" className="hover:text-white transition-colors">Mi perfil</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>📧 contacto@shopwise.com</li>
              <li>📞 +51 999 999 999</li>
              <li>📍 Lima, Perú</li>
              <li className="mt-4">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  ● Soporte en línea
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 Shopwise. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Términos y condiciones</span>
            <span className="hover:text-white cursor-pointer transition-colors">Política de privacidad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}