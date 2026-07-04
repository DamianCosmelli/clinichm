# ClinicHM API

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED)

API RESTful para la gestión integral de una clínica médica: turnos, pacientes, médicos, caja, stock, cobros, comisiones y más.

---

## Tecnologías

| Tecnología | Versión | Propósito |
|---|---|---|
| .NET / ASP.NET Core | 8.0 (LTS) | Runtime y framework web |
| Entity Framework Core | 8.0.3 | ORM |
| MySQL (Pomelo) | 8.0.40 / 8.0.2 | Base de datos y provider |
| JWT Bearer | 8.0.3 | Autenticación por token |
| BCrypt.Net-Next | 4.0.3 | Hashing de contraseñas |
| Serilog | 4.2.0 | Logging estructurado |
| Swashbuckle (Swagger) | 6.6.2 | Documentación interactiva |
| ClosedXML | 0.104.2 | Generación de reportes Excel |
| Health Checks | 8.0.3 / 8.0.1 | Health checks de app y BD |
| xUnit + Moq | - | Tests unitarios |

---

## Funcionalidades

- **Turnos** — Gestión completa de agenda de turnos con médicos
- **Pacientes** — ABM, búsqueda por DNI, filtros por médico
- **Médicos** — ABM de profesionales + asignación de tratamientos
- **Agenda Médica** — Horarios y disponibilidad por médico
- **Caja** — Movimientos, cierres de caja, medios de pago
- **Cobros** — Registro de cobros con notas, productos y tratamientos asociados
- **Stock** — Control de inventario, auditoría, transferencias, reporte Excel
- **Productos** — ABM con categorías
- **Comisiones** — Pago de comisiones por rol
- **Usuarios** — ABM, login/logout, cambio de contraseña, auditoría
- **Roles** — Control de acceso basado en roles (Admin, Recepcion, Turnos, Caja, Stock)
- **Recepción** — Registro de ingreso/egreso de pacientes con seguimiento de estado
- **WhatsApp** — Webhook para integración con Meta/WhatsApp Cloud API
- **Cotización Dólar** — Consulta del dólar blue Argentina vía DolarApi
- **Importación/Exportación** — Importar datos desde Excel, exportar stock
- **Turnos Afectados** — Historial de cambios y cancelaciones de turnos
- **Health Checks** — Endpoint de salud de la aplicación y BD
- **Auditoría** — Logs de acceso de usuarios y movimientos de stock
- **Vouchers** — Generación de comprobantes de pago

---

## Arquitectura

El proyecto sigue una arquitectura limpia por capas con inyección de dependencias automática:

```
┌─────────────────────────────────────────────────┐
│              Controllers (25)                    │  ← HTTP / DTOs
├─────────────────────────────────────────────────┤
│            Middleware (Auth + Errors)             │  ← Filtros globales
├─────────────────────────────────────────────────┤
│           Services (28 interfaces/impl.)          │  ← Lógica de negocio
├─────────────────────────────────────────────────┤
│         Repositories (9 genéricos/específicos)    │  ← Acceso a datos
├─────────────────────────────────────────────────┤
│        DbContext / EF Core (28 DbSets)            │  ← ORM (Code-First)
├─────────────────────────────────────────────────┤
│                  MySQL 8.0                        │  ← Base de datos
└─────────────────────────────────────────────────┘
```

- **Controllers** reciben/responden DTOs, nunca exponen entidades directamente
- **Middleware** maneja autenticación JWT + API Key y errores globales
- **Services** contienen la lógica de negocio (interfaz + implementación)
- **Repositories** abstraen el acceso a datos (`IRepository<T>` genérico + repositorios específicos)
- **Inyección de dependencias** automática por convención de nombres via `ServiceCollectionExtensions`

---

## Estructura del proyecto

