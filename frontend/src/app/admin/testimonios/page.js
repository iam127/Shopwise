'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import toast from 'react-hot-toast';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';

export default function AdminTestimoniosPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [testimonios, setTestimonios] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(null);

  useEffect(() => {
    if (user && user.rol !== 'admin') router.push('/productos');
    fetchTestimonios();
  }, [user]);

  const fetchTestimonios = () => {
    setLoading(true);
    api.get('/testimonios/admin/todos')
      .then((res) => setTestimonios(res.data))
      .catch(() => toast.error('Error al cargar testimonios'))
      .finally(() => setLoading(false));
  };

  const toggleAprobar = async (testimonio) => {
    setProcesando(testimonio.id);
    try {
      const res = await api.put('/testimonios/' + testimonio.id + '/toggle-aprobar');
      setTestimonios((prev) => prev.map((t) => t.id === testimonio.id ? { ...t, aprobado: res.data.aprobado } : t));
      toast.success(res.data.aprobado ? 'Testimonio aprobado y publicado' : 'Testimonio ocultado');
    } catch (err) {
      toast.error('Error al actualizar testimonio');
    } finally {
      setProcesando(null);
    }
  };

  const eliminarTestimonio = async (id) => {
    if (!confirm('Estas seguro de eliminar este testimonio?')) return;
    try {
      await api.delete('/testimonios/' + id);
      toast.success('Testimonio eliminado');
      fetchTestimonios();
    } catch (err) {
      toast.error('Error al eliminar testimonio');
    }
  };

  const testimoniosFiltrados = testimonios.filter((t) => {
    const matchFiltro = filtro === 'todos' ? true : filtro === 'aprobados' ? t.aprobado : !t.aprobado;
    const matchBusqueda = t.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.texto.toLowerCase().includes(busqueda.toLowerCase());
    return matchFiltro && matchBusqueda;
  });

  const pendientes = testimonios.filter((t) => !t.aprobado).length;
  const aprobados = testimonios.filter((t) => t.aprobado).length;

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">Testimonios</h1>
              <p className="text-gray-400 text-sm mt-1">Aprueba o rechaza las opiniones de los clientes</p>
            </div>
            {pendientes > 0 && (
              <div className="flex items-center gap-2 bg-orange-50 text-orange-600 text-xs font-semibold px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                {pendientes} pendiente{pendientes !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <RateReviewIcon style={{ fontSize: 24 }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">{testimonios.length}</p>
                <p className="text-gray-400 text-sm">Total testimonios</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                <VisibilityOffIcon style={{ fontSize: 24 }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">{pendientes}</p>
                <p className="text-gray-400 text-sm">Pendientes de revisar</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <CheckCircleIcon style={{ fontSize: 24 }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">{aprobados}</p>
                <p className="text-gray-400 text-sm">Aprobados y publicados</p>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 18 }} />
              <input
                type="text"
                placeholder="Buscar por nombre o texto..."
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {[
                { value: 'todos', label: 'Todos' },
                { value: 'pendientes', label: 'Pendientes' },
                { value: 'aprobados', label: 'Aprobados' },
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

          {/* Lista */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : testimoniosFiltrados.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
              <RateReviewIcon style={{ fontSize: 64 }} className="text-gray-200 mb-4" />
              <p className="text-gray-400">No hay testimonios que coincidan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {testimoniosFiltrados.map((t) => (
                <div key={t.id} className={'bg-white rounded-2xl p-6 border shadow-sm ' + (t.aprobado ? 'border-green-200' : 'border-orange-200')}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {t.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{t.nombre}</p>
                        <p className="text-gray-400 text-xs">{t.email}</p>
                      </div>
                    </div>
                    <span className={'text-xs font-semibold px-3 py-1 rounded-full ' + (
                      t.aprobado ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                    )}>
                      {t.aprobado ? 'Aprobado' : 'Pendiente'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    {[1,2,3,4,5].map((s) => (
                      <StarIcon key={s} className={s <= t.rating ? 'text-yellow-400' : 'text-gray-200'} style={{ fontSize: 16 }} />
                    ))}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.texto}"</p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <p className="text-gray-400 text-xs">{formatFecha(t.fecha)}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAprobar(t)}
                        disabled={procesando === t.id}
                        className={'flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-colors ' + (
                          t.aprobado
                            ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        )}
                      >
                        {t.aprobado ? <VisibilityOffIcon style={{ fontSize: 14 }} /> : <CheckCircleIcon style={{ fontSize: 14 }} />}
                        {t.aprobado ? 'Ocultar' : 'Aprobar'}
                      </button>
                      <button
                        onClick={() => eliminarTestimonio(t.id)}
                        className="w-8 h-8 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"
                      >
                        <DeleteIcon style={{ fontSize: 16 }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}