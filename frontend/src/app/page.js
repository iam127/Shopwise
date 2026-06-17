'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import NavbarPublic from '@/components/NavbarPublic';
import Footer from '@/components/Footer';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function HomePage() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    api.get('/productos').then((res) => setProductos(res.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavbarPublic />

      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/hero-banner.png" alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/70 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 z-10 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-blue-300 text-xs font-semibold px-4 py-2 rounded-full border border-white/20 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Bienvenido a Shopwise
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              Compra de forma<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                inteligente
              </span>
            </h1>
            <p className="text-blue-200 text-lg md:text-xl mb-8 leading-relaxed">
              Descubre miles de productos al mejor precio.<br />
              Entrega rápida, pagos seguros y soporte 24/7.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/register" className="group bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-500 transition-all flex items-center gap-2 shadow-xl shadow-blue-900/50">
                Empezar gratis
                <ArrowForwardIcon style={{ fontSize: 20 }} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/explorar" className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/20">
                Ver productos
              </Link>
            </div>
            <div className="flex items-center gap-8 mt-10">
              {[
                { num: '500+', label: 'Productos' },
                { num: '1K+', label: 'Clientes' },
                { num: '4.9★', label: 'Valoración' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-extrabold text-white">{stat.num}</p>
                  <p className="text-blue-300 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
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

      {/* Productos destacados */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-blue-500 font-semibold text-sm uppercase tracking-widest">Destacados</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Productos populares</h2>
            <p className="text-gray-400 mt-3 max-w-md mx-auto">Los productos más vendidos y mejor valorados</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productos.slice(0, 4).map((producto) => (
              <Link href="/login" key={producto.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 block">
                <div className="relative h-52 bg-gray-50 overflow-hidden">
                  {producto.imagen_url ? (
                    <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
                    {producto.categoria}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{producto.nombre}</h3>
                  <div className="flex items-center gap-1 mb-3">
                    {[1,2,3,4,5].map((s) => <StarIcon key={s} className="text-yellow-400" style={{ fontSize: 14 }} />)}
                    <span className="text-gray-400 text-xs ml-1">(128)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-extrabold text-xl">S/. {producto.precio}</span>
                    <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-medium">Ver más</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/explorar" className="group inline-flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Ver todos los productos
              <ArrowForwardIcon style={{ fontSize: 20 }} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-cyan-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
            Únete ahora
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            Regístrate y obtén<br />
            <span className="text-cyan-300">acceso exclusivo</span>
          </h2>
          <p className="text-blue-200 mb-10 text-lg max-w-xl mx-auto">
            Crea tu cuenta gratis y empieza a comprar con los mejores precios del mercado
          </p>
          <Link href="/register" className="group inline-flex items-center gap-2 bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all text-lg shadow-2xl">
            Crear cuenta gratis
            <ArrowForwardIcon style={{ fontSize: 22 }} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}