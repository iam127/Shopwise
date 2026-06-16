'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

export default function ProductosPage() {
  const { addToCart, carrito } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [agregado, setAgregado] = useState(null);

  useEffect(() => {
    api.get('/productos').then((res) => setProductos(res.data));
    api.get('/categorias').then((res) => setCategorias(res.data));
  }, []);

  const productosFiltrados = productos.filter((p) => {
    const matchCategoria = categoriaFiltro ? p.categoria_id === parseInt(categoriaFiltro) : true;
    const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return matchCategoria && matchBusqueda;
  });

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleAddToCart = (producto) => {
    addToCart(producto.id, 1);
    setAgregado(producto.id);
    setTimeout(() => setAgregado(null), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100 h-14">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center gap-4">
          {/* Logo */}
          <div className="flex items-center min-w-fit">
            <Image src="/logo.png" alt="Shopwise" width={140} height={35} style={{ objectFit: 'contain' }} />
          </div>

          {/* Buscador */}
          <div className="flex-1 relative max-w-xl">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 18 }} />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full border border-gray-200 rounded-full pl-9 pr-5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-4 min-w-fit">
            <Link href="/carrito" className="relative flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
              <ShoppingCartIcon style={{ fontSize: 22 }} />
              {carrito.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {carrito.length}
                </span>
              )}
            </Link>
            <Link href="/pedidos" className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">
              <ListAltIcon style={{ fontSize: 18 }} />
              <span>Mis pedidos</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.nombre?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-gray-700 font-medium hidden xl:block">{user?.nombre}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              <LogoutIcon style={{ fontSize: 18 }} />
              <span className="hidden xl:block">Salir</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-1">Bienvenido, {user?.nombre?.split(' ')[0]} 👋</h2>
          <p className="text-blue-200 text-sm">Descubre los mejores productos al mejor precio</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filtros */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setCategoriaFiltro('')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              categoriaFiltro === ''
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400'
            }`}
          >
            Todos
          </button>
          {categorias.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoriaFiltro(String(c.id))}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                categoriaFiltro === String(c.id)
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400'
              }`}
            >
              {c.nombre}
            </button>
          ))}
        </div>

        {/* Contador */}
        <p className="text-sm text-gray-400 mb-4">{productosFiltrados.length} producto(s) encontrado(s)</p>

        {/* Grid de productos */}
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-20 text-gray-300">
            <SearchIcon style={{ fontSize: 64 }} />
            <p className="text-lg mt-4 text-gray-400">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productosFiltrados.map((producto) => (
              <div
                key={producto.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100"
              >
                <div className="relative overflow-hidden h-48 bg-gray-50">
                  {producto.imagen_url ? (
                    <img
                      src={producto.imagen_url}
                      alt={producto.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
                  )}
                  {producto.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm bg-red-500 px-3 py-1 rounded-full">Sin stock</span>
                    </div>
                  )}
                  {producto.stock > 0 && producto.stock <= 5 && (
                    <span className="absolute top-2 right-2 bg-orange-400 text-white text-xs px-2 py-1 rounded-full font-medium">
                      ¡Últimas unidades!
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-1">{producto.categoria}</p>
                  <h2 className="font-bold text-gray-800 mb-1 line-clamp-1">{producto.nombre}</h2>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{producto.descripcion}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-blue-600 font-extrabold text-xl">S/. {producto.precio}</span>
                    <span className="text-gray-300 text-xs">Stock: {producto.stock}</span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(producto)}
                    disabled={producto.stock === 0}
                    className={`w-full py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      agregado === producto.id
                        ? 'bg-green-500 text-white'
                        : producto.stock === 0
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                    }`}
                  >
                    <AddShoppingCartIcon style={{ fontSize: 18 }} />
                    {agregado === producto.id ? '¡Agregado!' : 'Agregar al carrito'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}