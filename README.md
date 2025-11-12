# 🏗️ Constructini

> **Sistema de Gestión de Construcción Moderno** - Plataforma web completa para la gestión de proyectos, tareas, trabajadores y asistencia en obras de construcción.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2.38.4-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Despliegue](#-despliegue)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Roles y Permisos](#-roles-y-permisos)
- [Base de Datos](#-base-de-datos)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

## ✨ Características

### 👥 Gestión de Usuarios
- **Sistema de autenticación** basado en roles (Admin, Project Manager, Worker)
- **Gestión completa de usuarios** con roles y permisos
- **Perfiles de usuario** personalizables

### 📊 Dashboards por Rol
- **Dashboard de Administrador**: Vista general del sistema, estadísticas y gestión completa
- **Dashboard de Project Manager**: Gestión de proyectos, tareas y trabajadores
- **Dashboard de Worker**: Tareas asignadas, asistencia y progreso

### 🏗️ Gestión de Proyectos
- **Crear y editar proyectos** con información detallada
- **Ubicación geográfica** con Google Maps integrado
- **Estado de proyectos** (activo, completado, cancelado)
- **Asignación de trabajadores** a proyectos

### ✅ Gestión de Tareas
- **Crear y asignar tareas** a trabajadores específicos
- **Estados de tareas** (pendiente, en progreso, completada, cancelada)
- **Comentarios en tareas** para comunicación
- **Fotos de progreso** de las tareas
- **Fechas de vencimiento** y seguimiento

### 👷 Control de Asistencia
- **Marcado de entrada/salida** con geolocalización
- **Fotos de asistencia** como evidencia
- **Reportes de asistencia** en tiempo real
- **Cálculo automático de horas trabajadas**

### 📸 Gestión de Fotos
- **Subida de fotos** para tareas y asistencia
- **Almacenamiento en Supabase Storage**
- **Visualización de fotos** en galerías

### 📈 Reportes y Analytics
- **Reportes de asistencia** exportables (PDF, Excel)
- **Estadísticas de proyectos** y tareas
- **Análisis de rendimiento** de trabajadores

### 🎨 Interfaz Moderna
- **Diseño responsivo** con TailwindCSS
- **Animaciones suaves** con Framer Motion
- **Componentes UI** modernos con Radix UI
- **Tema oscuro/claro** personalizable
- **Glassmorphism** y efectos visuales modernos

## 🛠️ Tecnologías

### Frontend
- **React 18.2.0** - Biblioteca de UI
- **Vite 4.4.5** - Build tool y dev server
- **React Router 6.16.0** - Enrutamiento
- **TailwindCSS 3.3.3** - Estilos utility-first
- **Framer Motion 10.16.4** - Animaciones
- **Radix UI** - Componentes accesibles
- **Lucide React** - Iconos

### Backend y Base de Datos
- **Supabase 2.38.4** - Backend como servicio
- **PostgreSQL** - Base de datos (via Supabase)
- **Supabase Storage** - Almacenamiento de archivos
- **Supabase Auth** - Autenticación

### Servicios Externos
- **Google Maps API** - Mapas y geolocalización

### Utilidades
- **jsPDF 3.0.1** - Generación de PDFs
- **date-fns 4.1.0** - Manipulación de fechas
- **js-cookie 3.0.5** - Gestión de cookies

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18.x o superior)
- **npm** (v9.x o superior) o **yarn**
- **Git**
- **Cuenta de Supabase** (gratuita)
- **API Key de Google Maps** (opcional, para funcionalidad de mapas)

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/constructini.git
cd constructini
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basado en `.env.example`:

```bash
cp .env.example .env
```

Edita el archivo `.env` y agrega tus credenciales:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_de_google_maps
```

### 4. Configurar Supabase

#### 4.1. Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Espera a que el proyecto esté listo (2-3 minutos)

#### 4.2. Configurar la Base de Datos

1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Ejecuta el siguiente script SQL para crear las tablas:

<details>
<summary>📄 Ver Script SQL Completo</summary>

```sql
-- Crear las tablas principales

-- Tabla de perfiles de usuario
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT CHECK (role IN ('admin', 'manager', 'worker')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de proyectos
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    radius INTEGER DEFAULT 100,
    status TEXT CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de tareas
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de asignaciones de proyecto
CREATE TABLE project_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('manager', 'worker')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);

-- Tabla de comentarios de tareas
CREATE TABLE task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de fotos de tareas
CREATE TABLE tasks_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de asistencia
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    check_in TIMESTAMP WITH TIME ZONE,
    check_out TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de fotos de asistencia
CREATE TABLE attendance_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attendance_id UUID REFERENCES attendance(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de tipos de recursos
CREATE TABLE resource_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de solicitudes de recursos
CREATE TABLE resource_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de items de solicitud de recursos
CREATE TABLE resource_request_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID REFERENCES resource_requests(id) ON DELETE CASCADE,
    resource_type_id UUID REFERENCES resource_types(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_project_assignments_project_id ON project_assignments(project_id);
CREATE INDEX idx_project_assignments_user_id ON project_assignments(user_id);
CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX idx_attendance_user_id ON attendance(user_id);
CREATE INDEX idx_attendance_project_id ON attendance(project_id);
CREATE INDEX idx_resource_requests_project_id ON resource_requests(project_id);
CREATE INDEX idx_resource_request_items_request_id ON resource_request_items(request_id);

-- Crear función para actualizar el timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar automáticamente updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resource_requests_updated_at
    BEFORE UPDATE ON resource_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

</details>

#### 4.3. Configurar Storage

1. En Supabase, ve a **Storage**
2. Crea los siguientes buckets:
   - `tasks_photos` - Para fotos de tareas
   - `attendance_photos` - Para fotos de asistencia
3. Configura las políticas de acceso:
   - **Política de lectura**: Permitir lectura pública o autenticada según necesites
   - **Política de escritura**: Solo usuarios autenticados

#### 4.4. Obtener Credenciales

1. Ve a **Project Settings** > **API**
2. Copia la **Project URL** y la **anon public key**
3. Agrega estas credenciales a tu archivo `.env`

### 5. Configurar Google Maps API (Opcional)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Maps JavaScript API**
4. Crea una **API Key**
5. Agrega la API Key a tu archivo `.env`

## 🎯 Uso

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Compilar para Producción

```bash
npm run build
```

Esto generará los archivos optimizados en la carpeta `dist/`

### Preview de Producción

```bash
npm run preview
```

Esto servirá la versión de producción localmente para probar antes de desplegar.

## 🚢 Despliegue

> 📖 **Guía completa de despliegue**: Consulta [DEPLOY.md](./DEPLOY.md) para instrucciones detalladas de despliegue en diferentes plataformas.

### Opciones de Despliegue

#### 🚀 Vercel (Recomendado)

1. **Conecta tu repositorio** en [vercel.com](https://vercel.com)
2. **Configura Variables de Entorno**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GOOGLE_MAPS_API_KEY`
3. **Despliega** automáticamente con cada push

**O usa el botón de despliegue**:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/constructini)

#### 🌐 Netlify

1. **Conecta tu repositorio** en [netlify.com](https://netlify.com)
2. **Configura Variables de Entorno** en el dashboard
3. **Despliega** automáticamente con cada push

#### 📄 GitHub Pages

1. **Configura GitHub Actions** (ver [DEPLOY.md](./DEPLOY.md))
2. **Configura Secrets** en GitHub
3. **Habilita GitHub Pages** en Settings

#### ☁️ AWS S3 + CloudFront

1. **Crea un bucket de S3**
2. **Configura CloudFront**
3. **Sube los archivos** de `dist/`

#### 🐳 Docker

1. **Construye la imagen**: `docker build -t constructini .`
2. **Ejecuta el contenedor**: `docker run -p 80:80 constructini`

### Variables de Entorno Requeridas

Asegúrate de configurar estas variables en tu plataforma de despliegue:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_de_google_maps
```

### Archivos de Configuración

El proyecto incluye archivos de configuración listos para usar:

- ✅ `vercel.json` - Configuración de Vercel
- ✅ `netlify.toml` - Configuración de Netlify
- ✅ `.env.example` - Ejemplo de variables de entorno

Para más detalles, consulta [DEPLOY.md](./DEPLOY.md).

## 📁 Estructura del Proyecto

```
constructini/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── ui/           # Componentes UI (Radix UI)
│   │   └── ProtectedRoute.jsx
│   ├── contexts/         # Context API (Auth, Theme)
│   ├── layouts/          # Layouts de la aplicación
│   ├── lib/              # Utilidades y configuraciones
│   │   ├── supabaseClient.js
│   │   ├── Maps.jsx
│   │   └── utils.js
│   ├── pages/            # Páginas de la aplicación
│   │   ├── admin/       # Páginas de administrador
│   │   ├── manager/     # Páginas de project manager
│   │   └── worker/      # Páginas de trabajador
│   ├── services/         # Servicios API
│   ├── App.jsx           # Componente principal
│   └── main.jsx          # Punto de entrada
├── .env.example          # Ejemplo de variables de entorno
├── .gitignore
├── index.html
├── package.json
├── vite.config.js        # Configuración de Vite
├── tailwind.config.js    # Configuración de TailwindCSS
├── vercel.json           # Configuración de Vercel
├── netlify.toml          # Configuración de Netlify
└── README.md
```

## 👥 Roles y Permisos

### 🔴 Administrador (Admin)

**Permisos completos del sistema**:
- ✅ Gestión completa de usuarios (crear, editar, eliminar)
- ✅ Gestión de proyectos (crear, editar, eliminar)
- ✅ Configuración del sistema
- ✅ Aprobación de solicitudes de recursos
- ✅ Acceso a todos los reportes y estadísticas
- ✅ Gestión de roles y permisos
- ✅ Exportación de reportes (PDF, Excel)
- ✅ Vista general del sistema

### 🟡 Project Manager (Gerente de Proyecto)

**Gestión de proyectos y equipos**:
- ✅ Crear y gestionar proyectos
- ✅ Asignar trabajadores a proyectos
- ✅ Crear y asignar tareas
- ✅ Ver reportes de asistencia
- ✅ Solicitar recursos
- ✅ Aprobar tareas completadas
- ✅ Gestionar trabajadores del proyecto
- ✅ Ver estadísticas de proyectos
- ✅ Comentar en tareas
- ✅ Ver ubicaciones de proyectos en mapas

### 🟢 Worker (Trabajador)

**Gestión de tareas y asistencia**:
- ✅ Ver tareas asignadas
- ✅ Marcar asistencia (entrada/salida)
- ✅ Subir fotos de progreso
- ✅ Comentar en tareas
- ✅ Ver proyectos asignados
- ✅ Actualizar estado de tareas
- ✅ Ver ubicaciones de proyectos en mapas
- ✅ Ver historial de asistencia

## 🗄️ Base de Datos

### Esquema Principal

- **profiles** - Perfiles de usuario
- **projects** - Proyectos de construcción
- **tasks** - Tareas de los proyectos
- **project_assignments** - Asignaciones de trabajadores a proyectos
- **task_comments** - Comentarios en tareas
- **tasks_photos** - Fotos de tareas
- **attendance** - Registro de asistencia
- **attendance_photos** - Fotos de asistencia
- **resource_types** - Tipos de recursos
- **resource_requests** - Solicitudes de recursos
- **resource_request_items** - Items de solicitudes de recursos

### Relaciones

- Un proyecto tiene muchas tareas
- Un proyecto tiene muchas asignaciones
- Una tarea tiene muchos comentarios
- Una tarea tiene muchas fotos
- Un usuario tiene muchos registros de asistencia
- Un proyecto tiene muchas solicitudes de recursos

## 🔒 Seguridad

### Autenticación y Autorización
- ✅ **Autenticación basada en Supabase Auth** - Sistema robusto de autenticación
- ✅ **Autorización basada en roles (RBAC)** - Control de acceso granular
- ✅ **Rutas protegidas** con React Router - Acceso restringido por rol
- ✅ **Variables de entorno** para credenciales - Secretos seguros
- ✅ **Validación de datos** en cliente y servidor - Prevención de errores
- ✅ **Políticas de seguridad en Supabase** - Row Level Security (RLS)

### Buenas Prácticas
- ✅ Credenciales en variables de entorno
- ✅ No exponer claves API en el código
- ✅ Validación de entrada de usuario
- ✅ Sanitización de datos
- ✅ HTTPS en producción
- ✅ CORS configurado correctamente

## 🧪 Testing

```bash
# Próximamente: tests unitarios y de integración
npm test
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Compila para producción
npm run preview      # Preview de la versión de producción
```

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Email: tu-email@example.com

## 🙏 Agradecimientos

- [Supabase](https://supabase.com) por el excelente backend como servicio
- [Vite](https://vitejs.dev) por la increíble experiencia de desarrollo
- [React](https://reactjs.org) por la biblioteca de UI
- [TailwindCSS](https://tailwindcss.com) por el framework de CSS
- [Radix UI](https://www.radix-ui.com) por los componentes accesibles

## 📞 Soporte

Si tienes preguntas o necesitas ayuda, por favor:
- Abre un [Issue](https://github.com/tu-usuario/constructini/issues)
- Contacta al autor por email

---

<div align="center">

**Hecho con ❤️ usando React y Supabase**

⭐ Si te gusta este proyecto, dale una estrella!

</div>
