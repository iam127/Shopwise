'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import NavbarPublic from '@/components/NavbarPublic';
import Footer from '@/components/Footer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import LaptopIcon from '@mui/icons-material/Laptop';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categoriaDetalle, setCategoriaDetalle] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/categorias'),
      api.get('/productos'),
    ]).then(([catRes, prodRes]) => {
      setCategorias(catRes.data);
      setProductos(prodRes.data);
    }).catch(() => {});
  }, []);

  const categoriaConfig = [
    {
      imagen: '/hero-electronica.png',
      hero: '/banner-electronica.png',
      icono: <LaptopIcon style={{ fontSize: 40 }} />,
      color: 'from-blue-600 to-blue-900',
      colorLight: 'bg-blue-50 text-blue-600',
      badge: 'Mas vendido',
      badgeColor: 'bg-blue-500',
      descripcion: 'Descubre la ultima tecnologia en dispositivos electronicos. Desde laptops y smartphones hasta audifonos y accesorios gaming.',
      features: ['Garantia de 1 ano', 'Soporte tecnico', 'Envio express', 'Productos originales'],
      tags: ['Gaming', 'Smartphone', 'Audio', 'Computacion', 'Accesorios'],
    },
    {
      imagen: '/hero-ropa.png',
      hero: '/banner-ropa.png',
      icono: <CheckroomIcon style={{ fontSize: 40 }} />,
      color: 'from-purple-600 to-purple-900',
      colorLight: 'bg-purple-50 text-purple-600',
      badge: 'Nueva coleccion',
      badgeColor: 'bg-purple-500',
      descripcion: 'Explora nuestra coleccion de moda con las ultimas tendencias. Ropa casual, deportiva y formal para todos los estilos.',
      features: ['Tallas S al XXL', 'Materiales premium', 'Devolucion gratis', 'Envio en 24h'],
      tags: ['Casual', 'Sport', 'Formal', 'Sneakers', 'Accesorios'],
    },
    {
      imagen: '/hero-hogar.png',
      hero: '/banner-hogar.png',
      icono: <HomeIcon style={{ fontSize: 40 }} />,
      color: 'from-orange-500 to-orange-800',
      colorLight: 'bg-orange-50 text-orange-600',
      badge: 'Tendencia',
      badgeColor: 'bg-orange-500',
      descripcion: 'Transforma tu hogar con nuestra seleccion de decoracion y mobiliario. Productos modernos y funcionales para cada espacio.',
      features: ['Diseno moderno', 'Alta durabilidad', 'Facil instalacion', 'Garantia extendida'],
      tags: ['Decoracion', 'Iluminacion', 'Textiles', 'Muebles', 'Jardineria'],
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavbarPublic />

      {/* Hero editorial */}
      <div className="relative bg-gray-900 py-24 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/bg-categorias.png" alt="fondo" className="w-full h-full object-cover opacity-40" />
        </div>
        <div className="relative max-w-7xl mx-auto z-10">
          <div className="max-w-2xl">
            <span className="inline-block bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
              Colecciones 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              Encuentra tu
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> estilo</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Explora nuestras colecciones curadas en Electronica, Moda y Hogar. Cada categoria, una experiencia unica.
            </p>
            <div className="flex gap-4">
              <Link href="/explorar" className="group bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2">
                Explorar todo
                <ArrowForwardIcon style={{ fontSize: 20 }} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all">
                Unirse gratis
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categorías estilo editorial - como Nike */}
      <section className="py-4 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          {categorias.map((c, i) => {
            const config = categoriaConfig[i % 3];
            const productosCategoria = productos.filter((p) => p.categoria_id === c.id);
            const precioMin = productosCategoria.length > 0 ? Math.min(...productosCategoria.map((p) => parseFloat(p.precio))) : 0;
            const precioMax = productosCategoria.length > 0 ? Math.max(...productosCategoria.map((p) => parseFloat(p.precio))) : 0;
            const isDetalle = categoriaDetalle === c.id;

            return (
              <div key={c.id} className="mb-4">
                {/* Card principal editorial */}
                <div className={`relative overflow-hidden rounded-3xl cursor-pointer group ${i % 2 === 0 ? '' : ''}`}
                  style={{ height: '500px' }}
                  onClick={() => setCategoriaDetalle(isDetalle ? null : c.id)}
                >
                  {/* Imagen de fondo */}
                  <img
                    src={config.imagen}
                    alt={c.nombre}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay gradiente */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${i % 2 === 0 ? config.color + '/80 via-transparent' : 'via-transparent ' + config.color + '/80'} opacity-90`} />

                  {/* Contenido */}
                  <div className={`absolute inset-0 flex items-center ${i % 2 === 0 ? 'justify-start' : 'justify-end'} p-12`}>
                    <div className={`max-w-sm ${i % 2 !== 0 ? 'text-right' : ''}`}>
                      <div className={`inline-flex items-center gap-2 ${config.badgeColor} text-white text-xs font-bold px-4 py-2 rounded-full mb-4`}>
                        {config.badge}
                      </div>
                      <div className="text-white/80 mb-3">
                        {config.icono}
                      </div>
                      <h2 className="text-5xl font-extrabold text-white mb-3">{c.nombre}</h2>
                      <p className="text-white/80 text-sm leading-relaxed mb-4">{config.descripcion}</p>
                      <p className="text-white/60 text-xs mb-6">{productosCategoria.length} productos · Desde S/. {precioMin.toFixed(2)}</p>

                      {/* Tags */}
                      <div className={`flex flex-wrap gap-2 mb-6 ${i % 2 !== 0 ? 'justify-end' : ''}`}>
                        {config.tags.map((tag) => (
                          <span key={tag} className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/30">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <button className="group/btn bg-white text-gray-900 px-8 py-3 rounded-2xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-xl">
                        {isDetalle ? 'Cerrar' : 'Explorar coleccion'}
                        {isDetalle
                          ? <CloseIcon style={{ fontSize: 18 }} />
                          : <ArrowForwardIcon style={{ fontSize: 18 }} className="group-hover/btn:translate-x-1 transition-transform" />
                        }
                      </button>
                    </div>
                  </div>

                  {/* Numero de categoria decorativo */}
                  <div className="absolute bottom-6 right-6 text-white/10 font-extrabold" style={{ fontSize: '120px', lineHeight: 1 }}>
                    0{i + 1}
                  </div>
                </div>

                {/* Panel de detalle expandible */}
                {isDetalle && (
                  <div className="bg-gray-50 rounded-3xl mt-4 p-8 border border-gray-100 animate-pulse-once">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                      {/* Info de la categoría */}
                      <div className="lg:col-span-1">
                        <div className={`w-16 h-16 ${config.colorLight} rounded-2xl flex items-center justify-center mb-4`}>
                          {config.icono}
                        </div>
                        <h3 className="text-2xl font-extrabold text-gray-800 mb-3">{c.nombre}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">{config.descripcion}</p>

                        {/* Features */}
                        <div className="space-y-2 mb-6">
                          {config.features.map((f) => (
                            <div key={f} className="flex items-center gap-2">
                              <VerifiedIcon className="text-green-500" style={{ fontSize: 16 }} />
                              <span className="text-gray-600 text-sm">{f}</span>
                            </div>
                          ))}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white rounded-2xl p-4 text-center border border-gray-100">
                            <p className="text-2xl font-extrabold text-blue-600">{productosCategoria.length}</p>
                            <p className="text-gray-400 text-xs">Productos</p>
                          </div>
                          <div className="bg-white rounded-2xl p-4 text-center border border-gray-100">
                            <p className="text-2xl font-extrabold text-green-600">S/. {precioMin.toFixed(0)}</p>
                            <p className="text-gray-400 text-xs">Desde</p>
                          </div>
                        </div>
                      </div>

                      {/* Productos destacados */}
                      <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-extrabold text-gray-800 text-lg">Productos destacados</h4>
                          <Link href="/login" className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1">
                            Ver todos <ArrowForwardIcon style={{ fontSize: 14 }} />
                          </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {productosCategoria.slice(0, 3).map((producto) => (
                            <Link href="/login" key={producto.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all block">
                              <div className="relative h-36 overflow-hidden">
                                {producto.imagen_url ? (
                                  <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-3xl">paquete</div>
                                )}
                              </div>
                              <div className="p-3">
                                <h5 className="font-bold text-gray-800 text-sm line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">{producto.nombre}</h5>
                                <div className="flex items-center gap-1 mb-1">
                                  {[1,2,3,4,5].map((s) => <StarIcon key={s} className="text-yellow-400" style={{ fontSize: 10 }} />)}
                                </div>
                                <p className="text-blue-600 font-extrabold text-sm">S/. {producto.precio}</p>
                              </div>
                            </Link>
                          ))}
                        </div>

                        {/* CTA */}
                        <div className="mt-6 flex gap-3">
                          <Link href="/login" className={`flex-1 bg-gradient-to-r ${config.color} text-white py-3 rounded-2xl font-bold text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}>
                            Ver toda la coleccion
                            <ArrowForwardIcon style={{ fontSize: 18 }} />
                          </Link>
                          <Link href="/register" className="border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-2xl font-bold hover:border-blue-400 hover:text-blue-600 transition-all">
                            Registrarse
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-500 font-semibold text-sm uppercase tracking-widest">Por que elegirnos</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">La mejor experiencia de compra</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <LocalShippingIcon style={{ fontSize: 32 }} />, color: 'text-blue-500 bg-blue-50', title: 'Envio rapido', desc: 'Recibe tu pedido en 24-48 horas con seguimiento en tiempo real.' },
              { icon: <VerifiedIcon style={{ fontSize: 32 }} />, color: 'text-green-500 bg-green-50', title: 'Compra 100% segura', desc: 'Tus datos y pagos estan protegidos con tecnologia de encriptacion avanzada.' },
              { icon: <WorkspacePremiumIcon style={{ fontSize: 32 }} />, color: 'text-orange-500 bg-orange-50', title: 'Garantia total', desc: '30 dias de garantia en todos los productos. Sin preguntas, sin complicaciones.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className={'w-16 h-16 ' + item.color + ' rounded-2xl flex items-center justify-center mb-6'}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-extrabold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-cyan-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Lista para empezar a comprar?
          </h2>
          <p className="text-blue-200 mb-10 text-lg">Crea tu cuenta gratis y accede a todas nuestras colecciones</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register" className="group bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-2xl inline-flex items-center gap-2">
              Crear cuenta gratis
              <ArrowForwardIcon style={{ fontSize: 20 }} className="group-hover:translate-x-1 transition-transform" />
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