```
clinichm-api/
├── Controllers/             # 25 controladores REST
├── Services/                # Interfaces de servicios
│   └── Implements/          # 28 implementaciones concretas
├── Repositories/            # Capa de acceso a datos (10 interfaces, 9 impl.)
├── Models/                  # 29 entidades de EF Core
├── DTOs/                    # 27 Data Transfer Objects
├── Data/                    # DbContext, SeedData, migraciones, constraints
├── Middleware/               # AuthenticationMiddleware, ExceptionMiddleware
├── Utils/                   # Filtros globales (ApiKey, BadRequest, NotFound), EncryptionHelper
├── Extensions/              # DI registration (ServiceCollectionExtensions)
├── Migrations/              # Migración inicial (migrations_v1.0)
├── Tests/                   # 62 tests unitarios (xUnit + Moq)
├── Properties/              # launchSettings.json
├── Scripts/                 # Scripts de utilidad (SQL, bash)
├── Mocks/                   # Datos de prueba (Excel, JSON)
├── conf/                    # Archivos de configuración
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   ├── appsettings.Production.json
│   ├── AuthRole.json
│   └── toxinas.json
├── .devcontainer/           # Config DevContainer (en raíz del repo)
├── Dockerfile               # Build multi-stage
├── docker-compose.yml       # Orquestación producción
├── clinichm-api.csproj      # net8.0
└── clinichm-api.sln         # Solución VS 2022 (API + Tests)
```

---

