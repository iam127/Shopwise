'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import NavbarPublic from '@/components/NavbarPublic';
import Footer from '@/components/Footer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  useEffect(() => {
    api.get('/categorias').then((res) => setCategorias(res.data)).catch(() => {});
    api.get('/productos').then((res) => setProductos(res.data)).catch(() => {});
  }, []);

  const categoriaConfig = [
    { emoji: '💻', bg: 'from-blue-600 to-blue-800', desc: 'Los mejores gadgets y tecnología' },
    { emoji: '👗', bg: 'from-purple-600 to-purple-800', desc: 'Moda y estilo para todos' },
    { emoji: '🏠', bg: 'from-orange-500 to-orange-700', desc: 'Todo para tu hogar' },
  ];

  const productosFiltrados = categoriaSeleccionada
    ? productos.filter((p) => p.categoria_id === categoriaSeleccionada)
    : productos;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavbarPublic />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-blue-300 font-semibold text-sm uppercase tracking-widest">Explora</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-2 mb-4">Nuestras categorías</h1>
          <p className="text-blue-200 max-w-xl mx-auto">Encuentra exactamente lo que buscas en nuestra variedad de categorías</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 flex-1 w-full">
        {/* Cards de categorías */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {categorias.map((c, i) => {
            const config = categoriaConfig[i % 3];
            const count = productos.filter((p) => p.categoria_id === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setCategoriaSeleccionada(categoriaSeleccionada === c.id ? null : c.id)}
                className={`group relative overflow-hidden rounded-3xl text-left transition-all duration-300 ${
                  categoriaSeleccionada === c.id ? 'ring-4 ring-white ring-offset-4 ring-offset-blue-600 scale-[1.02]' : 'hover:scale-[1.02]'
                }`}
              >
                <div className={`bg-gradient-to-br ${config.bg} p-10 h-56 flex flex-col justify-between`}>
                  <div className="flex justify-between items-start">
                    <span className="text-6xl">{config.emoji}</span>
                    <div className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {count} productos
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-white mb-1">{c.nombre}</h3>
                    <p className="text-white/70 text-sm">{config.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Productos filtrados */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-gray-800">
              {categoriaSeleccionada
                ? categorias.find((c) => c.id === categoriaSeleccionada)?.nombre
                : 'Todos los productos'}
              <span className="text-gray-400 font-normal text-lg ml-2">({productosFiltrados.length})</span>
            </h2>
            {categoriaSeleccionada && (
              <button onClick={() => setCategoriaSeleccionada(null)} className="text-sm text-blue-600 hover:underline">
                Ver todos
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productosFiltrados.map((producto) => (
              <Link href="/login" key={producto.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 block">
                <div className="relative h-48 bg-gray-50 overflow-hidden">
                  {producto.imagen_url ? (
                    <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
                    {producto.categoria}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{producto.nombre}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map((s) => <StarIcon key={s} className="text-yellow-400" style={{ fontSize: 12 }} />)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-extrabold text-lg">S/. {producto.precio}</span>
                    <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-medium">Ver más</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/login" className="group inline-flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Inicia sesión para comprar
              <ArrowForwardIcon style={{ fontSize: 20 }} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}