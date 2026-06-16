import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

export default function CambiarContrasena() {
  const navigate = useNavigate();
  
  // Estados para capturar las nuevas contraseñas y poder compararlas
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación manual: Comprobar que las contraseñas coincidan
    if (nuevaPassword !== confirmarPassword) {
      alert('❌ Las nuevas contraseñas no coinciden. Inténtalo de nuevo.');
      return; // Detiene el flujo para que no guarde
    }

    // Si pasa la validación, recién ahí guarda
    alert('✅ Contraseña cambiada con éxito');
    navigate('/dashboard');
  };

  return (
    <Layout>
      <div className="container px-6 mx-auto grid">
        <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Cambiar Contraseña
        </h2>

        <div className="px-6 py-8 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 max-w-2xl border border-gray-100 dark:border-gray-700 flex flex-col">
          <form onSubmit={handleSubmit} className="flex flex-col">
            
            <div className="flex flex-col gap-6">
              {/* Campo: Contraseña Actual */}
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400 font-medium mb-2 block">Contraseña actual</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  required /* Obligatorio */
                  className="block w-full px-4 py-2 mt-1 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-purple-500 focus:outline-none dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 transition-colors form-input"
                />
              </label>
              
              {/* Campo: Nueva Contraseña */}
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400 font-medium mb-2 block">Nueva contraseña</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  required /* Obligatorio */
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  className="block w-full px-4 py-2 mt-1 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-purple-500 focus:outline-none dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 transition-colors form-input"
                />
              </label>
              
              {/* Campo: Confirmar Nueva Contraseña */}
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400 font-medium mb-2 block">Confirmar nueva contraseña</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  required /* Obligatorio */
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  className="block w-full px-4 py-2 mt-1 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-purple-500 focus:outline-none dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 transition-colors form-input"
                />
              </label>
            </div>
            
            <div className="mt-8 flex justify-end space-x-4">
              <button 
                type="button" 
                onClick={() => navigate('/dashboard')} 
                className="px-6 py-2.5 text-sm font-medium text-center text-gray-800 bg-gray-200 transition-colors duration-150 border border-transparent rounded-lg dark:text-white dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:shadow-outline-gray"
              >
                Cancelar
              </button>
              
              <button 
                type="submit" 
                className="px-6 py-2.5 text-sm font-medium text-center text-white bg-purple-600 transition-colors duration-150 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple shadow-md shadow-purple-500/30"
              >
                Actualizar
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}