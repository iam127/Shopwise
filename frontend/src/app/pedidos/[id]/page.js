'use client';
import { useState, useEffect, use } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import CancelIcon from '@mui/icons-material/Cancel';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DownloadIcon from '@mui/icons-material/Download';

export default function SeguimientoPedidoPage({ params }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [pedido, setPedido] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numeroPedido, setNumeroPedido] = useState(null);
  const [generandoPdf, setGenerandoPdf] = useState(false);

  useEffect(() => {
    if (!user) return;
    api.get('/pedidos/' + id).then((res) => {
      setPedido(res.data.pedido);
      setItems(res.data.items);
      setLoading(false);
    }).catch(() => router.push('/pedidos'));

    api.get('/pedidos').then((res) => {
      const todos = res.data;
      const total = todos.length;
      const index = todos.findIndex((p) => p.id === parseInt(id));
      if (index !== -1) setNumeroPedido(total - index);
    }).catch(() => {});
  }, [user, id]);

    const cargarLogoBase64 = () => {
    return new Promise((resolve) => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        // Fondo blanco para que el logo no se mezcle con el azul
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => resolve(null);
        img.src = '/logo.png';
    });
    };

  const descargarPDF = async () => {
    setGenerandoPdf(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF();

      const logoBase64 = await cargarLogoBase64();

      const fechaEmision = new Date().toLocaleDateString('es-PE', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
      const fechaPedido = new Date(pedido.creado_en).toLocaleDateString('es-PE', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
      });

      // Encabezado azul
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, 210, 40, 'F');

      // Logo en el encabezado
      if (logoBase64) {
        // Fondo blanco redondeado para el logo
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(12, 6, 36, 16, 3, 3, 'F');
        doc.addImage(logoBase64, 'PNG', 13, 7, 34, 14);
      }

      // Texto del encabezado
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Tu tienda de confianza', 14, 30);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('RECIBO DE COMPRA', 130, 16);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Pedido #' + (numeroPedido || id), 130, 24);
      doc.text('Emitido: ' + fechaEmision, 130, 31);

      // Info del pedido
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Datos del pedido', 14, 55);
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(0.5);
      doc.line(14, 57, 196, 57);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text('Cliente:', 14, 65);
      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'bold');
      doc.text(user.nombre || '-', 45, 65);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text('Email:', 14, 73);
      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'bold');
      doc.text(user.email || '-', 45, 73);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text('Fecha de compra:', 14, 81);
      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'bold');
      doc.text(fechaPedido, 55, 81);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text('Estado:', 14, 89);
      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'bold');
      doc.text(pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1), 45, 89);

      // Tabla de productos
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);
      doc.text('Productos', 14, 102);
      doc.setDrawColor(37, 99, 235);
      doc.line(14, 104, 196, 104);

      autoTable(doc, {
        startY: 108,
        head: [['Producto', 'Cant.', 'Precio unit.', 'Subtotal']],
        body: items.map((item) => [
          item.nombre,
          item.cantidad,
          'S/. ' + parseFloat(item.precio_unitario).toFixed(2),
          'S/. ' + (item.cantidad * item.precio_unitario).toFixed(2),
        ]),
        headStyles: {
          fillColor: [37, 99, 235],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 10,
        },
        bodyStyles: { fontSize: 10, textColor: [30, 30, 30] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
          0: { cellWidth: 90 },
          1: { halign: 'center', cellWidth: 20 },
          2: { halign: 'right', cellWidth: 40 },
          3: { halign: 'right', cellWidth: 40 },
        },
        margin: { left: 14, right: 14 },
      });

      // Resumen de pago
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(120, finalY, 76, pedido.subtotal ? 30 : 18, 3, 3, 'F');

      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.setFont('helvetica', 'normal');

      let lineY = finalY + 8;
      if (pedido.subtotal) {
        doc.text('Subtotal:', 125, lineY);
        doc.text('S/. ' + parseFloat(pedido.subtotal).toFixed(2), 191, lineY, { align: 'right' });
        lineY += 8;
        doc.text('Envio:', 125, lineY);
        const envioTexto = pedido.costo_envio == 0 ? 'Gratis' : 'S/. ' + parseFloat(pedido.costo_envio).toFixed(2);
        doc.text(envioTexto, 191, lineY, { align: 'right' });
        lineY += 8;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(37, 99, 235);
      doc.text('TOTAL:', 125, lineY);
      doc.text('S/. ' + parseFloat(pedido.total).toFixed(2), 191, lineY, { align: 'right' });

      // Footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFillColor(37, 99, 235);
      doc.rect(0, pageHeight - 20, 210, 20, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Shopwise — Tu tienda de confianza | shopwise-vmux.onrender.com', 105, pageHeight - 12, { align: 'center' });
      doc.text('Gracias por tu compra. Este documento es un comprobante de pago valido.', 105, pageHeight - 6, { align: 'center' });

      doc.save('recibo-shopwise-pedido-' + (numeroPedido || id) + '.pdf');
    } catch (err) {
      console.error('Error al generar PDF:', err);
    } finally {
      setGenerandoPdf(false);
    }
  };

  const pasos = [
    { estado: 'pendiente', label: 'Pedido recibido', desc: 'Tu pedido ha sido registrado correctamente', icon: <ReceiptLongIcon style={{ fontSize: 24 }} /> },
    { estado: 'procesando', label: 'En preparacion', desc: 'Estamos preparando tu pedido', icon: <AutorenewIcon style={{ fontSize: 24 }} /> },
    { estado: 'enviado', label: 'En camino', desc: 'Tu pedido esta en camino', icon: <LocalShippingIcon style={{ fontSize: 24 }} /> },
    { estado: 'entregado', label: 'Entregado', desc: 'Tu pedido fue entregado exitosamente', icon: <CheckCircleIcon style={{ fontSize: 24 }} /> },
  ];

  const ordenEstados = ['pendiente', 'procesando', 'enviado', 'entregado'];
  const esCancelado = pedido?.estado === 'cancelado';
  const pasoActual = esCancelado ? -1 : ordenEstados.indexOf(pedido?.estado);

  const formatFecha = (fecha) => new Date(fecha).toLocaleDateString('es-PE', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Debes <Link href="/login" className="text-blue-600 font-semibold hover:underline">iniciar sesión</Link>.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100 h-14">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <Link href="/productos" className="flex items-center min-w-fit">
            <Image src="/logo.png" alt="Shopwise" width={140} height={35} style={{ objectFit: 'contain' }} />
          </Link>
          <Link href="/carrito" className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 font-medium">
            <ShoppingCartIcon style={{ fontSize: 18 }} />
            Carrito
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/pedidos" className="text-gray-400 hover:text-blue-600 transition-colors">
              <ArrowBackIcon style={{ fontSize: 22 }} />
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">
                Seguimiento — Pedido #{numeroPedido || id}
              </h1>
              <p className="text-gray-400 text-sm">{pedido && formatFecha(pedido.creado_en)}</p>
            </div>
          </div>
          <button
            onClick={descargarPDF}
            disabled={generandoPdf}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:bg-blue-400 transition-colors shadow-lg shadow-blue-200"
          >
            <DownloadIcon style={{ fontSize: 18 }} />
            {generandoPdf ? 'Generando...' : 'Recibo PDF'}
          </button>
        </div>

        {/* Estado cancelado */}
        {esCancelado && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 flex items-center gap-4">
            <CancelIcon className="text-red-500" style={{ fontSize: 40 }} />
            <div>
              <p className="font-bold text-red-700 text-lg">Pedido cancelado</p>
              <p className="text-red-500 text-sm">Este pedido fue cancelado. Contacta al soporte si tienes dudas.</p>
            </div>
          </div>
        )}

        {/* Timeline de seguimiento */}
        {!esCancelado && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="font-extrabold text-gray-800 mb-6">Estado del pedido</h2>
            <div className="relative">
              {pasos.map((paso, i) => {
                const completado = i <= pasoActual;
                const activo = i === pasoActual;
                return (
                  <div key={paso.estado} className="flex gap-4 mb-6 last:mb-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        completado ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-300'
                      } ${activo ? 'ring-4 ring-blue-100' : ''}`}>
                        {paso.icon}
                      </div>
                      {i < pasos.length - 1 && (
                        <div className={`w-0.5 flex-1 mt-2 min-h-[24px] transition-all ${
                          i < pasoActual ? 'bg-blue-600' : 'bg-gray-100'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <p className={`font-bold text-sm ${completado ? 'text-gray-800' : 'text-gray-300'}`}>
                        {paso.label}
                        {activo && (
                          <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
                            Actual
                          </span>
                        )}
                      </p>
                      <p className={`text-xs mt-0.5 ${completado ? 'text-gray-400' : 'text-gray-200'}`}>
                        {paso.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Productos del pedido */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="font-extrabold text-gray-800 mb-4 flex items-center gap-2">
            <InventoryIcon className="text-blue-400" style={{ fontSize: 20 }} />
            Productos
          </h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{item.nombre}</p>
                  <p className="text-gray-400 text-xs">{item.cantidad} x S/. {parseFloat(item.precio_unitario).toFixed(2)}</p>
                </div>
                <p className="font-bold text-gray-800 text-sm">
                  S/. {(item.cantidad * item.precio_unitario).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen de pago */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-extrabold text-gray-800 mb-4">Resumen de pago</h2>
          <div className="space-y-2 text-sm text-gray-600">
            {pedido.subtotal && (
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">S/. {parseFloat(pedido.subtotal).toFixed(2)}</span>
              </div>
            )}
            {pedido.costo_envio !== undefined && (
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <LocalShippingIcon style={{ fontSize: 15 }} />
                  Envío
                </span>
                <span className={`font-medium ${pedido.costo_envio == 0 ? 'text-green-600' : ''}`}>
                  {pedido.costo_envio == 0 ? 'Gratis' : 'S/. ' + parseFloat(pedido.costo_envio).toFixed(2)}
                </span>
              </div>
            )}
          </div>
          <div className="border-t pt-3 mt-3 flex justify-between items-center">
            <span className="font-bold text-gray-800">Total pagado</span>
            <span className="font-extrabold text-blue-600 text-xl">S/. {parseFloat(pedido.total).toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Link href="/pedidos" className="text-blue-600 font-semibold hover:underline text-sm">
            ← Volver a mis pedidos
          </Link>
          <button
            onClick={descargarPDF}
            disabled={generandoPdf}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors"
          >
            <DownloadIcon style={{ fontSize: 16 }} />
            {generandoPdf ? 'Generando...' : 'Descargar recibo'}
          </button>
        </div>
      </div>
    </div>
  );
}