import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si una peticion falla con 401 y ya no hay token (por ejemplo, justo despues
// de cerrar sesion), no la tratamos como un error real: simplemente se cancela
// silenciosamente en vez de mostrar el error en consola.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = Cookies.get('token');
    if (error.response?.status === 401 && !token) {
      return new Promise(() => {});
    }
    return Promise.reject(error);
  }
);

export default api;