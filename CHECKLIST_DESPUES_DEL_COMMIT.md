# ✅ Checklist Después del Commit

## 🎉 ¡Bien hecho! Has hecho commit de todos los cambios.

Ahora necesitas verificar y completar estos pasos para que todo funcione en producción:

## 📋 Checklist de Verificación

### 1. ✅ Código en Git
- [x] Cambios commiteados a main
- [x] Código sincronizado con el repositorio

### 2. 🔧 Base de Datos en Supabase

#### Verificar que todas las columnas existan:
- [ ] Ejecuta este SQL para verificar `completion_photo_url`:
  ```sql
  ALTER TABLE tasks ADD COLUMN IF NOT EXISTS completion_photo_url TEXT;
  ```

#### Verificar permisos:
- [ ] Si recibes errores de "permission denied", ejecuta `fix_permissions.sql`

#### Verificar políticas RLS:
- [ ] Las políticas RLS deben estar activas (ya están en el script SQL)

### 3. 🗄️ Storage Buckets en Supabase

**OBLIGATORIO** - Sin esto, las fotos no funcionarán:

- [ ] Crear bucket `tasks_photos` (público)
- [ ] Crear bucket `attendance-photos` (público)
- [ ] Ejecutar `fix_storage_policies.sql` para configurar políticas

**Pasos:**
1. Ve a Supabase → Storage
2. Crea los 2 buckets (marcados como públicos)
3. Ejecuta el script SQL de políticas de Storage

### 4. 🌐 Variables de Entorno en Vercel

**OBLIGATORIO** - Sin esto, Google Maps no funcionará:

- [ ] Configurar `VITE_GOOGLE_MAPS_API_KEY` en Vercel
- [ ] Valor: `AIzaSyBHLzxG68CrdPBaiQ1NDmRAn7tfAjvoC6Y`
- [ ] Redesplegar la aplicación después de agregar la variable

**Pasos:**
1. Ve a Vercel → Tu proyecto → Settings → Environment Variables
2. Agrega la variable `VITE_GOOGLE_MAPS_API_KEY`
3. Redesplega (Redeploy) la aplicación

### 5. 🔐 Credenciales de Prueba

Asegúrate de usar las credenciales correctas:
- Admin: `admin@constructini.com` / `admin123`
- Manager: `manager@constructini.com` / `manager123`
- Worker: `worker@constructini.com` / `worker123`

### 6. 🧪 Pruebas Funcionales

Después de completar los pasos anteriores, prueba:

- [ ] Login con cada tipo de usuario
- [ ] Crear un proyecto nuevo
- [ ] Editar un proyecto existente
- [ ] Crear una tarea
- [ ] Subir foto de completación de tarea
- [ ] Publicar comentario en una tarea
- [ ] Marcar asistencia (check-in/check-out)
- [ ] Ver mapas en proyectos

## ⚠️ Problemas Comunes Después del Deploy

### Error: "Invalid email or password"
- ✅ Usa las credenciales de prueba correctas
- ✅ Verifica que los usuarios existan en la BD

### Error: "NoApiKeys" (Google Maps)
- ✅ Configura `VITE_GOOGLE_MAPS_API_KEY` en Vercel
- ✅ Redesplega después de agregar la variable

### Error: "Bucket not found"
- ✅ Crea los buckets en Supabase Storage
- ✅ Verifica que los nombres sean exactos: `tasks_photos` y `attendance-photos`

### Error: "new row violates row-level security policy"
- ✅ Ejecuta `fix_storage_policies.sql` en Supabase

### Error: "column does not exist"
- ✅ Ejecuta: `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS completion_photo_url TEXT;`

## 🚀 Orden Recomendado de Configuración

1. **Primero:** Verificar/crear columnas faltantes en BD
2. **Segundo:** Crear buckets de Storage
3. **Tercero:** Configurar políticas de Storage
4. **Cuarto:** Configurar variable de entorno en Vercel
5. **Quinto:** Redesplegar en Vercel
6. **Sexto:** Probar todas las funcionalidades

## 📝 Scripts SQL Necesarios

Si aún no los has ejecutado, ejecuta en este orden:

1. `database_completa.sql` - Si es la primera vez (crea todo)
   O si ya tienes datos:
2. `add_completion_photo_column.sql` - Agrega columna faltante
3. `fix_permissions.sql` - Corrige permisos
4. `fix_storage_policies.sql` - Configura Storage

## ✅ Estado Actual

- ✅ Código corregido y commiteado
- ⏳ Pendiente: Configurar Storage buckets
- ⏳ Pendiente: Configurar variable de entorno en Vercel
- ⏳ Pendiente: Redesplegar en Vercel

## 🎯 Siguiente Paso Inmediato

**Configura la variable de entorno en Vercel** - Esto es lo más crítico para que los mapas funcionen en producción.

