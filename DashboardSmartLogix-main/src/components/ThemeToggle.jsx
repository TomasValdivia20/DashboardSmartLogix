import React, { useState, useEffect } from 'react';

export default function ThemeToggle({ className, isSidebarItem = false }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Sincronizar el estado inicial con la clase del HTML
    setIsDark(document.documentElement.classList.contains('theme-dark'));
  }, []);

  // Función para alternar el modo oscuro
  const alternarTema = () => {
    const dark = document.documentElement.classList.toggle('theme-dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    setIsDark(dark);
  };

  // Si no se especifica clase, usa el estilo flotante elegante por defecto (para el Login/Registro)
  const customClasses = className !== undefined 
    ? className 
    : "fixed top-4 right-4 z-50 p-2 text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700";

  return (
    <button 
      onClick={alternarTema} 
      className={`focus:outline-none transition-colors duration-200 ${customClasses}`}
      aria-label="Alternar tema"
      title={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
    >
      <div className="flex items-center justify-center">
        {isDark ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
        
        {isSidebarItem && (
          <span className="ml-4 text-sm font-semibold">
            {isDark ? 'Modo Claro' : 'Modo Oscuro'}
          </span>
        )}
      </div>
    </button>
  );
}