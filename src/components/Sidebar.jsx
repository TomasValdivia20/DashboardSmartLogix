import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import LogoutButton from './LogoutButton';

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

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
              <span className={`absolute inset-y-0 left-0 w-1 rounded-tr-lg rounded-br-lg transition-opacity duration-300 ease-in-out ${currentPath === '/dashboard' ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundColor: '#ff7a00' }} aria-hidden="true"></span>
              <Link className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${currentPath === '/dashboard' ? 'text-gray-800 dark:text-gray-100' : ''}`} to="/dashboard">
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