# 🚀 Guía de Despliegue - Constructini

Esta guía te ayudará a desplegar Constructini en diferentes plataformas.

## 📋 Índice

- [Preparación](#-preparación)
- [Vercel](#-vercel-recomendado)
- [Netlify](#-netlify)
- [GitHub Pages](#-github-pages)
- [AWS S3 + CloudFront](#-aws-s3--cloudfront)
- [Docker](#-docker)
- [Troubleshooting](#-troubleshooting)

## 🔧 Preparación

Antes de desplegar, asegúrate de:

1. ✅ Tener todas las variables de entorno configuradas
2. ✅ Haber ejecutado `npm run build` exitosamente
3. ✅ Haber probado la aplicación localmente con `npm run preview`
4. ✅ Tener las credenciales de Supabase listas
5. ✅ Tener la API Key de Google Maps (si la usas)

### Variables de Entorno Necesarias

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_de_google_maps
```

## 🚀 Vercel (Recomendado)

Vercel es la plataforma más fácil y recomendada para desplegar aplicaciones React/Vite.

### Opción 1: Despliegue desde GitHub

1. **Conecta tu repositorio**:
   - Ve a [vercel.com](https://vercel.com)
   - Inicia sesión con GitHub
   - Haz clic en "New Project"
   - Importa tu repositorio

2. **Configura el proyecto**:
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Configura Variables de Entorno**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GOOGLE_MAPS_API_KEY`

4. **Despliega**:
   - Haz clic en "Deploy"
   - Espera a que termine el despliegue
   - Tu aplicación estará disponible en `https://tu-proyecto.vercel.app`

### Opción 2: Despliegue con CLI

1. **Instala Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Inicia sesión**:
   ```bash
   vercel login
   ```

3. **Despliega**:
   ```bash
   vercel
   ```

4. **Configura Variables de Entorno**:
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   vercel env add VITE_GOOGLE_MAPS_API_KEY
   ```

5. **Despliega a producción**:
   ```bash
   vercel --prod
   ```

### Configuración de Vercel

El archivo `vercel.json` ya está configurado con:
- ✅ Rewrites para SPA
- ✅ Headers de caché para assets
- ✅ Configuración de build

## 🌐 Netlify

### Opción 1: Despliegue desde GitHub

1. **Conecta tu repositorio**:
   - Ve a [netlify.com](https://netlify.com)
   - Inicia sesión con GitHub
   - Haz clic en "New site from Git"
   - Selecciona tu repositorio

2. **Configura el proyecto**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Branch to deploy: `main` (o tu rama principal)

3. **Configura Variables de Entorno**:
   - Ve a Site settings > Environment variables
   - Agrega:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_GOOGLE_MAPS_API_KEY`

4. **Despliega**:
   - Haz clic en "Deploy site"
   - Espera a que termine el despliegue
   - Tu aplicación estará disponible en `https://tu-proyecto.netlify.app`

### Opción 2: Despliegue con CLI

1. **Instala Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   ```

2. **Inicia sesión**:
   ```bash
   netlify login
   ```

3. **Despliega**:
   ```bash
   netlify deploy --prod
   ```

4. **Configura Variables de Entorno**:
   ```bash
   netlify env:set VITE_SUPABASE_URL "tu_url"
   netlify env:set VITE_SUPABASE_ANON_KEY "tu_clave"
   netlify env:set VITE_GOOGLE_MAPS_API_KEY "tu_api_key"
   ```

### Configuración de Netlify

El archivo `netlify.toml` ya está configurado con:
- ✅ Build command
- ✅ Publish directory
- ✅ Redirects para SPA
- ✅ Headers de caché

## 📄 GitHub Pages

### Opción 1: GitHub Actions (Recomendado)

1. **Crea un workflow**:
   Crea `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             cache: 'npm'
         
         - name: Install dependencies
           run: npm ci
         
         - name: Build
           run: npm run build
           env:
             VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
             VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
             VITE_GOOGLE_MAPS_API_KEY: ${{ secrets.VITE_GOOGLE_MAPS_API_KEY }}
         
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

2. **Configura Secrets**:
   - Ve a Settings > Secrets > Actions
   - Agrega:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_GOOGLE_MAPS_API_KEY`

3. **Habilita GitHub Pages**:
   - Ve a Settings > Pages
   - Source: GitHub Actions

### Opción 2: Manual

1. **Construye el proyecto**:
   ```bash
   npm run build
   ```

2. **Sube la carpeta dist/**:
   ```bash
   git subtree push --prefix dist origin gh-pages
   ```

## ☁️ AWS S3 + CloudFront

### 1. Configurar S3

1. **Crea un bucket de S3**:
   - Ve a [AWS Console](https://console.aws.amazon.com)
   - Crea un bucket de S3
   - Configura el bucket para hosting estático

2. **Configura permisos**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::tu-bucket/*"
       }
     ]
   }
   ```

3. **Sube los archivos**:
   ```bash
   npm run build
   aws s3 sync dist/ s3://tu-bucket --delete
   ```

### 2. Configurar CloudFront

1. **Crea una distribución de CloudFront**:
   - Origin: Tu bucket de S3
   - Default root object: `index.html`
   - Error pages: Redirigir 404 a `/index.html`

2. **Configura Variables de Entorno**:
   - Usa CloudFront Functions o Lambda@Edge
   - O configura las variables en el build

## 🐳 Docker

### 1. Crear Dockerfile

Crea un `Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 2. Crear nginx.conf

Crea un `nginx.conf`:
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. Construir y ejecutar

```bash
# Construir
docker build -t constructini .

# Ejecutar
docker run -p 80:80 constructini
```

### 4. Desplegar a Docker Hub

```bash
# Tag
docker tag constructini tu-usuario/constructini:latest

# Push
docker push tu-usuario/constructini:latest
```

## 🔍 Troubleshooting

### Problema: Variables de entorno no funcionan

**Solución**:
- Verifica que las variables empiecen con `VITE_`
- Reinicia el servidor de desarrollo después de cambiar `.env`
- En producción, verifica que las variables estén configuradas en la plataforma

### Problema: Rutas no funcionan en producción

**Solución**:
- Configura redirects/rewrites para SPA
- Verifica `vercel.json` o `netlify.toml`
- Asegúrate de que todas las rutas redirijan a `/index.html`

### Problema: Error de CORS

**Solución**:
- Configura CORS en Supabase
- Verifica las URLs permitidas en Supabase Dashboard
- Agrega tu dominio a las URLs permitidas

### Problema: Google Maps no carga

**Solución**:
- Verifica que la API Key sea válida
- Verifica que la API Key tenga las restricciones correctas
- Verifica que la API esté habilitada en Google Cloud Console

### Problema: Build falla

**Solución**:
- Verifica que todas las dependencias estén instaladas
- Verifica que Node.js sea la versión correcta (18+)
- Limpia la caché: `rm -rf node_modules dist && npm install`

## 📚 Recursos Adicionales

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3)
- [Docker Documentation](https://docs.docker.com)

## 🆘 Soporte

Si tienes problemas con el despliegue, por favor:
- Abre un [Issue](https://github.com/tu-usuario/constructini/issues)
- Revisa los logs de la plataforma
- Verifica la configuración de variables de entorno

---

**¡Feliz despliegue! 🚀**

