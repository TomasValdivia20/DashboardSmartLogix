import React, { useState, useEffect } from 'react';

export default function TrafficChart() {
  
  const [animar, setAnimar] = useState(false);

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setAnimar(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-gray-800 dark:text-gray-300">
          Tráfico
        </h4>
        <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded font-bold">
          ↑ +14.5%
        </span>
      </div>

      
      <div className="relative h-64 w-full">
        <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
          
          {/* LÍNEAS DE FONDO (Guías horizontales grises) */}
          <line x1="0" y1="40" x2="500" y2="40" className="chart-grid-line" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="0" y1="90" x2="500" y2="90" className="chart-grid-line" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="0" y1="140" x2="500" y2="140" className="chart-grid-line" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="0" y1="190" x2="500" y2="190" className="chart-grid-line" strokeWidth="1" />

          {/* LÍNEA 1: TRÁFICO ORGÁNICO (Línea Azul/Cian) */}
          <path
            d="M 10 180 L 80 160 L 160 120 L 240 140 L 320 90 L 400 110 L 490 60" // Tus coordenadas de puntos reales
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
           
            pathLength="1000"
            style={{
             
              strokeDasharray: '1000',
              strokeDashoffset: animar ? '0' : '1000',
              transition: 'stroke-dashoffset 2s ease-out'
            }}
          />

          
          <path
            d="M 10 170 L 80 140 L 160 150 L 240 100 L 320 120 L 400 70 L 490 50" 
            fill="none"
            stroke="#ff7a00"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1000"
            style={{
              strokeDasharray: '1000',
              strokeDashoffset: animar ? '0' : '1000',
              
              transition: 'stroke-dashoffset 2s ease-out',
              transitionDelay: '200ms'
            }}
          />
        </svg>
      </div>

      {/* LEYENDA INFERIOR (Días de la semana) */}
      <div className="flex justify-between text-xs font-bold text-gray-400 uppercase px-2 mt-2">
        <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
      </div>
    </div>
  );
}