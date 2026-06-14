import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <div className="p-4 mt-auto border-t border-gray-200 dark:border-gray-700">
      <button 
        onClick={handleLogout}
        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium !text-white !bg-orange-500 transition-colors duration-150 border border-transparent rounded-lg hover:!bg-orange-600 focus:outline-none focus:shadow-outline-gray"
      >
        <svg className="w-5 h-5 mr-2" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
        </svg>
        Cerrar Sesión
      </button>
    </div>
  );
}
