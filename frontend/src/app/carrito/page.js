'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PaymentIcon from '@mui/icons-material/Payment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function CarritoPage() {
  const { carrito, removeFromCart, clearCart, total, fetchCarrito } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const pedidoRes = await api.post('/pedidos');
      const pedido_id = pedidoRes.data.pedido.id;
      const pagoRes = await api.post('/pagos', { pedido_id, metodo: 'tarjeta' });
      setResultado(pagoRes.data.pago.estado);
      fetchCarrito();
    } catch (err) {
      setResultado('error');
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingCartIcon style={{ fontSize: 64 }} className="text-gray-200 mb-4" />
          <p className="text-gray-500">Debes <Link href="/login" className="text-blue-600 font-semibold hover:underline">iniciar sesión</Link> para ver tu carrito.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100 h-14">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <Link href="/productos" className="flex items-center min-w-fit">
            <Image src="/logo.png" alt="Shopwise" width={140} height={35} style={{ objectFit: 'contain' }} />
          </Link>
          <Link href="/pedidos" className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 font-medium">
            <ListAltIcon style={{ fontSize: 18 }} />
            Mis pedidos
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/productos" className="text-gray-400 hover:text-blue-600 transition-colors">
            <ArrowBackIcon style={{ fontSize: 22 }} />
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-800">Mi carrito</h1>
          {carrito.length > 0 && (
            <span className="bg-blue-100 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full">
              {carrito.length} producto(s)
            </span>
          )}
        </div>

        {/* Resultado del pago */}
        {resultado && (
          <div className={`rounded-2xl p-5 mb-6 flex items-center gap-4 ${
            resultado === 'aprobado' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            {resultado === 'aprobado' ? (
              <CheckCircleIcon className="text-green-500" style={{ fontSize: 36 }} />
            ) : (
              <CancelIcon className="text-red-500" style={{ fontSize: 36 }} />
            )}
            <div>
              <p className={`font-bold text-lg ${resultado === 'aprobado' ? 'text-green-700' : 'text-red-700'}`}>
                {resultado === 'aprobado' ? '¡Pago aprobado!' : 'Pago rechazado'}
              </p>
              <p className="text-sm text-gray-500">
                {resultado === 'aprobado'
                  ? '¡Gracias por tu compra! Puedes ver tus pedidos en el historial.'
                  : 'Hubo un problema con tu pago. Intenta de nuevo.'}
              </p>
              {resultado === 'aprobado' && (
                <Link href="/pedidos" className="text-blue-600 text-sm font-semibold hover:underline mt-1 block">
                  Ver mis pedidos →
                </Link>
              )}
            </div>
          </div>
        )}

        {carrito.length === 0 && !resultado ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <ShoppingCartIcon style={{ fontSize: 72 }} className="text-gray-200 mb-4" />
            <p className="text-xl font-bold text-gray-300 mb-2">Tu carrito está vacío</p>
            <p className="text-gray-400 text-sm mb-6">Agrega productos para comenzar tu compra</p>
            <Link
              href="/productos"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Lista de items */}
            <div className="flex-1 space-y-4">
              {carrito.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 items-center">
                  {item.imagen_url ? (
                    <img
                      src={item.imagen_url}
                      alt={item.nombre}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">📦</div>
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{item.nombre}</p>
                    <p className="text-gray-400 text-sm">Cantidad: {item.cantidad}</p>
                    <p className="text-blue-600 font-extrabold text-lg mt-1">
                      S/. {(item.precio * item.cantidad).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <DeleteIcon style={{ fontSize: 24 }} />
                  </button>
                </div>
              ))}
            </div>

            {/* Resumen */}
            <div className="lg:w-80">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-20">
                <h2 className="font-bold text-gray-800 text-lg mb-4">Resumen del pedido</h2>
                <div className="space-y-3 mb-4">
                  {carrito.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm text-gray-500">
                      <span className="line-clamp-1 flex-1">{item.nombre} x{item.cantidad}</span>
                      <span className="ml-2 font-medium">S/. {(item.precio * item.cantidad).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800 text-lg">Total</span>
                    <span className="font-extrabold text-blue-600 text-2xl">S/. {total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={loading || resultado === 'aprobado'}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <PaymentIcon style={{ fontSize: 20 }} />
                  {loading ? 'Procesando...' : 'Pagar ahora'}
                </button>
                <button
                  onClick={clearCart}
                  className="w-full mt-3 border border-red-200 text-red-400 py-2 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  Vaciar carrito
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}