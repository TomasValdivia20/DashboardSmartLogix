import api from './api';

export const getProductos = () => api.get('/productos/');

export const crearProducto = (data) => api.post('/productos/', data);
