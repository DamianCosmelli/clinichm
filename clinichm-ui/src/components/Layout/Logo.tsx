import React from 'react';
import logo from '../../assets/logo-db-3.png';

const Logo: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-12 h-12 bg-black rounded-full mx-auto">
      <img src={logo} alt="Logo" className="w-12 h-12 object-contain rounded-full" />
    </div>
  );
};

export default Logo;
