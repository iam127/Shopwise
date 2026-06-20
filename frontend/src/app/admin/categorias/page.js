'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import toast from 'react-hot-toast';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import CategoryIcon from '@mui/icons-material/Category';
import Inventory2Icon from '@mui/icons-material/Inventory2';

export default function AdminCategoriasPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [editId, setEditId] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.rol !== 'admin') router.push('/productos');
    fetchData();
  }, [user]);

  const fetchData = () => {
    api.get('/categorias').then((res) => setCategorias(res.data));
    api.get('/productos').then((res) => setProductos(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put('/categorias/' + editId, { nombre });
        toast.success('Categoria actualizada correctamente');
      } else {
        await api.post('/categorias', { nombre });
        toast.success('Categoria creada correctamente');
      }
      cerrarModal();
      fetchData();
    } catch (err) {
      toast.error('Error al guardar categoria');
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNuevo = () => {
    setNombre('');
    setEditId(null);
    setModalAbierto(true);
  };

  const handleEdit = (categoria) => {
    setNombre(categoria.nombre);
    setEditId(categoria.id);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditId(null);
    setNombre('');
  };

  const handleDelete = async (categoria) => {
    const count = productos.filter((p) => p.categoria_id === categoria.id).length;
    if (count > 0) {
      toast.error('No se puede eliminar: tiene ' + count + ' producto(s) asociado(s)');
      return;
    }
    if (!confirm('Estas seguro de eliminar la categoria "' + categoria.nombre + '"?')) return;
    try {
      await api.delete('/categorias/' + categoria.id);
      toast.success('Categoria eliminada');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al eliminar categoria');
    }
  };

  const colores = [
    { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'bg-blue-100' },
    { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'bg-purple-100' },
    { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'bg-orange-100' },
    { bg: 'bg-green-50', text: 'text-green-600', icon: 'bg-green-100' },
    { bg: 'bg-pink-50', text: 'text-pink-600', icon: 'bg-pink-100' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-6 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">Gestion de categorias</h1>
              <p className="text-gray-400 text-sm mt-1">Administra las categorias de productos de Shopwise</p>
            </div>
            <button
              onClick={abrirModalNuevo}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              <AddIcon style={{ fontSize: 20 }} />
              Nueva categoria
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Stats */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6 flex items-center gap-4 max-w-xs">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <CategoryIcon style={{ fontSize: 24 }} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-800">{categorias.length}</p>
              <p className="text-gray-400 text-sm">Categorias totales</p>
            </div>
          </div>

          {/* Grid de categorias */}
          {categorias.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
              <CategoryIcon style={{ fontSize: 64 }} className="text-gray-200 mb-4" />
              <p className="text-gray-400 mb-2">No hay categorias creadas</p>
              <button onClick={abrirModalNuevo} className="text-blue-600 font-semibold hover:underline">
                Crear la primera categoria
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categorias.map((categoria, i) => {
                const color = colores[i % colores.length];
                const count = productos.filter((p) => p.categoria_id === categoria.id).length;
                return (
                  <div key={categoria.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className={'w-14 h-14 ' + color.icon + ' rounded-2xl flex items-center justify-center'}>
                        <CategoryIcon className={color.text} style={{ fontSize: 28 }} />
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(categoria)}
                          className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors"
                        >
                          <EditIcon style={{ fontSize: 16 }} />
                        </button>
                        <button
                          onClick={() => handleDelete(categoria)}
                          className="w-9 h-9 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"
                        >
                          <DeleteIcon style={{ fontSize: 16 }} />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-lg font-extrabold text-gray-800 mb-2">{categoria.nombre}</h3>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Inventory2Icon style={{ fontSize: 16 }} />
                      <span>{count} producto{count !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-gray-800">
                {editId ? 'Editar categoria' : 'Nueva categoria'}
              </h3>
              <button onClick={cerrarModal} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                <CloseIcon style={{ fontSize: 18 }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nombre de la categoria *</label>
                <input
                  type="text"
                  placeholder="Ej: Electronica"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                >
                  {loading ? 'Guardando...' : editId ? 'Actualizar' : 'Crear categoria'}
                </button>
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-6 py-3.5 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}