'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RateReviewIcon from '@mui/icons-material/RateReview';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

export default function PerfilPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formPerfil, setFormPerfil] = useState({ nombre: '', email: '', telefono: '', direccion: '' });
  const [formPassword, setFormPassword] = useState({ password_actual: '', password_nueva: '', password_confirmar: '' });
  const [showPasswords, setShowPasswords] = useState({ actual: false, nueva: false, confirmar: false });
  const [savingPerfil, setSavingPerfil] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Testimonio
  const [miTestimonio, setMiTestimonio] = useState(null);
  const [testimonioLoading, setTestimonioLoading] = useState(true);
  const [textoTestimonio, setTextoTestimonio] = useState('');
  const [ratingTestimonio, setRatingTestimonio] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [enviandoTestimonio, setEnviandoTestimonio] = useState(false);

  useEffect(() => {
    api.get('/perfil')
      .then((res) => {
        setPerfil(res.data);
        setFormPerfil({
          nombre: res.data.nombre,
          email: res.data.email,
          telefono: res.data.telefono || '',
          direccion: res.data.direccion || '',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));

    api.get('/testimonios/mi-testimonio')
      .then((res) => setMiTestimonio(res.data))
      .catch(() => {})
      .finally(() => setTestimonioLoading(false));
  }, []);

  const handleUpdatePerfil = async (e) => {
    e.preventDefault();
    setSavingPerfil(true);
    try {
      const res = await api.put('/perfil', formPerfil);
      setPerfil(res.data.user);
      toast.success('Perfil actualizado correctamente');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al actualizar perfil');
    }
    setSavingPerfil(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (formPassword.password_nueva !== formPassword.password_confirmar) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    if (formPassword.password_nueva.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setSavingPassword(true);
    try {
      await api.put('/perfil/password', {
        password_actual: formPassword.password_actual,
        password_nueva: formPassword.password_nueva,
      });
      toast.success('Contraseña actualizada correctamente');
      setFormPassword({ password_actual: '', password_nueva: '', password_confirmar: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al actualizar contraseña');
    }
    setSavingPassword(false);
  };

  const handleEnviarTestimonio = async (e) => {
    e.preventDefault();
    if (ratingTestimonio === 0) {
      toast.error('Selecciona una calificacion');
      return;
    }
    if (!textoTestimonio.trim()) {
      toast.error('Escribe tu opinion');
      return;
    }
    setEnviandoTestimonio(true);
    try {
      const res = await api.post('/testimonios', { texto: textoTestimonio, rating: ratingTestimonio });
      setMiTestimonio(res.data.testimonio);
      toast.success('Gracias por tu opinion! Sera revisada antes de publicarse.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al enviar tu opinion');
    } finally {
      setEnviandoTestimonio(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100 h-14">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <Link href="/productos">
            <Image src="/logo.png" alt="Shopwise" width={140} height={35} style={{ objectFit: 'contain' }} />
          </Link>
          <Link href="/carrito" className="relative flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
            <ShoppingCartIcon style={{ fontSize: 22 }} />
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/productos" className="text-gray-400 hover:text-blue-600 transition-colors">
            <ArrowBackIcon style={{ fontSize: 22 }} />
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-800">Mi perfil</h1>
        </div>

        {/* Avatar y info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-extrabold">
            {perfil?.nombre?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-extrabold text-gray-800">{perfil?.nombre}</p>
            <p className="text-gray-400 text-sm">{perfil?.email}</p>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full mt-1 inline-block ${
              perfil?.rol === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {perfil?.rol === 'admin' ? '👑 Administrador' : '👤 Cliente'}
            </span>
          </div>
        </div>

        {/* Formulario de perfil */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <BadgeIcon className="text-blue-500" style={{ fontSize: 22 }} />
            <h2 className="text-lg font-bold text-gray-800">Información personal</h2>
          </div>
          <form onSubmit={handleUpdatePerfil} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <div className="relative">
                <PersonIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 18 }} />
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  value={formPerfil.nombre}
                  onChange={(e) => setFormPerfil({ ...formPerfil, nombre: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <div className="relative">
                <EmailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 18 }} />
                <input
                  type="email"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  value={formPerfil.email}
                  onChange={(e) => setFormPerfil({ ...formPerfil, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 18 }} />
                <input
                  type="tel"
                  placeholder="+51 999 999 999"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  value={formPerfil.telefono}
                  onChange={(e) => setFormPerfil({ ...formPerfil, telefono: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de envío</label>
              <div className="relative">
                <LocationOnIcon className="absolute left-3 top-3.5 text-gray-400" style={{ fontSize: 18 }} />
                <textarea
                  rows={2}
                  placeholder="Av. Ejemplo 123, Distrito, Ciudad"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 resize-none"
                  value={formPerfil.direccion}
                  onChange={(e) => setFormPerfil({ ...formPerfil, direccion: e.target.value })}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={savingPerfil}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-gray-200"
            >
              <SaveIcon style={{ fontSize: 18 }} />
              {savingPerfil ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </div>

        {/* Tu opinion sobre Shopwise */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <RateReviewIcon className="text-blue-500" style={{ fontSize: 22 }} />
            <h2 className="text-lg font-bold text-gray-800">Tu opinion sobre Shopwise</h2>
          </div>

          {testimonioLoading ? (
            <div className="py-6 text-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : miTestimonio ? (
            <div className={'rounded-xl p-5 border ' + (miTestimonio.aprobado ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200')}>
              <div className="flex items-center gap-1 mb-3">
                {[1,2,3,4,5].map((s) => (
                  <StarIcon key={s} className={s <= miTestimonio.rating ? 'text-yellow-400' : 'text-gray-200'} style={{ fontSize: 18 }} />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">"{miTestimonio.texto}"</p>
              <div className="flex items-center gap-2">
                {miTestimonio.aprobado ? (
                  <>
                    <CheckCircleIcon className="text-green-600" style={{ fontSize: 18 }} />
                    <p className="text-green-700 text-sm font-semibold">Tu opinion ya esta publicada en la web</p>
                  </>
                ) : (
                  <>
                    <HourglassEmptyIcon className="text-orange-600" style={{ fontSize: 18 }} />
                    <p className="text-orange-700 text-sm font-semibold">Tu opinion esta en revision</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleEnviarTestimonio} className="space-y-4">
              <p className="text-gray-400 text-sm">Comparte tu experiencia con Shopwise. Tu opinion sera revisada antes de publicarse en la pagina principal.</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tu calificacion</label>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRatingTestimonio(s)}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      {s <= (hoverRating || ratingTestimonio) ? (
                        <StarIcon className="text-yellow-400" style={{ fontSize: 32 }} />
                      ) : (
                        <StarBorderIcon className="text-gray-300" style={{ fontSize: 32 }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tu opinion</label>
                <textarea
                  rows={4}
                  placeholder="Cuentanos tu experiencia comprando en Shopwise..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 resize-none"
                  value={textoTestimonio}
                  onChange={(e) => setTextoTestimonio(e.target.value)}
                  maxLength={300}
                />
                <p className="text-gray-400 text-xs mt-1 text-right">{textoTestimonio.length}/300</p>
              </div>

              <button
                type="submit"
                disabled={enviandoTestimonio}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-gray-200"
              >
                <RateReviewIcon style={{ fontSize: 18 }} />
                {enviandoTestimonio ? 'Enviando...' : 'Enviar mi opinion'}
              </button>
            </form>
          )}
        </div>

        {/* Formulario de contraseña */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <LockIcon className="text-blue-500" style={{ fontSize: 22 }} />
            <h2 className="text-lg font-bold text-gray-800">Cambiar contraseña</h2>
          </div>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 18 }} />
                <input
                  type={showPasswords.actual ? 'text' : 'password'}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  value={formPassword.password_actual}
                  onChange={(e) => setFormPassword({ ...formPassword, password_actual: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, actual: !showPasswords.actual })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPasswords.actual ? <VisibilityOffIcon style={{ fontSize: 18 }} /> : <VisibilityIcon style={{ fontSize: 18 }} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 18 }} />
                <input
                  type={showPasswords.nueva ? 'text' : 'password'}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  value={formPassword.password_nueva}
                  onChange={(e) => setFormPassword({ ...formPassword, password_nueva: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, nueva: !showPasswords.nueva })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPasswords.nueva ? <VisibilityOffIcon style={{ fontSize: 18 }} /> : <VisibilityIcon style={{ fontSize: 18 }} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 18 }} />
                <input
                  type={showPasswords.confirmar ? 'text' : 'password'}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  value={formPassword.password_confirmar}
                  onChange={(e) => setFormPassword({ ...formPassword, password_confirmar: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirmar: !showPasswords.confirmar })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPasswords.confirmar ? <VisibilityOffIcon style={{ fontSize: 18 }} /> : <VisibilityIcon style={{ fontSize: 18 }} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={savingPassword}
              className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors disabled:bg-gray-200"
            >
              <LockIcon style={{ fontSize: 18 }} />
              {savingPassword ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}