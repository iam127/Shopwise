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
import ChatIcon from '@mui/icons-material/Chat';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RatingStars from '@/components/RatingStars';

export default function HomePage() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [statsPublicas, setStatsPublicas] = useState({ totalProductos: 0, totalClientes: 0, ratingPromedio: 0, totalRatings: 0 });
  const [testimonios, setTestimonios] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [tiempo, setTiempo] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
  const [email, setEmail] = useState('');
  const [newsletterEnviado, setNewsletterEnviado] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [anuncioVisible, setAnuncioVisible] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  const heroSlides = [
    {
      imagen: '/hero-banner.png',
      badge: 'Bienvenido a Shopwise',
      titulo: 'Compra de forma',
      tituloDestacado: 'inteligente',
      descripcion: 'Descubre miles de productos al mejor precio. Entrega rapida, pagos seguros y soporte 24/7.',
      botonPrimario: 'Empezar gratis',
      linkPrimario: '/register',
      botonSecundario: 'Ver productos',
      linkSecundario: '/explorar',
    },
    {
      imagen: '/hero-banner-2.png',
      badge: 'Tecnologia de punta',
      titulo: 'Los mejores',
      tituloDestacado: 'gadgets',
      descripcion: 'Laptops, smartphones, audifonos y mas. La tecnologia que necesitas al mejor precio del mercado.',
      botonPrimario: 'Ver electronica',
      linkPrimario: '/categorias',
      botonSecundario: 'Explorar todo',
      linkSecundario: '/explorar',
    },
    {
      imagen: '/hero-banner-3.png',
      badge: 'Nueva coleccion',
      titulo: 'Moda y estilo',
      tituloDestacado: 'para ti',
      descripcion: 'Descubre las ultimas tendencias en ropa y accesorios. Estilo y calidad en cada prenda.',
      botonPrimario: 'Ver moda',
      linkPrimario: '/categorias',
      botonSecundario: 'Explorar todo',
      linkSecundario: '/explorar',
    },
    {
      imagen: '/hero-banner-4.png',
      badge: 'Para tu hogar',
      titulo: 'Transforma tu',
      tituloDestacado: 'espacio',
      descripcion: 'Decoracion, muebles y mas. Todo lo que necesitas para hacer de tu hogar un lugar especial.',
      botonPrimario: 'Ver hogar',
      linkPrimario: '/categorias',
      botonSecundario: 'Explorar todo',
      linkSecundario: '/explorar',
    },
    {
      imagen: '/hero-banner-5.png',
      badge: 'Oferta especial',
      titulo: 'Descuentos por',
      tituloDestacado: 'tiempo limitado',
      descripcion: 'Aprovecha nuestras ofertas exclusivas. Los mejores precios solo por tiempo limitado.',
      botonPrimario: 'Ver ofertas',
      linkPrimario: '/explorar',
      botonSecundario: 'Registrarme',
      linkSecundario: '/register',
    },
    {
      imagen: '/hero-banner-6.png',
      badge: 'Envio garantizado',
      titulo: 'Entrega rapida y',
      tituloDestacado: 'segura',
      descripcion: 'Recibe tus productos en 24-48 horas con seguimiento en tiempo real a todo el Peru.',
      botonPrimario: 'Empezar ahora',
      linkPrimario: '/register',
      botonSecundario: 'Ver productos',
      linkSecundario: '/explorar',
    },
  ];

  useEffect(() => {
    api.get('/productos').then((res) => setProductos(res.data)).catch(() => {});
    api.get('/categorias').then((res) => setCategorias(res.data)).catch(() => {});
    api.get('/stats-publicas').then((res) => setStatsPublicas(res.data)).catch(() => {});
    api.get('/testimonios').then((res) => setTestimonios(res.data)).catch(() => {});
    api.get('/productos/ofertas').then((res) => setOfertas(res.data)).catch(() => {});
  }, []);

  // Carrusel del hero - rota cada 6 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Contador real basado en la oferta con fecha de fin mas proxima
  useEffect(() => {
    if (ofertas.length === 0) return;

    const ofertasConFecha = ofertas.filter((o) => o.oferta_fin);
    if (ofertasConFecha.length === 0) return;

    const proximaFin = ofertasConFecha.reduce((min, o) => {
      const fin = new Date(o.oferta_fin).getTime();
      return fin < min ? fin : min;
    }, new Date(ofertasConFecha[0].oferta_fin).getTime());

    const actualizar = () => {
      const restante = proximaFin - Date.now();
      if (restante <= 0) {
        setTiempo({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
        return;
      }
      const dias = Math.floor(restante / (1000 * 60 * 60 * 24));
      const horas = Math.floor((restante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((restante % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((restante % (1000 * 60)) / 1000);
      setTiempo({ dias, horas, minutos, segundos });
    };

    actualizar();
    const timer = setInterval(actualizar, 1000);
    return () => clearInterval(timer);
  }, [ofertas]);

  const handleNewsletter = async () => {
    if (!email) return;
    setNewsletterLoading(true);
    try {
      await api.post('/newsletter', { email });
      setNewsletterEnviado(true);
      setEmail('');
    } catch (error) {
      if (error.response?.data?.message === 'Este email ya esta suscrito') {
        setNewsletterEnviado(true);
      }
    } finally {
      setNewsletterLoading(false);
    }
  };

  const pad = (n) => String(n).padStart(2, '0');

  const categoriaConfig = [
    { imagen: '/banner-electronica.png', bg: 'from-blue-600 to-blue-800', emoji: '💻', desc: 'Los mejores gadgets' },
    { imagen: '/banner-ropa.png', bg: 'from-purple-600 to-purple-800', emoji: '👗', desc: 'Moda y estilo' },
    { imagen: '/banner-hogar.png', bg: 'from-orange-500 to-orange-700', emoji: '🏠', desc: 'Todo para tu hogar' },
  ];

  const pagos = [
    { nombre: 'VISA', img: '/visa.png' },
    { nombre: 'Mastercard', img: '/mastercard.jpg' },
    { nombre: 'AMEX', img: '/amex.png' },
    { nombre: 'PayPal', img: '/paypal.png' },
  ];

  const slideActual = heroSlides[heroIndex];

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Barra de anuncio */}
      {anuncioVisible && (
        <div className="bg-blue-600 text-white text-xs font-semibold py-2 px-6 flex items-center justify-center gap-3 relative">
          <span>Envio gratis en compras mayores a S/. 100 — Oferta por tiempo limitado!</span>
          <Link href="/register" className="underline hover:text-blue-200 transition-colors">
            Registrate gratis
          </Link>
          <button onClick={() => setAnuncioVisible(false)} className="absolute right-4 text-white/70 hover:text-white transition-colors">
            <CloseIcon style={{ fontSize: 16 }} />
          </button>
        </div>
      )}

      <NavbarPublic />

      {/* Hero con carrusel dinamico */}
      <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        {/* Imagenes de fondo */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, i) => (
            <img
              key={slide.imagen}
              src={slide.imagen}
              alt="Hero"
              className={'absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ' + (i === heroIndex ? 'opacity-100' : 'opacity-0')}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/70 to-transparent" />
        </div>

        {/* Contenido dinamico */}
        <div className="relative max-w-7xl mx-auto px-6 z-10 w-full">
          <div key={heroIndex} className="max-w-2xl animate-[fadeIn_0.8s_ease-in-out]">
            <span className="text-blue-300 font-semibold text-sm uppercase tracking-widest mb-6 block">
              {slideActual.badge}
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              {slideActual.titulo}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                {slideActual.tituloDestacado}
              </span>
            </h1>
            <p className="text-blue-200 text-lg md:text-xl mb-8 leading-relaxed">
              {slideActual.descripcion}
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href={slideActual.linkPrimario} className="group bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-500 transition-all flex items-center gap-2 shadow-xl shadow-blue-900/50">
                {slideActual.botonPrimario}
                <ArrowForwardIcon style={{ fontSize: 20 }} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href={slideActual.linkSecundario} className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/20">
                {slideActual.botonSecundario}
              </Link>
            </div>
            <div className="flex items-center gap-8 mt-10">
              {[
                { num: statsPublicas.totalProductos + '+', label: 'Productos' },
                { num: statsPublicas.totalClientes + '+', label: 'Clientes' },
                { num: statsPublicas.totalRatings > 0 ? statsPublicas.ratingPromedio : 'N/A', label: 'Valoracion' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-extrabold text-white">{stat.num}</p>
                  <p className="text-blue-300 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Indicadores del carrusel */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className={'h-1.5 rounded-full transition-all duration-300 ' + (i === heroIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60')}
              aria-label={'Ir a slide ' + (i + 1)}
            />
          ))}
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <LocalShippingIcon style={{ fontSize: 28 }} />, color: 'text-blue-500 bg-blue-50', title: 'Envio rapido', desc: 'Entrega en 24-48h' },
              { icon: <VerifiedIcon style={{ fontSize: 28 }} />, color: 'text-green-500 bg-green-50', title: 'Compra segura', desc: 'Pago 100% protegido' },
              { icon: <SupportAgentIcon style={{ fontSize: 28 }} />, color: 'text-purple-500 bg-purple-50', title: 'Soporte 24/7', desc: 'Siempre disponibles' },
              { icon: <WorkspacePremiumIcon style={{ fontSize: 28 }} />, color: 'text-orange-500 bg-orange-50', title: 'Garantia', desc: '30 dias de garantia' },
            ].map((item) => (
              <div key={item.title} className="group bg-white rounded-2xl p-6 text-center border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className={'w-14 h-14 ' + item.color + ' rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform'}>
                  {item.icon}
                </div>
                <p className="font-bold text-gray-800 mb-1">{item.title}</p>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ofertas reales - solo se muestra si hay productos en oferta */}
      {ofertas.length > 0 && (
        <section className="py-10 bg-gradient-to-r from-orange-500 to-red-500">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
              <div>
                <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-1">Oferta especial</p>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                  Hasta {Math.max(...ofertas.map((o) => o.descuento))}% de descuento!
                </h3>
              </div>
              {(tiempo.dias > 0 || tiempo.horas > 0 || tiempo.minutos > 0 || tiempo.segundos > 0) && (
                <div className="flex items-center gap-3">
                  {[
                    { val: tiempo.dias, label: 'Dias', mostrar: tiempo.dias > 0 },
                    { val: pad(tiempo.horas), label: 'Horas', mostrar: true },
                    { val: pad(tiempo.minutos), label: 'Minutos', mostrar: true },
                    { val: pad(tiempo.segundos), label: 'Segundos', mostrar: true },
                  ].filter((item) => item.mostrar).map((item, i, arr) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 text-center border border-white/30 min-w-[70px]">
                        <p className="text-3xl font-extrabold text-white">{item.val}</p>
                        <p className="text-white/70 text-xs">{item.label}</p>
                      </div>
                      {i < arr.length - 1 && <span className="text-white text-2xl font-extrabold">:</span>}
                    </div>
                  ))}
                </div>
              )}
              <Link href="/explorar" className="bg-white text-orange-500 px-8 py-3 rounded-2xl font-bold hover:bg-orange-50 transition-colors whitespace-nowrap shadow-xl flex items-center gap-2">
                Ver ofertas
                <ArrowForwardIcon style={{ fontSize: 18 }} />
              </Link>
            </div>

            {/* Productos en oferta */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {ofertas.slice(0, 4).map((producto) => (
                <Link href="/login" key={producto.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 block">
                  <div className="relative h-32 bg-gray-50 overflow-hidden">
                    {producto.imagen_url ? (
                      <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                    )}
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{producto.descuento}%
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-gray-800 text-xs line-clamp-1 mb-1">{producto.nombre}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs line-through">S/. {producto.precio}</span>
                      <span className="text-red-600 font-extrabold text-sm">S/. {producto.precio_oferta}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categorias preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-500 font-semibold text-sm uppercase tracking-widest">Explora</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Nuestras categorias</h2>
            <p className="text-gray-400 mt-3">Encuentra lo que buscas en nuestra variedad de categorias</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categorias.map((c, i) => {
              const config = categoriaConfig[i % 3];
              const count = productos.filter((p) => p.categoria_id === c.id).length;
              return (
                <Link href="/categorias" key={c.id} className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="relative h-64 overflow-hidden">
                    <img src={config.imagen} alt={c.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className={'absolute inset-0 bg-gradient-to-t ' + config.bg + ' opacity-80'} />
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
                      {count} productos
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="text-4xl mb-2 block">{config.emoji}</span>
                      <h3 className="text-2xl font-extrabold text-white mb-1">{c.nombre}</h3>
                      <p className="text-white/70 text-sm flex items-center gap-1">
                        {config.desc}
                        <ArrowForwardIcon style={{ fontSize: 16 }} className="group-hover:translate-x-1 transition-transform" />
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Link href="/categorias" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline">
              Ver todas las categorias
              <ArrowForwardIcon style={{ fontSize: 18 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-blue-500 font-semibold text-sm uppercase tracking-widest">Destacados</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Productos populares</h2>
            <p className="text-gray-400 mt-3 max-w-md mx-auto">Los productos mas vendidos y mejor valorados</p>
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
                  {producto.precio_oferta && (
                    <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{producto.descuento}%
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{producto.nombre}</h3>
                  <div className="mb-3">
                    <RatingStars rating={producto.rating_promedio} total={producto.rating_total} size={14} />
                  </div>
                  <div className="flex items-center justify-between">
                    {producto.precio_oferta ? (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm line-through">S/. {producto.precio}</span>
                        <span className="text-red-600 font-extrabold text-xl">S/. {producto.precio_oferta}</span>
                      </div>
                    ) : (
                      <span className="text-blue-600 font-extrabold text-xl">S/. {producto.precio}</span>
                    )}
                    <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-medium">Ver mas</span>
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

      {/* Testimonios reales */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/bg-testimonios.png" alt="fondo" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-blue-900/85" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 z-10">
          <div className="text-center mb-12">
            <span className="text-blue-300 font-semibold text-sm uppercase tracking-widest">Opiniones</span>
            <h2 className="text-4xl font-extrabold text-white mt-2">Lo que dicen nuestros clientes</h2>
            <p className="text-blue-200 mt-3">Opiniones reales de clientes verificados de Shopwise</p>
          </div>
          {testimonios.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-white/70 text-lg">Aun no hay opiniones publicadas</p>
              <p className="text-blue-300 text-sm mt-2">Se el primero en compartir tu experiencia con Shopwise</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonios.map((t) => (
                <div key={t.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                  <div className="flex items-center gap-1 mb-4">
                    {[1,2,3,4,5].map((s) => (
                      <StarIcon key={s} className={s <= t.rating ? 'text-yellow-400' : 'text-white/20'} style={{ fontSize: 16 }} />
                    ))}
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed mb-6">"{t.texto}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {t.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{t.nombre}</p>
                      <p className="text-blue-300 text-xs">Cliente verificado</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Banner CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-cyan-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
            Unete ahora
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            Registrate y obten<br />
            <span className="text-cyan-300">acceso exclusivo</span>
          </h2>
          <p className="text-blue-200 mb-10 text-lg max-w-xl mx-auto">
            Crea tu cuenta gratis y empieza a comprar con los mejores precios del mercado
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register" className="group inline-flex items-center gap-2 bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all text-lg shadow-2xl">
              Crear cuenta gratis
              <ArrowForwardIcon style={{ fontSize: 22 }} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/explorar" className="inline-flex items-center gap-2 bg-white/10 text-white px-10 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/20">
              Ver productos
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/bg-newsletter.png" alt="newsletter" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-blue-900/80" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center z-10">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <EmailOutlinedIcon className="text-white" style={{ fontSize: 32 }} />
          </div>
          <span className="text-blue-300 font-semibold text-sm uppercase tracking-widest">Newsletter</span>
          <h2 className="text-3xl font-extrabold text-white mt-2 mb-3">Recibe ofertas exclusivas</h2>
          <p className="text-blue-200 mb-8">Suscribete y recibe las mejores ofertas directamente en tu correo</p>
          {newsletterEnviado ? (
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20 flex flex-col items-center">
              <CheckCircleIcon className="text-green-400 mb-2" style={{ fontSize: 40 }} />
              <p className="text-white font-bold text-lg">Gracias por suscribirte!</p>
              <p className="text-blue-200 text-sm mt-1">Pronto recibiras nuestras mejores ofertas</p>
            </div>
          ) : (
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNewsletter()}
              />
              <button
                onClick={handleNewsletter}
                disabled={newsletterLoading}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 disabled:bg-blue-100 transition-colors whitespace-nowrap"
              >
                {newsletterLoading ? 'Enviando...' : 'Suscribirme'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Metodos de pago */}
      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center gap-6">
            <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest">Metodos de pago aceptados</p>
            <div className="flex items-center gap-6 flex-wrap justify-center">
              {pagos.map((pago) => (
                <div key={pago.nombre} className="bg-white border border-gray-200 rounded-2xl px-8 py-5 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow h-20 w-36">
                  <img
                    src={pago.img}
                    alt={pago.nombre}
                    style={{ height: '48px', objectFit: 'contain', width: '100%' }}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-4 py-2 rounded-full">
              <VerifiedIcon style={{ fontSize: 16 }} />
              <span>Compra 100% segura y protegida con encriptacion SSL</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Chat flotante WhatsApp */}
      <a href="https://wa.me/51949510535" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 group">
        <div className="relative">
          <div className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50 transition-all group-hover:scale-110">
            <ChatIcon className="text-white" style={{ fontSize: 28 }} />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">1</span>
          </div>
          <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-semibold px-3 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            Chatear por WhatsApp
          </div>
        </div>
      </a>

    </div>
  );
}