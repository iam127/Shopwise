'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx-js-style';
import EmailIcon from '@mui/icons-material/Email';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import CampaignIcon from '@mui/icons-material/Campaign';

export default function AdminNewsletterPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [suscriptores, setSuscriptores] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalCampana, setModalCampana] = useState(false);
  const [campana, setCampana] = useState({ asunto: '', mensaje: '' });
  const [enviando, setEnviando] = useState(false);

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

  const enviarCampana = async (e) => {
    e.preventDefault();
    if (!campana.asunto || !campana.mensaje) {
      toast.error('Completa el asunto y el mensaje');
      return;
    }
    setEnviando(true);
    try {
      const res = await api.post('/newsletter/campana', campana);
      toast.success(res.data.message);
      setModalCampana(false);
      setCampana({ asunto: '', mensaje: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al enviar la campaña');
    } finally {
      setEnviando(false);
    }
  };

  const exportarExcel = () => {
    const headerStyle = {
      fill: { fgColor: { rgb: '2563EB' } },
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 12 },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        top: { style: 'thin', color: { rgb: 'D1D5DB' } },
        bottom: { style: 'thin', color: { rgb: 'D1D5DB' } },
        left: { style: 'thin', color: { rgb: 'D1D5DB' } },
        right: { style: 'thin', color: { rgb: 'D1D5DB' } },
      },
    };
    const cellStyleBase = {
      border: {
        top: { style: 'thin', color: { rgb: 'E5E7EB' } },
        bottom: { style: 'thin', color: { rgb: 'E5E7EB' } },
        left: { style: 'thin', color: { rgb: 'E5E7EB' } },
        right: { style: 'thin', color: { rgb: 'E5E7EB' } },
      },
      alignment: { vertical: 'center' },
    };
    const cellStyleEven = { ...cellStyleBase, fill: { fgColor: { rgb: 'F9FAFB' } } };
    const cellStyleOdd = { ...cellStyleBase, fill: { fgColor: { rgb: 'FFFFFF' } } };
    const estadoActivoStyle = { font: { color: { rgb: '16A34A' }, bold: true } };
    const estadoInactivoStyle = { font: { color: { rgb: '6B7280' }, bold: true } };
    const titulo = 'Suscriptores Newsletter - Shopwise';
    const subtitulo = 'Exportado el ' + new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }) + ' · Total: ' + suscriptores.length + ' suscriptores';
    const headers = ['#', 'Email', 'Fecha de suscripcion', 'Estado'];
    const wsData = [
      [titulo, '', '', ''],
      [subtitulo, '', '', ''],
      [],
      headers,
      ...suscriptores.map((s, i) => [
        i + 1,
        s.email,
        new Date(s.fecha_suscripcion).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }),
        s.activo ? 'Activo' : 'Inactivo',
      ]),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    worksheet['!cols'] = [{ wch: 6 }, { wch: 38 }, { wch: 22 }, { wch: 14 }];
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
    ];
    worksheet['A1'].s = { font: { bold: true, sz: 16, color: { rgb: '1E3A8A' } }, alignment: { horizontal: 'left', vertical: 'center' } };
    worksheet['A2'].s = { font: { italic: true, sz: 10, color: { rgb: '6B7280' } }, alignment: { horizontal: 'left', vertical: 'center' } };
    const headerRowIndex = 3;
    ['A', 'B', 'C', 'D'].forEach((col) => {
      const cellRef = col + (headerRowIndex + 1);
      if (worksheet[cellRef]) worksheet[cellRef].s = headerStyle;
    });
    suscriptores.forEach((s, i) => {
      const rowIndex = headerRowIndex + 1 + i + 1;
      const baseStyle = i % 2 === 0 ? cellStyleEven : cellStyleOdd;
      const refA = 'A' + rowIndex;
      const refB = 'B' + rowIndex;
      const refC = 'C' + rowIndex;
      const refD = 'D' + rowIndex;
      if (worksheet[refA]) worksheet[refA].s = { ...baseStyle, alignment: { ...baseStyle.alignment, horizontal: 'center' } };
      if (worksheet[refB]) worksheet[refB].s = baseStyle;
      if (worksheet[refC]) worksheet[refC].s = baseStyle;
      if (worksheet[refD]) {
        const estadoStyle = s.activo ? estadoActivoStyle : estadoInactivoStyle;
        worksheet[refD].s = { ...baseStyle, ...estadoStyle, alignment: { ...baseStyle.alignment, horizontal: 'center' } };
      }
    });
    worksheet['!rows'] = [{ hpt: 28 }, { hpt: 18 }, { hpt: 6 }, { hpt: 24 }];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Suscriptores');
    XLSX.writeFile(workbook, 'suscriptores_shopwise.xlsx');
    toast.success('Archivo Excel descargado');
  };

  const suscriptoresFiltrados = suscriptores.filter((s) =>
    s.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  const formatFecha = (fecha) => {
    const d = new Date(fecha);
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const haceUnMes = new Date();
  haceUnMes.setMonth(haceUnMes.getMonth() - 1);
  const nuevosUltimoMes = suscriptores.filter((s) => new Date(s.fecha_suscripcion) >= haceUnMes).length;
  const activos = suscriptores.filter((s) => s.activo).length;

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
            <div className="flex gap-3">
              <button
                onClick={() => setModalCampana(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
              >
                <CampaignIcon style={{ fontSize: 20 }} />
                Enviar campaña
              </button>
              <button
                onClick={exportarExcel}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                <DownloadIcon style={{ fontSize: 20 }} />
                Exportar Excel
              </button>
            </div>
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
                <p className="text-2xl font-extrabold text-gray-800">{activos}</p>
                <p className="text-gray-400 text-sm">Activos (recibirán campaña)</p>
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

      {/* Modal de campaña */}
      {modalCampana && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-gray-800">Enviar campaña</h3>
                <p className="text-gray-400 text-sm">Se enviará a {activos} suscriptores activos</p>
              </div>
              <button onClick={() => setModalCampana(false)} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                <CloseIcon style={{ fontSize: 18 }} />
              </button>
            </div>
            <form onSubmit={enviarCampana} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Asunto del email *</label>
                <input
                  type="text"
                  placeholder="Ej: ¡Ofertas exclusivas esta semana!"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  value={campana.asunto}
                  onChange={(e) => setCampana({ ...campana, asunto: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Mensaje *</label>
                <textarea
                  rows={6}
                  placeholder="Escribe el contenido del email aqui..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 resize-none"
                  value={campana.mensaje}
                  onChange={(e) => setCampana({ ...campana, mensaje: e.target.value })}
                  required
                />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                <p className="text-yellow-700 text-xs font-semibold">⚠️ Este email se enviará a todos los suscriptores activos ({activos}). Esta acción no se puede deshacer.</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={enviando}
                  className="flex-1 bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 disabled:bg-green-400 transition-colors flex items-center justify-center gap-2"
                >
                  <SendIcon style={{ fontSize: 18 }} />
                  {enviando ? 'Enviando...' : 'Enviar campaña'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalCampana(false)}
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