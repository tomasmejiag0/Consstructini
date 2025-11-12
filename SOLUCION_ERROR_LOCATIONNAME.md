# Solución: Error "Could not find the 'locationName' column"

## 🔴 Error Encontrado

```
Supabase error in createProject: Could not find the 'locationName' column of 'projects' in the schema cache
```

## 🔍 Causa del Problema

El problema era que al usar `...rest` en la transformación, se estaban incluyendo campos adicionales que no deberían estar en la base de datos, o el campo `locationName` se estaba pasando accidentalmente.

## ✅ Solución Aplicada

### Cambio en `createProject`:

**ANTES:**
```javascript
const { locationName, manager_id, ...rest } = projectData;
const dbProjectData = {
  ...rest,  // ❌ Esto incluye TODOS los campos, incluso los que no deberían estar
  location_name: locationName || rest.location_name,
  manager_id: manager_id && manager_id.trim() !== '' ? manager_id : null
};
```

**DESPUÉS:**
```javascript
const { 
  locationName, 
  manager_id, 
  id,           // Exclude id for new projects
  manager,      // Exclude manager (computed field)
  ...rest 
} = projectData;

// Build database object with only valid columns
const dbProjectData = {
  name: rest.name,
  description: rest.description || null,
  location_name: locationName || rest.location_name || null,  // ✅ Solo location_name
  latitude: rest.latitude,
  longitude: rest.longitude,
  radius: rest.radius || 100,
  status: rest.status || 'Planning',
  budget: rest.budget || null,
  spent_budget: rest.spent_budget || 0,
  manager_id: manager_id && manager_id.trim() !== '' ? manager_id : null
};
```

## 📋 Cambios Realizados

1. **Exclusión explícita de campos:**
   - `id` - No se incluye en nuevos proyectos
   - `manager` - Campo calculado, no se guarda en BD

2. **Construcción explícita del objeto:**
   - Solo se incluyen los campos que realmente existen en la tabla `projects`
   - Se asegura que `locationName` se convierta a `location_name`
   - Se excluyen campos calculados o no válidos

3. **Valores por defecto:**
   - `description`: `null` si no se proporciona
   - `radius`: `100` si no se proporciona
   - `status`: `'Planning'` si no se proporciona
   - `budget`: `null` si no se proporciona
   - `spent_budget`: `0` si no se proporciona

## ✅ Archivos Corregidos

1. `src/services/dataService.js` - Función `createProject`
2. `src/services/projectService.js` - Función `createProject`

## 🧪 Prueba Ahora

1. Intenta crear un proyecto nuevamente
2. El error de `locationName` debería desaparecer
3. El proyecto debería crearse correctamente en la BD

## 📝 Nota sobre Google Maps

El error de "BillingNotEnabledMapError" es un problema separado de Google Maps API. Necesitas:
1. Habilitar facturación en Google Cloud Console
2. O usar una API key de prueba (limitada)

Pero esto NO afecta la creación de proyectos en la BD.

