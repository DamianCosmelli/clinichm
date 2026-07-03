import React, { useState } from 'react';
import TurnosPorEstado from './TurnosPorEstado';
import TurnosAfectados from './TurnosAfectados';
import TurnosPorPeriodo from './TurnosPorPeriodo';

const ReporteTurnos: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TurnosPorEstado' | 'TurnosAfectados' | 'TurnosPorPeriodo'>('TurnosPorEstado');



  return (
    <div className="w-full h-[calc(100vh-180px)] relative overflow-hidden overflow-y-auto font-poppins">
      <div className="w-full mt-4">
        {/* Subtabs */}
        <div className="flex gap-4 border-b border-gray-300 pb-2 items-start">
          <button
            className={`text-sm font-poppins px-4 py-2 rounded ${
              activeTab === 'TurnosPorEstado' ? 'font-bold text-[#85673B] bg-gray-200' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('TurnosPorEstado')}
          >
            Turnos por estado
          </button>
        
          <button
            className={`text-sm font-poppins px-4 py-2 rounded ${
              activeTab === 'TurnosAfectados' ? 'font-bold text-[#85673B] bg-gray-200' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('TurnosAfectados')}
          >
            Turnos afectados
          </button>

          <button
            className={`text-sm font-poppins px-4 py-2 rounded ${
              activeTab === 'TurnosPorPeriodo' ? 'font-bold text-[#85673B] bg-gray-200' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('TurnosPorPeriodo')}
          >
            Turnos por período
          </button>
        </div>
        {/* Contenido de las subtabs */}
        <div className="mt-4">
          {activeTab === 'TurnosPorEstado' && <TurnosPorEstado />}
          {activeTab === 'TurnosAfectados' && <TurnosAfectados />}
          {activeTab === 'TurnosPorPeriodo' && <TurnosPorPeriodo />}
        </div>
      </div>
    </div>
  );
};

export default ReporteTurnos;





