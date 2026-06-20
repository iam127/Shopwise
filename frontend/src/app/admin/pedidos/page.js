'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import toast from 'react-hot-toast';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PersonIcon from '@mui/icons-material/Person';

export default function AdminPedidosPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [pedidos, setPedidos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [detalleLoading, setDetalleLoading] = useState(false);
  const [actualizando, setActualizando] = useState(false);

  useEffect(() => {
    if (user && user.rol !== 'admin') router.push('/productos');
    fetchPedidos();
  }, [user]);

  const fetchPedidos = () => {
    setLoading(true);
    api.get('/pedidos/all')
      .then((res) => setPedidos(res.data))
      .catch(() => toast.error('Error al cargar pedidos'))
      .finally(() => setLoading(false));
  };

  const verDetalle = async (pedido) => {
    setDetalleLoading(true);
    setPedidoSeleccionado({ pedido, items: [] });
    try {
      const res = await api.get('/pedidos/' + pedido.id);
      setPedidoSeleccionado(res.data);
    } catch (err) {
      toast.error('Error al cargar el detalle del pedido');
    } finally {
      setDetalleLoading(false);
    }
  };

  const cambiarEstado = async (nuevoEstado) => {
    if (!pedidoSeleccionado) return;
    setActualizando(true);
    try {
      await api.put('/pedidos/' + pedidoSeleccionado.pedido.id + '/estado', { estado: nuevoEstado });
      toast.success('Estado actualizado a ' + estadoConfig[nuevoEstado].label);
      setPedidoSeleccionado({ ...pedidoSeleccionado, pedido: { ...pedidoSeleccionado.pedido, estado: nuevoEstado } });
      setPedidos((prev) => prev.map((p) => p.id === pedidoSeleccionado.pedido.id ? { ...p, estado: nuevoEstado } : p));
    } catch (err) {
      toast.error('Error al actualizar el estado');
    } finally {
      setActualizando(false);
    }
  };

  const estadoConfig = {
    pendiente: { label: 'Pendiente', color: 'bg-yellow-50 text-yellow-600', icon: <HourglassEmptyIcon style={{ fontSize: 16 }} /> },
    procesando: { label: 'Procesando', color: 'bg-blue-50 text-blue-600', icon: <AutorenewIcon style={{ fontSize: 16 }} /> },
    enviado: { label: 'Enviado', color: 'bg-purple-50 text-purple-600', icon: <LocalShippingIcon style={{ fontSize: 16 }} /> },
    entregado: { label: 'Entregado', color: 'bg-green-50 text-green-600', icon: <CheckCircleIcon style={{ fontSize: 16 }} /> },
    cancelado: { label: 'Cancelado', color: 'bg-red-50 text-red-600', icon: <CancelIcon style={{ fontSize: 16 }} /> },
  };

  const pedidosFiltrados = pedidos.filter((p) => {
    const matchBusqueda = p.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      String(p.id).includes(busqueda);
    const matchEstado = filtroEstado === 'todos' ? true : p.estado === filtroEstado;
    return matchBusqueda && matchEstado;
  });

  const totalVentas = pedidos.reduce((sum, p) => sum + parseFloat(p.total), 0);
  const pendientes = pedidos.filter((p) => p.estado === 'pendiente').length;

  const formatFecha = (fecha) => {
    const d = new Date(fecha);
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-6 sticky top-0 z-30">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">Gestion de pedidos</h1>
            <p className="text-gray-400 text-sm mt-1">Administra y actualiza el estado de los pedidos</p>
          </div>
        </div>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <ShoppingBagIcon style={{ fontSize: 24 }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">{pedidos.length}</p>
                <p className="text-gray-400 text-sm">Total pedidos</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center">
                <HourglassEmptyIcon style={{ fontSize: 24 }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">{pendientes}</p>
                <p className="text-gray-400 text-sm">Pendientes</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <ShoppingBagIcon style={{ fontSize: 24 }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">S/. {totalVentas.toFixed(2)}</p>
                <p className="text-gray-400 text-sm">Total en ventas</p>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 18 }} />
              <input
                type="text"
                placeholder="Buscar por cliente o # de pedido..."
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFiltroEstado('todos')}
                className={'px-4 py-2 rounded-full text-xs font-semibold transition-all ' + (
                  filtroEstado === 'todos' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                )}
              >
                Todos
              </button>
              {Object.entries(estadoConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setFiltroEstado(key)}
                  className={'px-4 py-2 rounded-full text-xs font-semibold transition-all ' + (
                    filtroEstado === key ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tabla */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : pedidosFiltrados.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
              <ShoppingBagIcon style={{ fontSize: 64 }} className="text-gray-200 mb-4" />
              <p className="text-gray-400">No hay pedidos que coincidan</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 text-left font-semibold text-gray-600">Pedido</th>
                    <th className="p-4 text-left font-semibold text-gray-600">Cliente</th>
                    <th className="p-4 text-left font-semibold text-gray-600">Fecha</th>
                    <th className="p-4 text-left font-semibold text-gray-600">Total</th>
                    <th className="p-4 text-left font-semibold text-gray-600">Estado</th>
                    <th className="p-4 text-right font-semibold text-gray-600">Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosFiltrados.map((p) => {
                    const estado = estadoConfig[p.estado] || estadoConfig.pendiente;
                    return (
                      <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-bold text-gray-800">#{p.id}</td>
                        <td className="p-4 text-gray-600">{p.cliente}</td>
                        <td className="p-4 text-gray-500">{formatFecha(p.creado_en)}</td>
                        <td className="p-4 font-bold text-gray-800">S/. {parseFloat(p.total).toFixed(2)}</td>
                        <td className="p-4">
                          <span className={'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ' + estado.color}>
                            {estado.icon}
                            {estado.label}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => verDetalle(p)}
                            className="text-blue-600 font-semibold text-sm hover:underline"
                          >
                            Ver detalle
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalle */}
      {pedidoSeleccionado && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-xl font-extrabold text-gray-800">Pedido #{pedidoSeleccionado.pedido.id}</h3>
                <p className="text-gray-400 text-xs">{formatFecha(pedidoSeleccionado.pedido.creado_en)}</p>
              </div>
              <button onClick={() => setPedidoSeleccionado(null)} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                <CloseIcon style={{ fontSize: 18 }} />
              </button>
            </div>

            {/* Info del cliente */}
            <div className="px-6 pt-6">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <PersonIcon style={{ fontSize: 14 }} />
                  Datos del cliente
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700"><span className="font-semibold">Nombre:</span> {pedidoSeleccionado.pedido.cliente_nombre}</p>
                  <p className="text-sm text-gray-700"><span className="font-semibold">Email:</span> {pedidoSeleccionado.pedido.cliente_email}</p>
                  {pedidoSeleccionado.pedido.cliente_telefono && (
                    <p className="text-sm text-gray-700"><span className="font-semibold">Teléfono:</span> {pedidoSeleccionado.pedido.cliente_telefono}</p>
                  )}
                  {pedidoSeleccionado.pedido.cliente_direccion && (
                    <p className="text-sm text-gray-700"><span className="font-semibold">Dirección:</span> {pedidoSeleccionado.pedido.cliente_direccion}</p>
                  )}
                  {!pedidoSeleccionado.pedido.cliente_telefono && !pedidoSeleccionado.pedido.cliente_direccion && (
                    <p className="text-sm text-gray-400 italic">El cliente no ha completado su teléfono ni dirección</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Estado actual y cambio */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Estado del pedido</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(estadoConfig).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => cambiarEstado(key)}
                      disabled={actualizando || pedidoSeleccionado.pedido.estado === key}
                      className={'flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border-2 ' + (
                        pedidoSeleccionado.pedido.estado === key
                          ? config.color + ' border-current'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                      ) + (actualizando ? ' opacity-50 cursor-not-allowed' : '')}
                    >
                      {config.icon}
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items del pedido */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Productos</p>
                {detalleLoading ? (
                  <div className="py-8 text-center">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pedidoSeleccionado.items.map((item) => (
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
                )}
              </div>

              {/* Total */}
              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <p className="font-bold text-gray-800">Total del pedido</p>
                <p className="text-xl font-extrabold text-blue-600">S/. {parseFloat(pedidoSeleccionado.pedido.total).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}