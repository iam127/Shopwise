'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CarritoPage() {
  const { carrito, removeFromCart, clearCart, total, fetchCarrito } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const pedidoRes = await api.post('/pedidos');
      const pedido_id = pedidoRes.data.pedido.id;
      const pagoRes = await api.post('/pagos', {
        pedido_id,
        metodo: 'tarjeta',
      });
      if (pagoRes.data.pago.estado === 'aprobado') {
        setMensaje('✅ Pago aprobado. ¡Gracias por tu compra!');
        fetchCarrito();
      } else {
        setMensaje('❌ Pago rechazado. Intenta de nuevo.');
      }
    } catch (err) {
      setMensaje('Error al procesar el pedido.');
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Debes <Link href="/login" className="text-blue-600">iniciar sesión</Link> para ver tu carrito.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <Link href="/productos" className="text-xl font-bold text-blue-600">Shopwise</Link>
        <Link href="/pedidos" className="text-sm text-gray-600 hover:underline">Mis pedidos</Link>
      </nav>

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Mi carrito</h1>

        {mensaje && (
          <div className="bg-white p-4 rounded shadow mb-4 text-center font-semibold">
            {mensaje}
            <div className="mt-2">
              <Link href="/pedidos" className="text-blue-600 hover:underline text-sm">
                Ver mis pedidos
              </Link>
            </div>
          </div>
        )}

        {carrito.length === 0 && !mensaje ? (
          <div className="bg-white p-6 rounded shadow text-center">
            <p className="text-gray-500">Tu carrito está vacío.</p>
            <Link href="/productos" className="text-blue-600 hover:underline mt-2 block">
              Ver productos
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {carrito.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{item.nombre}</p>
                    <p className="text-gray-500 text-sm">Cantidad: {item.cantidad}</p>
                    <p className="text-blue-600">S/. {(item.precio * item.cantidad).toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white p-4 rounded shadow mt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg">Total:</span>
                <span className="text-blue-600 font-bold text-lg">S/. {total.toFixed(2)}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={clearCart}
                  className="flex-1 border border-red-500 text-red-500 py-2 rounded hover:bg-red-50"
                >
                  Vaciar carrito
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
                >
                  {loading ? 'Procesando...' : 'Pagar ahora'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}