import NavbarPublic from '@/components/NavbarPublic';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GroupsIcon from '@mui/icons-material/Groups';

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavbarPublic />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-blue-300 font-semibold text-sm uppercase tracking-widest">Quiénes somos</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-2 mb-4">Sobre Shopwise</h1>
          <p className="text-blue-200 max-w-2xl mx-auto text-lg">
            Somos una plataforma de e-commerce peruana comprometida en ofrecerte la mejor experiencia de compra online
          </p>
        </div>
      </div>

      {/* Misión */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-blue-500 font-semibold text-sm uppercase tracking-widest">Nuestra misión</span>
              <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-6">
                Hacer las compras más inteligentes
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4 text-lg">
                Shopwise nació con la misión de hacer que las compras en línea sean más inteligentes, rápidas y seguras para todos los peruanos.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                Somos un equipo apasionado por la tecnología y el comercio electrónico, comprometidos en ofrecerte la mejor experiencia de compra con productos de calidad a precios justos.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  'Productos verificados y de calidad garantizada',
                  'Pagos seguros con múltiples métodos',
                  'Soporte al cliente disponible 24/7',
                  'Entregas rápidas a todo el Perú',
                  'Precios competitivos y ofertas exclusivas',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircleIcon className="text-blue-500 flex-shrink-0" style={{ fontSize: 20 }} />
                    <p className="text-gray-600 text-sm">{item}</p>
                  </div>
                ))}
              </div>
              <Link href="/register" className="group inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                Únete a Shopwise
                <ArrowForwardIcon style={{ fontSize: 20 }} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-12 flex items-center justify-center h-96">
                <Image src="/logo.png" alt="Shopwise" width={280} height={90} style={{ objectFit: 'contain' }} />
              </div>
              <div className="absolute -top-4 -right-4 bg-blue-600 text-white rounded-2xl p-4 shadow-xl">
                <p className="text-2xl font-extrabold">98%</p>
                <p className="text-blue-200 text-xs">Satisfacción</p>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                <p className="text-2xl font-extrabold text-gray-800">24/7</p>
                <p className="text-gray-400 text-xs">Soporte</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: '500+', label: 'Productos', color: 'text-blue-600 bg-blue-50' },
              { num: '1K+', label: 'Clientes felices', color: 'text-green-600 bg-green-50' },
              { num: '4.9★', label: 'Valoración promedio', color: 'text-yellow-600 bg-yellow-50' },
              { num: '98%', label: 'Satisfacción', color: 'text-purple-600 bg-purple-50' },
            ].map((stat) => (
              <div key={stat.label} className={`${stat.color} rounded-2xl p-6 text-center`}>
                <p className="text-4xl font-extrabold mb-1">{stat.num}</p>
                <p className="text-sm opacity-70 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-blue-500 font-semibold text-sm uppercase tracking-widest">Lo que nos mueve</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Nuestros valores</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <EmojiObjectsIcon style={{ fontSize: 32 }} />, color: 'text-yellow-500 bg-yellow-50', title: 'Innovación', desc: 'Siempre buscamos nuevas formas de mejorar tu experiencia de compra con tecnología de vanguardia.' },
              { icon: <FavoriteIcon style={{ fontSize: 32 }} />, color: 'text-red-500 bg-red-50', title: 'Pasión', desc: 'Amamos lo que hacemos y eso se refleja en cada detalle de nuestra plataforma y servicio al cliente.' },
              { icon: <GroupsIcon style={{ fontSize: 32 }} />, color: 'text-blue-500 bg-blue-50', title: 'Comunidad', desc: 'Construimos una comunidad de compradores y vendedores conectados por la confianza y el respeto mutuo.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-extrabold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-blue-500 font-semibold text-sm uppercase tracking-widest">Beneficios</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">¿Por qué elegirnos?</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <LocalShippingIcon style={{ fontSize: 28 }} />, color: 'text-blue-500 bg-blue-50', title: 'Envío rápido', desc: 'Entrega en 24-48h' },
              { icon: <VerifiedIcon style={{ fontSize: 28 }} />, color: 'text-green-500 bg-green-50', title: 'Compra segura', desc: 'Pago 100% protegido' },
              { icon: <SupportAgentIcon style={{ fontSize: 28 }} />, color: 'text-purple-500 bg-purple-50', title: 'Soporte 24/7', desc: 'Siempre disponibles' },
              { icon: <WorkspacePremiumIcon style={{ fontSize: 28 }} />, color: 'text-orange-500 bg-orange-50', title: 'Garantía', desc: '30 días de garantía' },
            ].map((item) => (
              <div key={item.title} className="group bg-white rounded-2xl p-6 text-center border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <p className="font-bold text-gray-800 mb-1">{item.title}</p>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900" />
        <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            ¿Listo para comprar inteligente?
          </h2>
          <p className="text-blue-200 mb-10 text-lg">Únete a miles de clientes satisfechos en Shopwise</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register" className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-2xl">
              Crear cuenta gratis
            </Link>
            <Link href="/explorar" className="bg-white/10 text-white px-10 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/20">
              Ver productos
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}