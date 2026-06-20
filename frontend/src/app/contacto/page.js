'use client';
import { useState } from 'react';
import NavbarPublic from '@/components/NavbarPublic';
import Footer from '@/components/Footer';
import Link from 'next/link';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ChatIcon from '@mui/icons-material/Chat';
import StarIcon from '@mui/icons-material/Star';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

export default function ContactoPage() {
  const [formEnviado, setFormEnviado] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '', tipo: 'consulta' });
  const [faqAbierto, setFaqAbierto] = useState(null);
  const [email, setEmail] = useState('');
  const [newsletterEnviado, setNewsletterEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contacto', form);
      setFormEnviado(true);
    } catch (error) {
      toast.error('Error al enviar el mensaje. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletter = async () => {
    if (!email) return;
    setNewsletterLoading(true);
    try {
      await api.post('/newsletter', { email });
      setNewsletterEnviado(true);
      setEmail('');
    } catch (error) {
      if (error.response?.data?.message === 'Este email ya esta suscrito') {
        setNewsletterEnviado(true);
      } else {
        toast.error('Error al suscribirse. Intenta de nuevo.');
      }
    } finally {
      setNewsletterLoading(false);
    }
  };

  const faqs = [
    { pregunta: 'Cuanto tiempo tarda el envio?', respuesta: 'Los envios se realizan en 24-48 horas habiles. Una vez despachado tu pedido recibiras un correo con el numero de seguimiento.' },
    { pregunta: 'Como puedo devolver un producto?', respuesta: 'Tienes 30 dias desde la recepcion del producto para solicitar una devolucion. El producto debe estar en perfectas condiciones y con su empaque original.' },
    { pregunta: 'Cuales son los metodos de pago?', respuesta: 'Aceptamos tarjetas de credito y debito (Visa, Mastercard, Amex), transferencias bancarias y pagos simulados a traves de nuestra plataforma.' },
    { pregunta: 'Como puedo rastrear mi pedido?', respuesta: 'Una vez realizado tu pedido podras ver el estado en tu perfil en la seccion Mis pedidos. Tambien recibiras notificaciones por correo electronico.' },
    { pregunta: 'Los productos tienen garantia?', respuesta: 'Si, todos nuestros productos tienen 30 dias de garantia. En caso de defecto de fabrica realizamos el cambio sin costo adicional.' },
  ];

  const testimonios = [
    { nombre: 'Ana G.', cargo: 'Cliente verificada', texto: 'El soporte fue increible. Respondieron en menos de 1 hora y resolvieron mi problema de inmediato.', avatar: 'A' },
    { nombre: 'Luis M.', cargo: 'Cliente frecuente', texto: 'Muy facil contactarlos. El chat de WhatsApp es super rapido y efectivo.', avatar: 'L' },
    { nombre: 'Sofia R.', cargo: 'Cliente habitual', texto: 'Excelente atencion al cliente. Se nota que les importa la satisfaccion del usuario.', avatar: 'S' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavbarPublic />

      {/* Header */}
      <div className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/bg-contacto.png" alt="fondo" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-blue-900/80" />
        </div>
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <span className="text-blue-300 font-semibold text-sm uppercase tracking-widest mb-4 block">Escribenos</span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mt-2 mb-6 leading-tight">
            Contacta<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">nos</span>
          </h1>
          <p className="text-blue-200 max-w-xl mx-auto text-lg mb-10">
            Estamos aqui para ayudarte. Escribenos y te responderemos lo antes posible.
          </p>
          <div className="flex items-center gap-8 justify-center">
            {[
              { num: '<1h', label: 'Tiempo de respuesta' },
              { num: '24/7', label: 'Disponibilidad' },
              { num: '98%', label: 'Satisfaccion' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-extrabold text-white">{stat.num}</p>
                <p className="text-blue-300 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Canales rapidos */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <ChatIcon style={{ fontSize: 24 }} />, color: 'bg-green-50 text-green-600 border-green-200', title: 'WhatsApp', desc: 'Respuesta inmediata', link: 'https://wa.me/51949510535' },
              { icon: <EmailIcon style={{ fontSize: 24 }} />, color: 'bg-blue-50 text-blue-600 border-blue-200', title: 'Email', desc: 'matias.galvan@tecsup.edu.pe', link: 'mailto:matias.galvan@tecsup.edu.pe' },
              { icon: <PhoneIcon style={{ fontSize: 24 }} />, color: 'bg-purple-50 text-purple-600 border-purple-200', title: 'Telefono', desc: '+51 949 510 535', link: 'tel:+51949510535' },
            ].map((item) => (
              <a key={item.title} href={item.link} target="_blank" rel="noopener noreferrer"
                className={'group flex items-center gap-4 p-5 rounded-2xl border-2 transition-all hover:shadow-lg hover:scale-[1.02] ' + item.color}>
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{item.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                </div>
                <ArrowForwardIcon className="text-gray-300 group-hover:translate-x-1 transition-transform" style={{ fontSize: 18 }} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Seccion principal */}
      <div className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* Columna izquierda */}
          <div className="lg:col-span-2 space-y-5">

            {/* Info de contacto */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-extrabold text-gray-800 mb-4">Informacion de contacto</h3>
              <div className="space-y-4">
                {[
                  { icon: <EmailIcon style={{ fontSize: 18 }} />, color: 'bg-blue-50 text-blue-500', title: 'Email', value: 'matias.galvan@tecsup.edu.pe' },
                  { icon: <PhoneIcon style={{ fontSize: 18 }} />, color: 'bg-green-50 text-green-500', title: 'Telefono', value: '+51 949 510 535' },
                  { icon: <LocationOnIcon style={{ fontSize: 18 }} />, color: 'bg-red-50 text-red-500', title: 'Ubicacion', value: 'Tecsup, Miraflores - Lima' },
                  { icon: <AccessTimeIcon style={{ fontSize: 18 }} />, color: 'bg-orange-50 text-orange-500', title: 'Horario', value: 'Lun-Vie 9am-6pm / Sab 9am-1pm' },
                ].map((item) => (
                  <div key={item.title} className="flex items-center gap-3">
                    <div className={'w-9 h-9 ' + item.color + ' rounded-xl flex items-center justify-center flex-shrink-0'}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">{item.title}</p>
                      <p className="text-gray-800 font-semibold text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Soporte + Redes */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <SupportAgentIcon style={{ fontSize: 22 }} />
                <h3 className="font-bold">Soporte en linea</h3>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-green-300 text-sm font-medium">En linea ahora</span>
              </div>
              <a href="https://wa.me/51949510535" target="_blank" rel="noopener noreferrer"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors mb-4">
                <ChatIcon style={{ fontSize: 18 }} />
                Chatear por WhatsApp
              </a>
              <div className="border-t border-white/20 pt-4">
                <p className="text-blue-200 text-xs mb-3">Siguenos en redes sociales</p>
                <div className="flex gap-2">
                  {[
                    { icon: <FacebookIcon style={{ fontSize: 18 }} />, color: 'hover:bg-blue-700' },
                    { icon: <InstagramIcon style={{ fontSize: 18 }} />, color: 'hover:bg-pink-600' },
                    { icon: <TwitterIcon style={{ fontSize: 18 }} />, color: 'hover:bg-sky-500' },
                  ].map((red, i) => (
                    <button key={i} className={'w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors ' + red.color}>
                      {red.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats de soporte */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-extrabold text-gray-800 mb-4 text-sm uppercase tracking-wide">Nuestros numeros</h3>
              <div className="space-y-4">
                {[
                  { num: '500+', label: 'Consultas resueltas', color: 'bg-blue-50 text-blue-600', icon: '💬' },
                  { num: '<1h', label: 'Tiempo de respuesta', color: 'bg-green-50 text-green-600', icon: '⚡' },
                  { num: '98%', label: 'Clientes satisfechos', color: 'bg-purple-50 text-purple-600', icon: '⭐' },
                  { num: '24/7', label: 'Disponibilidad', color: 'bg-orange-50 text-orange-600', icon: '🕐' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className={'w-12 h-12 ' + stat.color + ' rounded-xl flex items-center justify-center text-xl flex-shrink-0'}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className={'text-xl font-extrabold ' + stat.color.split(' ')[1]}>{stat.num}</p>
                      <p className="text-gray-400 text-xs">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha - Formulario */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            {formEnviado ? (
              <div className="flex flex-col items-center justify-center text-center py-20">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
                  <CheckCircleIcon className="text-green-500" style={{ fontSize: 56 }} />
                </div>
                <h3 className="text-3xl font-extrabold text-gray-800 mb-3">Mensaje enviado!</h3>
                <p className="text-gray-400 mb-2">Gracias, <span className="font-semibold text-gray-600">{form.nombre}</span>.</p>
                <p className="text-gray-400 mb-8">Te responderemos pronto en <span className="font-semibold text-gray-600">{form.email}</span>.</p>
                <div className="flex gap-4 flex-wrap justify-center">
                  <button onClick={() => { setFormEnviado(false); setForm({ nombre: '', email: '', asunto: '', mensaje: '', tipo: 'consulta' }); }}
                    className="text-blue-600 font-semibold hover:underline">
                    Enviar otro mensaje
                  </button>
                  <Link href="/explorar" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                    Ver productos <ArrowForwardIcon style={{ fontSize: 18 }} />
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-extrabold text-gray-800 mb-1">Envianos un mensaje</h2>
                  <p className="text-gray-400 text-sm">Completa el formulario y te responderemos en menos de 24 horas.</p>
                </div>

                {/* Tipo de consulta */}
                <div className="flex gap-2 mb-6 flex-wrap">
                  {[
                    { value: 'consulta', label: '💬 Consulta' },
                    { value: 'soporte', label: '🔧 Soporte' },
                    { value: 'reclamo', label: '⚠️ Reclamo' },
                    { value: 'sugerencia', label: '💡 Sugerencia' },
                  ].map((tipo) => (
                    <button key={tipo.value} onClick={() => setForm({ ...form, tipo: tipo.value })}
                      className={'px-4 py-2 rounded-full text-xs font-semibold transition-all border ' + (form.tipo === tipo.value ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400')}>
                      {tipo.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nombre completo *</label>
                      <input type="text" placeholder="Tu nombre completo" required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 transition-all"
                        value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Correo electronico *</label>
                      <input type="email" placeholder="tu@email.com" required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 transition-all"
                        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Asunto *</label>
                    <input type="text" placeholder="En que te podemos ayudar?" required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 transition-all"
                      value={form.asunto} onChange={(e) => setForm({ ...form, asunto: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Mensaje *</label>
                    <textarea rows={7} placeholder="Escribe tu mensaje aqui..." required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 resize-none transition-all"
                      value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} />
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200 text-base">
                    {loading ? 'Enviando...' : 'Enviar mensaje'}
                    <ArrowForwardIcon style={{ fontSize: 20 }} />
                  </button>

                  {/* Badges */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {[
                      { icon: '🔒', text: 'Datos seguros' },
                      { icon: '⚡', text: 'Respuesta rapida' },
                      { icon: '✅', text: 'Sin spam' },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-2 justify-center bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <span>{item.icon}</span>
                        <span className="text-xs text-gray-500 font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* FAQs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-500 font-semibold text-sm uppercase tracking-widest">FAQ</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Preguntas frecuentes</h2>
            <p className="text-gray-400 mt-3">Encuentra respuestas rapidas a las preguntas mas comunes</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button onClick={() => setFaqAbierto(faqAbierto === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-gray-800 text-sm">{faq.pregunta}</span>
                  <ExpandMoreIcon className={'text-gray-400 transition-transform flex-shrink-0 ml-4 ' + (faqAbierto === i ? 'rotate-180' : '')} style={{ fontSize: 20 }} />
                </button>
                {faqAbierto === i && (
                  <div className="px-5 pb-5 border-t border-gray-50">
                    <p className="text-gray-500 text-sm leading-relaxed pt-4">{faq.respuesta}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-500 font-semibold text-sm uppercase tracking-widest">Opiniones</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Lo que dicen sobre nuestro soporte</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonios.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((s) => <StarIcon key={s} className="text-yellow-400" style={{ fontSize: 16 }} />)}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">"{t.texto}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">{t.avatar}</div>
                  <div>
                    <p className="text-gray-800 font-semibold text-sm">{t.nombre}</p>
                    <p className="text-gray-400 text-xs">{t.cargo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <EmailOutlinedIcon className="text-white" style={{ fontSize: 32 }} />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-3">Mantente informado</h2>
          <p className="text-blue-200 mb-8">Suscribete y recibe noticias, ofertas y novedades de Shopwise</p>
          {newsletterEnviado ? (
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <CheckCircleIcon className="text-green-400 mx-auto mb-2" style={{ fontSize: 40 }} />
              <p className="text-white font-bold text-lg">Gracias por suscribirte!</p>
              <p className="text-blue-200 text-sm mt-1">Pronto recibiras nuestras novedades</p>
            </div>
          ) : (
            <div className="flex gap-3 max-w-md mx-auto">
              <input type="email" placeholder="tu@email.com"
                className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                value={email} onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNewsletter()} />
              <button
                onClick={handleNewsletter}
                disabled={newsletterLoading}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 disabled:bg-blue-100 transition-colors whitespace-nowrap">
                {newsletterLoading ? 'Enviando...' : 'Suscribirme'}
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}