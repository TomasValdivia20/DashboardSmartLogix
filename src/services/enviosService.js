import api from './api';

export const getRepartidores = () => api.get('/repartidores/');
export const getEnvios = () => api.get('/envios/');
export const getEnvio = (id) => api.get(`/envios/${id}/`);
export const createEnvio = (data) => api.post('/envios/', data);
export const updateEnvio = (id, data) => api.put(`/envios/${id}/`, data);
export const deleteEnvio = (id) => api.delete(`/envios/${id}/`);
export const calcularCostos = (data) => api.post('/calcular-costos/', data);

export const getRutas = () => api.get('/rutas/');
export const getRuta = (id) => api.get(`/rutas/${id}/`);
export const createRuta = (data) => api.post('/rutas/', data);
export const calcularRuta = (id) => api.post(`/rutas/${id}/calcular/`);
export const completarRuta = (id) => api.post(`/rutas/${id}/completar/`);
export const deleteRuta = (id) => api.delete(`/rutas/${id}/`);
export const geocodificar = (direccion) => api.post('/geocodificar/', { direccion });
