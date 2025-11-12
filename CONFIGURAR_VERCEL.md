# Configuración de Variables de Entorno en Vercel

## Problema Actual

Tu aplicación está desplegada en Vercel pero:
1. ❌ Google Maps API no funciona (error: "NoApiKeys")
2. ❌ Las variables de entorno no están configuradas

## Solución: Configurar Variables de Entorno en Vercel

### Paso 1: Acceder a la Configuración de Vercel

1. Ve a tu proyecto en Vercel: https://vercel.com
2. Selecciona tu proyecto `con-struc-tini`
3. Ve a **Settings** (Configuración)
4. Haz clic en **Environment Variables** (Variables de Entorno)

### Paso 2: Agregar Variable de Google Maps API

1. Haz clic en **Add New** (Agregar Nueva)
2. Configura la variable:
   - **Name:** `VITE_GOOGLE_MAPS_API_KEY`
   - **Value:** `AIzaSyBHLzxG68CrdPBaiQ1NDmRAn7tfAjvoC6Y`
   - **Environment:** Selecciona todas las opciones:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
3. Haz clic en **Save**

### Paso 3: Redesplegar la Aplicación

Después de agregar las variables de entorno:

1. Ve a la pestaña **Deployments**
2. Haz clic en los tres puntos (⋯) del último deployment
3. Selecciona **Redeploy**
4. O simplemente haz un nuevo commit y push a tu repositorio

**Importante:** Las variables de entorno solo se cargan cuando se construye la aplicación. Necesitas redesplegar después de agregarlas.

## Verificación

Después de redesplegar:

1. Visita tu aplicación en Vercel
2. Abre la consola del navegador (F12)
3. Verifica que no haya errores de "NoApiKeys"
4. Los mapas deberían cargarse correctamente

## Variables de Entorno Necesarias

Para que tu aplicación funcione completamente en producción, necesitas:

```
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBHLzxG68CrdPBaiQ1NDmRAn7tfAjvoC6Y
```

## Notas Importantes

- ⚠️ **Nunca subas el archivo `.env` a Git** - ya está en `.gitignore`
- ✅ Las variables en Vercel son seguras y no se exponen en el código
- 🔄 Después de agregar variables, siempre redesplega la aplicación
- 📝 Puedes verificar las variables en Vercel → Settings → Environment Variables

## Solución de Problemas

### Los mapas aún no funcionan después de configurar
1. Verifica que la variable se llame exactamente `VITE_GOOGLE_MAPS_API_KEY`
2. Verifica que hayas redesplegado después de agregar la variable
3. Verifica que la clave de API esté habilitada en Google Cloud Console
4. Revisa la consola del navegador para errores específicos

### Error: "Invalid email or password"
Usa las credenciales de prueba correctas:
- Admin: `admin@constructini.com` / `admin123`
- Manager: `manager@constructini.com` / `manager123`
- Worker: `worker@constructini.com` / `worker123`

