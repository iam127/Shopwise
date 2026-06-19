'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import toast from 'react-hot-toast';
import EmailIcon from '@mui/icons-material/Email';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export default function AdminNewsletterPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [suscriptores, setSuscriptores] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.rol !== 'admin') router.push('/productos');
    fetchSuscriptores();
  }, [user]);

  const fetchSuscriptores = () => {
    setLoading(true);
    api.get('/newsletter')
      .then((res) => setSuscriptores(res.data))
      .catch(() => toast.error('Error al cargar suscriptores'))
      .finally(() => setLoading(false));
  };

  const copiarEmail = (email) => {
    navigator.clipboard.writeText(email);
    toast.success('Email copiado');
  };

  const copiarTodos = () => {
    const emails = suscriptoresFiltrados.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    toast.success('Todos los emails copiados (' + suscriptoresFiltrados.length + ')');
  };

  const exportarCSV = () => {
    const csv = 'Email,Fecha de suscripcion\n' +
      suscriptores.map((s) => s.email + ',' + new Date(s.fecha_suscripcion).toLocaleDateString('es-PE')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'suscriptores_shopwise.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Archivo CSV descargado');
  };

  const suscriptoresFiltrados = suscriptores.filter((s) =>
    s.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  const formatFecha = (fecha) => {
    const d = new Date(fecha);
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Suscriptores del ultimo mes
  const haceUnMes = new Date();
  haceUnMes.setMonth(haceUnMes.getMonth() - 1);
  const nuevosUltimoMes = suscriptores.filter((s) => new Date(s.fecha_suscripcion) >= haceUnMes).length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-6 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">Suscriptores newsletter</h1>
              <p className="text-gray-400 text-sm mt-1">Gestiona la lista de correos suscritos</p>
            </div>
            <button
              onClick={exportarCSV}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              <DownloadIcon style={{ fontSize: 20 }} />
              Exportar CSV
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <EmailIcon style={{ fontSize: 24 }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">{suscriptores.length}</p>
                <p className="text-gray-400 text-sm">Total suscriptores</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <TrendingUpIcon style={{ fontSize: 24 }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">+{nuevosUltimoMes}</p>
                <p className="text-gray-400 text-sm">Ultimo mes</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <CalendarTodayIcon style={{ fontSize: 24 }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">
                  {suscriptores.length > 0 ? formatFecha(suscriptores[suscriptores.length - 1].fecha_suscripcion) : '-'}
                </p>
                <p className="text-gray-400 text-sm">Primera suscripcion</p>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 flex flex-wrap gap-3 items-center justify-between">
            <div className="relative flex-1 min-w-[250px]">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 18 }} />
              <input
                type="text"
                placeholder="Buscar por email..."
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <button
              onClick={copiarTodos}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 px-4 py-2.5 rounded-xl transition-colors"
            >
              <ContentCopyIcon style={{ fontSize: 16 }} />
              Copiar todos ({suscriptoresFiltrados.length})
            </button>
          </div>

          {/* Tabla */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : suscriptoresFiltrados.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
              <EmailIcon style={{ fontSize: 64 }} className="text-gray-200 mb-4" />
              <p className="text-gray-400">No hay suscriptores que coincidan</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 text-left font-semibold text-gray-600">#</th>
                    <th className="p-4 text-left font-semibold text-gray-600">Email</th>
                    <th className="p-4 text-left font-semibold text-gray-600">Fecha de suscripcion</th>
                    <th className="p-4 text-left font-semibold text-gray-600">Estado</th>
                    <th className="p-4 text-right font-semibold text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {suscriptoresFiltrados.map((s, i) => (
                    <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-gray-400">{i + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {s.email.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{s.email}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-500">{formatFecha(s.fecha_suscripcion)}</td>
                      <td className="p-4">
                        <span className={'text-xs font-semibold px-3 py-1 rounded-full ' + (
                          s.activo ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                        )}>
                          {s.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => copiarEmail(s.email)}
                            className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors"
                          >
                            <ContentCopyIcon style={{ fontSize: 16 }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}