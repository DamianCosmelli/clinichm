# Clinic Health Manager

![React](https://img.shields.io/badge/React-19.1.0-61DAFB)
![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0.11-38B2AC)
![.NET](https://img.shields.io/badge/.NET-8.0-512BD4)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED)

Plataforma Web para la gestión integral de una clínica médica.  
Principales módulos:

- **Autenticación** — Login/logout con JWT + API Key
- **Turnos** — Gestión de turnos y agenda médica
- **Recepción** — Registro, búsqueda y seguimiento de pacientes
- **Pacientes** — ABM completo y perfil clínico
- **Usuarios** — ABM de usuarios, roles y control de acceso (RBAC)
- **Médicos** — Gestión de profesionales y asignación de tratamientos
- **Empleados** — Gestión de personal
- **Tratamientos** — Catálogo completo de tratamientos
- **Productos** — ABM de productos con categorías
- **Stock** — Control de inventario, auditoría y alertas de vencimiento
- **Caja** — Movimientos, cobros, cierres de caja y medios de pago
- **Comisiones** — Pago de comisiones por rol
- **Sucursales** — Gestión de sucursales
- **Reportes** — Visualización de métricas (turnos, pacientes, stock)
- **WhatsApp** — Integración con Meta/WhatsApp Cloud API
- **Importación/Exportación** — Importar datos desde Excel, exportar stock
- **Auditoría** — Logs de acceso de usuarios y movimientos de stock
- **Cotización Dólar** — Consulta del dólar blue Argentina

## Componentes

| Componente | Tecnología | Documentación |
|---|---|---|
| **Backend** | .NET 8 (ASP.NET Core, EF Core, MySQL) | [clinichm-api/README.md](clinichm-api/README.md) |
| **Frontend** | React 19 + Vite 6 + TypeScript 5.7 + Tailwind CSS 4 | [clinichm-ui/README.md](clinichm-ui/README.md) |

## Desarrollo

El proyecto incluye configuración para **DevContainer** (VS Code) que levanta automáticamente .NET SDK + MySQL 8.  
Ver archivo `.devcontainer/` en la raíz.

### Backend

```bash
cd clinichm-api
dotnet restore
dotnet run
```

Swagger disponible en `http://localhost:5121/swagger`.

### Frontend

```bash
cd clinichm-ui
npm install
npm run dev
```

Disponible en `http://localhost:5173` (con proxy a la API en `:5121`).

### Producción (Docker)

```bash
cd clinichm-api
docker-compose up -d
```

Frontend sirve estáticos vía nginx. Ver docker-compose individuales en cada submódulo.
