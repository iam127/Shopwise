import NavbarPublic from '@/components/NavbarPublic';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GroupsIcon from '@mui/icons-material/Groups';
import StarIcon from '@mui/icons-material/Star';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';

export default function NosotrosPage() {
  const equipo = [
    { nombre: 'Matias Galvan', cargo: 'CEO & Founder', avatar: 'M', color: 'bg-blue-600', descripcion: 'Apasionado por la tecnologia y el comercio electronico. Lider del equipo Shopwise.' },
    { nombre: 'Ana Torres', cargo: 'CTO', avatar: 'A', color: 'bg-purple-600', descripcion: 'Experta en desarrollo de software y arquitectura de sistemas escalables.' },
    { nombre: 'Carlos Ruiz', cargo: 'Head of Design', avatar: 'C', color: 'bg-green-600', descripcion: 'Disenador UX/UI con experiencia en crear experiencias digitales memorables.' },
    { nombre: 'Sofia Martinez', cargo: 'Marketing Lead', avatar: 'S', color: 'bg-orange-500', descripcion: 'Especialista en marketing digital y estrategias de crecimiento organico.' },
  ];

  const timeline = [
    { ano: '13 Jun', titulo: 'El inicio', desc: 'Shopwise nace como proyecto academico de un grupo de estudiantes de Tecsup apasionados por la tecnologia y el comercio electronico.' },
    { ano: '15 Jun', titulo: 'Primer prototipo', desc: 'Desarrollamos el primer prototipo con el modelo E-R, diagrama de arquitectura y estructura base del proyecto.' },
    { ano: '20 Jun', titulo: 'Backend listo', desc: 'Completamos el backend con Express y PostgreSQL. Rutas de autenticacion, productos, carrito, pedidos y pagos funcionando.' },
    { ano: '25 Jun', titulo: 'Frontend lanzado', desc: 'Lanzamos el frontend con Next.js. Landing page publica, catalogo de productos, carrito y panel de administracion.' },
    { ano: '3 Jul', titulo: 'Despliegue final', desc: 'Shopwise desplegado en produccion. Frontend en Vercel y backend con base de datos en Render. Proyecto completado.' },
  ];

  const testimonios = [
    { nombre: 'Roberto L.', cargo: 'Cliente desde 2024', texto: 'Shopwise cambio la forma en que compro online. Excelente servicio y productos de calidad.', avatar: 'R' },
    { nombre: 'Carmen V.', cargo: 'Cliente frecuente', texto: 'El equipo de soporte es increible. Siempre dispuestos a ayudar con cualquier consulta.', avatar: 'C' },
    { nombre: 'Diego P.', cargo: 'Cliente verificado', texto: 'Los mejores precios del mercado con la mejor calidad. No compro en otro lado.', avatar: 'D' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavbarPublic />

      {/* Header con imagen de fondo */}
      <div className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/bg-nosotros.png" alt="fondo" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-blue-900/75" />
        </div>
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <span className="text-blue-300 font-semibold text-sm uppercase tracking-widest mb-6 block">
            Quienes somos
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mt-2 mb-6 leading-tight">
            Sobre <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Shopwise</span>
          </h1>
          <p className="text-blue-200 max-w-2xl mx-auto text-lg leading-relaxed">
            Somos una plataforma de e-commerce peruana comprometida en ofrecerte la mejor experiencia de compra online con productos de calidad a precios justos.
          </p>
          <div className="flex items-center gap-8 justify-center mt-10">
            {[
              { num: '2023', label: 'Fundados' },
              { num: '1K+', label: 'Clientes' },
              { num: '98%', label: 'Satisfaccion' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold text-white">{stat.num}</p>
                <p className="text-blue-300 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mision con imagen real */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-blue-500 font-semibold text-sm uppercase tracking-widest">Nuestra mision</span>
              <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-6">
                Hacer las compras mas inteligentes
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4 text-lg">
                Shopwise nacio con la mision de hacer que las compras en linea sean mas inteligentes, rapidas y seguras para todos los peruanos.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                Somos un equipo apasionado por la tecnologia y el comercio electronico, comprometidos en ofrecerte la mejor experiencia de compra con productos de calidad a precios justos.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  'Productos verificados y de calidad garantizada',
                  'Pagos seguros con multiples metodos',
                  'Soporte al cliente disponible 24/7',
                  'Entregas rapidas a todo el Peru',
                  'Precios competitivos y ofertas exclusivas',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircleIcon className="text-blue-500 flex-shrink-0" style={{ fontSize: 20 }} />
                    <p className="text-gray-600 text-sm">{item}</p>
                  </div>
                ))}
              </div>
              <Link href="/register" className="group inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                Unete a Shopwise
                <ArrowForwardIcon style={{ fontSize: 20 }} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden h-96 shadow-2xl">
                <img src="/img-mision.png" alt="Nuestro equipo" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-4 -right-4 bg-blue-600 text-white rounded-2xl p-4 shadow-xl">
                <p className="text-2xl font-extrabold">98%</p>
                <p className="text-blue-200 text-xs">Satisfaccion</p>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                <p className="text-2xl font-extrabold text-gray-800">24/7</p>
                <p className="text-gray-400 text-xs">Soporte</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estadisticas animadas */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: '500+', label: 'Productos', icon: <RocketLaunchIcon style={{ fontSize: 28 }} /> },
              { num: '1K+', label: 'Clientes felices', icon: <GroupsIcon style={{ fontSize: 28 }} /> },
              { num: '4.9★', label: 'Valoracion promedio', icon: <StarIcon style={{ fontSize: 28 }} /> },
              { num: '98%', label: 'Satisfaccion', icon: <TrendingUpIcon style={{ fontSize: 28 }} /> },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white group-hover:bg-white/30 transition-colors">
                  {stat.icon}
                </div>
                <p className="text-4xl font-extrabold text-white mb-1">{stat.num}</p>
                <p className="text-blue-200 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline historia */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-blue-500 font-semibold text-sm uppercase tracking-widest">Historia</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Nuestra trayectoria</h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-blue-100" />
            <div className="space-y-12">
              {timeline.map((item, i) => (
                <div key={item.ano} className={'flex items-center gap-8 ' + (i % 2 === 0 ? 'flex-row' : 'flex-row-reverse')}>
                  <div className={'flex-1 ' + (i % 2 === 0 ? 'text-right' : 'text-left')}>
                    <div className={'inline-block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow ' + (i % 2 === 0 ? '' : '')}>
                      <p className="text-blue-600 font-extrabold text-sm uppercase tracking-widest mb-2">{item.ano}</p>
                      <h3 className="text-xl font-extrabold text-gray-800 mb-2">{item.titulo}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0 z-10 shadow-lg shadow-blue-200">
                    {i + 1}
                  </div>
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-blue-500 font-semibold text-sm uppercase tracking-widest">Lo que nos mueve</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Nuestros valores</h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">Los principios que guian cada decision que tomamos en Shopwise</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <EmojiObjectsIcon style={{ fontSize: 36 }} />, color: 'text-yellow-500 bg-yellow-50', title: 'Innovacion', desc: 'Siempre buscamos nuevas formas de mejorar tu experiencia de compra con tecnologia de vanguardia.', stat: '50+ mejoras al año' },
              { icon: <FavoriteIcon style={{ fontSize: 36 }} />, color: 'text-red-500 bg-red-50', title: 'Pasion', desc: 'Amamos lo que hacemos y eso se refleja en cada detalle de nuestra plataforma y servicio al cliente.', stat: '98% satisfaccion' },
              { icon: <GroupsIcon style={{ fontSize: 36 }} />, color: 'text-blue-500 bg-blue-50', title: 'Comunidad', desc: 'Construimos una comunidad de compradores y vendedores conectados por la confianza y el respeto mutuo.', stat: '1K+ miembros' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className={'w-20 h-20 ' + item.color + ' rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-extrabold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-4">{item.desc}</p>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-blue-600 font-bold text-sm">{item.stat}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-blue-500 font-semibold text-sm uppercase tracking-widest">Las personas detras</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Nuestro equipo</h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">Un equipo apasionado por crear la mejor experiencia de compra para ti</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {equipo.map((miembro) => (
              <div key={miembro.nombre} className="bg-white rounded-3xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className={'w-20 h-20 ' + miembro.color + ' rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg'}>
                  {miembro.avatar}
                </div>
                <h3 className="font-extrabold text-gray-800 mb-1">{miembro.nombre}</h3>
                <p className="text-blue-500 text-xs font-semibold uppercase tracking-wide mb-3">{miembro.cargo}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{miembro.descripcion}</p>
                <div className="flex justify-center gap-2 mt-4">
                  {[1,2,3,4,5].map((s) => <StarIcon key={s} className="text-yellow-400" style={{ fontSize: 12 }} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por que elegirnos */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-blue-500 font-semibold text-sm uppercase tracking-widest">Beneficios</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Por que elegirnos?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: <LocalShippingIcon style={{ fontSize: 28 }} />, color: 'text-blue-500 bg-blue-50', title: 'Envio rapido', desc: 'Recibe tu pedido en 24-48 horas con seguimiento en tiempo real y notificaciones de estado.' },
              { icon: <VerifiedIcon style={{ fontSize: 28 }} />, color: 'text-green-500 bg-green-50', title: 'Compra 100% segura', desc: 'Tus datos y pagos estan protegidos con tecnologia de encriptacion avanzada SSL.' },
              { icon: <SupportAgentIcon style={{ fontSize: 28 }} />, color: 'text-purple-500 bg-purple-50', title: 'Soporte 24/7', desc: 'Nuestro equipo esta disponible las 24 horas del dia para resolver cualquier duda.' },
              { icon: <SecurityIcon style={{ fontSize: 28 }} />, color: 'text-orange-500 bg-orange-50', title: 'Garantia total', desc: '30 dias de garantia en todos los productos. Sin preguntas, sin complicaciones.' },
            ].map((item) => (
              <div key={item.title} className="group bg-white rounded-2xl p-6 flex gap-5 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className={'w-14 h-14 ' + item.color + ' rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform'}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-500 font-semibold text-sm uppercase tracking-widest">Opiniones</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Lo que dicen nuestros clientes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonios.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((s) => <StarIcon key={s} className="text-yellow-400" style={{ fontSize: 16 }} />)}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">"{t.texto}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
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

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-cyan-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
            Unete a la familia
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Listo para comprar inteligente?
          </h2>
          <p className="text-blue-200 mb-10 text-lg">Unete a miles de clientes satisfechos en Shopwise</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register" className="group bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-2xl inline-flex items-center gap-2">
              Crear cuenta gratis
              <ArrowForwardIcon style={{ fontSize: 20 }} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/explorar" className="bg-white/10 text-white px-10 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/20">
              Ver productos
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}