import React from 'react';
import UserLogin from './UserLogin'; // Importar el componente UserLogin

interface CardUsuarioProps {
  userName: string;
  role: string;
}

const CardUsuario: React.FC<CardUsuarioProps> = ({ userName, role }) => {
  return (
    <div
      className="bg-fondo-card rounded-md flex justify-end items-center gap-2 p-2"
    >
      <UserLogin userName={userName} role={role} /> 
    </div>
  );
};

export default CardUsuario;
