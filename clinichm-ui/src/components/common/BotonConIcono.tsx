import React from 'react';

interface BotonConIconoProps {
  label: string;
  onClick?: () => void;
  iconSrc?: string; // Hacer el ícono opcional
  className?: string;
  type?: "button" | "submit" | "reset"; // Agregar tipo opcional
}

const BotonConIcono: React.FC<BotonConIconoProps> = ({
  label,
  onClick,
  iconSrc,
  className = '',
  type = "button", // Valor predeterminado
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`boton-con-icono flex items-center gap-2 px-4 py-2 rounded cursor-pointer hover:bg-opacity-100 ${className}`} // Asegurar hover completo
    >
      {iconSrc && <img src={iconSrc} alt="icon" className="icono-boton w-5 h-5" />} {/* Renderizar ícono solo si está presente */}
      <span className="texto-boton">{label}</span> {/* Clase para el texto */}
    </button>
  );
};

export default BotonConIcono;
