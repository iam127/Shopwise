'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function PedidosPage() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    if (user) {
      api.get('/pedidos').then((res) => setPedidos(res.data));
    }
  }, [user]);

  const estadoColor = (estado) => {
    switch (estado) {
      case 'pagado': return 'text-green-600';
      case 'pendiente': return 'text-yellow-600';
      case 'enviado': return 'text-blue-600';
      case 'cancelado': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Debes <Link href="/login" className="text-blue-600">iniciar sesión</Link> para ver tus pedidos.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <Link href="/productos" className="text-xl font-bold text-blue-600">Shopwise</Link>
        <Link href="/carrito" className="text-sm text-gray-600 hover:underline">🛒 Carrito</Link>
      </nav>

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Mis pedidos</h1>

        {pedidos.length === 0 ? (
          <div className="bg-white p-6 rounded shadow text-center">
            <p className="text-gray-500">No tienes pedidos aún.</p>
            <Link href="/productos" className="text-blue-600 hover:underline mt-2 block">
              Ver productos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="bg-white p-4 rounded shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Pedido #{pedido.id}</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(pedido.creado_en).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-600 font-bold">S/. {parseFloat(pedido.total).toFixed(2)}</p>
                    <p className={`text-sm font-semibold capitalize ${estadoColor(pedido.estado)}`}>
                      {pedido.estado}
                    </p>
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