// src/App.tsx
import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useOutlet } from 'react-router-dom';
import Layout from './components/Layout/Layout';
//import Home from './pages/Home';
import Turnos from './pages/Turnos';
import NuevoTurno from './pages/NuevoTurno';
import Logout from './pages/Logout';
import Usuarios from './pages/Usuarios';
import Pacientes from './pages/Pacientes';
import Medicos from "./pages/Ajustes/Medicos/Medicos";
import Sucursales from "./pages/Ajustes/Sucursales/Sucursales";
import Tratamientos from "./pages/Ajustes/Tratamientos/Tratamientos"; // Importar la nueva página
import Productos from "./pages/Ajustes/Productos/Productos";
import Empleados from "./pages/Ajustes/Empleados/Empleados";
import Agenda from './pages/Agenda';
import Recepcion from './pages/Recepcion';
import Caja from './pages/Caja';
import Cobro from './pages/Cobro';
import Retiro from './pages/Retiro';
import NuevaAgenda from './pages/NuevaAgenda';
import EditarAgenda from './pages/EditarAgenda';
import NuevoPaciente from './pages/NuevoPaciente';
import PerfilPaciente from './pages/PerfilPaciente'; // Importar la nueva pantalla
import EditarPaciente from './pages/EditarPaciente'; // Importar la nueva pantalla
import EditarTurno from './pages/EditarTurno';
import Ajustes from './pages/Ajustes/Ajustes';
import PerfilUsuario from './pages/PerfilUsuario'; // Importar la nueva página
import NuevoUsuario from './pages/NuevoUsuario'; // Importar la nueva página
import EditarUsuario from './pages/EditarUsuario'; // Importar la página EditarUsuario
import NuevaAtencion from './pages/NuevaAtencion'; // Importar la nueva página
 // Importar la página Ajustes
import CierreDeCaja from './pages/CierreDeCaja';
import Comisiones from './pages/Comisiones';
import PerfilMedico from './pages/Ajustes/Medicos/PerfilMedico'; // Importar la página PerfilMedico
import CrearMedico from './pages/Ajustes/Medicos/CrearMedico'; // Importar la página CrearMedico
import EditarMedico from './pages/Ajustes/Medicos/EditarMedico'; // Importar la página EditarMedico
import PerfilSucursal from './pages/Ajustes/Sucursales/PerfilSucursal'; // Importar la página PerfilSucursal
import CrearSucursal from './pages/Ajustes/Sucursales/CrearSucursal'; // Importar la página CrearSucursal
import EditarSucursal from './pages/Ajustes/Sucursales/EditarSucursal'; // Importar la página EditarSucursal
import PerfilEmpleado from './pages/Ajustes/Empleados/PerfilEmpleado'; // Importar la página PerfilEmpleado
import CrearEmpleado from './pages/Ajustes/Empleados/CrearEmpleado'; // Importar la página CrearEmpleado
import EditarEmpleado from './pages/Ajustes/Empleados/EditarEmpleado'; // Importar la página EditarEmpleado
import CrearTratamiento from './pages/Ajustes/Tratamientos/CrearTratamiento'; // Importar la página CrearTratamiento
import CrearProducto from './pages/Ajustes/Productos/CrearProducto'; // Importar la página CrearProducto
import Reportes from './pages/Reportes/Reportes'; // Importar la nueva página Reportes
import TurnosReportes from './pages/Reportes/Turnos/ReporteTurnos'; // Importar la página de Turnos dentro de Reportes
import PacientesReportes from './pages/Reportes/Paciente/ReportePacientes'; // Importar la página de Recepción dentro de Reportes
import Stock from './pages/stock/Stock'; // Importar la página Stock
import NuevoIngreso from './pages/stock/NuevoIngreso'; // Importar la nueva página
import { ROLES , ROLE_GROUPS} from './utils/roles';
import { AuthProvider } from './utils/authProvider';
import { AuthContext } from './utils/authContext';
import Login from './pages/Login';
import NoAutorizado from './pages/common/NoAutorizado';

interface PrivateRouteProps {
  allowedRoles: string[];
}

