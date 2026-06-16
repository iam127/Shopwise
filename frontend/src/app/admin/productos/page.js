'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminProductosPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    nombre: '', descripcion: '', precio: '', stock: '', imagen_url: '', categoria_id: ''
  });
  const [editId, setEditId] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (user && user.rol !== 'admin') router.push('/productos');
    fetchProductos();
    api.get('/categorias').then((res) => setCategorias(res.data));
  }, [user]);

  const fetchProductos = () => {
    api.get('/productos').then((res) => setProductos(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/productos/${editId}`, form);
        setMensaje('Producto actualizado');
      } else {
        await api.post('/productos', form);
        setMensaje('Producto creado');
      }
      setForm({ nombre: '', descripcion: '', precio: '', stock: '', imagen_url: '', categoria_id: '' });
      setEditId(null);
      fetchProductos();
    } catch (err) {
      setMensaje('Error al guardar producto');
    }
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
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    await api.delete(`/productos/${id}`);
    fetchProductos();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Shopwise Admin</h1>
        <div className="flex gap-4">
          <Link href="/admin/estadisticas" className="text-sm text-gray-600 hover:underline">Estadísticas</Link>
          <Link href="/productos" className="text-sm text-gray-600 hover:underline">Ver tienda</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Gestión de Productos</h2>

        {mensaje && <p className="text-green-600 mb-4">{mensaje}</p>}

        <div className="bg-white p-6 rounded shadow mb-8">
          <h3 className="font-semibold text-lg mb-4">{editId ? 'Editar producto' : 'Nuevo producto'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre"
              className="border p-2 rounded"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
            <select
              className="border p-2 rounded"
              value={form.categoria_id}
              onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
              required
            >
              <option value="">Selecciona categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Precio"
              className="border p-2 rounded"
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Stock"
              className="border p-2 rounded"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="URL de imagen"
              className="border p-2 rounded col-span-2"
              value={form.imagen_url}
              onChange={(e) => setForm({ ...form, imagen_url: e.target.value })}
            />
            <textarea
              placeholder="Descripción"
              className="border p-2 rounded col-span-2"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
            <div className="col-span-2 flex gap-3">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                {editId ? 'Actualizar' : 'Crear'}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => { setEditId(null); setForm({ nombre: '', descripcion: '', precio: '', stock: '', imagen_url: '', categoria_id: '' }); }}
                  className="border px-6 py-2 rounded hover:bg-gray-50"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Categoría</th>
                <th className="p-3 text-left">Precio</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.nombre}</td>
                  <td className="p-3">{p.categoria}</td>
                  <td className="p-3">S/. {p.precio}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline">Editar</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}