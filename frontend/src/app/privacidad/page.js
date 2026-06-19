import NavbarPublic from '@/components/NavbarPublic';
import Footer from '@/components/Footer';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedIcon from '@mui/icons-material/Verified';
import LockIcon from '@mui/icons-material/Lock';

export default function PrivacidadPage() {
  const secciones = [
    {
      titulo: '1. Informacion que recopilamos',
      contenido: 'Recopilamos informacion que nos proporcionas directamente, como nombre, correo electronico, direccion y datos de pago al crear una cuenta o realizar una compra. Tambien recopilamos informacion sobre tu uso de nuestros servicios de forma automatica.',
    },
    {
      titulo: '2. Uso de la informacion',
      contenido: 'Usamos tu informacion para procesar pedidos, gestionar tu cuenta, enviarte notificaciones sobre tus compras, mejorar nuestros servicios y cumplir con obligaciones legales. No vendemos tu informacion personal a terceros.',
    },
    {
      titulo: '3. Compartir informacion',
      contenido: 'Podemos compartir tu informacion con proveedores de servicios de pago y logistica necesarios para completar tus pedidos. Estos terceros estan obligados a proteger tu informacion y solo pueden usarla para los fines especificados.',
    },
    {
      titulo: '4. Seguridad de datos',
      contenido: 'Implementamos medidas de seguridad tecnicas y organizativas para proteger tu informacion personal contra acceso no autorizado, perdida o alteracion. Usamos encriptacion SSL para proteger las transacciones en linea.',
    },
    {
      titulo: '5. Cookies',
      contenido: 'Usamos cookies y tecnologias similares para mejorar tu experiencia, recordar tus preferencias y analizar el uso de nuestro sitio. Puedes controlar el uso de cookies a traves de la configuracion de tu navegador.',
    },
    {
      titulo: '6. Tus derechos',
      contenido: 'Tienes derecho a acceder, corregir o eliminar tu informacion personal. Puedes solicitar una copia de tus datos o pedir que los eliminemos contactando a nuestro equipo de soporte. Responderemos a tu solicitud en un plazo de 30 dias.',
    },
    {
      titulo: '7. Retencion de datos',
      contenido: 'Conservamos tu informacion personal durante el tiempo necesario para cumplir con los fines descritos en esta politica, a menos que la ley requiera un periodo de retencion mas largo.',
    },
    {
      titulo: '8. Menores de edad',
      contenido: 'Nuestros servicios no estan dirigidos a menores de 18 anos. No recopilamos intencionalmente informacion personal de menores. Si descubrimos que hemos recopilado datos de un menor, los eliminaremos inmediatamente.',
    },
    {
      titulo: '9. Cambios a esta politica',
      contenido: 'Podemos actualizar esta Politica de Privacidad periodicamente. Te notificaremos sobre cambios significativos por correo electronico o mediante un aviso en nuestro sitio web. El uso continuado de nuestros servicios implica la aceptacion de los cambios.',
    },
    {
      titulo: '10. Contacto',
      contenido: 'Si tienes preguntas sobre esta Politica de Privacidad o sobre el tratamiento de tus datos personales, puedes contactarnos en matias.galvan@tecsup.edu.pe o llamar al +51 949 510 535.',
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavbarPublic />

      {/* Header */}
      <div className="relative py-20 px-6 overflow-hidden bg-gradient-to-r from-purple-600 to-blue-700">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-cyan-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <PrivacyTipIcon className="text-white" style={{ fontSize: 32 }} />
          </div>
          <span className="text-purple-300 font-semibold text-sm uppercase tracking-widest mb-4 block">Legal</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Politica de Privacidad</h1>
          <p className="text-purple-200 max-w-xl mx-auto">Ultima actualizacion: Junio 2026</p>
        </div>
      </div>

      {/* Badges de seguridad */}
      <section className="py-10 bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <SecurityIcon style={{ fontSize: 24 }} />, color: 'text-blue-500 bg-blue-50', title: 'Datos encriptados', desc: 'SSL de 256 bits' },
              { icon: <VerifiedIcon style={{ fontSize: 24 }} />, color: 'text-green-500 bg-green-50', title: 'No vendemos datos', desc: 'Tu info es privada' },
              { icon: <LockIcon style={{ fontSize: 24 }} />, color: 'text-purple-500 bg-purple-50', title: 'Control total', desc: 'Elimina tus datos' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className={'w-12 h-12 ' + item.color + ' rounded-xl flex items-center justify-center flex-shrink-0'}>
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{item.title}</p>
                  <p className="text-gray-400 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-6 py-16 flex-1 w-full">

        {/* Intro */}
        <div className="bg-purple-50 rounded-2xl p-6 mb-10 border border-purple-100">
          <p className="text-purple-700 text-sm leading-relaxed">
            En Shopwise nos tomamos muy en serio la privacidad de nuestros usuarios. Esta Politica de Privacidad describe
            como recopilamos, usamos y protegemos tu informacion personal cuando usas nuestros servicios.
          </p>
        </div>

        {/* Secciones */}
        <div className="space-y-6">
          {secciones.map((seccion, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-lg font-extrabold text-gray-800 mb-3">{seccion.titulo}</h2>
              <p className="text-gray-500 text-sm leading-relaxed">{seccion.contenido}</p>
            </div>
          ))}
        </div>

        {/* Contacto */}
        <div className="mt-10 bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
          <h3 className="font-extrabold text-gray-800 mb-2">Tienes preguntas sobre tus datos?</h3>
          <p className="text-gray-400 text-sm mb-4">Nuestro equipo esta disponible para ayudarte con cualquier consulta sobre privacidad.</p>
          <Link href="/contacto" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
            Contactar soporte
            <ArrowForwardIcon style={{ fontSize: 18 }} />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}