import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import SalesChart from '../components/SalesChart';
import TrafficChart from '../components/TrafficChart';

// --- CONSTANTES ---
// Definir constantes para los "magic strings" mejora la mantenibilidad y previene errores de tipeo.
const VIEW_TYPES = {
  PEDIDOS: 'Pedidos',
  ENVIOS: 'Envíos',
};

const STATUS_TYPES = {
  PROCESANDO: 'Procesando',
  COMPLETADO: 'Completado',
  PENDIENTE: 'Pendiente',
  CANCELADO: 'Cancelado',
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState('Usuario');
  const [clientesTotales, setClientesTotales] = useState('...');
  const [balance, setBalance] = useState('...');
  const [pedidos, setPedidos] = useState('...');
  const [envios, setEnvios] = useState('...');
  const [contactos, setContactos] = useState('...');
  const [actividad, setActividad] = useState([]);
  const [vistaActual, setVistaActual] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Se envuelve la lógica de carga de datos en un `useCallback` para optimizar y evitar que se redeclare en cada render.
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Cargar información del usuario desde localStorage
      const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
      if (userInfo && userInfo.email) {
        const name = userInfo.email.split('@')[0];
        setUserName(name);
      }

      // 2. Simular una llamada a la API para obtener los datos del dashboard.
      // En un caso real, aquí harías: const response = await fetch('https://api.smartlogix.com/dashboard');
      await new Promise(resolve => setTimeout(resolve, 1200)); // Simula latencia de red de 1.2 segundos

      // Datos simulados que normalmente vendrían del backend
      const dataFromApi = {
        clientesTotales: 6389,
        balance: 46760.89,
        pedidos: 850,
        envios: 376,
        contactos: 35,
        actividad: [
          { id: '10234', tipo: 'Pedido', cliente: 'Juan Pérez', fecha: '28 May 2026', estado: STATUS_TYPES.PROCESANDO },
          { id: '10233', tipo: 'Envío', cliente: 'María Gómez', fecha: '27 May 2026', estado: STATUS_TYPES.COMPLETADO },
          { id: '10232', tipo: 'Pedido', cliente: 'Carlos Ruiz', fecha: '26 May 2026', estado: STATUS_TYPES.PENDIENTE },
          { id: '10231', tipo: 'Envío', cliente: 'Ana Silva', fecha: '25 May 2026', estado: STATUS_TYPES.COMPLETADO },
          { id: '10230', tipo: 'Pedido', cliente: 'Luis Torres', fecha: '25 May 2026', estado: STATUS_TYPES.CANCELADO },
        ]
      };

      // 3. Actualizar el estado con los datos recibidos
      setClientesTotales(dataFromApi.clientesTotales);
      setBalance(`$ ${dataFromApi.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      setPedidos(dataFromApi.pedidos);
      setEnvios(dataFromApi.envios);
      setContactos(dataFromApi.contactos);
      setActividad(dataFromApi.actividad);

    } catch (err) {
      console.error("Error al cargar los datos del dashboard:", err);
      setError("No se pudieron cargar los datos. Inténtalo de nuevo más tarde.");
    } finally {
      setIsLoading(false); // Finaliza el estado de carga, tanto si hubo éxito como si hubo error
    }
  }, []); // El array vacío asegura que esta función solo se cree una vez.

  useEffect(() => {
    // --- EFECTO PRINCIPAL PARA CARGA DE DATOS Y AUTENTICACIÓN ---
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchDashboardData();

    // --- EFECTO SECUNDARIO PARA MANEJAR VISTAS DEL SIDEBAR ---
    // Estos listeners son para la comunicación entre componentes (Sidebar -> Dashboard)
    const handleOpenView = (e) => setVistaActual(e.detail);
    const handleCloseView = () => setVistaActual(null);
    window.addEventListener('openView', handleOpenView);
    window.addEventListener('closeView', handleCloseView);

    // Función de limpieza para remover los listeners y evitar fugas de memoria
    return () => {
      window.removeEventListener('openView', handleOpenView);
      window.removeEventListener('closeView', handleCloseView);
    };
  }, [navigate, fetchDashboardData]); // Se ejecuta si `navigate` o `fetchDashboardData` cambian.

  return (
    <Layout>
      <div className="container px-6 mx-auto grid relative">
        {!vistaActual ? (
          <>
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
              Panel Administrador — Hola, {userName}
            </h2>

            {/* Indicador de carga y error para las tarjetas */}
            {isLoading && <p className="mb-4 text-sm text-gray-500">Cargando métricas...</p>}
            {error && <p className="mb-4 text-sm text-red-500 font-semibold">{error}</p>}

            <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
          
          <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <div className="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Clientes totales</p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {/* Se muestra '...' durante la carga, y el valor final después. */}
                {isLoading ? '...' : clientesTotales}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Balance de cuenta</p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{balance}</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <div className="p-3 mr-4 text-purple-500 bg-purple-100 rounded-full dark:text-purple-100 dark:bg-purple-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Pedidos</p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{pedidos}</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Envios</p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{envios}</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <div className="p-3 mr-4 text-teal-500 bg-teal-100 rounded-full dark:text-teal-100 dark:bg-teal-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Contactos pendientes</p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{contactos}</p>
            </div>
          </div>

        </div>

        <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Gráficos
        </h2>
        <div className="grid gap-6 mb-8 md:grid-cols-2">
          
          {/* Gráfico de dona funcional integrado con los datos reales */}
          <SalesChart completadas={typeof envios === 'number' ? envios : 0} pendientes={typeof pedidos === 'number' && typeof envios === 'number' ? pedidos - envios : 0} />

          {/* Gráfico de líneas (Tráfico) SVG fluido y adaptativo */}
          <TrafficChart />

        </div>
          </>
        ) : (
          /* Vista Integrada con la Tabla */
          <div className="mt-8 mb-8 w-full">
            <div className="w-full p-6 bg-white rounded-lg shadow-xs dark:bg-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                  Lista de {vistaActual}
              </h3>
              <button onClick={() => {
                setVistaActual(null);
                window.dispatchEvent(new CustomEvent('closeView'));
              }} className="flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline focus:outline-none">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Volver al Dashboard
              </button>
            </div>
            
            <div className="w-full overflow-hidden rounded-lg shadow-xs">
              <div className="w-full overflow-x-auto">
                <table className="w-full whitespace-no-wrap">
                  <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Cliente</th>
                      <th className="px-4 py-3">Tipo</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                    {actividad
                      .filter(item => vistaActual === VIEW_TYPES.PEDIDOS ? item.tipo === 'Pedido' : item.tipo === 'Envío')
                      .map((item, index) => (
                        <tr key={index} className="text-gray-700 dark:text-gray-400">
                          <td className="px-4 py-3 text-sm font-semibold">#{item.id}</td>
                          <td className="px-4 py-3 text-sm">{item.cliente}</td>
                          <td className="px-4 py-3 text-sm">{item.tipo}</td>
                          <td className="px-4 py-3 text-xs">
                            <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${item.estado === STATUS_TYPES.COMPLETADO ? 'text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100' : item.estado === STATUS_TYPES.PROCESANDO ? 'text-blue-700 bg-blue-100 dark:text-blue-100 dark:bg-blue-700' : item.estado === STATUS_TYPES.PENDIENTE ? 'text-orange-700 bg-orange-100 dark:text-white dark:bg-orange-600' : 'text-red-700 bg-red-100 dark:text-red-100 dark:bg-red-700'}`}>
                              {item.estado}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{item.fecha}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          </div>
        )}
      </div>
    </Layout>
  );
}