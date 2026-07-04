# Clinic Health Manager Development Agent

## Objetivo

Todo desarrollo debe estar asociado a una Task de Jira.

---

# Arquitectura

Backend
- .NET
- Arquitectura en Capas
- Repository Pattern
- Services
- DTO
- Dependency Injection

Frontend
- React
- TypeScript
- Tailwind CSS

Buenas prácticas
- SOLID
- DRY
- KISS
- Clean Code

---

# Flujo obligatorio

## 1. Analizar el requerimiento

Leer completamente la solicitud del usuario.

Si el requerimiento es ambiguo, realizar preguntas antes de comenzar.

---

## 2. Buscar una Task existente

Antes de crear una nueva Task, verificar mediante Jira si ya existe una Task abierta relacionada.

Si existe:

- reutilizarla
- informar el número de Task

No crear duplicados.

---

## 3. Crear Task

Si no existe una Task relacionada, crear una nueva.

Proyecto:

CHM

Tipo:

Task

Prioridad:

Medium

La descripción deberá contener:

### Objetivo

Descripción breve del objetivo.

### Alcance

Qué se implementará.

### Consideraciones técnicas

Aspectos importantes para el desarrollo.

### Criterios de aceptación

Lista de criterios verificables.

### Definition of Done

- Código implementado
- Build exitoso
- Tests ejecutados
- Pull Request creado

---

## 4. Informar el número de Task

Ejemplo

CHM-245

---

## 5. Git

Crear siempre una rama desde

develop

Formato

feature/CHM-245-descripcion-corta

Nunca crear ramas desde main.

Nunca crear ramas desde master.

Nunca trabajar directamente sobre develop.

---

## 6. Desarrollo

Implementar únicamente lo solicitado.

No modificar funcionalidades no relacionadas.

Mantener la arquitectura existente.

---

## 7. Calidad

Antes de finalizar:

- Compilar
- Ejecutar pruebas disponibles
- Verificar que no existan errores de compilación

---

## 8. Commits

Todos los commits deberán comenzar con

CHM-245:

Ejemplo

CHM-245 Agrega autenticación JWT

---

## 9. Pull Request

Crear siempre un Pull Request.

Origen

feature/CHM-245-descripcion

Destino

develop

Nunca crear Pull Requests hacia

- main
- master
- release

Título

CHM-245 - Descripción breve

Descripción

## Resumen

## Cambios realizados

## Archivos relevantes

## Pruebas realizadas

## Checklist

- Build OK
- Tests OK
- Sin conflictos
- Código revisado

---

## 10. Jira

Cuando el desarrollo finalice

Agregar un comentario indicando:

- Funcionalidad implementada
- Componentes modificados
- Resultado de pruebas
- Observaciones

Actualizar el estado de la Task según el flujo del proyecto.

---

# Restricciones

Nunca eliminar código sin justificación.

Nunca cambiar la arquitectura del proyecto.

Nunca crear código duplicado.

Nunca dejar código comentado.

Nunca dejar TODO pendientes.

Nunca modificar archivos no relacionados.

---

# Respuesta inicial

Antes de comenzar cualquier implementación informar:

Task:

CHM-XXX

Rama:

feature/CHM-XXX-descripcion

Luego comenzar el desarrollo.