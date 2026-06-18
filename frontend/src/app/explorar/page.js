'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import NavbarPublic from '@/components/NavbarPublic';
import Footer from '@/components/Footer';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FilterListIcon from '@mui/icons-material/FilterList';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EmailIcon from '@mui/icons-material/Email';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function ExplorarPage() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [orden, setOrden] = useState('');
  const [vista, setVista] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(500);
  const [pagina, setPagina] = useState(1);
  const [email, setEmail] = useState('');
  const [newsletterEnviado, setNewsletterEnviado] = useState(false);
  const [productoHover, setProductoHover] = useState(null);
  const searchRef = useRef(null);
  const PRODUCTOS_POR_PAGINA = 8;

  useEffect(() => {
    Promise.all([
      api.get('/productos'),
      api.get('/categorias'),
    ]).then(([prodRes, catRes]) => {
      setProductos(prodRes.data);
      setCategorias(catRes.data);
      const maxP = Math.max(...prodRes.data.map((p) => parseFloat(p.precio)));
      setPrecioMax(maxP);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSugerencias(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => { setPagina(1); }, [busqueda, categoriaFiltro, orden, precioMin, precioMax]);

  let productosFiltrados = productos.filter((p) => {
    const matchCategoria = categoriaFiltro ? p.categoria_id === parseInt(categoriaFiltro) : true;
    const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchPrecio = parseFloat(p.precio) >= precioMin && parseFloat(p.precio) <= precioMax;
    return matchCategoria && matchBusqueda && matchPrecio;
  });

  if (orden === 'precio_asc') productosFiltrados = [...productosFiltrados].sort((a, b) => a.precio - b.precio);
  if (orden === 'precio_desc') productosFiltrados = [...productosFiltrados].sort((a, b) => b.precio - a.precio);
  if (orden === 'nombre') productosFiltrados = [...productosFiltrados].sort((a, b) => a.nombre.localeCompare(b.nombre));

  const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA);
  const productosPaginados = productosFiltrados.slice((pagina - 1) * PRODUCTOS_POR_PAGINA, pagina * PRODUCTOS_POR_PAGINA);
  const sugerencias = productos.filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase())).slice(0, 5);
  const productosTrending = productos.slice(0, 4);

  const testimonios = [
    { nombre: 'Carlos M.', cargo: 'Cliente frecuente', texto: 'Excelente variedad de productos. Encontre exactamente lo que buscaba a un precio increible.', avatar: 'C' },
    { nombre: 'Maria L.', cargo: 'Compradora verificada', texto: 'El envio fue rapidisimo y el producto llego en perfectas condiciones. Totalmente recomendado.', avatar: 'M' },
    { nombre: 'Jose R.', cargo: 'Cliente habitual', texto: 'Productos de calidad a precios justos. La mejor tienda online que he encontrado.', avatar: 'J' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavbarPublic />

      {/* Header con imagen de fondo */}
      <div className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/bg-explorar.png" alt="fondo" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-blue-900/75" />
        </div>
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <span className="text-blue-300 font-semibold text-sm uppercase tracking-widest mb-4 block">
            Catalogo actualizado
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-2 mb-4">
            Explorar productos
          </h1>
          <p className="text-blue-200 max-w-xl mx-auto text-lg mb-8">
            Descubre nuestra amplia variedad de productos al mejor precio
          </p>

          {/* Buscador */}
          <div className="relative max-w-2xl mx-auto" ref={searchRef}>
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 20 }} />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full bg-white border-0 rounded-2xl pl-12 pr-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-2xl"
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setShowSugerencias(true); }}
              onFocus={() => setShowSugerencias(true)}
            />
            {showSugerencias && busqueda.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 text-left">
                {sugerencias.length > 0 ? sugerencias.map((p) => (
                  <Link key={p.id} href="/login"
                    onClick={() => { setBusqueda(''); setShowSugerencias(false); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                    {p.imagen_url && <img src={p.imagen_url} alt={p.nombre} className="w-10 h-10 object-cover rounded-lg" />}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{p.nombre}</p>
                      <p className="text-xs text-blue-500 font-medium">S/. {p.precio}</p>
                    </div>
                    <span className="text-xs text-gray-300">{p.categoria}</span>
                  </Link>
                )) : (
                  <div className="px-4 py-3 text-sm text-gray-400">No se encontraron productos</div>
                )}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 justify-center mt-8">
            {[
              { num: productos.length + '+', label: 'Productos' },
              { num: categorias.length + '', label: 'Categorias' },
              { num: '4.9', label: 'Valoracion' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-extrabold text-white">{stat.num}</p>
                <p className="text-blue-300 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Beneficios */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <LocalShippingIcon style={{ fontSize: 22 }} />, color: 'text-blue-500 bg-blue-50', title: 'Envio gratis', desc: 'En compras +S/. 100' },
              { icon: <VerifiedIcon style={{ fontSize: 22 }} />, color: 'text-green-500 bg-green-50', title: 'Compra segura', desc: 'Pago 100% protegido' },
              { icon: <SupportAgentIcon style={{ fontSize: 22 }} />, color: 'text-purple-500 bg-purple-50', title: 'Soporte 24/7', desc: 'Siempre disponibles' },
              { icon: <WorkspacePremiumIcon style={{ fontSize: 22 }} />, color: 'text-orange-500 bg-orange-50', title: 'Garantia', desc: '30 dias de garantia' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className={'w-10 h-10 ' + item.color + ' rounded-xl flex items-center justify-center flex-shrink-0'}>
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{item.title}</p>
                  <p className="text-gray-400 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <WhatshotIcon className="text-orange-500" style={{ fontSize: 28 }} />
              <div>
                <h2 className="text-2xl font-extrabold text-gray-800">Productos trending</h2>
                <p className="text-gray-400 text-sm">Los mas populares del momento</p>
              </div>
            </div>
            <Link href="/login" className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1">
              Ver todos <ArrowForwardIcon style={{ fontSize: 16 }} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {productosTrending.map((producto, i) => (
              <Link href="/login" key={producto.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 block">
                <div className="relative h-44 overflow-hidden">
                  {producto.imagen_url ? (
                    <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-50">paquete</div>
                  )}
                  <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <WhatshotIcon style={{ fontSize: 12 }} />
                    #{i + 1} Trending
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-gray-800 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">{producto.nombre}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-blue-600 font-extrabold">S/. {producto.precio}</span>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map((s) => <StarIcon key={s} className="text-yellow-400" style={{ fontSize: 10 }} />)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10 flex-1 w-full">

        {/* Filtros */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Categorías */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setCategoriaFiltro('')}
                  className={'px-4 py-2 rounded-full text-xs font-semibold transition-all ' + (categoriaFiltro === '' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400')}
                >
                  Todos
                </button>
                {categorias.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategoriaFiltro(String(c.id))}
                    className={'px-4 py-2 rounded-full text-xs font-semibold transition-all ' + (categoriaFiltro === String(c.id) ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400')}
                  >
                    {c.nombre}
                  </button>
                ))}
              </div>

              {/* Precio */}
              <div className="flex items-center gap-2">
                <LocalOfferIcon className="text-gray-400" style={{ fontSize: 16 }} />
                <input
                  type="number"
                  placeholder="Min"
                  className="border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white w-20"
                  value={precioMin}
                  onChange={(e) => setPrecioMin(Number(e.target.value))}
                />
                <span className="text-gray-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white w-24"
                  value={precioMax}
                  onChange={(e) => setPrecioMax(Number(e.target.value))}
                />
              </div>

              {/* Orden */}
              <div className="flex items-center gap-2">
                <FilterListIcon className="text-gray-400" style={{ fontSize: 16 }} />
                <select
                  className="border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                >
                  <option value="">Ordenar por</option>
                  <option value="precio_asc">Precio: menor a mayor</option>
                  <option value="precio_desc">Precio: mayor a menor</option>
                  <option value="nombre">Nombre A-Z</option>
                </select>
              </div>
            </div>

            {/* Vista */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
              <button
                onClick={() => setVista('grid')}
                className={'p-2 rounded-lg transition-colors ' + (vista === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-600')}
              >
                <GridViewIcon style={{ fontSize: 18 }} />
              </button>
              <button
                onClick={() => setVista('list')}
                className={'p-2 rounded-lg transition-colors ' + (vista === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-600')}
              >
                <ViewListIcon style={{ fontSize: 18 }} />
              </button>
            </div>
          </div>
        </div>

        {/* Contador */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUpIcon className="text-blue-500" style={{ fontSize: 20 }} />
            <p className="text-gray-600 text-sm font-medium">
              Mostrando <span className="text-blue-600 font-bold">{productosPaginados.length}</span> de <span className="font-bold">{productosFiltrados.length}</span> productos
            </p>
          </div>
          {(busqueda || categoriaFiltro) && (
            <button
              onClick={() => { setBusqueda(''); setCategoriaFiltro(''); setOrden(''); }}
              className="text-xs text-red-400 hover:text-red-600 font-medium hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Grid/Lista de productos */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl">
            <SearchIcon style={{ fontSize: 64 }} className="text-gray-200 mb-4" />
            <p className="text-xl font-bold text-gray-300 mb-2">No se encontraron productos</p>
            <p className="text-gray-400 text-sm">Intenta con otros filtros</p>
          </div>
        ) : vista === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productosPaginados.map((producto) => (
              <Link href="/login" key={producto.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 block"
                onMouseEnter={() => setProductoHover(producto.id)}
                onMouseLeave={() => setProductoHover(null)}
              >
                <div className="relative h-52 bg-gray-50 overflow-hidden">
                  {producto.imagen_url ? (
                    <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">paquete</div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
                    {producto.categoria}
                  </div>
                  {producto.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">Sin stock</span>
                    </div>
                  )}
                  {producto.stock > 0 && producto.stock <= 5 && (
                    <div className="absolute top-3 right-3 bg-orange-400 text-white text-xs px-2 py-1 rounded-full font-semibold">Ultimas!</div>
                  )}
                  {/* Vista rapida overlay */}
                  {productoHover === producto.id && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg">
                        <VisibilityIcon style={{ fontSize: 16 }} />
                        Vista rapida
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{producto.nombre}</h3>
                  <p className="text-gray-400 text-xs mb-2 line-clamp-2">{producto.descripcion}</p>
                  <div className="flex items-center gap-1 mb-3">
                    {[1,2,3,4,5].map((s) => <StarIcon key={s} className="text-yellow-400" style={{ fontSize: 12 }} />)}
                    <span className="text-gray-400 text-xs ml-1">(128)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-extrabold text-lg">S/. {producto.precio}</span>
                    <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-medium group-hover:bg-blue-700 transition-colors">Ver mas</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {productosPaginados.map((producto) => (
              <Link href="/login" key={producto.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex gap-4 p-4">
                <div className="relative w-36 h-36 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                  {producto.imagen_url ? (
                    <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">paquete</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-1">{producto.categoria}</p>
                  <h3 className="font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">{producto.nombre}</h3>
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">{producto.descripcion}</p>
                  <div className="flex items-center gap-1 mb-3">
                    {[1,2,3,4,5].map((s) => <StarIcon key={s} className="text-yellow-400" style={{ fontSize: 12 }} />)}
                    <span className="text-gray-400 text-xs ml-1">(128)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-extrabold text-xl">S/. {producto.precio}</span>
                    <span className="text-xs bg-blue-600 text-white px-4 py-2 rounded-full font-medium group-hover:bg-blue-700 transition-colors">Ver mas</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Paginacion */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPagina(Math.max(1, pagina - 1))}
              disabled={pagina === 1}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Anterior
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPagina(p)}
                className={'w-10 h-10 rounded-xl text-sm font-bold transition-all ' + (pagina === p ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600')}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPagina(Math.min(totalPaginas, pagina + 1))}
              disabled={pagina === totalPaginas}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Testimonios */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-500 font-semibold text-sm uppercase tracking-widest">Opiniones</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Lo que dicen nuestros clientes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonios.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((s) => <StarIcon key={s} className="text-yellow-400" style={{ fontSize: 16 }} />)}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">"{t.texto}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold text-sm">{t.nombre}</p>
                    <p className="text-gray-400 text-xs">{t.cargo}</p>
                  </div>
                </div>
              </div>
            ))}
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
            <EmailIcon className="text-white" style={{ fontSize: 32 }} />
          </div>
          <span className="text-blue-300 font-semibold text-sm uppercase tracking-widest">Newsletter</span>
          <h2 className="text-3xl font-extrabold text-white mt-2 mb-3">Recibe ofertas exclusivas</h2>
          <p className="text-blue-200 mb-8">Suscribete y recibe las mejores ofertas directamente en tu correo</p>
          {newsletterEnviado ? (
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
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
              />
              <button
                onClick={() => { if (email) setNewsletterEnviado(true); }}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                Suscribirme
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-3">Listo para comprar?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">Crea tu cuenta gratis y accede a todos los productos con los mejores precios</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register" className="group inline-flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Registrarse gratis
              <ArrowForwardIcon style={{ fontSize: 20 }} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-10 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all">
              Iniciar sesion
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}