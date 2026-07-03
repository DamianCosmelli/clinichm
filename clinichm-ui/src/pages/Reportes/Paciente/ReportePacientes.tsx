import React, { useState } from 'react';
import SoloConsulto from './SoloConsulto'; 
import SinVisita from './SinVisita'; 
import EstadisticaEtariaCaptacion from './EstadisticaEtariaCaptacion';

const Pacientes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SoloConsulto' | 'SinVisita' | 'Estadistica'>('SoloConsulto'); // Agregar 'Estadistica'

  return (
    <div className="w-full h-[calc(100vh-180px)] relative overflow-hidden overflow-y-auto font-poppins">
      <div className="w-full mt-4">
        {/* Subtabs */}
        <div className="flex gap-4 border-b border-gray-300 pb-2 items-start">
          <button
            className={`text-sm font-poppins px-4 py-2 rounded ${
              activeTab === 'SoloConsulto' ? 'font-bold text-[#85673B] bg-gray-200' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('SoloConsulto')}
          >
            Solo consultó
          </button>
        
          <button
            className={`text-sm font-poppins px-4 py-2 rounded ${
              activeTab === 'SinVisita' ? 'font-bold text-[#85673B] bg-gray-200' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('SinVisita')}
          >
            Sin visita los últimos meses
          </button>
          <button
            className={`text-sm font-poppins px-4 py-2 rounded ${
              activeTab === 'Estadistica' ? 'font-bold text-[#85673B] bg-gray-200' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('Estadistica')}
          >
            Estadística etaria y método de captación
          </button>
        </div>
        {/* Contenido de las subtabs */}
        <div className="mt-4">
          {activeTab === 'SoloConsulto' && <SoloConsulto />}
          {activeTab === 'SinVisita' && <SinVisita />}
          {activeTab === 'Estadistica' && <EstadisticaEtariaCaptacion />}
        </div>
      </div>
    </div>
  );
};

export default Pacientes;
