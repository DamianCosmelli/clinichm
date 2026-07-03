# ClinicHM UI

![React](https://img.shields.io/badge/React-19.1.0-61DAFB)
![Vite](https://img.shields.io/badge/Vite-ready-646CFF)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-ready-38B2AC)

Interfaz web para la gestión de turnos, pacientes, caja, stock y operaciones administrativas de la clínica.

---

## Tecnologías

| Tecnología | Versión | Propósito |
|---|---|---|
| React | 19.1.0 | UI dinámica |
| Vite | 6.1.0 | Bundler de desarrollo |
| TypeScript | 5.7 | Tipado estático |
| Tailwind CSS | 4.0.11 | Estilos y diseño |
| React Router | 6.30.0 | Navegación cliente |
| Vite Plugin React | 4.3.4 | Integración de React con Vite |

---

## Funcionalidades principales

- **Autenticación** — Login y logout de usuarios
- **Turnos** — Gestión de turnos y agenda médica
- **Recepción** — Registro y búsqueda de pacientes
- **Pacientes** — ABM de pacientes y perfil clínico
- **Usuarios** — ABM de usuarios y roles
- **Médicos** — Gestión de profesionales
- **Empleados** — Gestión de personal
- **Productos** — ABM de productos
- **Stock** — Control de inventario
- **Caja** — Movimientos, cobros y cierres de caja
- **Sucursales** — Gestión de sucursales
- **Tratamientos** — Catálogo de tratamientos
- **Reportes** — Visualización de métricas

---

## Estructura del proyecto

```
clinichm-ui/
├── src/
│   ├── api/           # Configuración de endpoints y variables de entorno
│   ├── components/    # Componentes reutilizables y vistas específicas
│   ├── pages/         # Páginas principales de la aplicación
│   ├── services/      # Lógica de negocio y llamadas a API
│   ├── styles/        # Estilos CSS y utilidades de diseño
│   ├── hooks/         # Hooks personalizados
│   └── utils/         # Utilidades generales
├── public/            # Archivos estáticos
├── Dockerfile         # Imagen de contenedor
├── docker-compose.yml # Orquestación de contenedores
├── package.json       # Dependencias y scripts
└── .env.example       # Variables de entorno de ejemplo
```

## Configuración

1. Instalar dependencias:

```bash
npm install
```

2. Crear el archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

3. Ajustar las variables de entorno según el entorno:

| Variable | Descripción |
|---|---|
| `VITE_API_BASE_URL` | URL base de la API de ClinicHM |
| `VITE_API_KEY` | Clave de API para integración |

---

## Ejecución

### Desarrollo

```bash
npm run dev
```

### Producción / Preview

```bash
npm run build
npm run preview
```

---
