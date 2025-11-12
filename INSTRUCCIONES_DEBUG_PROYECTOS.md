# Instrucciones para Debug de Creación de Proyectos

## 🔍 Pasos para Identificar el Problema

### 1. Ejecuta el Script SQL
Ejecuta `verificar_tabla_projects.sql` en Supabase SQL Editor y comparte los resultados.

### 2. Revisa la Consola del Navegador
Abre las DevTools (F12) y ve a la pestaña Console. Intenta crear un proyecto y revisa los mensajes de log:

- `createProject: Received projectData:` - Muestra los datos que llegan
- `createProject: Transformed dbProjectData:` - Muestra los datos transformados
- `createProject: Supabase error:` - Muestra cualquier error de Supabase
- `addProject: Error caught:` - Muestra errores capturados

### 3. Verifica Errores Comunes

#### Error: "column does not exist"
- **Causa:** Nombre de columna incorrecto
- **Solución:** Verifica que todas las columnas en `dbProjectData` existan en la tabla `projects`

#### Error: "null value in column violates not-null constraint"
- **Causa:** Falta una columna requerida
- **Solución:** Verifica que todas las columnas NOT NULL tengan valores

#### Error: "new row violates row-level security policy"
- **Causa:** Política RLS bloqueando la inserción
- **Solución:** Ya tienes políticas permisivas, pero verifica que el usuario esté autenticado

#### Error: "invalid input syntax for type uuid"
- **Causa:** `manager_id` no es un UUID válido
- **Solución:** Ya está corregido (convierte strings vacíos a null)

### 4. Verifica la Estructura de la Tabla

Ejecuta esto en Supabase SQL Editor:

```sql
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name = 'projects'
ORDER BY ordinal_position;
```

Compara los resultados con lo que el código está intentando insertar.

### 5. Prueba Manual de Inserción

Ejecuta esto en Supabase SQL Editor para probar si puedes insertar manualmente:

```sql
INSERT INTO projects (
    name,
    description,
    location_name,
    latitude,
    longitude,
    radius,
    manager_id,
    status,
    budget
) VALUES (
    'Test Project',
    'Test Description',
    'Test Location',
    4.8133,
    -75.6967,
    100,
    NULL,  -- o un UUID válido de un manager
    'Planning',
    NULL
) RETURNING *;
```

Si esto funciona, el problema está en el código. Si no funciona, el problema está en la estructura de la tabla.

## 📋 Checklist de Verificación

- [ ] Ejecutar `verificar_tabla_projects.sql` y compartir resultados
- [ ] Revisar consola del navegador al crear proyecto
- [ ] Verificar que el usuario esté autenticado
- [ ] Verificar que `selectedManager` sea un UUID válido o null
- [ ] Verificar que todas las columnas requeridas tengan valores
- [ ] Probar inserción manual en SQL Editor

## 🔧 Cambios Realizados

He agregado logs detallados en:
- `src/services/dataService.js` - Función `createProject`
- `src/contexts/AuthContext.jsx` - Función `addProject`

Estos logs te ayudarán a identificar exactamente dónde está fallando.

