import axios from 'axios';

const bffApi = axios.create({
  baseURL: import.meta.env.VITE_BFF_URL || 'http://127.0.0.1:8000/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

bffApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

bffApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getPedidos = () => bffApi.get('/pedidos');
export const getPedido = (id) => bffApi.get(`/pedidos/${id}/`);
export const createPedido = (data) => bffApi.post('/crear-pedido', data);
export const aprobarPedido = (id) => bffApi.patch(`/pedidos/${id}/aprobar`);
export const enviarPedido = (id) => bffApi.patch(`/pedidos/${id}/enviar`);
export const entregarPedido = (id) => bffApi.patch(`/pedidos/${id}/entregar`);
export const getGuia = (id) => bffApi.get(`/pedidos/${id}/guia`);
export const generarGuia = (id) => bffApi.post(`/pedidos/${id}/guia`);
export const getBodegas = () => bffApi.get('/bodegas');
export const getProductos = () => bffApi.get('/productos');
