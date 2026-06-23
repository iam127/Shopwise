'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CancelIcon from '@mui/icons-material/Cancel';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function PedidosPage() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    if (user) {
      api.get('/pedidos').then((res) => setPedidos(res.data));
    }
  }, [user]);

  const totalPedidos = pedidos.length;
  const pedidosConNumero = pedidos.map((pedido, index) => ({
    ...pedido,
    numeroPedido: totalPedidos - index,
  }));

  const estadoConfig = (estado) => {
    switch (estado) {
      case 'pagado': return { color: 'text-green-600', bg: 'bg-green-50 border-green-200', icon: <CheckCircleIcon className="text-green-500" style={{ fontSize: 18 }} />, label: 'Pagado' };
      case 'pendiente': return { color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', icon: <HourglassEmptyIcon className="text-yellow-500" style={{ fontSize: 18 }} />, label: 'Pendiente' };
      case 'procesando': return { color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', icon: <HourglassEmptyIcon className="text-blue-500" style={{ fontSize: 18 }} />, label: 'Procesando' };
      case 'enviado': return { color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', icon: <LocalShippingIcon className="text-blue-500" style={{ fontSize: 18 }} />, label: 'Enviado' };
      case 'entregado': return { color: 'text-green-600', bg: 'bg-green-50 border-green-200', icon: <CheckCircleIcon className="text-green-500" style={{ fontSize: 18 }} />, label: 'Entregado' };
      case 'cancelado': return { color: 'text-red-600', bg: 'bg-red-50 border-red-200', icon: <CancelIcon className="text-red-500" style={{ fontSize: 18 }} />, label: 'Cancelado' };
      default: return { color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200', icon: null, label: estado };
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Debes <Link href="/login" className="text-blue-600 font-semibold hover:underline">iniciar sesión</Link> para ver tus pedidos.</p>
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

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/productos" className="text-gray-400 hover:text-blue-600 transition-colors">
            <ArrowBackIcon style={{ fontSize: 22 }} />
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-800">Mis pedidos</h1>
          {pedidos.length > 0 && (
            <span className="bg-blue-100 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full">
              {pedidos.length} pedido(s)
            </span>
          )}
        </div>

        {pedidos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <ReceiptLongIcon style={{ fontSize: 72 }} className="text-gray-200 mb-4" />
            <p className="text-xl font-bold text-gray-300 mb-2">No tienes pedidos aún</p>
            <p className="text-gray-400 text-sm mb-6">Cuando realices una compra aparecerá aquí</p>
            <Link href="/productos" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-block">
              Ver productos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidosConNumero.map((pedido) => {
              const config = estadoConfig(pedido.estado);
              return (
                <div key={pedido.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <ReceiptLongIcon className="text-blue-400" style={{ fontSize: 20 }} />
                        <p className="font-bold text-gray-800 text-lg">Pedido #{pedido.numeroPedido}</p>
                      </div>
                      <p className="text-gray-400 text-sm">
                        {new Date(pedido.creado_en).toLocaleDateString('es-PE', {
                          year: 'numeric', month: 'long', day: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-600 font-extrabold text-xl mb-2">
                        S/. {parseFloat(pedido.total).toFixed(2)}
                      </p>
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-semibold ${config.bg} ${config.color}`}>
                        {config.icon}
                        {config.label}
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/pedidos/${pedido.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 border border-blue-200 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors"
                  >
                    <LocalShippingIcon style={{ fontSize: 18 }} />
                    Ver seguimiento
                    <ArrowForwardIcon style={{ fontSize: 16 }} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}