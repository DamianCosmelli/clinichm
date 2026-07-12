import React, { ReactNode, useContext, useState } from 'react';
import personIcon from '../../assets/icon-person-outline-rounded.svg';
import PacientesIcon from '../../assets/icon-group.svg';
import configIcon from '../../assets/icon-cog.svg';
import bookIcon from '../../assets/icon-book.svg';
import calendarIcon from '../../assets/icon-calendar.svg';
import recepcionIcon from '../../assets/icon-reception-bell.svg';
import cajaIcon from '../../assets/icon-attach-money-rounded.svg';
import logoutIcon from '../../assets/icon-round-log-out.svg';
import reportesIcon from '../../assets/iconoReportes.svg'; // Importar el ícono de reportes
import stockIcon from '../../assets/iconoStock.svg'; // Importar el ícono de Stock
//import chevronDownIcon from '../../assets/icon-chevron-down.svg';
import { MenuItem } from './MenuItem';
import CardUsuario from './CardUsuario';
import Logo from './Logo';
import { AuthContext } from '../../utils/authContext';
import { ROLE_GROUPS, ROLES } from '../../utils/roles';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  //const [isAjustesOpen, setIsAjustesOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true); // Estado inicial colapsado
  const { user } = useContext(AuthContext);

  const canAccess = (rolesPermitidos: string[]): boolean => 
  rolesPermitidos.includes(user?.role ?? "");

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex h-full overflow-hidden">
        <aside 
          className={`bg-fondo-layout p-3 ${isCollapsed ? 'w-16' : 'w-48'} fixed h-full flex flex-col justify-between items-center border-r border-borde transition-all duration-300`}
          onMouseEnter={() => setIsCollapsed(false)} 
          onMouseLeave={() => setIsCollapsed(true)}
        >
          <nav>
            <ul className="space-y-4">
              <li>
                <Logo />
              </li>
              <li className="mt-5">
                <MenuItem 
                  menuName={
                    <div className="flex items-center gap-2">
                      <div className="iconSize flex items-center justify-center">
                        <img src={personIcon} alt="Usuarios" className="iconSize" />
                      </div>
                      <span className={`${isCollapsed ? 'hidden' : 'block'} text-principal text-sm`}>Usuarios</span>
                    </div>
                  } 
                  route='usuarios'
                  hide={!canAccess([ROLES.ADMIN])} // Ocultar este menú si el usuario no Notiene acceso
                />
              </li>
              <li>
                <MenuItem 
                  menuName={
                    <div className="flex items-center gap-2">
                      <div className="iconSize flex items-center justify-center">
                        <img src={PacientesIcon} alt="Pacientes" className="iconSize" />
                      </div>
                      <span className={`${isCollapsed ? 'hidden' : 'block'} text-principal text-sm`}>Pacientes</span>
                    </div>
                  } 
                  route='pacientes'
                  hide={!canAccess([...ROLE_GROUPS.ALL_ADMINISTRATIVE])}
                />
              </li>
              
                {/*<button 
                  onClick={() => setIsAjustesOpen(!isAjustesOpen)} 
                  className="text-principal text-sm hover:bg-[var(--color-burbela-items)] hover:border hover:border-[var(--color-burbela-items)] hover:rounded-md p-1 m-4 flex items-center w-full"
                >
                  <div className="iconSize flex items-center justify-center">
                    <img src={configIcon} alt="Ajustes" className="iconSize" />
                  </div>
                  <span className={`${isCollapsed ? 'hidden' : 'block'} ml-2`}>Ajustes</span>
                  {!isCollapsed && (
                    <img src={chevronDownIcon} alt="Desplegable" className="iconSize ml-2 text-principal flex-shrink-0" />
                  )}
                </button>
                {isAjustesOpen && !isCollapsed && (
                  <ul className="ml-10 space-y-4">
                    <li><MenuItem menuName="Medicos" route='ajustes/medicos'/></li>
                    <li><MenuItem menuName="Sucursales" route='ajustes/sucursales'/></li>
                    <li><MenuItem menuName="Tratamientos" route='ajustes/tratamientos'/></li>
                    <li><MenuItem menuName="Productos" route='ajustes/productos'/></li>
                    <li><MenuItem menuName="Empleados" route='ajustes/empleados'/></li>
                  </ul>
                )}*/ /**  Se cambio por una pagina solo de ajustes */ }
              <li>
                <MenuItem
                  menuName={
                    <div className="flex items-center gap-2">
                      <div className="iconSize flex items-center justify-center">
                        <img src={configIcon} alt="Ajustes" className="iconSize" />
                      </div>
                      <span className={`${isCollapsed ? 'hidden' : 'block'} text-principal text-sm`}>Ajustes</span>
                    </div>
                  }
                  route='ajustes'
                  hide={!canAccess([ROLES.ADMIN, ROLES.STOCK])}
                />
              </li>
              <li>
                <MenuItem 
                  menuName={
                    <div className="flex items-center gap-2">
                      <div className="iconSize flex items-center justify-center">
                        <img src={bookIcon} alt="Agenda" className="iconSize" />
                      </div>
                      <span className={`${isCollapsed ? 'hidden' : 'block'} text-principal text-sm`}>Agenda</span>
                    </div>
                  } 
                  route='agenda'
                  hide={!canAccess([...ROLE_GROUPS.ALL_AGENDA])}
                />
              </li>
                <li>
                <MenuItem 
                  menuName={
                    <div className="flex items-center gap-2">
                      <div className="iconSize flex items-center justify-center">
                        <img src={reportesIcon} alt="Reportes" className="iconSize" />
                      </div>
                      <span className={`${isCollapsed ? 'hidden' : 'block'} text-principal text-sm`}>Reportes</span>
                    </div>
                  } 
                  route='reportes'
                  hide={!canAccess([...ROLE_GROUPS.ALL_PACIENTES, ROLES.STOCK])} // Ocultar este menú si el usuario no tiene acceso
                />
              </li>
              <li>
                <MenuItem 
                  menuName={
                    <div className="flex items-center gap-2">
                      <div className="iconSize flex items-center justify-center">
                        <img src={calendarIcon} alt="Turnos" className="iconSize" />
                      </div>
                      <span className={`${isCollapsed ? 'hidden' : 'block'} text-principal text-sm`}>Turnos</span>
                    </div>
                  } 
                  route='turnos'
                  hide={!canAccess([ROLES.ADMIN, ROLES.TURNOS, ROLES.RECEPCION])} // Ocultar este menú si el usuario no tiene acceso
                />
              </li>
              <li>
                <MenuItem 
                  menuName={
                    <div className="flex items-center gap-2">
                      <div className="iconSize flex items-center justify-center">
                        <img src={recepcionIcon} alt="Recepcion" className="iconSize" />
                      </div>
                      <span className={`${isCollapsed ? 'hidden' : 'block'} text-principal text-sm`}>Recepcion</span>
                    </div>
                  } 
                  route='recepcion'
                  hide={!canAccess([ROLES.ADMIN, ROLES.RECEPCION])} // Ocultar este menú si el usuario no tiene acceso
                />
              </li>
              <li>
                <MenuItem 
                  menuName={
                    <div className="flex items-center gap-2">
                      <div className="iconSize flex items-center justify-center">
                        <img src={cajaIcon} alt="Caja" className="iconSize" />
                      </div>
                      <span className={`${isCollapsed ? 'hidden' : 'block'} text-principal text-sm`}>Caja</span>
                    </div>
                  } 
                  route='caja'
                  hide={!canAccess([ROLES.ADMIN, ROLES.CAJA])}
                />
              </li>
              <li>
                <MenuItem 
                  menuName={
                    <div className="flex items-center gap-2">
                      <div className="iconSize flex items-center justify-center">
                        <img src={cajaIcon} alt="Comisiones" className="iconSize" />
                      </div>
                      <span className={`${isCollapsed ? 'hidden' : 'block'} text-principal text-sm`}>Comisiones</span>
                    </div>
                  } 
                  route='comisiones'
                  hide={!canAccess([ROLES.ADMIN, ROLES.CAJA])}
                />
              </li>
              <li>
                <MenuItem 
                  menuName={
                    <div className="flex items-center gap-2">
                      <div className="iconSize flex items-center justify-center">
                        <img src={stockIcon} alt="Stock" className="iconSize" />
                      </div>
                      <span className={`${isCollapsed ? 'hidden' : 'block'} text-principal text-sm`}>Stock</span>
                    </div>
                  }
                  route='stock'
                  hide={!canAccess([ROLES.ADMIN, ROLES.STOCK])}
                />
              </li>
            
            </ul>
          </nav>
          <MenuItem 
            menuName={
              <div className="flex items-center gap-2 ml-6 mr-6">
                <div className="iconSize flex items-center justify-center">
                  <img src={logoutIcon} alt="Salir" className="iconSize" />
                </div>
                <span className={`${isCollapsed ? 'hidden' : 'block'} text-principal text-sm`}>Salir</span>
              </div>
            } 
            route='logout'
          />
        </aside>
        <div className={`${isCollapsed ? 'ml-16' : 'ml-48'} flex-1 h-full overflow-hidden transition-all duration-300`}>
          <header>
            <CardUsuario 
              userName={user ? (user.usuarioData.nombre + ' ' + user.usuarioData.apellido) : ''} 
              role={user?.role === 'Admin' ? 'Administrador' : (user?.role ?? '')}>  
            </CardUsuario>
          </header>
          <main className="p-4 bg-fondo-contenedor h-full overflow-hidden">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
