import api from './api';

export const getVehiculos = () => api.get('/vehiculos/');
export const getVehiculo = (id) => api.get(`/vehiculos/${id}/`);
