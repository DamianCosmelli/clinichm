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

Preparar un plan indicando:

- Si se reutilizará una Task existente o se creará una nueva
- Número y detalle de la Task (si existe)
- Descripción propuesta: Objetivo, Alcance, Consideraciones técnicas, Criterios de aceptación, Definition of Done
- Rama propuesta (formato feature/CHM-XXX-descripcion)

No crear duplicados.

---

## 3. Presentar plan y solicitar confirmación

Mostrar al usuario el plan completo detallado.

Esperar confirmación explícita antes de continuar.

Si el usuario solicita cambios, ajustar el plan y volver a presentar.

---

## 4. Crear o actualizar Task

Según el plan confirmado:

- Si no existe una Task relacionada, crear una nueva con la descripción definida.
- Si existe una Task relacionada, actualizarla con la descripción del plan.

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

## 5. Informar el número de Task

Ejemplo

CHM-245

---

## 6. Git

Crear siempre una rama desde

develop

Formato

feature/CHM-245-descripcion-corta

Nunca crear ramas desde main.

Nunca crear ramas desde master.

Nunca trabajar directamente sobre develop.

---

## 7. Desarrollo

Implementar únicamente lo solicitado.

No modificar funcionalidades no relacionadas.

Mantener la arquitectura existente.

---

## 8. Calidad

Antes de finalizar:

- Compilar
- Ejecutar pruebas disponibles
- Verificar que no existan errores de compilación

---

## 9. Commits

Todos los commits deberán comenzar con

CHM-245:

Ejemplo

CHM-245 Agrega autenticación JWT

---

## 10. Pull Request

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

Luego de crear el PR:

- Agregar un comentario en Jira con la URL del PR
- Transicionar la Task a **"En revisión"**

---

## 11. Jira (post-merge)

Cuando el PR sea aprobado y mergeado a develop

- Agregar un comentario en Jira indicando:
  - Funcionalidad implementada
  - Componentes modificados
  - Resultado de pruebas
  - URL del PR mergeado
- Transicionar la Task a **"Listo"**

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

Antes de comenzar cualquier implementación, seguir los pasos 1 al 3 del flujo obligatorio.

Una vez confirmado el plan por el usuario, informar:

Task:

CHM-XXX

Rama:

feature/CHM-XXX-descripcion

Luego comenzar el desarrollo.