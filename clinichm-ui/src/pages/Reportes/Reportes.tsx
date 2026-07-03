import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import Turnos from './Turnos/ReporteTurnos'; 
import Pacientes from './Paciente/ReportePacientes'; // Actualizar importación
import ReporteStock from './Stock/ReporteStock';
import { AuthContext } from '../../utils/authContext';
import { ROLE_GROUPS, ROLES } from '../../utils/roles';

const hasRoleInGroup = (userRole: string | undefined, group: readonly string[]) => {
  return userRole && group.includes(userRole);
};

const Reportes: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext);
    let tab = 'Turnos'; // valor por defecto
    if (user?.role === ROLES.STOCK) {
      tab = 'Stock';
    }
  const [activeTab, setActiveTab] = useState(tab);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const tabs = [
    hasRoleInGroup(user?.role, ROLE_GROUPS.ALL_PACIENTES) ?{ name: 'Turnos', active: activeTab === 'Turnos', onClick: () => setActiveTab('Turnos') }: null,
    hasRoleInGroup(user?.role, ROLE_GROUPS.ALL_PACIENTES) ? { name: 'Pacientes', active: activeTab === 'Pacientes', onClick: () => setActiveTab('Pacientes') }: null,
    user?.role == ROLES.ADMIN || user?.role == ROLES.STOCK ? { name: 'Stock', active: activeTab === 'Stock', onClick: () => setActiveTab('Stock') }: null,
    { name: '', active: false, onClick: () => {}, disabled: true },
    { name: '', active: false, onClick: () => {}, disabled: true },
    { name: '', active: false, onClick: () => {}, disabled: true },
    // Agregar más solapas aquí en el futuro
  ].filter((tab): tab is { name: string; active: boolean; onClick: () => void } => tab !== null);;

  return (
    <div className="h-full bg-[rgba(133,103,59,0.15)]">
      <NavBar tabs={tabs} /> 
      <div className="p-4">
        {activeTab === 'Turnos' && <Turnos />}
        {activeTab === 'Pacientes' && <Pacientes />} 
        {activeTab === 'Stock' && <ReporteStock />}
        {/* Las tabs 4 y 5 están inhabilitadas */}
      </div>
    </div>
  );
};

export default Reportes;
