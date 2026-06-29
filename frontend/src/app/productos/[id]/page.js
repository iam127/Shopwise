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
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import RatingStars from '@/components/RatingStars';

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
  const [miRating, setMiRating] = useState(0);
  const [ratingHover, setRatingHover] = useState(0);
  const [ratingEnviado, setRatingEnviado] = useState(false);
  const [enviandoRating, setEnviandoRating] = useState(false);

  useEffect(() => {
    api.get(`/productos/${id}`)
      .then((res) => { setProducto(res.data); setLoading(false); })
      .catch(() => router.push('/productos'));
  }, [id]);

  useEffect(() => {
    if (producto) {
      api.get(`/favoritos/check/${producto.id}`).then((res) => setIsFavorito(res.data.isFavorito)).catch(() => {});
      // Verificar si ya calificó este producto
      api.get(`/ratings/mi-rating/${producto.id}`).then((res) => {
        if (res.data.rating) {
          setMiRating(res.data.rating);
          setRatingEnviado(true);
        }
      }).catch(() => {});
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

  const handleRating = async (estrellas) => {
    if (ratingEnviado) return;
    setEnviandoRating(true);
    try {
      await api.post('/ratings', { producto_id: producto.id, rating: estrellas });
      setMiRating(estrellas);
      setRatingEnviado(true);
      toast.success(`¡Gracias por tu calificación de ${estrellas} estrella${estrellas > 1 ? 's' : ''}!`);
      // Recargar el producto para actualizar el rating promedio
      const res = await api.get(`/productos/${id}`);
      setProducto(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al enviar calificación');
    } finally {
      setEnviandoRating(false);
    }
  };

  const handleLogout = () => { logout(); router.push('/login'); };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const etiquetasRating = ['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'];

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
                <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">📦</div>
              )}
              {producto.precio_oferta && (
                <div className="absolute top-4 right-4 bg-red-600 text-white text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                  <LocalOfferIcon style={{ fontSize: 14 }} />
                  -{producto.descuento}% OFF
                </div>
              )}
              {producto.stock === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <span className="text-white font-semibold bg-red-500 px-4 py-2 rounded-full">Sin stock</span>
                </div>
              )}
              {producto.stock > 0 && producto.stock <= 5 && !producto.precio_oferta && (
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
                <button onClick={toggleFavorito}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${
                    isFavorito ? 'bg-red-50 border-red-300 text-red-500' : 'bg-white border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400'
                  }`}>
                  {isFavorito ? <FavoriteIcon style={{ fontSize: 20 }} /> : <FavoriteBorderIcon style={{ fontSize: 20 }} />}
                </button>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-800 mb-3">{producto.nombre}</h1>
              <div className="mb-4">
                <RatingStars rating={producto.rating_promedio} total={producto.rating_total} size={18} />
              </div>
              <p className="text-gray-500 leading-relaxed">{producto.descripcion}</p>
            </div>

            {/* Precio y stock */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-end gap-3 mb-4">
                {producto.precio_oferta ? (
                  <>
                    <span className="text-4xl font-extrabold text-red-600">S/. {parseFloat(producto.precio_oferta).toFixed(2)}</span>
                    <span className="text-xl text-gray-400 line-through mb-1">S/. {parseFloat(producto.precio).toFixed(2)}</span>
                    <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-full mb-1.5">
                      Ahorras S/. {(producto.precio - producto.precio_oferta).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-extrabold text-blue-600">S/. {parseFloat(producto.precio).toFixed(2)}</span>
                )}
              </div>

              <div className={`flex items-center gap-2 mb-6 px-3 py-2 rounded-xl w-fit ${producto.stock > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <InventoryIcon className={producto.stock > 0 ? 'text-green-500' : 'text-red-500'} style={{ fontSize: 16 }} />
                <span className={`text-sm font-semibold ${producto.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {producto.stock > 0 ? `${producto.stock} unidades disponibles` : 'Sin stock'}
                </span>
              </div>

              {producto.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-semibold text-gray-700">Cantidad:</span>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      className="px-4 py-2 text-gray-500 hover:bg-gray-100 font-bold text-lg transition-colors">−</button>
                    <span className="px-5 py-2 font-bold text-gray-800 border-x border-gray-200">{cantidad}</span>
                    <button onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                      className="px-4 py-2 text-gray-500 hover:bg-gray-100 font-bold text-lg transition-colors">+</button>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={handleAddToCart} disabled={producto.stock === 0}
                  className={`flex-1 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-base ${
                    agregado ? 'bg-green-500 text-white scale-95'
                    : producto.stock === 0 ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-200'
                  }`}>
                  {agregado ? <><CheckCircleIcon style={{ fontSize: 22 }} />¡Agregado!</>
                    : <><AddShoppingCartIcon style={{ fontSize: 22 }} />Agregar al carrito</>}
                </button>
                <button onClick={toggleFavorito}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all ${
                    isFavorito ? 'bg-red-50 border-red-300 text-red-500' : 'bg-white border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400'
                  }`}>
                  {isFavorito ? <FavoriteIcon style={{ fontSize: 24 }} /> : <FavoriteBorderIcon style={{ fontSize: 24 }} />}
                </button>
              </div>
              <Link href="/carrito"
                className="mt-3 w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors">
                <ShoppingCartIcon style={{ fontSize: 20 }} />
                Ver carrito
              </Link>
            </div>

            {/* Beneficios */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-700 mb-4">¿Por qué comprar en Shopwise?</h3>
              <div className="space-y-3">
                {[
                  { icon: <LocalShippingIcon style={{ fontSize: 18 }} />, color: 'bg-blue-50 text-blue-500', title: 'Envío rápido', desc: 'Entrega en 24-48 horas' },
                  { icon: <VerifiedIcon style={{ fontSize: 18 }} />, color: 'bg-green-50 text-green-500', title: 'Compra segura', desc: 'Pago 100% protegido' },
                  { icon: <CheckCircleIcon style={{ fontSize: 18 }} />, color: 'bg-orange-50 text-orange-500', title: 'Garantía', desc: '30 días de garantía' },
                ].map((item) => (
                  <div key={item.title} className="flex items-center gap-3">
                    <div className={`w-9 h-9 ${item.color} rounded-xl flex items-center justify-center`}>{item.icon}</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{item.title}</p>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SECCIÓN DE RATING ── */}
        <div className="mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-extrabold text-gray-800 mb-1">Califica este producto</h2>
          <p className="text-gray-400 text-sm mb-6">Tu opinión ayuda a otros compradores</p>

          {ratingEnviado ? (
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-4">
                <StarIcon className="text-yellow-400" style={{ fontSize: 36 }} />
              </div>
              <p className="font-extrabold text-gray-800 text-lg mb-1">¡Gracias por tu calificación!</p>
              <p className="text-gray-400 text-sm mb-4">Calificaste este producto con <span className="font-bold text-yellow-500">{miRating} estrella{miRating > 1 ? 's' : ''}</span></p>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s) => (
                  <StarIcon key={s} className={s <= miRating ? 'text-yellow-400' : 'text-gray-200'} style={{ fontSize: 32 }} />
                ))}
              </div>
              <p className="text-blue-500 font-semibold text-sm mt-2">{etiquetasRating[miRating]}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-gray-500 text-sm mb-4">¿Qué tan bueno es este producto?</p>
              <div className="flex items-center gap-2 mb-3">
                {[1,2,3,4,5].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleRating(s)}
                    onMouseEnter={() => setRatingHover(s)}
                    onMouseLeave={() => setRatingHover(0)}
                    disabled={enviandoRating}
                    className="transition-transform hover:scale-125 active:scale-110 disabled:cursor-not-allowed"
                  >
                    {s <= (ratingHover || miRating)
                      ? <StarIcon className="text-yellow-400" style={{ fontSize: 40 }} />
                      : <StarBorderIcon className="text-gray-300" style={{ fontSize: 40 }} />}
                  </button>
                ))}
              </div>
              {(ratingHover > 0 || miRating > 0) && (
                <p className="text-blue-500 font-semibold text-sm">
                  {etiquetasRating[ratingHover || miRating]}
                </p>
              )}
              {!ratingHover && miRating === 0 && (
                <p className="text-gray-300 text-xs mt-1">Pasa el cursor sobre las estrellas para calificar</p>
              )}
              {enviandoRating && (
                <div className="mt-3 flex items-center gap-2 text-blue-500 text-sm">
                  <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                  Enviando calificación...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}