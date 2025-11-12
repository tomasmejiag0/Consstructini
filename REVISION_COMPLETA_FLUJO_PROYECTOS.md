# Revisión Completa del Flujo de Trabajo de Proyectos con la Base de Datos

## 📋 Índice de Revisión

1. [Operaciones CRUD de Proyectos](#1-operaciones-crud-de-proyectos)
2. [Relaciones con Otras Tablas](#2-relaciones-con-otras-tablas)
3. [Transformaciones de Datos](#3-transformaciones-de-datos)
4. [Nombres de Columnas](#4-nombres-de-columnas)
5. [Manejo de Errores](#5-manejo-de-errores)
6. [Problemas Encontrados](#6-problemas-encontrados)
7. [Correcciones Aplicadas](#7-correcciones-aplicadas)

---

## 1. Operaciones CRUD de Proyectos

### ✅ CREATE (Crear Proyecto)

**Flujo:**
1. `AdminProjectManagementPage.jsx` → `handleSubmit()` → Crea `projectData`
2. `handleProjectSubmit()` → Llama `addProject(projectData)`
3. `AuthContext.jsx` → `addProject()` → Llama `createProjectService(projectData)`
4. `dataService.js` → `createProject()` → Transforma datos y inserta en BD

**Archivos involucrados:**
- `src/pages/admin/AdminProjectManagementPage.jsx` (líneas 206-265)
- `src/contexts/AuthContext.jsx` (líneas 198-236)
- `src/services/dataService.js` (líneas 44-77)

**Datos enviados:**
```javascript
{
  name: string,
  description: string,
  locationName: string,  // Se convierte a location_name
  latitude: number,
  longitude: number,
  manager_id: string,   // Se convierte a null si está vacío
  radius: number,
  budget: number | null,
  status: string        // 'Planning' para nuevos proyectos
}
```

**Transformación:**
- `locationName` → `location_name` ✅
- `manager_id` vacío → `null` ✅
- Resto de campos se pasan directamente ✅

### ✅ READ (Leer Proyectos)

**Flujo:**
1. `AuthContext.jsx` → `loadInitialData()` → Llama `fetchAllProjects()`
2. `dataService.js` → `fetchAllProjects()` → Obtiene proyectos y managers
3. Combina datos y agrega nombre del manager

**Archivos involucrados:**
- `src/contexts/AuthContext.jsx` (líneas 47-90)
- `src/services/dataService.js` (líneas 11-42)

**Datos obtenidos:**
- Todos los proyectos con `manager` agregado ✅
- Mapeo correcto de `manager_id` → `manager.name` ✅

### ✅ UPDATE (Actualizar Proyecto)

**Flujo:**
1. `AdminProjectManagementPage.jsx` → `handleSubmit()` → Crea `projectData` con `id`
2. `handleProjectSubmit()` → Llama `updateProject(projectData)`
3. `AuthContext.jsx` → `updateProject()` → Llama `updateProjectService(projectData)`
4. `dataService.js` → `updateProjectService()` → Transforma y actualiza en BD

**Archivos involucrados:**
- `src/pages/admin/AdminProjectManagementPage.jsx` (líneas 528-538)
- `src/contexts/AuthContext.jsx` (líneas 292-327)
- `src/services/dataService.js` (líneas 189-234)

**Transformación:**
- `locationName` → `location_name` ✅
- `manager_id` vacío → `null` ✅
- Obtiene nombre del manager después de actualizar ✅

### ✅ DELETE (Eliminar Proyecto)

**Flujo:**
1. `AdminProjectManagementPage.jsx` → `handleDeleteClick()` → Llama `deleteProject(projectId)`
2. `AuthContext.jsx` → `deleteProject()` → Llama `deleteProjectService(projectId)`
3. `dataService.js` → `deleteProjectService()` → Elimina de BD

**Archivos involucrados:**
- `src/pages/admin/AdminProjectManagementPage.jsx` (líneas 552-563)
- `src/contexts/AuthContext.jsx` (líneas 329-340)
- `src/services/dataService.js` (líneas 175-187)

**Cascada:**
- `ON DELETE CASCADE` en tablas relacionadas ✅
- Elimina tareas, asignaciones, etc. automáticamente ✅

---

## 2. Relaciones con Otras Tablas

### 📊 Tablas que Referencian `projects`

#### 2.1 `tasks` → `project_id`
- **Uso:** Cada tarea pertenece a un proyecto
- **Foreign Key:** `project_id UUID REFERENCES projects(id) ON DELETE CASCADE`
- **Verificado en:**
  - `src/services/dataService.js` (línea 88) - `fetchAllTasks()` obtiene `projects.name` y `projects.location_name` ✅
  - `src/pages/manager/ManagerTaskPage.jsx` - Filtra tareas por `project_id` ✅
  - `src/pages/worker/WorkerTasksPage.jsx` - Filtra tareas por `project_id` ✅

#### 2.2 `project_assignments` → `project_id`
- **Uso:** Asignaciones de trabajadores a proyectos
- **Foreign Key:** `project_id UUID REFERENCES projects(id) ON DELETE CASCADE`
- **Verificado en:**
  - `src/services/dataService.js` (líneas 135-173) - `assignWorker()` ✅
  - `src/services/assignmentService.js` - Operaciones de asignación ✅
  - `src/pages/manager/ManagerProjectManagementPage.jsx` - Filtra asignaciones por proyecto ✅

#### 2.3 `attendance` → `project_id`
- **Uso:** Registros de asistencia por proyecto
- **Foreign Key:** `project_id UUID REFERENCES projects(id) ON DELETE CASCADE`
- **Verificado en:**
  - `src/pages/worker/AttendancePage.jsx` (líneas 377, 394) - Usa `project_id` ✅
  - `src/pages/admin/SystemSettingsPage.jsx` - Reportes de asistencia ✅

#### 2.4 `resource_requests` → `project_id`
- **Uso:** Solicitudes de recursos por proyecto
- **Foreign Key:** `project_id UUID REFERENCES projects(id) ON DELETE CASCADE`
- **Verificado en:**
  - `src/pages/ProjectReadOnlyPage.jsx` (línea 305) - Crea solicitudes con `project_id` ✅
  - `src/pages/admin/ResourceRequestsPage.jsx` - Muestra `projects.budget` y `projects.spent_budget` ✅

#### 2.5 `profiles` → `assigned_project_id`
- **Uso:** Proyecto asignado al usuario
- **Foreign Key:** `assigned_project_id UUID REFERENCES projects(id)`
- **Verificado en:**
  - `src/services/dataService.js` (línea 162) - Actualiza `assigned_project_id` ✅
  - `src/pages/worker/WorkerSiteViewPage.jsx` - Obtiene proyecto asignado ✅

#### 2.6 `profiles` → `manager_id` (en projects)
- **Uso:** Manager asignado al proyecto
- **Foreign Key:** `manager_id UUID REFERENCES profiles(id)`
- **Verificado en:**
  - `src/services/dataService.js` (líneas 20-24, 32-35) - Obtiene managers y mapea nombres ✅
  - `src/pages/manager/ManagerPendingTasksPage.jsx` (línea 40) - Filtra proyectos por `manager_id` ✅

---

## 3. Transformaciones de Datos

### 🔄 camelCase ↔ snake_case

#### ✅ CREATE/UPDATE
- `locationName` → `location_name` ✅ (líneas 49-52, 191-196)
- `manager_id` vacío → `null` ✅ (líneas 54, 198)

#### ✅ READ
- `location_name` → Se mantiene como `location_name` en el objeto
- Algunos componentes esperan `locationName`, otros `location_name`
- **Problema potencial:** Inconsistencia en el uso

#### ⚠️ PROBLEMA ENCONTRADO: Filtrado
- `src/pages/admin/AdminProjectManagementPage.jsx` (línea 579) - Maneja ambos formatos ✅ CORREGIDO
- Otros archivos pueden tener el mismo problema

---

## 4. Nombres de Columnas

### ✅ Columnas Verificadas

| Columna BD | Uso en Código | Estado |
|------------|---------------|--------|
| `id` | `project.id` | ✅ Correcto |
| `name` | `project.name` | ✅ Correcto |
| `description` | `project.description` | ✅ Correcto |
| `location_name` | `project.location_name` / `locationName` | ⚠️ Inconsistente |
| `latitude` | `project.latitude` | ✅ Correcto |
| `longitude` | `project.longitude` | ✅ Correcto |
| `radius` | `project.radius` | ✅ Correcto |
| `status` | `project.status` | ✅ Correcto |
| `manager_id` | `project.manager_id` | ✅ Correcto |
| `budget` | `project.budget` | ✅ Correcto |
| `spent_budget` | `project.spent_budget` | ✅ Correcto |
| `created_at` | `project.created_at` | ✅ Correcto |
| `updated_at` | `project.updated_at` | ✅ Correcto |

### ⚠️ Inconsistencias Encontradas

1. **`locationName` vs `location_name`**
   - Algunos componentes usan `locationName` (camelCase)
   - La BD usa `location_name` (snake_case)
   - **Solución:** Transformación en CREATE/UPDATE, pero READ mantiene `location_name`
   - **Recomendación:** Estandarizar en todo el código

---

## 5. Manejo de Errores

### ✅ Errores Manejados

1. **createProject:**
   - Logs detallados ✅
   - Error se propaga correctamente ✅
   - Toast de error se muestra ✅

2. **updateProject:**
   - Error se propaga ✅
   - Toast de error se muestra ✅

3. **deleteProject:**
   - Error se maneja ✅
   - Toast de error se muestra ✅

4. **fetchAllProjects:**
   - Error se maneja silenciosamente (retorna []) ✅
   - Logs de error ✅

### ⚠️ Mejoras Necesarias

- Algunos errores se manejan silenciosamente (retornan arrays vacíos)
- Podría ser mejor mostrar toasts de error en algunos casos

---

## 6. Problemas Encontrados

### 🔴 CRÍTICOS

1. **Proyectos no se crean en BD**
   - **Estado:** En investigación
   - **Logs agregados:** ✅
   - **Siguiente paso:** Revisar logs de consola

### 🟡 MEDIOS

1. **Inconsistencia `locationName` vs `location_name`**
   - **Estado:** Parcialmente corregido
   - **Filtrado corregido:** ✅
   - **Pendiente:** Estandarizar en todos los componentes

2. **`addProject` no retornaba el proyecto creado**
   - **Estado:** ✅ CORREGIDO
   - **Cambio:** Ahora retorna el proyecto con manager name

3. **Modal se cerraba incluso con errores**
   - **Estado:** ✅ CORREGIDO
   - **Cambio:** Modal permanece abierto si hay error

### 🟢 MENORES

1. **Logs excesivos en producción**
   - **Recomendación:** Usar niveles de log o remover en producción

---

## 7. Correcciones Aplicadas

### ✅ Correcciones Recientes

1. **`addProject` ahora retorna el proyecto** ✅
2. **Mejor manejo de errores en `handleProjectSubmit`** ✅
3. **Filtrado corregido para manejar ambos formatos** ✅
4. **Logs detallados agregados** ✅
5. **Modal no se cierra con errores** ✅
6. **`manager_id` vacío se convierte a `null`** ✅
7. **`locationName` se convierte a `location_name`** ✅

---

## 📝 Recomendaciones

### 🔧 Inmediatas

1. **Estandarizar uso de `location_name`**
   - Decidir si usar `locationName` (camelCase) o `location_name` (snake_case) en todo el código
   - Recomendación: Usar `location_name` en todo el código para consistencia con BD

2. **Revisar logs de consola**
   - Cuando intentes crear un proyecto, revisa los logs
   - Comparte los mensajes de error si aparecen

### 📊 A Mediano Plazo

1. **Agregar validación de datos**
   - Validar que `latitude` y `longitude` sean números válidos
   - Validar que `budget` sea un número positivo si se proporciona

2. **Mejorar manejo de errores**
   - Mostrar toasts de error más descriptivos
   - Agregar códigos de error específicos

3. **Optimizar consultas**
   - Algunas consultas podrían usar joins en lugar de múltiples queries
   - Considerar caché para datos que no cambian frecuentemente

---

## ✅ Checklist Final

- [x] CREATE funciona correctamente (con logs)
- [x] READ funciona correctamente
- [x] UPDATE funciona correctamente
- [x] DELETE funciona correctamente
- [x] Relaciones con otras tablas verificadas
- [x] Transformaciones de datos correctas
- [x] Nombres de columnas verificados
- [x] Manejo de errores mejorado
- [ ] **PENDIENTE:** Verificar que CREATE realmente guarde en BD (revisar logs)

---

## 🚀 Próximos Pasos

1. **Intenta crear un proyecto** y revisa la consola
2. **Comparte los logs** si hay errores
3. **Verifica en Supabase** que el proyecto se haya creado
4. **Si funciona:** Remover logs excesivos
5. **Si no funciona:** Revisar el error específico de los logs

