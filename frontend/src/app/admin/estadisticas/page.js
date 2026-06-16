'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

export default function EstadisticasPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user && user.rol !== 'admin') router.push('/productos');
    api.get('/estadisticas').then((res) => setStats(res.data));
  }, [user]);

  if (!stats) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Shopwise Admin</h1>
        <div className="flex gap-4">
          <Link href="/admin/productos" className="text-sm text-gray-600 hover:underline">Productos</Link>
          <Link href="/productos" className="text-sm text-gray-600 hover:underline">Ver tienda</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Panel de estadísticas</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-gray-500 text-sm">Total ventas</p>
            <p className="text-2xl font-bold text-blue-600">S/. {parseFloat(stats.totalVentas).toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-gray-500 text-sm">Total pedidos</p>
            <p className="text-2xl font-bold text-green-600">{stats.totalPedidos}</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-gray-500 text-sm">Clientes</p>
            <p className="text-2xl font-bold text-purple-600">{stats.totalUsuarios}</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-gray-500 text-sm">Productos</p>
            <p className="text-2xl font-bold text-orange-600">{stats.totalProductos}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow mb-8">
          <h3 className="font-semibold text-lg mb-4">Ventas por mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.ventasPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value) => `S/. ${parseFloat(value).toFixed(2)}`} />
              <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold text-lg mb-4">Productos más vendidos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.productosMasVendidos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_vendido" fill="#2563eb" name="Unidades vendidas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}