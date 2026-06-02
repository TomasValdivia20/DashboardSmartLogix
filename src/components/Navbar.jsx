import React, { useState, useEffect } from 'react';
import Profile from '../pages/Profile';

export default function Navbar() {
  const [inicial, setInicial] = useState('U');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
      if (userInfo && userInfo.email) {
        // Toma la primera letra del correo y la convierte en mayúscula
        setInicial(userInfo.email.charAt(0).toUpperCase());
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <header className="z-10 py-4 bg-white border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        
        {/* Buscador central */}
        <div className="flex justify-center flex-1 lg:mr-32">
          <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
              </svg>
            </div>
            <input 
              className="w-full pl-8 pr-2 py-1.5 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input" 
              type="text" 
              placeholder="Search for projects" 
              aria-label="Search" 
            />
          </div>
        </div>

        {/* Zona derecha libre de imágenes */}
        <ul className="flex items-center flex-shrink-0 space-x-6">

          <li className="relative">
            <button 
              onClick={() => setIsProfileOpen(true)}
              className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center text-xs font-bold focus:outline-none transition-colors duration-150 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              {inicial}
            </button>
            <Profile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
          </li>
        </ul>

      </div>
    </header>
  );
}