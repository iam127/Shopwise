'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    const savedUser = Cookies.get('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    Cookies.set('token', res.data.token, { expires: 1 });
    Cookies.set('user', JSON.stringify(res.data.user), { expires: 1 });
    setUser(res.data.user);
    toast.success(`Bienvenido, ${res.data.user.nombre.split(' ')[0]}!`);
    return res.data;
  };

  const register = async (nombre, email, password, telefono, direccion) => {
    const res = await api.post('/auth/register', { nombre, email, password, telefono, direccion });
    toast.success('Cuenta creada exitosamente');
    return res.data;
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setUser(null);
    toast.success('Sesión cerrada');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);