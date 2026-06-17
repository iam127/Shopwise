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

export default function ExplorarPage() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [orden, setOrden] = useState('');
  const searchRef = useRef(null);

  useEffect(() => {
    api.get('/productos').then((res) => setProductos(res.data)).catch(() => {});
    api.get('/categorias').then((res) => setCategorias(res.data)).catch(() => {});
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

  let productosFiltrados = productos.filter((p) => {
    const matchCategoria = categoriaFiltro ? p.categoria_id === parseInt(categoriaFiltro) : true;
    const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return matchCategoria && matchBusqueda;
  });

  if (orden === 'precio_asc') productosFiltrados = [...productosFiltrados].sort((a, b) => a.precio - b.precio);
  if (orden === 'precio_desc') productosFiltrados = [...productosFiltrados].sort((a, b) => b.precio - a.precio);
  if (orden === 'nombre') productosFiltrados = [...productosFiltrados].sort((a, b) => a.nombre.localeCompare(b.nombre));

  const sugerencias = productos.filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase())).slice(0, 5);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavbarPublic />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-blue-300 font-semibold text-sm uppercase tracking-widest">Catálogo</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-2 mb-4">Explorar productos</h1>
          <p className="text-blue-200 max-w-xl mx-auto mb-8">Descubre nuestra amplia variedad de productos al mejor precio</p>

          {/* Buscador */}
          <div className="relative max-w-xl mx-auto" ref={searchRef}>
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 20 }} />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full bg-white border-0 rounded-2xl pl-12 pr-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg"
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setShowSugerencias(true); }}
              onFocus={() => setShowSugerencias(true)}
            />
            {showSugerencias && busqueda.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50 text-left">
                {sugerencias.length > 0 ? sugerencias.map((p) => (
                  <Link key={p.id} href="/login" onClick={() => { setBusqueda(''); setShowSugerencias(false); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                    {p.imagen_url && <img src={p.imagen_url} alt={p.nombre} className="w-10 h-10 object-cover rounded-lg" />}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{p.nombre}</p>
                      <p className="text-xs text-blue-500 font-medium">S/. {p.precio}</p>
                    </div>
                  </Link>
                )) : (
                  <div className="px-4 py-3 text-sm text-gray-400">No se encontraron productos</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 flex-1 w-full">
        {/* Filtros */}
        <div className="flex flex-wrap gap-3 items-center justify-between mb-8">
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setCategoriaFiltro('')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                categoriaFiltro === '' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400'
              }`}
            >
              Todos
            </button>
            {categorias.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoriaFiltro(String(c.id))}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  categoriaFiltro === String(c.id) ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400'
                }`}
              >
                {c.nombre}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <FilterListIcon className="text-gray-400" style={{ fontSize: 18 }} />
            <select
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
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

        <p className="text-sm text-gray-400 mb-6">{productosFiltrados.length} producto(s) encontrado(s)</p>

        {/* Grid */}
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-20">
            <SearchIcon style={{ fontSize: 64 }} className="text-gray-200 mb-4" />
            <p className="text-gray-400">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productosFiltrados.map((producto) => (
              <Link href="/login" key={producto.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 block">
                <div className="relative h-52 bg-gray-50 overflow-hidden">
                  {producto.imagen_url ? (
                    <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
                    {producto.categoria}
                  </div>
                  {producto.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">Sin stock</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{producto.nombre}</h3>
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">{producto.descripcion}</p>
                  <div className="flex items-center gap-1 mb-3">
                    {[1,2,3,4,5].map((s) => <StarIcon key={s} className="text-yellow-400" style={{ fontSize: 12 }} />)}
                    <span className="text-gray-400 text-xs ml-1">(128)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-extrabold text-xl">S/. {producto.precio}</span>
                    <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-medium group-hover:bg-blue-700 transition-colors">Ver más</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/login" className="group inline-flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            Inicia sesión para comprar
            <ArrowForwardIcon style={{ fontSize: 20 }} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}