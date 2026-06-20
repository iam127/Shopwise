'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';

export default function FavoritosPage() {
  const { user } = useAuth();
  const { addToCart, carrito } = useCart();
  const router = useRouter();
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchFavoritos();
  }, [user]);

  const fetchFavoritos = async () => {
    try {
      const res = await api.get('/favoritos');
      setFavoritos(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const removeFavorito = async (producto_id) => {
    try {
      await api.delete(`/favoritos/${producto_id}`);
      setFavoritos(favoritos.filter((f) => f.producto_id !== producto_id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100 h-14">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <Link href="/productos">
            <Image src="/logo.png" alt="Shopwise" width={140} height={35} style={{ objectFit: 'contain' }} />
          </Link>
          <Link href="/carrito" className="relative flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
            <ShoppingCartIcon style={{ fontSize: 22 }} />
            {carrito.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {carrito.length}
              </span>
            )}
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/productos" className="text-gray-400 hover:text-blue-600 transition-colors">
            <ArrowBackIcon style={{ fontSize: 22 }} />
          </Link>
          <FavoriteIcon className="text-red-500" style={{ fontSize: 28 }} />
          <h1 className="text-2xl font-extrabold text-gray-800">Mis favoritos</h1>
          {favoritos.length > 0 && (
            <span className="bg-red-100 text-red-500 text-sm font-semibold px-3 py-1 rounded-full">
              {favoritos.length} producto(s)
            </span>
          )}
        </div>

        {favoritos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <FavoriteBorderIcon style={{ fontSize: 72 }} className="text-gray-200 mb-4" />
            <p className="text-xl font-bold text-gray-300 mb-2">No tienes favoritos aún</p>
            <p className="text-gray-400 text-sm mb-6">Agrega productos a tus favoritos para verlos aquí</p>
            <Link
              href="/productos"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoritos.map((producto) => (
              <div
                key={producto.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <Link href={`/productos/${producto.producto_id || producto.id}`} className="block">
                  <div className="relative h-48 bg-gray-50 overflow-hidden">
                    {producto.imagen_url ? (
                      <img
                        src={producto.imagen_url}
                        alt={producto.nombre}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-1">{producto.categoria}</p>
                  <h2 className="font-bold text-gray-800 mb-1 line-clamp-1">{producto.nombre}</h2>
                  <p className="text-blue-600 font-extrabold text-xl mb-3">S/. {parseFloat(producto.precio).toFixed(2)}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(producto.producto_id || producto.id, 1)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1 hover:bg-blue-700 transition-colors"
                    >
                      <AddShoppingCartIcon style={{ fontSize: 16 }} />
                      Agregar
                    </button>
                    <button
                      onClick={() => removeFavorito(producto.producto_id || producto.id)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
                    >
                      <DeleteIcon style={{ fontSize: 18 }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}