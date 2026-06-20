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
import SearchIcon from '@mui/icons-material/Search';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export default function AdminProductosPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    nombre: '', descripcion: '', precio: '', stock: '', imagen_url: '', categoria_id: ''
  });
  const [editId, setEditId] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [loading, setLoading] = useState(false);
  const [procesando, setProcesando] = useState(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  useEffect(() => {
    if (user && user.rol !== 'admin') router.push('/productos');
    fetchProductos();
    api.get('/categorias').then((res) => setCategorias(res.data));
  }, [user]);

  const fetchProductos = () => {
    api.get('/productos/admin/todos').then((res) => setProductos(res.data));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSubiendoImagen(true);
    const formData = new FormData();
    formData.append('imagen', file);
    try {
      const res = await api.post('/upload/imagen', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, imagen_url: res.data.url }));
      toast.success('Imagen subida correctamente');
    } catch (err) {
      toast.error('Error al subir la imagen');
    } finally {
      setSubiendoImagen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put('/productos/' + editId, form);
        toast.success('Producto actualizado correctamente');
      } else {
        await api.post('/productos', form);
        toast.success('Producto creado correctamente');
      }
      cerrarModal();
      fetchProductos();
    } catch (err) {
      toast.error('Error al guardar producto');
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNuevo = () => {
    setForm({ nombre: '', descripcion: '', precio: '', stock: '', imagen_url: '', categoria_id: '' });
    setEditId(null);
    setModalAbierto(true);
  };

  const handleEdit = (producto) => {
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      imagen_url: producto.imagen_url || '',
      categoria_id: producto.categoria_id,
    });
    setEditId(producto.id);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditId(null);
    setForm({ nombre: '', descripcion: '', precio: '', stock: '', imagen_url: '', categoria_id: '' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Estas seguro de eliminar este producto? Esta accion no se puede deshacer.')) return;
    try {
      await api.delete('/productos/' + id);
      toast.success('Producto eliminado');
      fetchProductos();
    } catch (err) {
      toast.error('Error al eliminar producto');
    }
  };

  const handleToggleActivo = async (producto) => {
    setProcesando(producto.id);
    try {
      const res = await api.put('/productos/' + producto.id + '/toggle-activo');
      setProductos((prev) => prev.map((p) => p.id === producto.id ? { ...p, activo: res.data.activo } : p));
      toast.success('Producto ' + (res.data.activo ? 'activado' : 'desactivado') + ' correctamente');
    } catch (err) {
      toast.error('Error al actualizar el producto');
    } finally {
      setProcesando(null);
    }
  };

  const productosFiltrados = productos.filter((p) => {
    const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = categoriaFiltro ? p.categoria_id === parseInt(categoriaFiltro) : true;
    const matchEstado = filtroEstado === 'todos' ? true : filtroEstado === 'activos' ? p.activo : !p.activo;
    return matchBusqueda && matchCategoria && matchEstado;
  });

  const sinStock = productos.filter((p) => p.stock === 0).length;
  const stockBajo = productos.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const inactivos = productos.filter((p) => !p.activo).length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-6 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">Gestion de productos</h1>
              <p className="text-gray-400 text-sm mt-1">Administra el catalogo de Shopwise</p>
            </div>
            <button
              onClick={abrirModalNuevo}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              <AddIcon style={{ fontSize: 20 }} />
              Nuevo producto
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Stats rapidos */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-6">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Inventory2Icon style={{ fontSize: 24 }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">{productos.length}</p>
                <p className="text-gray-400 text-sm">Total productos</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                <WarningAmberIcon style={{ fontSize: 24 }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">{stockBajo}</p>
                <p className="text-gray-400 text-sm">Stock bajo (≤5)</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                <CheckCircleIcon style={{ fontSize: 24 }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">{sinStock}</p>
                <p className="text-gray-400 text-sm">Sin stock</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 text-gray-500 rounded-xl flex items-center justify-center">
                <VisibilityOffIcon style={{ fontSize: 24 }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">{inactivos}</p>
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
                placeholder="Buscar producto..."
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <select
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
            >
              <option value="">Todas las categorias</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            <div className="flex gap-2">
              {[
                { value: 'todos', label: 'Todos' },
                { value: 'activos', label: 'Activos' },
                { value: 'inactivos', label: 'Desactivados' },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFiltroEstado(f.value)}
                  className={'px-4 py-2 rounded-full text-xs font-semibold transition-all ' + (
                    filtroEstado === f.value ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <p className="text-gray-400 text-sm whitespace-nowrap">{productosFiltrados.length} resultados</p>
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-600">Producto</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Categoria</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Precio</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Stock</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Visibilidad</th>
                  <th className="p-4 text-right font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-gray-400">
                      No se encontraron productos
                    </td>
                  </tr>
                ) : (
                  productosFiltrados.map((p) => (
                    <tr key={p.id} className={'border-b border-gray-50 hover:bg-gray-50 transition-colors ' + (!p.activo ? 'opacity-60' : '')}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                            {p.imagen_url ? (
                              <img src={p.imagen_url} alt={p.nombre} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Inventory2Icon style={{ fontSize: 20 }} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{p.nombre}</p>
                            <p className="text-gray-400 text-xs line-clamp-1 max-w-xs">{p.descripcion}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                          {p.categoria}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-gray-800">S/. {p.precio}</td>
                      <td className="p-4">
                        <span className={'text-xs font-semibold px-3 py-1 rounded-full ' + (
                          p.stock === 0 ? 'bg-red-50 text-red-600' :
                          p.stock <= 5 ? 'bg-orange-50 text-orange-600' :
                          'bg-green-50 text-green-600'
                        )}>
                          {p.stock} unidades
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={'text-xs font-semibold px-3 py-1 rounded-full ' + (
                          p.activo ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                        )}>
                          {p.activo ? 'Visible' : 'Oculto'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleActivo(p)}
                            disabled={procesando === p.id}
                            title={p.activo ? 'Ocultar del catalogo' : 'Mostrar en catalogo'}
                            className={'w-9 h-9 rounded-xl flex items-center justify-center transition-colors ' + (
                              p.activo
                                ? 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                            )}
                          >
                            {p.activo ? <VisibilityOffIcon style={{ fontSize: 18 }} /> : <VisibilityIcon style={{ fontSize: 18 }} />}
                          </button>
                          <button
                            onClick={() => handleEdit(p)}
                            className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors"
                          >
                            <EditIcon style={{ fontSize: 18 }} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="w-9 h-9 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"
                          >
                            <DeleteIcon style={{ fontSize: 18 }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-extrabold text-gray-800">
                {editId ? 'Editar producto' : 'Nuevo producto'}
              </h3>
              <button onClick={cerrarModal} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                <CloseIcon style={{ fontSize: 18 }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nombre del producto *</label>
                <input
                  type="text"
                  placeholder="Ej: Mouse Inalambrico"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Categoria *</label>
                  <select
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                    value={form.categoria_id}
                    onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
                    required
                  >
                    <option value="">Selecciona categoria</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Precio (S/.) *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                    value={form.precio}
                    onChange={(e) => setForm({ ...form, precio: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Stock disponible *</label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  required
                />
              </div>

              {/* Subida de imagen real */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Imagen del producto</label>

                {form.imagen_url ? (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200">
                    <img src={form.imagen_url} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, imagen_url: '' })}
                      className="absolute top-1 right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                    >
                      <HighlightOffIcon className="text-red-500" style={{ fontSize: 18 }} />
                    </button>
                  </div>
                ) : (
                  <label className={'flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed border-gray-200 rounded-xl py-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors ' + (subiendoImagen ? 'pointer-events-none opacity-60' : '')}>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={subiendoImagen}
                    />
                    {subiendoImagen ? (
                      <>
                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="text-sm text-gray-500">Subiendo imagen...</p>
                      </>
                    ) : (
                      <>
                        <CloudUploadIcon className="text-gray-400" style={{ fontSize: 32 }} />
                        <p className="text-sm text-gray-500 font-medium">Haz clic para subir una imagen</p>
                        <p className="text-xs text-gray-400">PNG, JPG o WEBP (max 5MB)</p>
                      </>
                    )}
                  </label>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Descripcion</label>
                <textarea
                  rows={4}
                  placeholder="Describe el producto..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 resize-none"
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading || subiendoImagen}
                  className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                >
                  {loading ? 'Guardando...' : editId ? 'Actualizar producto' : 'Crear producto'}
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