import NavbarPublic from '@/components/NavbarPublic';
import Footer from '@/components/Footer';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GavelIcon from '@mui/icons-material/Gavel';

export default function TerminosPage() {
  const secciones = [
    {
      titulo: '1. Aceptacion de los terminos',
      contenido: 'Al acceder y utilizar Shopwise, aceptas estos Terminos y Condiciones en su totalidad. Si no estas de acuerdo con alguno de estos terminos, no debes usar nuestros servicios. Nos reservamos el derecho de modificar estos terminos en cualquier momento.',
    },
    {
      titulo: '2. Uso del servicio',
      contenido: 'Shopwise es una plataforma de comercio electronico que permite a los usuarios comprar productos en linea. Te comprometes a usar el servicio solo para fines legales y de acuerdo con estos terminos. No puedes usar el servicio para actividades fraudulentas o ilegales.',
    },
    {
      titulo: '3. Cuenta de usuario',
      contenido: 'Para realizar compras necesitas crear una cuenta. Eres responsable de mantener la confidencialidad de tu contrasena y de todas las actividades realizadas bajo tu cuenta. Debes notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta.',
    },
    {
      titulo: '4. Productos y precios',
      contenido: 'Nos reservamos el derecho de modificar los precios y la disponibilidad de los productos en cualquier momento. Los precios mostrados incluyen impuestos aplicables. En caso de error en el precio, nos reservamos el derecho de cancelar el pedido.',
    },
    {
      titulo: '5. Proceso de compra',
      contenido: 'Al realizar una compra, aceptas pagar el precio indicado mas los gastos de envio aplicables. El contrato de compraventa se perfecciona cuando confirmamos tu pedido por correo electronico. Nos reservamos el derecho de rechazar pedidos.',
    },
    {
      titulo: '6. Envio y entrega',
      contenido: 'Los tiempos de entrega son estimados y pueden variar. No somos responsables por retrasos causados por terceros o circunstancias fuera de nuestro control. El riesgo de perdida o dano del producto pasa al comprador una vez entregado.',
    },
    {
      titulo: '7. Devolucion y reembolso',
      contenido: 'Tienes 30 dias desde la recepcion del producto para solicitar una devolucion. El producto debe estar en perfectas condiciones y con su empaque original. Los reembolsos se procesaran en un plazo de 5-10 dias habiles.',
    },
    {
      titulo: '8. Limitacion de responsabilidad',
      contenido: 'Shopwise no sera responsable por danos indirectos, incidentales o consecuentes derivados del uso del servicio. Nuestra responsabilidad maxima se limita al monto pagado por el producto en cuestion.',
    },
    {
      titulo: '9. Propiedad intelectual',
      contenido: 'Todo el contenido de Shopwise, incluyendo textos, imagenes, logos y software, esta protegido por derechos de autor. No puedes reproducir, distribuir o crear trabajos derivados sin nuestro permiso expreso.',
    },
    {
      titulo: '10. Ley aplicable',
      contenido: 'Estos terminos se rigen por las leyes de la Republica del Peru. Cualquier disputa sera sometida a la jurisdiccion exclusiva de los tribunales de Lima, Peru.',
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavbarPublic />

      {/* Header */}
      <div className="relative py-20 px-6 overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-cyan-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <GavelIcon className="text-white" style={{ fontSize: 32 }} />
          </div>
          <span className="text-blue-300 font-semibold text-sm uppercase tracking-widest mb-4 block">Legal</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Terminos y Condiciones</h1>
          <p className="text-blue-200 max-w-xl mx-auto">Ultima actualizacion: Junio 2026</p>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-6 py-16 flex-1 w-full">

        {/* Intro */}
        <div className="bg-blue-50 rounded-2xl p-6 mb-10 border border-blue-100">
          <p className="text-blue-700 text-sm leading-relaxed">
            Bienvenido a Shopwise. Por favor, lee detenidamente estos Terminos y Condiciones antes de usar nuestros servicios.
            Al acceder a nuestra plataforma, confirmas que has leido, entendido y aceptas estar sujeto a estos terminos.
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
          <h3 className="font-extrabold text-gray-800 mb-2">Tienes preguntas?</h3>
          <p className="text-gray-400 text-sm mb-4">Si tienes dudas sobre estos terminos, contactanos directamente.</p>
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