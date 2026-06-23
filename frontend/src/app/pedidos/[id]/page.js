'use client';
import { useState, useEffect, use } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import CancelIcon from '@mui/icons-material/Cancel';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AutorenewIcon from '@mui/icons-material/Autorenew';

export default function SeguimientoPedidoPage({ params }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [pedido, setPedido] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numeroPedido, setNumeroPedido] = useState(null);

  useEffect(() => {
    if (!user) return;
    // Obtenemos el detalle del pedido
    api.get('/pedidos/' + id).then((res) => {
      setPedido(res.data.pedido);
      setItems(res.data.items);
      setLoading(false);
    }).catch(() => router.push('/pedidos'));

    // Calculamos el numero de pedido del cliente
    api.get('/pedidos').then((res) => {
      const todos = res.data;
      const total = todos.length;
      const index = todos.findIndex((p) => p.id === parseInt(id));
      if (index !== -1) setNumeroPedido(total - index);
    }).catch(() => {});
  }, [user, id]);

  const pasos = [
    { estado: 'pendiente', label: 'Pedido recibido', desc: 'Tu pedido ha sido registrado correctamente', icon: <ReceiptLongIcon style={{ fontSize: 24 }} /> },
    { estado: 'procesando', label: 'En preparacion', desc: 'Estamos preparando tu pedido', icon: <AutorenewIcon style={{ fontSize: 24 }} /> },
    { estado: 'enviado', label: 'En camino', desc: 'Tu pedido está en camino', icon: <LocalShippingIcon style={{ fontSize: 24 }} /> },
    { estado: 'entregado', label: 'Entregado', desc: 'Tu pedido fue entregado exitosamente', icon: <CheckCircleIcon style={{ fontSize: 24 }} /> },
  ];

  const ordenEstados = ['pendiente', 'procesando', 'enviado', 'entregado'];
  const esCancelado = pedido?.estado === 'cancelado';
  const pasoActual = esCancelado ? -1 : ordenEstados.indexOf(pedido?.estado);

  const formatFecha = (fecha) => new Date(fecha).toLocaleDateString('es-PE', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Debes <Link href="/login" className="text-blue-600 font-semibold hover:underline">iniciar sesión</Link>.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100 h-14">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <Link href="/productos" className="flex items-center min-w-fit">
            <Image src="/logo.png" alt="Shopwise" width={140} height={35} style={{ objectFit: 'contain' }} />
          </Link>
          <Link href="/carrito" className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 font-medium">
            <ShoppingCartIcon style={{ fontSize: 18 }} />
            Carrito
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/pedidos" className="text-gray-400 hover:text-blue-600 transition-colors">
            <ArrowBackIcon style={{ fontSize: 22 }} />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">
              Seguimiento — Pedido #{numeroPedido || id}
            </h1>
            <p className="text-gray-400 text-sm">{pedido && formatFecha(pedido.creado_en)}</p>
          </div>
        </div>

        {/* Estado cancelado */}
        {esCancelado && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 flex items-center gap-4">
            <CancelIcon className="text-red-500" style={{ fontSize: 40 }} />
            <div>
              <p className="font-bold text-red-700 text-lg">Pedido cancelado</p>
              <p className="text-red-500 text-sm">Este pedido fue cancelado. Contacta al soporte si tienes dudas.</p>
            </div>
          </div>
        )}

        {/* Timeline de seguimiento */}
        {!esCancelado && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="font-extrabold text-gray-800 mb-6">Estado del pedido</h2>
            <div className="relative">
              {pasos.map((paso, i) => {
                const completado = i <= pasoActual;
                const activo = i === pasoActual;
                return (
                  <div key={paso.estado} className="flex gap-4 mb-6 last:mb-0">
                    {/* Icono y línea */}
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        completado
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                          : 'bg-gray-100 text-gray-300'
                      } ${activo ? 'ring-4 ring-blue-100' : ''}`}>
                        {paso.icon}
                      </div>
                      {i < pasos.length - 1 && (
                        <div className={`w-0.5 flex-1 mt-2 min-h-[24px] transition-all ${
                          i < pasoActual ? 'bg-blue-600' : 'bg-gray-100'
                        }`} />
                      )}
                    </div>
                    {/* Texto */}
                    <div className="flex-1 pt-2">
                      <p className={`font-bold text-sm ${completado ? 'text-gray-800' : 'text-gray-300'}`}>
                        {paso.label}
                        {activo && (
                          <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
                            Actual
                          </span>
                        )}
                      </p>
                      <p className={`text-xs mt-0.5 ${completado ? 'text-gray-400' : 'text-gray-200'}`}>
                        {paso.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Productos del pedido */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="font-extrabold text-gray-800 mb-4 flex items-center gap-2">
            <InventoryIcon className="text-blue-400" style={{ fontSize: 20 }} />
            Productos
          </h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{item.nombre}</p>
                  <p className="text-gray-400 text-xs">{item.cantidad} x S/. {parseFloat(item.precio_unitario).toFixed(2)}</p>
                </div>
                <p className="font-bold text-gray-800 text-sm">
                  S/. {(item.cantidad * item.precio_unitario).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen de pago */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-extrabold text-gray-800 mb-4">Resumen de pago</h2>
          <div className="space-y-2 text-sm text-gray-600">
            {pedido.subtotal && (
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">S/. {parseFloat(pedido.subtotal).toFixed(2)}</span>
              </div>
            )}
            {pedido.costo_envio !== undefined && (
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <LocalShippingIcon style={{ fontSize: 15 }} />
                  Envío
                </span>
                <span className={`font-medium ${pedido.costo_envio == 0 ? 'text-green-600' : ''}`}>
                  {pedido.costo_envio == 0 ? 'Gratis' : 'S/. ' + parseFloat(pedido.costo_envio).toFixed(2)}
                </span>
              </div>
            )}
          </div>
          <div className="border-t pt-3 mt-3 flex justify-between items-center">
            <span className="font-bold text-gray-800">Total pagado</span>
            <span className="font-extrabold text-blue-600 text-xl">S/. {parseFloat(pedido.total).toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/pedidos" className="text-blue-600 font-semibold hover:underline text-sm">
            ← Volver a mis pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}