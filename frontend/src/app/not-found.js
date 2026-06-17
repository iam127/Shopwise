import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <Image src="/logo.png" alt="Shopwise" width={150} height={40} style={{ objectFit: 'contain' }} className="mb-8" />
      
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-blue-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Página no encontrada</h2>
        <p className="text-gray-400 mb-8">La página que buscas no existe o fue movida.</p>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/productos"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Ir a productos
          </Link>
          <Link
            href="/"
            className="border border-gray-200 text-gray-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}