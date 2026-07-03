import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import Medicos from './Medicos/Medicos';
import Sucursales from './Sucursales/Sucursales';
import Tratamientos from './Tratamientos/Tratamientos';
import Productos from './Productos/Productos';
import Empleados from './Empleados/Empleados';
import { AuthContext } from '../../utils/authContext';
import { ROLES } from '../../utils/roles';

const Ajustes: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext);
  let tab = 'Medicos'; // valor por defecto
  if (user?.role === ROLES.STOCK) {
    tab = 'Productos';
  }
  const [activeTab, setActiveTab] = useState(tab);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const tabs = [
    user?.role == ROLES.ADMIN ? { name: 'Medicos', active: activeTab === 'Medicos', onClick: () => setActiveTab('Medicos')}: null,
    user?.role == ROLES.ADMIN ? { name: 'Sedes', active: activeTab === 'Sedes', onClick: () => setActiveTab('Sedes')}: null,
    user?.role == ROLES.ADMIN ? { name: 'Tratamientos', active: activeTab === 'Tratamientos', onClick: () => setActiveTab('Tratamientos')}: null,
    user?.role == ROLES.ADMIN || user?.role == ROLES.STOCK ? { name: 'Productos', active: activeTab === 'Productos', onClick: () => setActiveTab('Productos')}: null,
    user?.role == ROLES.ADMIN ? { name: 'Empleados', active: activeTab === 'Empleados', onClick: () => setActiveTab('Empleados') }: null,
  ].filter((tab): tab is { name: string; active: boolean; onClick: () => void } => tab !== null);

  return (
    <div className="h-full bg-[rgba(133,103,59,0.15)]">
      <NavBar tabs={tabs} />
      <div className="p-4">
        {activeTab === 'Medicos' && <Medicos />}
        {activeTab === 'Sedes' && <Sucursales />}
        {activeTab === 'Tratamientos' && <Tratamientos />}
        {activeTab === 'Productos' && <Productos />}
        {activeTab === 'Empleados' && <Empleados />}
      </div>
    </div>
  );
};

export default Ajustes;
