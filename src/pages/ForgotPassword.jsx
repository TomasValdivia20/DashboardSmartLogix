import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import forgotLight from '../assets/img/forgot-password-office.jpeg';
import forgotDark from '../assets/img/forgot-password-office-dark.jpeg';

export default function ForgotPassword() {
  return (
    <div className="relative flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      
      {/* Botón flotante para cambiar el tema */}
      <ThemeToggle />

      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          
          {/* Columna de la Imagen con rutas corregidas para Vite */}
          <div className="h-32 md:h-auto md:w-1/2">
            <img 
              aria-hidden="true" 
              className="object-cover w-full h-full dark:hidden" 
              src={forgotLight} 
              alt="Office" 
            />
            <img 
              aria-hidden="true" 
              className="hidden object-cover w-full h-full dark:block" 
              src={forgotDark} 
              alt="Office" 
            />
          </div>

          {/* Columna del Formulario */}
          <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Olvidaste tu contraseña
              </h1>
              
              <form id="formularioRecuperacion">
                <label className="block text-sm">
                  <span className="text-gray-700 dark:text-gray-400">Correo electrónico</span>
                  <input 
                    id="emailInput"
                    type="email"
                    required
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input" 
                    placeholder="jane@doe.com" 
                  />
                </label>

                {/* Cambiado de etiqueta <a> a un botón real de submit tipo el de tu login */}
                <button 
                  type="submit" 
                  id="btnSubmit" 
                  className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-orange-500 border border-transparent rounded-lg active:bg-orange-600 hover:bg-orange-600 focus:outline-none focus:shadow-outline-purple"
                >
                  Recuperar contraseña
                </button>
              </form>

              <hr className="my-6 dark:border-gray-700" />

              <p className="mt-4">
                <Link 
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline" 
                  to="/login"
                >
                  Volver al inicio de sesión
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}