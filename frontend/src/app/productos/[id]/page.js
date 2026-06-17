'use client';
import { useState, useEffect, use } from 'react';
import api from '@/lib/axios';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function ProductoDetallePage({ params }) {
  const { id } = use(params);
  const { addToCart, carrito } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agregado, setAgregado] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [isFavorito, setIsFavorito] = useState(false);

  useEffect(() => {
    api.get(`/productos/${id}`)
      .then((res) => {
        setProducto(res.data);
        setLoading(false);
      })
      .catch(() => {
        router.push('/productos');
      });
  }, [id]);

  useEffect(() => {
    if (producto) {
      api.get(`/favoritos/check/${producto.id}`)
        .then((res) => setIsFavorito(res.data.isFavorito))
        .catch(() => {});
    }
  }, [producto]);

  const handleAddToCart = () => {
    addToCart(producto.id, cantidad);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  const toggleFavorito = async () => {
    try {
      if (isFavorito) {
        await api.delete(`/favoritos/${producto.id}`);
        setIsFavorito(false);
        toast.success('Eliminado de favoritos');
      } else {
        await api.post('/favoritos', { producto_id: producto.id });
        setIsFavorito(true);
        toast.success('Agregado a favoritos ❤️');
      }
    } catch (err) {
      toast.error('Error al actualizar favoritos');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
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
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center gap-4">
          <Link href="/productos" className="flex items-center min-w-fit">
            <Image src="/logo.png" alt="Shopwise" width={140} height={35} style={{ objectFit: 'contain' }} />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/favoritos" className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors">
              <FavoriteIcon style={{ fontSize: 22 }} />
            </Link>
            <Link href="/carrito" className="relative flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
              <ShoppingCartIcon style={{ fontSize: 22 }} />
              {carrito.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {carrito.length}
                </span>
              )}
            </Link>
            <Link href="/pedidos" className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 font-medium">
              <ListAltIcon style={{ fontSize: 18 }} />
              <span>Mis pedidos</span>
            </Link>
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.nombre?.charAt(0).toUpperCase()}
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium">
              <LogoutIcon style={{ fontSize: 18 }} />
              <span className="hidden xl:block">Salir</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link href="/productos" className="flex items-center gap-1 text-gray-400 hover:text-blue-600 transition-colors">
            <ArrowBackIcon style={{ fontSize: 16 }} />
            Productos
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-400">{producto.categoria}</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-medium">{producto.nombre}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imagen */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="relative h-96 lg:h-full min-h-80 bg-gradient-to-br from-gray-50 to-gray-100">
              {producto.imagen_url ? (
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">📦</div>
              )}
              {producto.stock === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <span className="text-white font-semibold bg-red-500 px-4 py-2 rounded-full">Sin stock</span>
                </div>
              )}
              {producto.stock > 0 && producto.stock <= 5 && (
                <div className="absolute top-4 left-4 bg-orange-400 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  ¡Últimas unidades!
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <LocalOfferIcon className="text-blue-400" style={{ fontSize: 16 }} />
                  <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">{producto.categoria}</span>
                </div>
                <button
                  onClick={toggleFavorito}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${
                    isFavorito
                      ? 'bg-red-50 border-red-300 text-red-500'
                      : 'bg-white border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400'
                  }`}
                >
                  {isFavorito
                    ? <FavoriteIcon style={{ fontSize: 20 }} />
                    : <FavoriteBorderIcon style={{ fontSize: 20 }} />
                  }
                </button>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-800 mb-3">{producto.nombre}</h1>

              {/* Rating simulado */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <StarIcon key={star} className="text-yellow-400" style={{ fontSize: 18 }} />
                  ))}
                </div>
                <span className="text-sm text-gray-400">(128 reseñas)</span>
              </div>

              <p className="text-gray-500 leading-relaxed">{producto.descripcion}</p>
            </div>

            {/* Precio y stock */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-end gap-3 mb-4">
                <span className="text-4xl font-extrabold text-blue-600">
                  S/. {parseFloat(producto.precio).toFixed(2)}
                </span>
              </div>

              <div className={`flex items-center gap-2 mb-6 px-3 py-2 rounded-xl w-fit ${
                producto.stock > 0 ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <InventoryIcon className={producto.stock > 0 ? 'text-green-500' : 'text-red-500'} style={{ fontSize: 16 }} />
                <span className={`text-sm font-semibold ${producto.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {producto.stock > 0 ? `${producto.stock} unidades disponibles` : 'Sin stock'}
                </span>
              </div>

              {/* Selector de cantidad */}
              {producto.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-semibold text-gray-700">Cantidad:</span>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      className="px-4 py-2 text-gray-500 hover:bg-gray-100 font-bold text-lg transition-colors"
                    >
                      −
                    </button>
                    <span className="px-5 py-2 font-bold text-gray-800 border-x border-gray-200">
                      {cantidad}
                    </span>
                    <button
                      onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                      className="px-4 py-2 text-gray-500 hover:bg-gray-100 font-bold text-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={producto.stock === 0}
                  className={`flex-1 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-base ${
                    agregado
                      ? 'bg-green-500 text-white scale-95'
                      : producto.stock === 0
                      ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-200'
                  }`}
                >
                  {agregado ? (
                    <>
                      <CheckCircleIcon style={{ fontSize: 22 }} />
                      ¡Agregado!
                    </>
                  ) : (
                    <>
                      <AddShoppingCartIcon style={{ fontSize: 22 }} />
                      Agregar al carrito
                    </>
                  )}
                </button>
                <button
                  onClick={toggleFavorito}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all ${
                    isFavorito
                      ? 'bg-red-50 border-red-300 text-red-500'
                      : 'bg-white border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400'
                  }`}
                >
                  {isFavorito ? <FavoriteIcon style={{ fontSize: 24 }} /> : <FavoriteBorderIcon style={{ fontSize: 24 }} />}
                </button>
              </div>
              <Link
                href="/carrito"
                className="mt-3 w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <ShoppingCartIcon style={{ fontSize: 20 }} />
                Ver carrito
              </Link>
            </div>

            {/* Beneficios */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-700 mb-4">¿Por qué comprar en Shopwise?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                    <LocalShippingIcon className="text-blue-500" style={{ fontSize: 18 }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Envío rápido</p>
                    <p className="text-xs text-gray-400">Entrega en 24-48 horas</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                    <VerifiedIcon className="text-green-500" style={{ fontSize: 18 }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Compra segura</p>
                    <p className="text-xs text-gray-400">Pago 100% protegido</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center">
                    <CheckCircleIcon className="text-orange-500" style={{ fontSize: 18 }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Garantía</p>
                    <p className="text-xs text-gray-400">30 días de garantía</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}