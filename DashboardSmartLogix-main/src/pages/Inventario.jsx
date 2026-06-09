import React from 'react';
import Layout from '../components/Layout';

export default function Inventario() {
  return (
    <Layout>
      <div className="container px-6 mx-auto grid">
        <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Gestión de Inventario
        </h2>

        {/* Tarjetas de Indicadores */}
        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <div className="p-3 mr-4 text-purple-500 bg-purple-100 rounded-full dark:text-purple-100 dark:bg-purple-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Total SKUs</p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">15</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <div className="p-3 mr-4 text-red-500 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Stock Crítico</p>
              <p className="text-lg font-semibold text-red-600 dark:text-red-400">2 productos</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div className="flex flex-col">
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Sincronización</p>
              <div className="flex items-center space-x-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">En línea</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y Buscador */}
        <div className="flex flex-col gap-4 mb-6 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800 md:flex-row md:items-center">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Bodega</label>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 text-sm font-medium border rounded-full transition-colors duration-150 focus:outline-none bg-purple-600 text-white border-purple-600">Todas</button>
              <button className="px-3 py-1 text-sm font-medium border rounded-full transition-colors duration-150 focus:outline-none bg-white text-gray-600 border-gray-300 hover:border-purple-400 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">Bodega Central</button>
              <button className="px-3 py-1 text-sm font-medium border rounded-full transition-colors duration-150 focus:outline-none bg-white text-gray-600 border-gray-300 hover:border-purple-400 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">Sucursal Norte</button>
            </div>
          </div>
          <div className="hidden md:block w-px self-stretch bg-gray-200 dark:bg-gray-700 mx-2"></div>
          <div className="flex-1">
            <label className="block mb-1 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Buscar producto</label>
            <div className="relative focus-within:text-purple-500">
              <div className="absolute inset-y-0 flex items-center pl-3">
                <svg className="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                </svg>
              </div>
              <input type="text" placeholder="Nombre o SKU..." className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 bg-gray-100 border-0 rounded-md dark:bg-gray-700 dark:text-gray-200 focus:bg-white focus:outline-none focus:shadow-outline-purple form-input" />
            </div>
          </div>
          <div className="flex items-end">
            <button className="flex items-center px-4 py-2 text-sm font-medium leading-5 text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
              Agregar Producto
            </button>
          </div>
        </div>

        {/* Tabla de Productos Maqueteada */}
        <div className="w-full overflow-hidden rounded-lg shadow-xs mb-8">
          <div className="w-full overflow-x-auto">
            <table className="w-full whitespace-no-wrap min-w-[1200px]">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Descripción</th>
                  <th className="px-4 py-3">Tipo Carga</th>
                  <th className="px-4 py-3 text-right">Costo</th>
                  <th className="px-4 py-3 text-right">Venta</th>
                  <th className="px-4 py-3 text-right">Stock Total</th>
                  <th className="px-4 py-3 text-right">Bodega A</th>
                  <th className="px-4 py-3 text-right">Bodega B</th>
                  <th className="px-4 py-3 text-right">Umbral Min</th>
                  <th className="px-4 py-3 text-center">Estado</th>
                  <th className="px-4 py-3 text-center">Activo</th>
                  <th className="px-4 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                {/* Fila de Ejemplo 1 */}
                <tr className="text-gray-700 dark:text-gray-400">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">Teclado Mecánico RGB</span>
                      <span className="text-xs text-gray-500">SKU-001</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-gray-500 whitespace-normal w-48">Teclado layout latinoamericano switches red.</div>
                  </td>
                  <td className="px-4 py-3 text-sm">General</td>
                  <td className="px-4 py-3 text-sm text-right">$25000</td>
                  <td className="px-4 py-3 text-sm text-right font-bold">$45000</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">50</td>
                  <td className="px-4 py-3 text-sm text-right">30</td>
                  <td className="px-4 py-3 text-sm text-right">20</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-500">10</td>
                  <td className="px-4 py-3 text-xs text-center">
                    <span className="px-2 py-1 font-semibold leading-tight rounded-full text-green-700 bg-green-100 dark:text-green-100 dark:bg-green-700">Normal</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-center">
                    <span className="px-2 py-1 font-semibold leading-tight rounded-full text-blue-700 bg-blue-100 dark:text-blue-100 dark:bg-blue-700">Sí</span>
                  </td>
                  <td className="px-4 py-3 text-sm">27/5/2026</td>
                </tr>

                {/* Fila de Ejemplo 2 (Crítico) */}
                <tr className="text-gray-700 dark:text-gray-400">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">Mouse Gamer Inalámbrico</span>
                      <span className="text-xs text-gray-500">SKU-002</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-gray-500 whitespace-normal w-48">Mouse sensor óptico 16000 DPI.</div>
                  </td>
                  <td className="px-4 py-3 text-sm">Fragil</td>
                  <td className="px-4 py-3 text-sm text-right">$15000</td>
                  <td className="px-4 py-3 text-sm text-right font-bold">$29990</td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-red-600 dark:text-red-400">3</td>
                  <td className="px-4 py-3 text-sm text-right">3</td>
                  <td className="px-4 py-3 text-sm text-right">0</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-500">5</td>
                  <td className="px-4 py-3 text-xs text-center">
                    <span className="px-2 py-1 font-semibold leading-tight rounded-full text-red-700 bg-red-100 dark:text-red-100 dark:bg-red-700">Crítico</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-center">
                    <span className="px-2 py-1 font-semibold leading-tight rounded-full text-blue-700 bg-blue-100 dark:text-blue-100 dark:bg-blue-700">Sí</span>
                  </td>
                  <td className="px-4 py-3 text-sm">25/5/2026</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:bg-gray-800">
            <span className="flex items-center col-span-3">
              Mostrando <span className="mx-1 font-bold">2</span> de <span className="mx-1 font-bold">2</span> productos
            </span>
          </div>
        </div>

      </div>
    </Layout>
  );
}