const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
  const { user } = useContext(AuthContext);
  const outlet = useOutlet();

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/noautorizado" replace />;

  return <>{outlet}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
      <Layout>
        <Routes>
          
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/noautorizado" element={<NoAutorizado />} />

          {/* Rutas SOLO ADMINISTRADOR */}
          <Route element={<PrivateRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/perfil-usuario/:id" element={<PerfilUsuario />} />
            <Route path="/nuevo-usuario" element={<NuevoUsuario />} />
            <Route path="/editar-usuario/:id" element={<EditarUsuario />} />

            {/*<Route path="/ajustes" element={<Ajustes />} />*/}

            <Route path="/ajustes/medicos" element={<Medicos />} />
            <Route path="/perfil-medico/:id" element={<PerfilMedico />} /> 
            <Route path="/crear-medico" element={<CrearMedico />} /> 
            <Route path="/editar-medico/:id" element={<EditarMedico />} /> 

            <Route path="/ajustes/sucursales" element={<Sucursales />} />
            <Route path="/perfil-sucursal/:id" element={<PerfilSucursal />} />
            <Route path="/crear-sucursal" element={<CrearSucursal />} />
            <Route path="/editar-sucursal/:id" element={<EditarSucursal />} />

            <Route path="/ajustes/tratamientos" element={<Tratamientos />} />
            <Route path="/tratamientos/nuevo" element={<CrearTratamiento />} />

           {/* <Route path="/ajustes/productos" element={<Productos />} />*/}
           {/* <Route path="/productos/nuevo" element={<CrearProducto />} />*/}

            <Route path="/ajustes/empleados" element={<Empleados />} />     
            <Route path="/perfil-empleado/:id" element={<PerfilEmpleado />} />
            <Route path="/crear-empleado" element={<CrearEmpleado />} />
            <Route path="/editar-empleado/:id" element={<EditarEmpleado />} />
          </Route>

          {/* Rutas SOLO TURNOS */}
          <Route element={<PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.TURNOS]} />}>
            <Route path="/nuevo-turno" element={<NuevoTurno />} />
            <Route path="/editarTurno" element={<EditarTurno />} />
          </Route>

          {/* Rutas SOLO CAJA */}
          <Route element={<PrivateRoute allowedRoles={[ROLES.ADMIN,ROLES.CAJA]} />}>
            <Route path="/caja" element={<Caja />} />
            <Route path="/cobro" element={<Cobro />} />
            <Route path="/retiro" element={<Retiro />} />
            <Route path="/cierre-de-caja" element={<CierreDeCaja />} />
            <Route path="/comisiones" element={<Comisiones />} />
          </Route>
          
          {/* Rutas SOLO RECEPCION */}
          <Route element={<PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.RECEPCION]} />}>
            <Route path="/recepcion" element={<Recepcion />} />
            <Route path="/nueva-atencion" element={<NuevaAtencion />} />
          </Route>

          {/* Rutas SOLO STOCK */}
          <Route element={<PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.STOCK]} />}>
            <Route path="/stock" element={<Stock />} />
            <Route path="/stock/nuevo" element={<NuevoIngreso />} />
            <Route path="/ajustes" element={<Ajustes />} />
            <Route path="/ajustes/productos" element={<Productos />} />
            <Route path="/productos/nuevo" element={<CrearProducto />} />
          </Route>
          
          {/* Rutas COMPARTIDAS POR ROLES */}
          <Route element={<PrivateRoute allowedRoles={[...ROLE_GROUPS.ALL_PRIVATE]} />}>
            <Route path="/" element={<Turnos />} />
            <Route path="/turnos" element={<Turnos />} />

            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/nuevoPaciente" element={<NuevoPaciente />} />
            <Route path="/perfilPaciente" element={<PerfilPaciente />} />
            <Route path="/editarPaciente" element={<EditarPaciente />} />
            
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/nueva-agenda" element={<NuevaAgenda />} />
            <Route path="/editar-agenda" element={<EditarAgenda />} />

            <Route path="/reportes" element={<Reportes />} /> 
            <Route path="/reportes/turnos" element={<TurnosReportes />} />
            <Route path="/reportes/pacientes" element={<PacientesReportes />} />

            <Route path="/logout" element={<Logout />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />

          {/* Agrega más rutas según sea necesario */}
        </Routes>
      </Layout>
      </AuthProvider>
    </Router>
  );
};

export default App;

