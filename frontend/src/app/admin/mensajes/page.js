'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import toast from 'react-hot-toast';
import EmailIcon from '@mui/icons-material/Email';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function AdminMensajesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [mensajes, setMensajes] = useState([]);
  const [mensajeSeleccionado, setMensajeSeleccionado] = useState(null);
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.rol !== 'admin') router.push('/productos');
    fetchMensajes();
  }, [user]);

  const fetchMensajes = () => {
    setLoading(true);
    api.get('/contacto')
      .then((res) => setMensajes(res.data))
      .catch(() => toast.error('Error al cargar mensajes'))
      .finally(() => setLoading(false));
  };

  const abrirMensaje = async (mensaje) => {
    setMensajeSeleccionado(mensaje);
    if (!mensaje.leido) {
      try {
        await api.put('/contacto/' + mensaje.id + '/leido');
        setMensajes((prev) => prev.map((m) => m.id === mensaje.id ? { ...m, leido: true } : m));
      } catch (err) {
        // silencioso
      }
    }
  };

  const copiarEmail = (email) => {
    navigator.clipboard.writeText(email);
    toast.success('Email copiado');
  };

  const tipoConfig = {
    consulta: { label: 'Consulta', color: 'bg-blue-50 text-blue-600', emoji: '💬' },
    soporte: { label: 'Soporte', color: 'bg-purple-50 text-purple-600', emoji: '🔧' },
    reclamo: { label: 'Reclamo', color: 'bg-red-50 text-red-600', emoji: '⚠️' },
    sugerencia: { label: 'Sugerencia', color: 'bg-green-50 text-green-600', emoji: '💡' },
  };

  const mensajesFiltrados = mensajes.filter((m) => {
    const matchFiltro = filtro === 'todos' ? true : filtro === 'sin_leer' ? !m.leido : m.leido;
    const matchBusqueda = m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.asunto.toLowerCase().includes(busqueda.toLowerCase());
    return matchFiltro && matchBusqueda;
  });

  const sinLeer = mensajes.filter((m) => !m.leido).length;

  const formatFecha = (fecha) => {
    const d = new Date(fecha);
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' - ' + d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-6 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">Mensajes de contacto</h1>
              <p className="text-gray-400 text-sm mt-1">Gestiona las consultas de tus clientes</p>
            </div>
            {sinLeer > 0 && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 text-xs font-semibold px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                {sinLeer} sin leer
              </div>
            )}
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
                <p className="text-2xl font-extrabold text-gray-800">{mensajes.length}</p>
                <p className="text-gray-400 text-sm">Total mensajes</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                <EmailIcon style={{ fontSize: 24 }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">{sinLeer}</p>
                <p className="text-gray-400 text-sm">Sin leer</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <MarkEmailReadIcon style={{ fontSize: 24 }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">{mensajes.length - sinLeer}</p>
                <p className="text-gray-400 text-sm">Leidos</p>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 18 }} />
              <input
                type="text"
                placeholder="Buscar por nombre, email o asunto..."
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {[
                { value: 'todos', label: 'Todos' },
                { value: 'sin_leer', label: 'Sin leer' },
                { value: 'leidos', label: 'Leidos' },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFiltro(f.value)}
                  className={'px-4 py-2 rounded-full text-xs font-semibold transition-all ' + (
                    filtro === f.value ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de mensajes */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : mensajesFiltrados.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
              <EmailIcon style={{ fontSize: 64 }} className="text-gray-200 mb-4" />
              <p className="text-gray-400">No hay mensajes que coincidan</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mensajesFiltrados.map((mensaje) => {
                const tipo = tipoConfig[mensaje.tipo] || tipoConfig.consulta;
                return (
                  <button
                    key={mensaje.id}
                    onClick={() => abrirMensaje(mensaje)}
                    className={'w-full text-left bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all flex items-start gap-4 ' + (
                      !mensaje.leido ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100'
                    )}
                  >
                    {!mensaje.leido && (
                      <span className="w-2.5 h-2.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    )}
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold flex-shrink-0">
                      {mensaje.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className={'font-bold text-gray-800 ' + (!mensaje.leido ? 'font-extrabold' : '')}>{mensaje.nombre}</p>
                        <span className="text-gray-400 text-xs whitespace-nowrap">{formatFecha(mensaje.fecha)}</span>
                      </div>
                      <p className="text-gray-500 text-sm mb-2 truncate">{mensaje.email}</p>
                      <div className="flex items-center gap-2">
                        <span className={'text-xs font-semibold px-2.5 py-1 rounded-full ' + tipo.color}>
                          {tipo.emoji} {tipo.label}
                        </span>
                        <p className="text-gray-600 text-sm font-medium truncate">{mensaje.asunto}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalle */}
      {mensajeSeleccionado && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {mensajeSeleccionado.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-gray-800">{mensajeSeleccionado.nombre}</h3>
                  <p className="text-gray-400 text-xs">{formatFecha(mensajeSeleccionado.fecha)}</p>
                </div>
              </div>
              <button onClick={() => setMensajeSeleccionado(null)} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                <CloseIcon style={{ fontSize: 18 }} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Email con boton copiar */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <EmailIcon className="text-blue-500" style={{ fontSize: 18 }} />
                  <span className="text-sm font-medium text-gray-700">{mensajeSeleccionado.email}</span>
                </div>
                <button
                  onClick={() => copiarEmail(mensajeSeleccionado.email)}
                  className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                >
                  <ContentCopyIcon style={{ fontSize: 16 }} />
                </button>
              </div>

              {/* Tipo */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tipo de consulta</p>
                <span className={'text-sm font-semibold px-3 py-1.5 rounded-full inline-block ' + (tipoConfig[mensajeSeleccionado.tipo] || tipoConfig.consulta).color}>
                  {(tipoConfig[mensajeSeleccionado.tipo] || tipoConfig.consulta).emoji} {(tipoConfig[mensajeSeleccionado.tipo] || tipoConfig.consulta).label}
                </span>
              </div>

              {/* Asunto */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Asunto</p>
                <p className="text-gray-800 font-semibold">{mensajeSeleccionado.asunto}</p>
              </div>

              {/* Mensaje */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Mensaje</p>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{mensajeSeleccionado.mensaje}</p>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-3 pt-2">
                <a
                  href={'mailto:' + mensajeSeleccionado.email + '?subject=Re: ' + mensajeSeleccionado.asunto}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors text-center flex items-center justify-center gap-2"
                >
                  <EmailIcon style={{ fontSize: 18 }} />
                  Responder por email
                </a>
                <button
                  onClick={() => setMensajeSeleccionado(null)}
                  className="px-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}