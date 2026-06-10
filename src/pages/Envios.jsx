import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function Envios() {
  const [envios, setEnvios] = useState([]);

  useEffect(() => {
    // Simulando datos recientes de Envíos con fechas
    setEnvios([
      { id: '10233', tipo: 'Envío', cliente: 'María Gómez', fecha: '27 May 2026', estado: 'Completado' },
      { id: '10231', tipo: 'Envío', cliente: 'Ana Silva', fecha: '25 May 2026', estado: 'Completado' },
    ]);
  }, []);

  return (
    <Layout>
      <div className="container px-6 mx-auto grid">
        <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Lista de Envíos
        </h2>
        
        <div className="w-full overflow-hidden rounded-lg shadow-xs mb-8">
          <div className="w-full overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                {envios.map((item) => (
                  <tr key={item.id} className="text-gray-700 dark:text-gray-400">
                    <td className="px-4 py-3 text-sm font-semibold">#{item.id}</td>
                    <td className="px-4 py-3 text-sm dark:text-gray-200">{item.cliente}</td>
                    <td className="px-4 py-3 text-sm">{item.tipo}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${item.estado === 'Completado' ? 'text-green-700 bg-green-100 dark:text-green-100 dark:bg-green-700' : item.estado === 'Procesando' ? 'text-blue-700 bg-blue-100 dark:text-blue-100 dark:bg-blue-500' : item.estado === 'Pendiente' ? 'text-orange-700 bg-orange-100 dark:text-white dark:bg-orange-600' : 'text-red-700 bg-red-100 dark:text-white dark:bg-red-600'}`}>
                        {item.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{item.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}