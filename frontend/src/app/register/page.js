'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.nombre, form.email, form.password);
      router.push('/login');
    } catch (err) {
      setError('Error al registrarse, intenta de nuevo');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo con imagen */}
      <div
        className="hidden lg:flex w-1/2"
        style={{
        backgroundImage: "url('/bg-auth.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'left center',
        }}
      />

      {/* Panel derecho */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800">Crear cuenta</h1>
            <p className="text-gray-500 mt-2">Únete a Shopwise hoy</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

        <form onSubmit={handleSubmit} className="space-y-5">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input
            type="text"
            placeholder="Ingresa tu nombre completo"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input
            type="email"
            placeholder="Ingresa tu correo electrónico"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
            type="password"
            placeholder="Ingresa tu contraseña"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            />
        </div>
        <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 mt-2"
        >
            Crear cuenta
        </button>
        </form>

          <p className="text-center mt-6 text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}