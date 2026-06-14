import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

export default function EditarPerfil() {
  const navigate = useNavigate();

  // Dejamos los estados vacíos para producción
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación: Asegurar que no metan puros espacios vacíos
    if (nombre.trim().length < 3) {
      alert('❌ Por favor, ingresa un nombre completo válido (mínimo 3 caracteres).');
      return;
    }

    // Aquí ya quedó la estructura lista para tu petición fetch/axios hacia el backend
    alert('✅ Perfil actualizado correctamente');
    navigate('/dashboard');
  };

  return (
    <Layout>
      <div className="container px-6 mx-auto grid">
          <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-white">
            Editar Perfil
          </h2>

        <div className="px-6 py-8 mb-8 bg-white rounded-lg shadow-md dark:bg-black max-w-2xl border border-gray-100 dark:border-gray-700 flex flex-col">
          <form onSubmit={handleSubmit} className="flex flex-col">
            
            <div className="flex flex-col gap-6">
              {/* Campo: Nombre Completo */}
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-white font-medium mb-2 block">Nombre completo</span>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Alonzo..."
                  className="block w-full px-4 py-2 mt-1 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-purple-500 focus:outline-none dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 transition-colors form-input"
                />
              </label>
              
              {/* Campo: Dirección de Correo */}
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-white font-medium mb-2 block">Dirección de correo</span>
                <input
                  type="email"
                  required
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="correo@ejemplo.com"
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
                className="px-6 py-2.5 text-sm font-medium text-center text-white bg-orange-500 transition-colors duration-150 border border-transparent rounded-lg hover:bg-orange-600 focus:outline-none focus:shadow-outline-purple shadow-md shadow-purple-500/30"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}