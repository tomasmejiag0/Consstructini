# Instrucciones para Redeploy en Vercel

## 🚀 Pasos para Redeploy

### Opción 1: Redeploy Automático (Recomendado)
1. **Haz commit y push de los cambios:**
   ```bash
   git add .
   git commit -m "Fix: Corregir creación de proyectos - locationName a location_name"
   git push origin main
   ```

2. **Vercel detectará automáticamente el push y hará deploy**
   - Ve a tu dashboard de Vercel
   - Verás un nuevo deployment en progreso
   - Espera a que termine (2-3 minutos)

### Opción 2: Redeploy Manual
1. Ve a tu proyecto en Vercel
2. Haz clic en el menú de los 3 puntos (⋯) del último deployment
3. Selecciona **"Redeploy"**
4. Confirma el redeploy

## ✅ Verificación Post-Deploy

Después del deploy:

1. **Limpia la caché del navegador:**
   - Presiona `Ctrl + Shift + R` (Windows/Linux) o `Cmd + Shift + R` (Mac)
   - O abre en modo incógnito

2. **Intenta crear un proyecto nuevamente**

3. **Revisa la consola:**
   - Ya NO debería aparecer el error de `locationName`
   - Deberías ver: `createProject: Success! Created project:`

## 🔍 Si Aún Hay Problemas

Si después del redeploy aún ves el error:

1. **Verifica que el código esté en el repositorio:**
   - Revisa `src/services/dataService.js` en GitHub
   - Asegúrate de que tenga la versión corregida

2. **Verifica el build en Vercel:**
   - Ve a la pestaña "Deployments"
   - Revisa los logs del build
   - Asegúrate de que no haya errores de compilación

3. **Limpia el caché de Vercel:**
   - En Vercel, ve a Settings → General
   - Busca "Clear Build Cache"
   - Haz clic en "Clear"

## 📝 Nota sobre Logs

Los logs excesivos que ves (`useEffect triggered`, `Map drawing`, etc.) son de desarrollo. Después de que funcione, podemos limpiarlos para producción.


