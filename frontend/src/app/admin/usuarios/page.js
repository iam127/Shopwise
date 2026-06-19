'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import toast from 'react-hot-toast';
import GroupsIcon from '@mui/icons-material/Groups';
import SearchIcon from '@mui/icons-material/Search';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

export default function AdminUsuariosPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(null);

  useEffect(() => {
    if (user && user.rol !== 'admin') router.push('/productos');
    fetchUsuarios();
  }, [user]);

  const fetchUsuarios = () => {
    setLoading(true);
    api.get('/usuarios')
      .then((res) => setUsuarios(res.data))
      .catch(() => toast.error('Error al cargar usuarios'))
      .finally(() => setLoading(false));
  };

  const toggleActivo = async (usuario) => {
    const accion = usuario.activo ? 'desactivar' : 'activar';
    if (!confirm('Estas seguro de ' + accion + ' a "' + usuario.nombre + '"?')) return;
    setProcesando(usuario.id);
    try {
      const res = await api.put('/usuarios/' + usuario.id + '/toggle-activo');
      setUsuarios((prev) => prev.map((u) => u.id === usuario.id ? { ...u, activo: res.data.activo } : u));
      toast.success('Usuario ' + (res.data.activo ? 'activado' : 'desactivado') + ' correctamente');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al actualizar usuario');
    } finally {
      setProcesando(null);
    }
  };

  const cambiarRol = async (usuario) => {
    const nuevoRol = usuario.rol === 'admin' ? 'cliente' : 'admin';
    if (!confirm('Cambiar el rol de "' + usuario.nombre + '" a ' + nuevoRol + '?')) return;
    setProcesando(usuario.id);
    try {
      const res = await api.put('/usuarios/' + usuario.id + '/rol', { rol: nuevoRol });
      setUsuarios((prev) => prev.map((u) => u.id === usuario.id ? { ...u, rol: res.data.rol } : u));
      toast.success('Rol actualizado a ' + nuevoRol);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al cambiar rol');
    } finally {
      setProcesando(null);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const matchBusqueda = u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase());
    const matchRol = filtroRol === 'todos' ? true : u.rol === filtroRol;
    return matchBusqueda && matchRol;
  });

  const totalAdmins = usuarios.filter((u) => u.rol === 'admin').length;
  const totalActivos = usuarios.filter((u) => u.activo).length;
  const totalInactivos = usuarios.filter((u) => !u.activo).length;

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
            <h1 className="text-2xl font-extrabold text-gray-800">Gestion de usuarios</h1>
            <p className="text-gray-400 text-sm mt-1">Administra cuentas, roles y permisos</p>
          </div>
        </div>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-6">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <GroupsIcon style={{ fontSize: 24 }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">{usuarios.length}</p>
                <p className="text-gray-400 text-sm">Total usuarios</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <AdminPanelSettingsIcon style={{ fontSize: 24 }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">{totalAdmins}</p>
                <p className="text-gray-400 text-sm">Administradores</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <CheckCircleIcon style={{ fontSize: 24 }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">{totalActivos}</p>
                <p className="text-gray-400 text-sm">Activos</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                <BlockIcon style={{ fontSize: 24 }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">{totalInactivos}</p>
                <p className="text-gray-400 text-sm">Desactivados</p>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 18 }} />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {[
                { value: 'todos', label: 'Todos' },
                { value: 'cliente', label: 'Clientes' },
                { value: 'admin', label: 'Admins' },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFiltroRol(f.value)}
                  className={'px-4 py-2 rounded-full text-xs font-semibold transition-all ' + (
                    filtroRol === f.value ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tabla */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : usuariosFiltrados.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
              <GroupsIcon style={{ fontSize: 64 }} className="text-gray-200 mb-4" />
              <p className="text-gray-400">No hay usuarios que coincidan</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 text-left font-semibold text-gray-600">Usuario</th>
                    <th className="p-4 text-left font-semibold text-gray-600">Registro</th>
                    <th className="p-4 text-left font-semibold text-gray-600">Rol</th>
                    <th className="p-4 text-left font-semibold text-gray-600">Estado</th>
                    <th className="p-4 text-right font-semibold text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map((u) => {
                    const esUsuarioActual = u.id === user?.id;
                    return (
                      <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ' + (
                              u.rol === 'admin' ? 'bg-purple-600' : 'bg-blue-600'
                            )}>
                              {u.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 flex items-center gap-1.5">
                                {u.nombre}
                                {esUsuarioActual && (
                                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">Tu</span>
                                )}
                              </p>
                              <p className="text-gray-400 text-xs">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-500">{formatFecha(u.creado_en)}</td>
                        <td className="p-4">
                          <span className={'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ' + (
                            u.rol === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-600'
                          )}>
                            {u.rol === 'admin' ? <VerifiedUserIcon style={{ fontSize: 14 }} /> : <PersonIcon style={{ fontSize: 14 }} />}
                            {u.rol === 'admin' ? 'Administrador' : 'Cliente'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={'text-xs font-semibold px-3 py-1.5 rounded-full ' + (
                            u.activo ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                          )}>
                            {u.activo ? 'Activo' : 'Desactivado'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => cambiarRol(u)}
                              disabled={esUsuarioActual || procesando === u.id}
                              className={'text-xs font-semibold px-3 py-2 rounded-xl transition-colors ' + (
                                esUsuarioActual
                                  ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                  : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                              )}
                            >
                              {u.rol === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                            </button>
                            <button
                              onClick={() => toggleActivo(u)}
                              disabled={esUsuarioActual || procesando === u.id}
                              className={'w-9 h-9 rounded-xl flex items-center justify-center transition-colors ' + (
                                esUsuarioActual
                                  ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                  : u.activo
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                              )}
                            >
                              {u.activo ? <BlockIcon style={{ fontSize: 16 }} /> : <CheckCircleIcon style={{ fontSize: 16 }} />}
                            </button>
                          </div>
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
    </div>
  );
}