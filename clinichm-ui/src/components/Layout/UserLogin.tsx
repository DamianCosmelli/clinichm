import React, { useState, useRef, useEffect, useContext } from 'react';
import chevronDownIcon from '../../assets/icon-chevron-down.svg';
import PasswordResetForm from '../Login/PasswordResetForm';
import { AuthContext } from '../../utils/authContext';

interface UserLoginProps {
  userName: string;
  role: string;
}

const UserLogin: React.FC<UserLoginProps> = ({ userName, role }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [mostarChangePass, setMostrarChangePass] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const { user } = useContext(AuthContext);

const handlerChangePass= () => {
  //alert('Cambiar contraseña');
  setMostrarChangePass(true);
}

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8, // 8px de separación
        left: rect.right - 160, // 160px = w-40, alinea el borde derecho del menú con el icono
      });
    }
  }, [menuOpen]);

  return (
    <div className="flex flex-col items-center" ref={menuRef}>
      <div className="flex items-center gap-2">
        <div className="text-fondo-layout text-sm font-normal leading-5 font-poppins break-words">
          {userName}
        </div>
        <div className="relative w-6 h-6 overflow-visible z-50" ref={buttonRef}>
          <img
            src={chevronDownIcon}
            alt="Chevron Down"
            className="absolute w-4.5 h-5 left-1.5 top-2.5 cursor-pointer"
            onClick={() => setMenuOpen((open) => !open)}
          />
        </div>
      </div>
      <div className="self-stretch text-secundario text-xs font-normal leading-4.5 font-poppins break-words">
        {role}
      </div>
      {menuOpen && menuPosition && (
        <div
          ref={menuRef}
          className="fixed w-40 bg-white border border-gray-200 rounded shadow-lg z-[9999]"
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          <div className="w-full text-left px-4 py-2 text-sm font-normal leading-5 font-poppins break-words">
          {userName}
          </div>
          <div className="w-full text-left px-4 py-2 text-xs font-normal leading-4.5 font-poppins break-words text-gray-500">
          {role}
          </div>
          <div className="w-full text-left px-4 py-2 text-xs font-normal italic leading-4.5 font-poppins break-words text-gray-500">
          {user?.sucursal}
          </div>
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => { setMenuOpen(false); handlerChangePass(); }}
          >
            Cambiar contraseña
          </button>
        </div>
      )}
      { mostarChangePass && (
        <PasswordResetForm onClose={() => setMostrarChangePass(false)}/>
      )}
    </div>
  );
};

export default UserLogin;
