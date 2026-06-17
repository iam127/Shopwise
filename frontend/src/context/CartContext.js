'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [carrito, setCarrito] = useState([]);

  const fetchCarrito = async () => {
    if (!user) return;
    try {
      const res = await api.get('/carrito');
      setCarrito(res.data.items);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCarrito();
  }, [user]);

  const addToCart = async (producto_id, cantidad = 1) => {
    try {
      await api.post('/carrito/add', { producto_id, cantidad });
      fetchCarrito();
      toast.success('Producto agregado al carrito');
    } catch (err) {
      toast.error('Error al agregar al carrito');
    }
  };

  const removeFromCart = async (item_id) => {
    try {
      await api.delete(`/carrito/item/${item_id}`);
      fetchCarrito();
      toast.success('Producto eliminado del carrito');
    } catch (err) {
      toast.error('Error al eliminar del carrito');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/carrito/clear');
      setCarrito([]);
      toast.success('Carrito vaciado');
    } catch (err) {
      toast.error('Error al vaciar el carrito');
    }
  };

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  return (
    <CartContext.Provider value={{ carrito, addToCart, removeFromCart, clearCart, fetchCarrito, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);