## Requisitos previos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [MySQL 8.0](https://dev.mysql.com/downloads/) (local o contenedor)
- [Docker](https://www.docker.com/) (opcional, para DevContainer o producción)
- [VS Code + Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers) (opcional)

---

## Configuración

Toda la configuración sensible está en `conf/`. Los archivos principales:

| Archivo | Propósito |
|---|---|
| `appsettings.json` | Configuración base (logging) |
| `appsettings.Development.json` | Conexión MySQL, JWT, WhatsApp, API Key, CORS, encriptación |
| `appsettings.Production.json` | Overrides de producción (binding, DB, CORS, logging) |
| `AuthRole.json` | Mapeo de controladores/métodos → roles permitidos |
| `toxinas.json` | Valores unitarios de toxinas (botox, dysport, xeomin) |

### Variables de entorno importantes

| Variable | Descripción |
|---|---|
| `ASPNETCORE_ENVIRONMENT` | `Development` o `Production` |
| `TZ` | Zona horaria (ej: `America/Argentina/Buenos_Aires`) |

---

## Ejecución

### 1. Directa (local)

```bash
dotnet restore
dotnet build
dotnet run
```

La API se levanta en `http://localhost:5121` (perfil Development).  
Swagger disponible en `/swagger`.

### 2. DevContainer (VS Code)

El DevContainer está configurado en la raíz del repositorio (`.devcontainer/`).  
Levanta .NET SDK + MySQL 8 automáticamente. Dentro del contenedor:

```bash
dotnet run
```

### 3. Docker Compose (producción)

```bash
docker-compose up -d
```

La API queda disponible en `http://localhost:8080` y MySQL en `localhost:3306`.

---

## Autenticación

La API utiliza un esquema de autenticación de **doble capa**:

### API Key (global)
Toda request debe incluir el header `X-API-KEY` con el valor configurado en `appsettings.*.json`.

### JWT Bearer Token
El login se realiza mediante:

```bash
curl --location 'http://localhost:5121/api/Usuario/login' \
--header 'Content-Type: application/json' \
--data '{
    "userName": "admin",
    "password": "admin111"
}'
```

Respuesta:

```json
{
    "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

Endpoints autenticados:

```bash
curl --location 'http://localhost:5121/api/Rol' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIs...'
```

### Roles disponibles

| Rol | Descripción |
|---|---|
| Admin | Acceso total |
| Recepcion | Recepción de pacientes |
| Turnos | Gestión de turnos |
| Caja | Movimientos y cierres de caja |
| Stock | Control de inventario |

### Control de acceso por roles (`AuthRole.json`)

```json
{
    "RolController": {
        "GetAll": ["Admin"]
    },
    "SucursalesController": {
        "*": ["Admin"]
    }
}
```

- Si un controlador/método no está en el JSON, es de **acceso público** (autenticado vía API Key)
- `"*"` aplica el rol a todos los métodos del controlador

---

## Endpoints API

| Método | Path | Controlador |
|---|---|---|
| GET | `/api/health` | Health Check |
| GET/POST/PUT/DELETE | `/api/Usuario` | Usuarios + login/logout |
| GET/POST/PUT/DELETE | `/api/Rol` | Roles |
| GET/POST/PUT/DELETE | `/api/Pacientes` | Pacientes |
| GET/POST/PUT/DELETE | `/api/Turnos` | Turnos |
| GET/POST/PUT/DELETE | `/api/Medicos` | Médicos |
| GET/POST/PUT/DELETE | `/api/Tratamientos` | Tratamientos |
| GET/POST/PUT/DELETE | `/api/Stock` | Stock |
| GET/POST/PUT/DELETE | `/api/Producto` | Productos |
| GET/POST/PUT/DELETE | `/api/CategoriaProd` | Categorías de producto |
| GET/POST/PUT/DELETE | `/api/Empleado` | Empleados |
| GET/POST/PUT/DELETE | `/api/Sucursales` | Sucursales |
| GET/POST/PUT/DELETE | `/api/RecepcionPacientes` | Recepción de pacientes |
| GET/POST/PUT/DELETE | `/api/CierreCaja` | Cierre de caja |
| GET/POST/PUT/DELETE | `/api/MovimientoCaja` | Movimientos de caja |
| GET/POST/PUT/DELETE | `/api/MedioDePago` | Medios de pago |
| GET/POST/PUT/DELETE | `/api/Cobros` | Cobros |
| GET/POST/PUT/DELETE | `/api/PagoDeComisiones` | Pago de comisiones |
| GET/POST/PUT/DELETE | `/api/RoleComision` | Roles de comisión |
| GET/POST/PUT/DELETE | `/api/AgendaMedica` | Agenda médica |
| GET/POST/PUT/DELETE | `/api/EstadosTurnos` | Estados de turno |
| GET/POST/PUT/DELETE | `/api/UsuarioAudit` | Auditoría de usuarios |
| GET/POST/PUT/DELETE | `/api/AuditStock` | Auditoría de stock |
| GET/POST/PUT/DELETE | `/api/MedicoTratamiento` | Médico-Tratamiento |
| GET/POST | `/api/webhook` | Webhook WhatsApp |
| POST | `/api/ImportData` | Importación de datos |

---

## Base de datos

- **Motor:** MySQL 8.0
- **ORM:** Entity Framework Core 8.0 (Code-First)
- **Migraciones:** Una migración inicial (`migrations_v1.0`) con 28 tablas

### Seed data

Al iniciar por primera vez, la base se puebla con datos iniciales:
- Roles (Admin, Recepcion, Turnos, Caja, Stock)
- Medios de pago (6 tipos)
- Estados de turno (5 estados)
- Roles de comisión (3 tipos)
- Sucursales (Flores, Lomas)
- TipoMovimiento (Cobro, Retiro)
- Categorías de producto (5 categorías)
- Médico por defecto ("Equipo Medico")

### Constraints únicos

Se aplican índices únicos en: `UserName`, DNI de paciente/empleado, matrícula de médico, nombre de rol/estado/medio de pago/sucursal/tratamiento/categoría, etc.

---

## Pruebas

```bash
dotnet test Tests/Tests.csproj
```

O desde la raíz de la solución:

```bash
dotnet test
```

Framework: **xUnit** + **Moq** + **EF Core InMemory**.  
62 archivos de test distribuidos entre servicios y controladores.

---

## Docker

### Producción

```bash
docker-compose up -d
```

- **API:** `clinichm-api:80` (mapeado a `localhost:8080`)
- **MySQL:** `database:3306` (mapeado a `localhost:3306`)
- **Volumen:** `./../data/mysql` para persistencia
- **Red:** bridge por defecto

El `Dockerfile` usa build multi-stage:
1. `dotnet restore` + `dotnet publish` con `mcr.microsoft.com/dotnet/sdk:8.0`
2. Imagen final con `mcr.microsoft.com/dotnet/aspnet:8.0`, expone puerto 80
