'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, AreaChart, Area
} from 'recharts';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import GroupsIcon from '@mui/icons-material/Groups';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmailIcon from '@mui/icons-material/Email';
import ChatIcon from '@mui/icons-material/Chat';

export default function EstadisticasPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [extra, setExtra] = useState({ newsletter: 0, mensajes: 0, mensajesSinLeer: 0 });

  useEffect(() => {
    if (user && user.rol !== 'admin') router.push('/productos');
    api.get('/estadisticas').then((res) => setStats(res.data));

    // Datos extra (opcionales, fallan silenciosamente si no hay acceso)
    Promise.allSettled([
      api.get('/newsletter'),
      api.get('/contacto'),
    ]).then(([newsletterRes, contactoRes]) => {
      const newsletter = newsletterRes.status === 'fulfilled' ? newsletterRes.value.data.length : 0;
      const mensajes = contactoRes.status === 'fulfilled' ? contactoRes.value.data.length : 0;
      const mensajesSinLeer = contactoRes.status === 'fulfilled'
        ? contactoRes.value.data.filter((m) => !m.leido).length
        : 0;
      setExtra({ newsletter, mensajes, mensajesSinLeer });
    });
  }, [user]);

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando estadisticas...</p>
        </div>
      </div>
    );
  }

  const kpis = [
    { label: 'Total ventas', value: 'S/. ' + parseFloat(stats.totalVentas).toFixed(2), icon: <AttachMoneyIcon style={{ fontSize: 26 }} />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total pedidos', value: stats.totalPedidos, icon: <ShoppingBagIcon style={{ fontSize: 26 }} />, color: 'bg-green-50 text-green-600' },
    { label: 'Clientes', value: stats.totalUsuarios, icon: <GroupsIcon style={{ fontSize: 26 }} />, color: 'bg-purple-50 text-purple-600' },
    { label: 'Productos', value: stats.totalProductos, icon: <Inventory2Icon style={{ fontSize: 26 }} />, color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-6 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">Panel de estadisticas</h1>
              <p className="text-gray-400 text-sm mt-1">Resumen general del rendimiento de Shopwise</p>
            </div>
            <div className="flex items-center gap-2 bg-green-50 text-green-600 text-xs font-semibold px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Datos en tiempo real
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* KPIs principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={'w-12 h-12 ' + kpi.color + ' rounded-xl flex items-center justify-center'}>
                    {kpi.icon}
                  </div>
                  <TrendingUpIcon className="text-green-400" style={{ fontSize: 18 }} />
                </div>
                <p className="text-2xl font-extrabold text-gray-800">{kpi.value}</p>
                <p className="text-gray-400 text-sm mt-1">{kpi.label}</p>
              </div>
            ))}
          </div>

          {/* KPIs secundarios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <EmailIcon style={{ fontSize: 24 }} />
                </div>
                <p className="text-3xl font-extrabold">{extra.newsletter}</p>
              </div>
              <p className="text-blue-100 text-sm font-medium">Suscriptores al newsletter</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <ChatIcon style={{ fontSize: 24 }} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-extrabold">{extra.mensajes}</p>
                  {extra.mensajesSinLeer > 0 && (
                    <p className="text-xs bg-red-500 px-2 py-0.5 rounded-full inline-block mt-1">{extra.mensajesSinLeer} sin leer</p>
                  )}
                </div>
              </div>
              <p className="text-purple-100 text-sm font-medium">Mensajes de contacto</p>
            </div>
          </div>

          {/* Ventas por mes */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-extrabold text-gray-800">Ventas por mes</h3>
                <p className="text-gray-400 text-sm">Evolucion de ingresos mensuales</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.ventasPorMes}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  formatter={(value) => ['S/. ' + parseFloat(value).toFixed(2), 'Ventas']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                />
                <Area type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} fill="url(#colorVentas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Productos mas vendidos */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="mb-6">
              <h3 className="font-extrabold text-gray-800">Productos mas vendidos</h3>
              <p className="text-gray-400 text-sm">Top productos por unidades vendidas</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.productosMasVendidos}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="nombre" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                <Legend />
                <Bar dataKey="total_vendido" fill="#2563eb" name="Unidades vendidas" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}