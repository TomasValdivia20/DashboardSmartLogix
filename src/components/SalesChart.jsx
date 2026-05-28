import React, { useState, useEffect } from 'react';

export default function SalesChart({ completadas = 75, pendientes = 25 }) {
  const total = completadas + pendientes;
  const porcentajeReal = total > 0 ? Math.round((completadas / total) * 100) : 0;
  const porcentajePendientes = total > 0 ? 100 - porcentajeReal : 0;

  
  const [porcentaje, setPorcentaje] = useState(0);

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setPorcentaje(porcentajeReal);
    }, 100);
    return () => clearTimeout(timer);
  }, [porcentajeReal]);

  
  const circunferencia = 100; 
  const dashOffset = circunferencia - (porcentaje / 100) * circunferencia;

  return (
    <div className="p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800 flex flex-col justify-between">
      <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
        Ventas Totales
      </h4>
      
      <div className="relative flex items-center justify-center py-2">
        <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
          
          <circle 
            cx="18" 
            cy="18" 
            r="15.915" 
            fill="none" 
            style={{ stroke: '#0f4c5c' }} 
            className="opacity-90 dark:opacity-100" 
            strokeWidth="3.5"
          ></circle>
          
          
          <circle 
            cx="18" 
            cy="18" 
            r="15.915" 
            fill="none" 
            style={{ 
              stroke: '#ff7a00',
             
              strokeDashoffset: dashOffset, 
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' 
            }} 
            strokeWidth="4" 
            // La circunferencia total es 100
            strokeDasharray={circunferencia} 
            strokeLinecap="round"
          ></circle>
        </svg>
        
        
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-[#0f4c5c] dark:text-white">{porcentajeReal}%</span>
          <span className="text-[10px] mt-1 text-gray-500 uppercase font-bold tracking-widest">Completado</span>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex justify-center mt-4 space-x-5 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 mr-1 rounded-full" style={{ backgroundColor: '#ff7a00' }}></span>
          <span className="font-semibold text-gray-700 dark:text-gray-200">{porcentajeReal}% <span className="text-xs font-normal text-gray-500">({completadas})</span></span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 mr-1 rounded-full" style={{ backgroundColor: '#0f4c5c' }}></span>
          <span className="font-semibold text-gray-700 dark:text-gray-200">{porcentajePendientes}% <span className="text-xs font-normal text-gray-500">({pendientes})</span></span>
        </div>
      </div>
    </div>
  );
}