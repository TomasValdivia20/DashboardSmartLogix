import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import LogoutButton from './LogoutButton';

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  // Estado para saber qué vista está activa en este momento
  const [activeView, setActiveView] = useState(null);

  useEffect(() => {
    const handleClose = () => setActiveView(null);
    const handleOpen = (e) => setActiveView(e.detail);
    window.addEventListener('closeView', handleClose);
    window.addEventListener('openView', handleOpen);
    return () => {
      window.removeEventListener('closeView', handleClose);
      window.removeEventListener('openView', handleOpen);
    };
  }, []);

  useEffect(() => {
    if (currentPath !== '/dashboard') setActiveView(null);
  }, [currentPath]);

  // Función para disparar la vista de Pedidos y Envíos
  const handleOpenView = (type) => {
    if (currentPath !== '/dashboard') {
      navigate('/dashboard');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openView', { detail: type }));
      }, 100);
    } else {
      window.dispatchEvent(new CustomEvent('openView', { detail: type }));
    }
  };

  return (
    <>
      <aside className="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0">
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <Link className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" to="/inventario">
            SmartLogix
          </Link>
          
          {/* Dashboard */}
          <ul className="mt-6">
            <li className="relative px-6 py-3">
              <span className={`absolute inset-y-0 left-0 w-1 rounded-tr-lg rounded-br-lg transition-opacity duration-300 ease-in-out ${currentPath === '/dashboard' && !activeView ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundColor: '#ff7a00' }} aria-hidden="true"></span>
              <Link onClick={() => { setActiveView(null); window.dispatchEvent(new CustomEvent('closeView')); }} className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${currentPath === '/dashboard' && !activeView ? 'text-gray-800 dark:text-gray-100' : ''}`} to="/dashboard">
                <svg className="w-5 h-5" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span className="ml-4">Dashboard</span>
              </Link>
            </li>
          </ul>
          
          {/* Gestión Inventario */}
          <ul>
            <li className="relative px-6 py-3">
              <span className={`absolute inset-y-0 left-0 w-1 rounded-tr-lg rounded-br-lg transition-opacity duration-300 ease-in-out ${currentPath === '/inventario' ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundColor: '#ff7a00' }} aria-hidden="true"></span>
              <Link className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${currentPath === '/inventario' ? 'text-gray-800 dark:text-gray-100' : ''}`} to="/inventario">
                <svg className="w-5 h-5" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                <span className="ml-4">Gestión Inventario</span>
              </Link>
            </li>
            <li className="relative px-6 py-3">
              <span className={`absolute inset-y-0 left-0 w-1 rounded-tr-lg rounded-br-lg transition-opacity duration-300 ease-in-out ${activeView === 'Pedidos' ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundColor: '#ff7a00' }} aria-hidden="true"></span>
              <button onClick={() => handleOpenView('Pedidos')} className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none ${activeView === 'Pedidos' ? 'text-gray-800 dark:text-gray-100' : ''}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-4">Pedidos</span>
              </button>
            </li>
            <li className="relative px-6 py-3">
              <span className={`absolute inset-y-0 left-0 w-1 rounded-tr-lg rounded-br-lg transition-opacity duration-300 ease-in-out ${activeView === 'Envíos' ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundColor: '#ff7a00' }} aria-hidden="true"></span>
              <button onClick={() => handleOpenView('Envíos')} className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none ${activeView === 'Envíos' ? 'text-gray-800 dark:text-gray-100' : ''}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                </svg>
                <span className="ml-4">Envíos</span>
              </button>
            </li>
          </ul>

          {/* Línea divisoria sutil */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-2 mx-6"></div>

          {/* Interruptor de Modo Claro / Oscuro */}
          <ul>
            <li className="px-6 py-3 flex items-center justify-start">
              <ThemeToggle isSidebarItem={true} className="inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100" />
            </li>
          </ul>

          {/* Botón de Cerrar Sesión */}
          <ul>
            <li className="px-6 py-3 flex items-center justify-start">
              <LogoutButton />
            </li>
          </ul>

        </div>
      </aside>
    </>
  );
}