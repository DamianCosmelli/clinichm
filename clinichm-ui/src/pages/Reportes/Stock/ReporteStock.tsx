import React, { useState } from 'react';
// Importa el componente de consulta de vencimientos cuando esté disponible
import ConsultaVencimientos from './ConsultaVencimientos';
import iconoDescargar from '../../../assets/icono-descarga.svg'; // Importar el ícono de descarga';
import { generarReporteStock } from '../../../services/stockService';

const ReporteStock: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ConsultaVencimientos'>('ConsultaVencimientos');

  const descargarReporte = async () => {
      try {
        const informeBlob = await generarReporteStock();
        const url = window.URL.createObjectURL(informeBlob);
        const link = document.createElement('a');
        link.href = url;
        const fechaActual = new Date();
        const yyyy = fechaActual.getFullYear();
        const mm = String(fechaActual.getMonth() + 1).padStart(2, '0');
        const dd = String(fechaActual.getDate()).padStart(2, '0');
        const fechaFormato = `${yyyy}${mm}${dd}`;
        link.download = `ReporteStock-${fechaFormato}.xlsx`; // Nombre del archivo
        link.click();
        window.URL.revokeObjectURL(url); // Liberar memoria
      } catch (error) {
        console.error('Error al descargar el informe:', error);
      }
    };


  return (
    <div className="w-full h-[calc(100vh-180px)] relative overflow-hidden overflow-y-auto font-poppins">
      <div className="w-full mt-4">
        {/* Subtabs */}
        <div className="flex justify-between items-start border-b border-gray-300 pb-2">
          <div className="flex gap-4">
            <button
              className={`text-sm font-poppins px-4 py-2 rounded ${
                activeTab === 'ConsultaVencimientos' ? 'font-bold text-[#85673B] bg-gray-200' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('ConsultaVencimientos')}
            >
              Consulta de vencimientos
            </button>
          </div>
          <button className="close-box flex items-end gap-2 mr-4" onClick={descargarReporte}>
            <img className="close-icon" src={iconoDescargar} alt="Descargar informe" />
            <span className="close-text">Descargar informe</span>
          </button>
        </div>
        {/* Contenido de las subtabs */}
        <div className="mt-4">
          {activeTab === 'ConsultaVencimientos' && <ConsultaVencimientos />}
        </div>
      </div>
    </div>
  );
};

export default ReporteStock;

