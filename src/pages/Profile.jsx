import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile({ isOpen, onClose }) {
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      <div className={`absolute right-0 top-full mt-3 w-[400px] min-w-[400px] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl z-50 border border-gray-200 dark:border-gray-700 p-6 transform origin-top-right transition-all duration-300 ease-out ${isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}`}>

        <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200">
            Mi Perfil
          </h3>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col mt-6">

          {/* BOTÓN 1 */}
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/cambiar-contrasena');
            }}
            className="flex items-center justify-center w-full min-h-[56px] px-4 py-3 mb-4 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-xl dark:text-white dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 transition-all focus:outline-none"
          >
            <svg
              className="w-5 h-5 mr-3"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4v-3.252l7.536-7.536a6 6 0 113.464-3.464z" />
            </svg>

            <span className="whitespace-nowrap">
              Cambiar contraseña
            </span>
          </button>

          {/* BOTÓN 2 */}
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/editar-perfil');
            }}
            className="flex items-center justify-center w-full min-h-[56px] px-4 py-3 text-sm font-medium border border-transparent rounded-xl transition-all text-white bg-orange-500 dark:text-white dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 focus:outline-none"
          >
              <svg
                className="w-5 h-5 mr-3"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>

            <span className="whitespace-nowrap">
              Editar perfil
            </span>
          </button>

        </div>
      </div>
    </>
  );
}