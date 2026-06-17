'use client';
import { useState } from 'react';
import NavbarPublic from '@/components/NavbarPublic';
import Footer from '@/components/Footer';
import Link from 'next/link';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ChatIcon from '@mui/icons-material/Chat';

export default function ContactoPage() {
  const [formEnviado, setFormEnviado] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormEnviado(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavbarPublic />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-blue-300 font-semibold text-sm uppercase tracking-widest">Escríbenos</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-2 mb-4">Contáctanos</h1>
          <p className="text-blue-200 max-w-xl mx-auto text-lg">
            Estamos aquí para ayudarte. Escríbenos y te responderemos lo antes posible.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Info de contacto */}
          <div className="space-y-5">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6">Información de contacto</h2>

            {[
              { icon: <EmailIcon style={{ fontSize: 22 }} />, color: 'bg-blue-50 text-blue-500', title: 'Email', value: 'matias.galvan@tecsup.edu.pe', desc: 'Respuesta en menos de 24h' },
              { icon: <PhoneIcon style={{ fontSize: 22 }} />, color: 'bg-green-50 text-green-500', title: 'Teléfono', value: '+51 949 510 535', desc: 'Lunes a Viernes 9am - 6pm' },
              { icon: <LocationOnIcon style={{ fontSize: 22 }} />, color: 'bg-red-50 text-red-500', title: 'Ubicación', value: 'Lima, Perú', desc: 'Sede principal' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-5 flex items-start gap-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-medium mb-0.5">{item.title}</p>
                  <p className="text-gray-800 font-bold text-sm">{item.value}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}

            {/* Horarios */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <AccessTimeIcon className="text-blue-500" style={{ fontSize: 20 }} />
                <h3 className="font-bold text-gray-800">Horario de atención</h3>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  { dia: 'Lunes - Viernes', hora: '9:00 AM - 6:00 PM' },
                  { dia: 'Sábado', hora: '9:00 AM - 1:00 PM' },
                  { dia: 'Domingo', hora: 'Cerrado' },
                ].map((item) => (
                  <div key={item.dia} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
                    <span className="text-gray-500">{item.dia}</span>
                    <span className={`font-semibold ${item.hora === 'Cerrado' ? 'text-red-400' : 'text-gray-800'}`}>{item.hora}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Soporte en línea */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <SupportAgentIcon style={{ fontSize: 24 }} />
                <h3 className="font-bold text-lg">Soporte en línea</h3>
              </div>
              <p className="text-blue-200 text-sm mb-4">Nuestro equipo está disponible para ayudarte ahora mismo.</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-green-300 text-sm font-medium">En línea ahora</span>
              </div>
              <a
                href="https://wa.me/51949510535"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <ChatIcon style={{ fontSize: 20 }} />
                Chatear por WhatsApp
              </a>
            </div>
          </div>

          {/* Formulario */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            {formEnviado ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
                  <CheckCircleIcon className="text-green-500" style={{ fontSize: 56 }} />
                </div>
                <h3 className="text-3xl font-extrabold text-gray-800 mb-3">¡Mensaje enviado!</h3>
                <p className="text-gray-400 mb-2">Gracias por contactarnos, <span className="font-semibold text-gray-600">{form.nombre}</span>.</p>
                <p className="text-gray-400 mb-8">Nos pondremos en contacto contigo pronto en <span className="font-semibold text-gray-600">{form.email}</span>.</p>
                <div className="flex gap-4 flex-wrap justify-center">
                  <button
                    onClick={() => { setFormEnviado(false); setForm({ nombre: '', email: '', asunto: '', mensaje: '' }); }}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Enviar otro mensaje
                  </button>
                  <Link href="/explorar" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                    Ver productos
                    <ArrowForwardIcon style={{ fontSize: 18 }} />
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Envíanos un mensaje</h2>
                <p className="text-gray-400 text-sm mb-8">Completa el formulario y te responderemos en menos de 24 horas.</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo *</label>
                      <input
                        type="text"
                        placeholder="Tu nombre"
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 transition-all"
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico *</label>
                      <input
                        type="email"
                        placeholder="tu@email.com"
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 transition-all"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Asunto *</label>
                    <input
                      type="text"
                      placeholder="¿En qué te podemos ayudar?"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 transition-all"
                      value={form.asunto}
                      onChange={(e) => setForm({ ...form, asunto: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje *</label>
                    <textarea
                      rows={6}
                      placeholder="Escribe tu mensaje aquí..."
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 resize-none transition-all"
                      value={form.mensaje}
                      onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                  >
                    Enviar mensaje
                    <ArrowForwardIcon style={{ fontSize: 18 }} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}