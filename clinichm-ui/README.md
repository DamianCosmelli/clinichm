# ClinicHM UI

![React](https://img.shields.io/badge/React-19.1.0-61DAFB)
![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0.11-38B2AC)

Interfaz web para la gestión de turnos, pacientes, caja, stock y operaciones administrativas de la clínica.

---

## Tecnologías

| Tecnología | Versión | Propósito |
|---|---|---|
| React | 19.1.0 | UI dinámica |
| Vite | 6.1.0 | Bundler de desarrollo |
| TypeScript | 5.7 | Tipado estático |
| Tailwind CSS | 4.0.11 | Estilos utilitarias |
| @material-tailwind/react | 2.0.5 | Componentes Material Design |
| React Router | 6.30.0 | Navegación cliente con RBAC |
| react-hook-form | 7.54.2 | Manejo de formularios |
| Zod | 3.24.2 | Validación de esquemas |
| @hookform/resolvers | 4.1.3 | Integración hookform + Zod |
| react-big-calendar | 1.18.0 | Calendario de turnos/agenda |
| date-fns | 4.1.0 | Utilidades de fecha |
| dayjs | 1.11.13 | Manipulación de fechas |
| ApexCharts / Chart.js / Recharts | - | Librerías de gráficos y reportes |
| @heroicons/react | 1.0.6 | Íconos SVG |
| jwt-decode | 4.0.0 | Decodificación de tokens JWT |

---

## Funcionalidades principales

- **Autenticación** — Login/logout con JWT, protección por roles (RBAC)
- **Turnos** — Calendario interactivo, creación, edición y cambio de estado
- **Recepción** — Registro de ingreso/egreso con calendario y seguimiento
- **Pacientes** — ABM, búsqueda, perfil clínico
- **Usuarios** — ABM, roles, historial de sesiones
- **Médicos** — Gestión de profesionales y agenda
- **Empleados** — Gestión de personal
- **Productos** — ABM con categorías
- **Stock** — Control de inventario, ingresos, transferencias
- **Caja** — Movimientos, cobros, cierres de caja
- **Sucursales** — Gestión de sucursales
- **Tratamientos** — Catálogo de tratamientos
- **Reportes** — Gráficos y métricas (turnos, pacientes, stock, vencimientos)

---

## Estructura del proyecto

```
clinichm-ui/
├── src/
│   ├── api/                    # Configuración de endpoints y fetch wrapper
│   │   ├── apiService.ts       # Wrapper genérico con X-API-KEY
│   │   ├── config.ts           # Variables de entorno
│   │   └── endpoints.ts        # Definición de endpoints
│   ├── assets/                 # Íconos SVG e imágenes
│   ├── charts/                 # Type declarations para ApexCharts
│   ├── components/             # Componentes reutilizables por módulo
│   │   ├── AgendaMedica/
│   │   ├── Caja/
│   │   ├── CierreCaja/
│   │   ├── common/             # Componentes genéricos (tablas, botones, selects)
│   │   ├── Empleados/
│   │   ├── Layout/             # Layout principal, navbar, menú
│   │   ├── Login/              # Login, reset de contraseña, 2FA
│   │   ├── Medicos/
│   │   ├── Pacientes/
│   │   ├── Productos/
│   │   ├── Recepcion/
│   │   ├── Stock/
│   │   ├── Sucursales/
│   │   ├── Tratamientos/
│   │   ├── Turnos/
│   │   └── Usuarios/
│   ├── declarations/           # Type declarations (react-date-range)
│   ├── hooks/                  # Custom hooks por funcionalidad
│   ├── mappers/                # Mapeo de entidades a eventos de calendario
│   ├── models/                 # Interfaces TypeScript (28 modelos)
│   ├── pages/                  # Páginas principales de la aplicación
│   │   ├── Ajustes/            # CRUDs de empleados, médicos, productos, etc.
│   │   ├── common/             # Home, ErrorPage, Loading, NoAutorizado
│   │   ├── Reportes/           # Reportes de pacientes, stock, turnos
│   │   └── stock/              # Stock y nuevos ingresos
│   ├── schema/                 # Esquemas de validación Zod
│   ├── services/               # Llamadas a API por entidad
│   ├── styles/                 # Estilos CSS específicos
│   ├── types/                  # Type declarations adicionales
│   ├── utils/                  # Auth context, roles, utilidades de fecha
│   ├── App.tsx                 # Componente raíz con routing basado en roles
│   ├── main.tsx                # Punto de entrada
│   └── tailwind.config.ts      # Configuración de Material Tailwind
├── public/                     # Archivos estáticos
├── Dockerfile                  # Build multi-stage (node → nginx)
├── docker-compose.yml          # Orquestación producción
├── nginx.conf                  # Configuración de nginx para SPA
├── package.json                # Dependencias y scripts
├── .env.example                # Variables de entorno de ejemplo
├── vite.config.ts              # Configuración de Vite (proxy /api)
├── tsconfig.json               # TypeScript project references
└── eslint.config.js            # ESLint flat config
```

---

## Configuración

1. Instalar dependencias:

```bash
npm install
```

2. Crear el archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

3. Ajustar las variables de entorno:

| Variable | Descripción |
|---|---|
| `VITE_API_BASE_URL` | URL base de la API (ej: `http://localhost:5121/`) |
| `VITE_API_KEY` | API Key para autenticación |

---

## Ejecución

### Desarrollo

```bash
npm run dev
```

El servidor de desarrollo se levanta en `http://localhost:5173` con proxy automático de `/api` hacia `http://localhost:5121`.

### Producción / Preview

```bash
npm run build
npm run preview
```

### Docker

```bash
docker-compose up -d
```

Sirve los archivos estáticos vía nginx en el puerto 80.

---

## Roles y control de acceso

La aplicación implementa RBAC (Role-Based Access Control) mediante `PrivateRoute`:

| Rol | Acceso |
|---|---|
| ADMIN | Todas las rutas |
| TURNOS | Turnos, agenda, pacientes |
| CAJA | Caja, cobros, cierres |
| RECEPCION | Recepción, pacientes, turnos |
| STOCK | Productos, stock |
