'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MoneyIcon from '@mui/icons-material/Money';

const COSTO_ENVIO = 15;
const ENVIO_GRATIS_DESDE = 100;

export default function CheckoutPage() {
  const { carrito, total, clearCart, fetchCarrito } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [metodo, setMetodo] = useState('tarjeta');
  const [form, setForm] = useState({ numero: '', nombre: '', expiry: '', cvv: '' });
  const [paso, setPaso] = useState('formulario');
  const [resultado, setResultado] = useState(null);
  const [pedidoId, setPedidoId] = useState(null);
  const [totalPagado, setTotalPagado] = useState(0);

  const subtotal = total;
  const costoEnvio = subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO;
  const totalConEnvio = subtotal + costoEnvio;

  const formatNumero = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const handlePagar = async () => {
    if (metodo === 'tarjeta') {
      const num = form.numero.replace(/\s/g, '');
      if (num.length < 16 || !form.nombre || !form.expiry || form.cvv.length < 3) return;
    }

    setTotalPagado(totalConEnvio);
    setPaso('procesando');

    await new Promise((res) => setTimeout(res, 2500));

    try {
      const pedidoRes = await api.post('/pedidos');
      const pedido_id = pedidoRes.data.pedido.id;
      const pagoRes = await api.post('/pagos', { pedido_id, metodo });
      setPedidoId(pedido_id);
      setResultado(pagoRes.data.pago.estado);
      fetchCarrito();
    } catch (err) {
      setResultado('rechazado');
    }

    setPaso('resultado');
  };

  if (!user) return null;

  // ── PROCESANDO ──
  if (paso === 'procesando') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 max-w-sm w-full mx-4">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-extrabold text-gray-800 mb-2">Procesando pago</h2>
          <p className="text-gray-400 text-sm">Verificando información y procesando tu transacción...</p>
          <div className="mt-6 space-y-2">
            {['Verificando datos', 'Procesando transaccion', 'Confirmando pedido'].map((step, i) => (
              <div key={i} className="flex items-center gap-3 text-left">
                <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin flex-shrink-0"
                  style={{ animationDelay: `${i * 0.3}s` }}></div>
                <p className="text-xs text-gray-400">{step}...</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── RESULTADO ──
  if (paso === 'resultado') {
    const aprobado = resultado === 'aprobado';
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 max-w-sm w-full mx-4">
          <div className={`w-24 h-24 ${aprobado ? 'bg-green-50' : 'bg-red-50'} rounded-full flex items-center justify-center mx-auto mb-6`}>
            {aprobado
              ? <CheckCircleIcon className="text-green-500" style={{ fontSize: 56 }} />
              : <CancelIcon className="text-red-500" style={{ fontSize: 56 }} />}
          </div>
          <h2 className={`text-2xl font-extrabold mb-2 ${aprobado ? 'text-gray-800' : 'text-red-700'}`}>
            {aprobado ? '¡Pago aprobado!' : 'Pago rechazado'}
          </h2>
          <p className="text-gray-400 text-sm mb-2">
            {aprobado
              ? `Total pagado: S/. ${totalPagado.toFixed(2)}`
              : 'No se pudo procesar tu pago. Verifica los datos e intenta de nuevo.'}
          </p>
          {aprobado && (
            <p className="text-gray-300 text-xs mb-6">Método: {metodo.charAt(0).toUpperCase() + metodo.slice(1)}</p>
          )}
          <div className="flex flex-col gap-3 mt-6">
            {aprobado ? (
              <>
                <Link href={`/pedidos/${pedidoId}`}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-center">
                  Ver seguimiento del pedido
                </Link>
                <Link href="/productos"
                  className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-center">
                  Seguir comprando
                </Link>
              </>
            ) : (
              <>
                <button onClick={() => setPaso('formulario')}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                  Intentar de nuevo
                </button>
                <Link href="/carrito"
                  className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-center">
                  Volver al carrito
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── FORMULARIO ──
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100 h-14">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <Link href="/productos" className="flex items-center min-w-fit">
            <Image src="/logo.png" alt="Shopwise" width={140} height={35} style={{ objectFit: 'contain' }} />
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <LockIcon style={{ fontSize: 16 }} />
            Pago seguro
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/carrito" className="text-gray-400 hover:text-blue-600 transition-colors">
            <ArrowBackIcon style={{ fontSize: 22 }} />
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-800">Finalizar compra</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Formulario izquierda */}
          <div className="flex-1 space-y-5">

            {/* Método de pago */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-extrabold text-gray-800 mb-4">Método de pago</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'tarjeta', label: 'Tarjeta', icon: <CreditCardIcon style={{ fontSize: 22 }} /> },
                  { value: 'transferencia', label: 'Transferencia', icon: <AccountBalanceIcon style={{ fontSize: 22 }} /> },
                  { value: 'efectivo', label: 'Efectivo', icon: <MoneyIcon style={{ fontSize: 22 }} /> },
                ].map((m) => (
                  <button key={m.value} onClick={() => setMetodo(m.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all font-semibold text-sm ${
                      metodo === m.value
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 text-gray-500 hover:border-blue-300'
                    }`}>
                    {m.icon}
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Datos de tarjeta */}
            {metodo === 'tarjeta' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-extrabold text-gray-800 mb-1">Datos de la tarjeta</h2>
                <p className="text-xs text-gray-400 mb-5">Simulacion — ingresa cualquier dato de prueba</p>

                {/* Vista previa */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 mb-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8"></div>
                  <p className="text-xs text-blue-200 mb-4 uppercase tracking-widest">Shopwise Card</p>
                  <p className="text-xl font-mono tracking-widest mb-4">
                    {form.numero || '•••• •••• •••• ••••'}
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-blue-200">Titular</p>
                      <p className="font-semibold text-sm uppercase">{form.nombre || 'NOMBRE APELLIDO'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-blue-200">Vence</p>
                      <p className="font-semibold text-sm">{form.expiry || 'MM/AA'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Número de tarjeta</label>
                    <input type="text" placeholder="1234 5678 9012 3456" maxLength={19}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 font-mono"
                      value={form.numero}
                      onChange={(e) => setForm({ ...form, numero: formatNumero(e.target.value) })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nombre del titular</label>
                    <input type="text" placeholder="Como aparece en la tarjeta"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value.toUpperCase() })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Vencimiento</label>
                      <input type="text" placeholder="MM/AA" maxLength={5}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 font-mono"
                        value={form.expiry}
                        onChange={(e) => setForm({ ...form, expiry: formatExpiry(e.target.value) })} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">CVV</label>
                      <input type="text" placeholder="123" maxLength={4}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 font-mono"
                        value={form.cvv}
                        onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
                  <img src="/visa.png" alt="Visa" className="h-6 object-contain opacity-70" />
                  <img src="/mastercard.jpg" alt="Mastercard" className="h-6 object-contain opacity-70" />
                  <img src="/amex.png" alt="Amex" className="h-6 object-contain opacity-70" />
                  <img src="/paypal.png" alt="PayPal" className="h-6 object-contain opacity-70" />
                </div>
              </div>
            )}

            {metodo === 'transferencia' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-extrabold text-gray-800 mb-4">Datos para transferencia</h2>
                <div className="space-y-3">
                  {[
                    ['Banco', 'BCP - Banco de Credito del Peru'],
                    ['Cuenta corriente', '193-12345678-0-12'],
                    ['CCI', '002-193-001234567801-20'],
                    ['Titular', 'Shopwise SAC'],
                    ['RUC', '20123456789'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-xs text-gray-400 font-semibold uppercase">{label}</span>
                      <span className="text-sm font-semibold text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                  <p className="text-xs text-yellow-700">Simulacion: al confirmar se procesara el pedido automaticamente.</p>
                </div>
              </div>
            )}

            {metodo === 'efectivo' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-extrabold text-gray-800 mb-4">Pago en efectivo</h2>
                <div className="space-y-3">
                  {[
                    ['Modalidad', 'Pago contra entrega'],
                    ['Plazo', 'Al recibir el pedido'],
                    ['Moneda', 'Soles (PEN)'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-xs text-gray-400 font-semibold uppercase">{label}</span>
                      <span className="text-sm font-semibold text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <p className="text-xs text-blue-700">Simulacion: ten el monto exacto preparado. El repartidor no da cambio.</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <LockIcon className="text-green-500" style={{ fontSize: 20 }} />
              <p className="text-xs text-gray-400">Tus datos están protegidos con encriptación SSL de 256 bits. Shopwise nunca almacena los datos de tu tarjeta.</p>
            </div>
          </div>

          {/* Resumen derecha */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-20">
              <h2 className="font-bold text-gray-800 mb-4">Resumen</h2>
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {carrito.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    {item.imagen_url
                      ? <img src={item.imagen_url} alt={item.nombre} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                      : <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">📦</div>}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700 line-clamp-1">{item.nombre}</p>
                      <p className="text-xs text-gray-400">x{item.cantidad}</p>
                    </div>
                    <p className="text-xs font-bold text-gray-700 ml-2">S/. {(item.precio_final * item.cantidad).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">S/. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <LocalShippingIcon style={{ fontSize: 15 }} />
                    Envío
                  </span>
                  <span className={'font-medium ' + (costoEnvio === 0 ? 'text-green-600' : '')}>
                    {costoEnvio === 0 ? 'Gratis' : 'S/. ' + costoEnvio.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800 text-lg">Total</span>
                  <span className="font-extrabold text-blue-600 text-2xl">S/. {totalConEnvio.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handlePagar}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 text-base"
              >
                <LockIcon style={{ fontSize: 18 }} />
                Confirmar pago · S/. {totalConEnvio.toFixed(2)}
              </button>
              <p className="text-center text-xs text-gray-300 mt-3">Simulacion de pasarela de pagos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}