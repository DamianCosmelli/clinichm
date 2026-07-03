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
| Serilog | 8.0.3 | Logging estructurado |
| Swashbuckle (Swagger) | 6.6.2 | Documentación interactiva |
| ClosedXML | 0.104.2 | Generación de reportes Excel |
| xUnit + Moq | - | Tests unitarios |

---

## Funcionalidades

- **Turnos** — Gestión completa de agenda de turnos con médicos
- **Pacientes** — ABM, búsqueda por DNI, filtros por médico
- **Médicos** — ABM de profesionales + asignación de tratamientos
- **Agenda Médica** — Horarios y disponibilidad por médico
- **Caja** — Movimientos, cierres de caja, medios de pago
- **Stock** — Control de inventario, auditoría, reporte Excel
- **Productos** — ABM con categorías
- **Cobros** — Registro de cobros con notas y productos asociados
- **Comisiones** — Pago de comisiones por rol
- **Usuarios** — ABM, login/logout, cambio de contraseña, auditoría
- **Roles** — Control de acceso basado en roles (Admin, Recepcion, Turnos, Caja, Stock)
- **WhatsApp** — Webhook para integración con Meta/WhatsApp Cloud API
- **Cotización Dólar** — Consulta del dólar blue Argentina vía DolarApi
- **Importación/Exportación** — Importar datos desde Excel, exportar stock
- **Health Checks** — Endpoint de salud de la aplicación y BD
- **Auditoría** — Logs de acceso de usuarios y movimientos de stock

---

## Arquitectura

El proyecto sigue una arquitectura limpia por capas:

```
┌─────────────────────────────────────────────────┐
│                 Controllers                      │  ← HTTP / DTOs
├─────────────────────────────────────────────────┤
│                  Services                        │  ← Lógica de negocio
├─────────────────────────────────────────────────┤
│                Repositories                      │  ← Acceso a datos
├─────────────────────────────────────────────────┤
│           DbContext / EF Core                    │  ← ORM
├─────────────────────────────────────────────────┤
│                    MySQL 8                        │  ← Base de datos
└─────────────────────────────────────────────────┘
```

- **Controllers** reciben/responden DTOs, nunca exponen entidades directamente
- **Services** contienen la lógica de negocio (interfaz + implementación)
- **Repositories** abstraen el acceso a datos (genérico `IRepository<T>` + repositorios específicos)
- **Inyección de dependencias** automática por convención de nombres

---

## Estructura del proyecto

```
clinichm-api/
├── Controllers/           # 25 controladores API REST
├── Services/              # Interfaces y servicios
│   └── Implements/        # Implementaciones concretas
├── Repositories/          # Capa de acceso a datos
├── Models/                # Entidades de EF Core
├── DTOs/                  # Data Transfer Objects
├── Data/                  # DbContext, SeedData, migraciones
├── Middleware/            # Autenticación y manejo de errores
├── Utils/                 # Filtros, helpers, encriptación
├── Extensions/            # Extensiones de DI
├── Tests/                 # Tests unitarios (xUnit)
├── conf/                  # Archivos de configuración
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   ├── appsettings.Production.json
│   ├── AuthRole.json
│   └── toxinas.json
├── Mocks/                 # Datos de prueba (Excel, JSON)
├── Properties/            # Launch settings
├── .devcontainer/         # Config DevContainer
├── Dockerfile             # Build multi-stage
├── docker-compose.yml     # Orquestación producción
└── clinichm-api.sln       # Solución de Visual Studio
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

1. Abrir la carpeta en VS Code
2. Ejecutar **Dev Containers: Reopen in Container**
3. El contenedor levanta .NET SDK + MySQL 8 automáticamente (`.devcontainer/docker-compose.yml`)
4. Dentro del contenedor:

```bash
dotnet run
```

### 3. Docker Compose (producción)

```bash
docker-compose up -d
```

La API queda disponible en `http://localhost:8080` y MySQL en `localhost:3307`.

---

## Autenticación

La API utiliza un esquema de autenticación de **doble capa**:

### API Key (global)
Toda request debe incluir el header `X-API-KEY` con el valor configurado en `appsettings.*.json`.  
Se puede exceptuar endpoints con `[AllowAnonymous]` o `[Authorize]`.

### JWT Bearer Token
El login se realiza mediante:

```bash
curl --location 'http://localhost:5121/api/Usuario/login' \
--header 'Content-Type: application/json' \
--data '{
    "userName": "doragon",
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
- **Migraciones:** Una migración inicial (`migrations_v1.0`)

### Seed data

Al iniciar por primera vez, la base se puebla con datos iniciales:
- Roles (Admin, Recepcion, Turnos, Caja, Stock)
- Medios de pago (6 tipos)
- Estados de turno (5 estados)
- Roles de comisión (3 tipos)
- Sucursales (Flores, Lomas)
- Tipos de movimiento (Cobro, Retiro)
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

---

## Docker

### Desarrollo (DevContainer)

```yaml
# .devcontainer/docker-compose.yml
# Levanta .NET SDK + MySQL 8, IP fija, volumen de datos persistente
```

### Producción

```bash
docker-compose up -d
```

- **API:** `clinic-api:80` (mapeado a `localhost:8080`)
- **MySQL:** `clinic-db:3306` (mapeado a `localhost:3307`)
- **Volumen:** `clinic-db-data` para persistencia
- **Reinicio:** `unless-stopped`
- **Red:** `clinic-network` (bridge)

El `Dockerfile` usa build multi-stage:
1. `dotnet restore` + `dotnet publish` con SDK 8.0
2. Imagen final con `aspnet:8.0`, expone puerto 80
