import { Plus_Jakarta_Sans } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'] });

export const metadata = {
  title: 'Shopwise',
  description: 'Tu tienda inteligente',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={jakarta.className} style={{ fontFamily: jakarta.style.fontFamily }}>
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                },
                success: {
                  style: {
                    background: '#f0fdf4',
                    color: '#16a34a',
                    border: '1px solid #bbf7d0',
                  },
                  iconTheme: {
                    primary: '#16a34a',
                    secondary: '#f0fdf4',
                  },
                },
                error: {
                  style: {
                    background: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                  },
                  iconTheme: {
                    primary: '#dc2626',
                    secondary: '#fef2f2',
                  },
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}