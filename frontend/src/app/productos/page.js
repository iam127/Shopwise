'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductosPage() {
  const { addToCart, carrito } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');

  useEffect(() => {
    api.get('/productos').then((res) => setProductos(res.data));
    api.get('/categorias').then((res) => setCategorias(res.data));
  }, []);

  const productosFiltrados = categoriaFiltro
    ? productos.filter((p) => p.categoria_id === parseInt(categoriaFiltro))
    : productos;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Shopwise</h1>
        <div className="flex items-center gap-4">
          <Link href="/carrito" className="relative">
            🛒
            {carrito.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                {carrito.length}
              </span>
            )}
          </Link>
          <Link href="/pedidos" className="text-sm text-gray-600 hover:underline">Mis pedidos</Link>
          <span className="text-sm text-gray-600">Hola, {user?.nombre}</span>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <select
            className="border p-2 rounded"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productosFiltrados.map((producto) => (
            <div key={producto.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
              {producto.imagen_url && (
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}
              <h2 className="font-semibold text-lg">{producto.nombre}</h2>
              <p className="text-gray-500 text-sm flex-1">{producto.descripcion}</p>
              <p className="text-blue-600 font-bold mt-2">S/. {producto.precio}</p>
              <p className="text-gray-400 text-xs mb-3">Stock: {producto.stock}</p>
              <button
                onClick={() => addToCart(producto.id, 1)}
                disabled={producto.stock === 0}
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
              >
                {producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}