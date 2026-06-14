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