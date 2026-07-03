import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../utils/authContext';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate('/');
    //window.location.reload(); // Recarga la página
  }, [logout, navigate, user]);

  return null;
};

export default Logout;