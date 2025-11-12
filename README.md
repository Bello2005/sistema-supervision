# Sistema de Supervisión - RES N° 215 DE 2025
## RESGUARDO INDÍGENA CATRÚ, DUBASA Y ANCOSÓ

Sistema web completo de supervisión en tiempo real con backend integrado para el registro de evidencias, listados y registros entregables de eventos de capacitación y procesos formativos.

---

## Descripción del Proyecto

Sistema tecnológico completo de apoyo a la supervisión de la ejecución en tiempo real que permite:

- **Registro de Evidencias**: Carga y administración de evidencias fotográficas, videos, documentos y registros de asistencia con almacenamiento en servidor
- **Listados y Registros Entregables**: Gestión completa, edición, visualización y exportación de todos los registros y documentos generados
- **Supervisión en Tiempo Real**: Monitoreo en vivo de eventos y capacitaciones con soporte para múltiples plataformas de reunión (Jitsi, Google Meet, Zoom, Teams, etc.)
- **Eventos de Capacitación**: Administración completa de eventos, talleres, seminarios y procesos formativos con gestión de participantes
- **Autenticación y Seguridad**: Sistema de login con JWT, acceso restringido solo a administradores

---

## Características Principales

### Dashboard Principal
- Visualización de estadísticas en tiempo real
- Gráficos de actividad
- Feed de actividad reciente
- Accesos rápidos a todas las funcionalidades

### Registro de Evidencias
- Carga de archivos mediante drag & drop
- Vista previa de imágenes y videos
- Formularios detallados con validación
- Sistema de etiquetas y categorización
- Geolocalización de evidencias

### Listados y Registros
- Tabla avanzada con múltiples filtros
- Búsqueda en tiempo real
- Selección múltiple para operaciones masivas
- Exportación a Excel, PDF, CSV y ZIP
- Paginación inteligente

### Supervisión en Tiempo Real
- Visualización de 8 transmisiones simultáneas
- Indicadores de EN VIVO
- Controles de grabación
- Estadísticas de red y calidad
- Timeline de actividad

### Eventos y Capacitación
- Calendario interactivo
- Vista grid y lista alternables
- Filtros por estado (Programado, En curso, Completado)
- Gestión de participantes
- Creación y edición de eventos

---

## Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **Tailwind CSS**: Framework de estilos modernos y responsive
- **Alpine.js**: Framework JavaScript reactivo y ligero
- **Font Awesome**: Biblioteca de iconos
- **Google Fonts (Inter)**: Tipografía profesional

### Backend
- **Node.js 18+**: Runtime de JavaScript
- **Express.js**: Framework web para API REST
- **PostgreSQL 15**: Base de datos relacional
- **JWT**: Autenticación basada en tokens
- **Bcrypt**: Encriptación de contraseñas
- **Multer**: Manejo de carga de archivos
- **Express Validator**: Validación de datos
- **Docker & Docker Compose**: Containerización

---

## Estructura del Proyecto

```
mockup/
├── frontend/
│   ├── index.html                      # Dashboard principal
│   ├── registro-evidencias.html        # Módulo de registro de evidencias
│   ├── listados.html                   # Listados y registros entregables
│   ├── supervision-tiempo-real.html    # Supervisión en vivo
│   ├── eventos-capacitacion.html       # Gestión de eventos
│   ├── login.html                      # Página de login
│   ├── ayuda.html                      # Centro de ayuda
│   ├── configuracion.html              # Configuración
│   └── js/
│       └── api.js                      # Cliente API para comunicación con backend
├── backend/
│   ├── src/
│   │   ├── server.js                   # Servidor Express principal
│   │   ├── controllers/                # Controladores (Auth, Events, Evidences)
│   │   ├── models/                     # Modelos de datos (User, Event, Evidence)
│   │   ├── routes/                     # Rutas API
│   │   ├── middlewares/                # Middlewares (Auth, Upload, Validator)
│   │   ├── config/                     # Configuración de BD
│   │   └── database/                   # Schema, migraciones y seeds
│   ├── uploads/                        # Archivos subidos
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml                  # Configuración Docker
├── nginx.conf                          # Configuración Nginx
└── README.md                           # Este archivo
```

---

## Instalación y Uso

### Opción 1: Docker (Recomendado - Más Rápido)

```bash
# 1. Clonar o descargar el proyecto
cd mockup

# 2. Crear archivo de variables de entorno
cp backend/.env.example backend/.env

# 3. Levantar todos los servicios
docker-compose up -d

# 4. Migrar base de datos
docker-compose exec backend npm run migrate

# 5. Cargar datos iniciales
docker-compose exec backend npm run seed

# 6. ¡Listo! Acceder a:
# Frontend: http://localhost:8080
# Backend API: http://localhost:3000
```

### Opción 2: Instalación Manual

#### Backend
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL
npm run migrate
npm run seed
npm run dev  # Servidor en http://localhost:3000
```

#### Frontend
```bash
cd frontend
# Usando Python 3
python -m http.server 8080

# O usando Node.js (http-server)
npx http-server -p 8080
```

Luego abre: `http://localhost:8080`

### Credenciales de Acceso

**IMPORTANTE**: Solo usuarios con rol de **administrador** pueden acceder al sistema.

- **Email**: `admin@supervision.com`
- **Contraseña**: `password123`

---

## Guía Completa de Deployment a Producción

### Pre-requisitos

Antes de desplegar, asegúrate de tener:
- Cuenta en un servicio de hosting (Railway, Render, DigitalOcean, etc.)
- Dominio propio (opcional pero recomendado)
- Git configurado en tu máquina local
- Conocimiento básico de terminal/CLI

### Variables de Entorno Necesarias

El backend requiere las siguientes variables de entorno (crea un archivo `.env` en `backend/`):

```env
# Base de Datos PostgreSQL
DB_HOST=tu-host-postgresql
DB_PORT=5432
DB_NAME=supervision_db
DB_USER=tu-usuario
DB_PASSWORD=tu-contraseña-segura

# JWT
JWT_SECRET=tu-secret-key-muy-segura-y-larga-minimo-32-caracteres
JWT_EXPIRES_IN=7d

# Servidor
NODE_ENV=production
PORT=3000

# CORS (URL de tu frontend en producción)
FRONTEND_URL=https://tu-dominio.com

# Opcional: Almacenamiento en la nube (AWS S3, etc.)
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
# AWS_BUCKET_NAME=
# AWS_REGION=
```

### Opción 1: Railway (Recomendado - Más Fácil)

Railway es ideal para deployment rápido y fácil.

#### Backend + Base de Datos en Railway

1. **Crear cuenta en Railway**
   - Ve a [railway.app](https://railway.app)
   - Inicia sesión con GitHub

2. **Crear Proyecto**
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Conecta tu repositorio

3. **Agregar Base de Datos PostgreSQL**
   - En tu proyecto, click "New"
   - Selecciona "Database" → "PostgreSQL"
   - Railway creará automáticamente la base de datos

4. **Desplegar Backend**
   - Click "New" → "GitHub Repo"
   - Selecciona tu repositorio
   - Railway detectará automáticamente el backend
   - Configura el Root Directory: `backend`
   - Configura el Start Command: `npm start`

5. **Configurar Variables de Entorno**
   - Ve a la sección "Variables" del servicio backend
   - Añade todas las variables de entorno necesarias
   - **IMPORTANTE**: Usa las variables de conexión de la base de datos que Railway proporciona:
     ```
     DB_HOST=${{Postgres.PGHOST}}
     DB_PORT=${{Postgres.PGPORT}}
     DB_NAME=${{Postgres.PGDATABASE}}
     DB_USER=${{Postgres.PGUSER}}
     DB_PASSWORD=${{Postgres.PGPASSWORD}}
     ```
   - Añade también:
     ```
     JWT_SECRET=tu-secret-key-muy-segura
     NODE_ENV=production
     PORT=3000
     FRONTEND_URL=https://tu-frontend.vercel.app
     ```

6. **Ejecutar Migraciones**
   - Ve a la sección "Deployments"
   - Click en el deployment más reciente
   - Abre la terminal
   - Ejecuta: `npm run migrate`
   - Ejecuta: `npm run seed` (opcional, solo para datos iniciales)

7. **Obtener URL del Backend**
   - Railway generará una URL como: `https://tu-backend.railway.app`
   - Copia esta URL

#### Frontend en Vercel/Netlify

1. **Desplegar en Vercel**
   ```bash
   # Instalar Vercel CLI
   npm i -g vercel
   
   # Desde la carpeta del proyecto
   cd frontend
   vercel
   
   # Seguir las instrucciones
   # Cuando pregunte por el build command, deja vacío
   # Cuando pregunte por el output directory, deja vacío
   ```

2. **Actualizar URL del API**
   - Edita `frontend/js/api.js`
   - Cambia la línea:
     ```javascript
     const API_BASE_URL = window.location.origin.includes('localhost')
       ? 'http://localhost:3000/api'
       : 'https://supervision-backend.onrender.com/api';
     ```

3. **Configurar Variables de Entorno en Vercel** (si es necesario)
   - Ve a tu proyecto en Vercel
   - Settings → Environment Variables
   - Añade: `VITE_API_URL=https://supervision-backend.onrender.com/api`

4. **Redeploy**
   ```bash
   vercel --prod
   ```

### Opción 2: Render

Render es otra excelente opción gratuita.

#### Backend en Render

1. **Crear cuenta en Render**
   - Ve a [render.com](https://render.com)
   - Inicia sesión con GitHub

2. **Crear Base de Datos PostgreSQL**
   - Dashboard → "New" → "PostgreSQL"
   - Nombre: `supervision-db`
   - Plan: Free (o pago según necesidades)
   - Anota las credenciales de conexión

3. **Crear Web Service (Backend)**
   - Dashboard → "New" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Configuración:
     - **Name**: `supervision-backend`
     - **Environment**: `Node`
     - **Build Command**: `cd backend && npm install`
     - **Start Command**: `cd backend && npm start`
     - **Root Directory**: `backend`

4. **Configurar Variables de Entorno**
   - En la sección "Environment" del servicio:
     ```
     DB_HOST=<host-de-render-postgres>
     DB_PORT=5432
     DB_NAME=<nombre-de-la-bd>
     DB_USER=<usuario>
     DB_PASSWORD=<contraseña>
     JWT_SECRET=tu-secret-key-muy-segura
     NODE_ENV=production
     PORT=3000
     FRONTEND_URL=https://tu-frontend.netlify.app
     ```

5. **Ejecutar Migraciones**
   - Ve a "Shell" en Render
   - Ejecuta: `npm run migrate`
   - Ejecuta: `npm run seed` (opcional)

#### Frontend en Netlify

1. **Desplegar en Netlify**
   ```bash
   # Instalar Netlify CLI
   npm i -g netlify-cli
   
   # Desde la carpeta del proyecto
   cd frontend
   netlify deploy --prod
   ```

2. **Actualizar URL del API en `frontend/js/api.js`**
   - Cambia a la URL de Render: `https://tu-backend.onrender.com/api`

### Opción 3: DigitalOcean (VPS Completo)

Para un control total, usa un VPS.

#### Configuración del Servidor

1. **Crear Droplet**
   - Ve a [digitalocean.com](https://digitalocean.com)
   - Crea un Droplet (Ubuntu 22.04, mínimo 2GB RAM)
   - Añade tu SSH key

2. **Conectar al Servidor**
   ```bash
   ssh root@tu-ip-servidor
   ```

3. **Instalar Dependencias**
   ```bash
   # Actualizar sistema
   apt update && apt upgrade -y
   
   # Instalar Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
   apt install -y nodejs
   
   # Instalar PostgreSQL
   apt install -y postgresql postgresql-contrib
   
   # Instalar Nginx
   apt install -y nginx
   
   # Instalar PM2 (process manager)
   npm install -g pm2
   ```

4. **Configurar PostgreSQL**
   ```bash
   # Cambiar a usuario postgres
   sudo -u postgres psql
   
   # Crear base de datos y usuario
   CREATE DATABASE supervision_db;
   CREATE USER supervision_user WITH PASSWORD 'tu-contraseña-segura';
   GRANT ALL PRIVILEGES ON DATABASE supervision_db TO supervision_user;
   \q
   ```

5. **Clonar y Configurar Backend**
   ```bash
   # Clonar repositorio
   cd /var/www
   git clone https://github.com/tu-usuario/tu-repo.git supervision
   cd supervision/backend
   
   # Instalar dependencias
   npm install --production
   
   # Crear archivo .env
   nano .env
   # Pegar variables de entorno
   
   # Ejecutar migraciones
   npm run migrate
   npm run seed
   ```

6. **Iniciar Backend con PM2**
   ```bash
   pm2 start src/server.js --name supervision-api
   pm2 save
   pm2 startup
   ```

7. **Configurar Nginx para Backend**
   ```bash
   nano /etc/nginx/sites-available/supervision-api
   ```
   
   Contenido:
   ```nginx
   server {
       listen 80;
       server_name api.tu-dominio.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   ```bash
   ln -s /etc/nginx/sites-available/supervision-api /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

8. **Configurar Nginx para Frontend**
   ```bash
   # Copiar archivos frontend
   cp -r /var/www/supervision/frontend/* /var/www/html/
   
   # Configurar Nginx
   nano /etc/nginx/sites-available/supervision-frontend
   ```
   
   Contenido:
   ```nginx
   server {
       listen 80;
       server_name tu-dominio.com www.tu-dominio.com;
       root /var/www/html;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```
   
   ```bash
   ln -s /etc/nginx/sites-available/supervision-frontend /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

9. **Configurar SSL con Let's Encrypt**
   ```bash
   apt install -y certbot python3-certbot-nginx
   certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
   certbot --nginx -d api.tu-dominio.com
   ```

10. **Actualizar URL del API en Frontend**
    - Edita `/var/www/html/js/api.js`
    - Cambia a: `https://api.tu-dominio.com/api`

### Configuración de Seguridad para Producción

1. **Cambiar Contraseña del Admin**
   ```sql
   -- Conectarse a la base de datos
   psql -U supervision_user -d supervision_db
   
   -- Actualizar contraseña (se encriptará automáticamente)
   UPDATE users SET password = '$2b$10$nueva_contraseña_encriptada' WHERE email = 'admin@supervision.com';
   ```

2. **Configurar Firewall**
   ```bash
   ufw allow 22/tcp
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw enable
   ```

3. **Configurar Backups Automáticos**
   ```bash
   # Crear script de backup
   nano /usr/local/bin/backup-db.sh
   ```
   
   Contenido:
   ```bash
   #!/bin/bash
   BACKUP_DIR="/var/backups/postgresql"
   DATE=$(date +%Y%m%d_%H%M%S)
   mkdir -p $BACKUP_DIR
   pg_dump -U supervision_user supervision_db > $BACKUP_DIR/backup_$DATE.sql
   # Mantener solo últimos 7 días
   find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
   ```
   
   ```bash
   chmod +x /usr/local/bin/backup-db.sh
   
   # Añadir a crontab (diario a las 2 AM)
   crontab -e
   # Añadir: 0 2 * * * /usr/local/bin/backup-db.sh
   ```

### Checklist de Deployment

Antes de considerar el deployment completo, verifica:

- [ ] Variables de entorno configuradas correctamente
- [ ] Base de datos migrada (`npm run migrate`)
- [ ] Datos iniciales cargados (`npm run seed`)
- [ ] URL del API actualizada en `frontend/js/api.js`
- [ ] SSL/HTTPS configurado
- [ ] Dominio apuntando correctamente
- [ ] Firewall configurado
- [ ] Backups automáticos configurados
- [ ] Contraseña del admin cambiada
- [ ] Logs monitoreados
- [ ] Pruebas de funcionalidad completadas

### Troubleshooting

#### Backend no inicia
- Verifica variables de entorno
- Revisa logs: `pm2 logs supervision-api` o en Railway/Render
- Verifica conexión a base de datos

#### Frontend no conecta al backend
- Verifica CORS en backend
- Verifica URL del API en `frontend/js/api.js`
- Revisa consola del navegador para errores

#### Errores de base de datos
- Verifica credenciales de conexión
- Asegúrate de que las migraciones se ejecutaron
- Revisa logs de PostgreSQL

### Soporte de Deployment

Si encuentras problemas durante el deployment:
1. Revisa los logs del servicio
2. Verifica la documentación de la plataforma
3. Consulta los issues en GitHub

Para una guía más detallada, consulta [DEPLOYMENT.md](./DEPLOYMENT.md)

### IMPORTANTE: Hosting Permanente y Gratis

**Render elimina la base de datos gratuita después de 90 días.** 

Para una solución **100% GRATIS Y PERMANENTE**, consulta:
- **[GUIA-DEPLOY-GRATIS.md](./GUIA-DEPLOY-GRATIS.md)** - **NUEVA GUÍA COMPLETA** - Opciones 100% gratuitas con Neon, Supabase, Railway, Render y Vercel
- **[GUIA-NEON-RENDER.md](./GUIA-NEON-RENDER.md)** - Neon (BD) + Render (Backend/Frontend) = **$0/mes permanente**
- **[GUIA-SUPABASE-RAILWAY.md](./GUIA-SUPABASE-RAILWAY.md)** - Supabase (BD) + Railway (Backend) + Vercel (Frontend)
- **[GUIA-HOSTING-PERMANENTE.md](./GUIA-HOSTING-PERMANENTE.md)** - Comparación de todas las opciones

**Mejor opción GRATIS**: **Neon (BD permanente) + Render (Backend) + Vercel (Frontend)** = **$0/mes, sin eliminaciones**

---

## Funcionalidades Implementadas

### Backend Completo
- [x] API REST completa con Express.js
- [x] Autenticación JWT con restricción solo a administradores
- [x] Base de datos PostgreSQL con relaciones y triggers
- [x] CRUD completo para Eventos y Evidencias
- [x] Sistema de carga de archivos (Multer)
- [x] Validación de datos en todas las rutas
- [x] Gestión de participantes en eventos
- [x] Estadísticas y reportes
- [x] Docker y Docker Compose configurados

### Frontend Integrado
- [x] Navegación fluida entre páginas
- [x] Sidebar colapsable con botón de cerrar sesión
- [x] Sistema de login con validación
- [x] Todas las vistas conectadas al backend
- [x] Filtros y búsquedas en tiempo real
- [x] Modales interactivos para CRUD
- [x] Carga de archivos con vista previa y almacenamiento real
- [x] Calendario interactivo conectado a la base de datos
- [x] Gestión de participantes en eventos
- [x] Sistema de toasts para notificaciones
- [x] Diseño 100% responsive
- [x] Soporte para múltiples plataformas de reunión (Jitsi, Google Meet, Zoom, Teams, Webex, GoToMeeting)

### Características Especiales
- [x] Dashboard con datos reales del backend
- [x] Tarjetas de eventos con datos dinámicos
- [x] Calendario que muestra eventos reales de la base de datos
- [x] Estadísticas precisas de participantes
- [x] Modales para ver, editar, compartir y descargar evidencias
- [x] Gestión de archivos (subir, eliminar) en evidencias
- [x] Supervisión en tiempo real con enlaces de reunión
- [x] Centro de ayuda con botones funcionales (Email y Llamar Soporte)

---

## Compatibilidad

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Dispositivos móviles (iOS/Android)

---

## Personalización

### Cambiar Colores

Edita las clases de Tailwind en cualquier archivo HTML:

```html
<!-- Color primario (purple) -->
<div class="bg-purple-600">...</div>

<!-- Cambiar a otro color, por ejemplo blue -->
<div class="bg-blue-600">...</div>
```

### Modificar Textos

Todos los textos están en español y pueden editarse directamente en los archivos HTML.

### Agregar Nuevas Páginas

Copia la estructura de cualquier página existente y modifica el contenido según necesites.

---

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuarios (solo admin puede acceder)
- `POST /api/auth/login` - Login (solo admin)
- `GET /api/auth/profile` - Obtener perfil del usuario
- `PUT /api/auth/profile` - Actualizar perfil
- `GET /api/auth/users` - Listar usuarios (para gestión de participantes)

### Eventos
- `GET /api/events` - Listar eventos (con filtros)
- `GET /api/events/:id` - Obtener evento por ID
- `POST /api/events` - Crear evento
- `PUT /api/events/:id` - Actualizar evento
- `DELETE /api/events/:id` - Eliminar evento
- `GET /api/events/stats` - Estadísticas de eventos
- `GET /api/events/upcoming` - Próximos eventos
- `POST /api/events/:id/participants` - Agregar participante
- `GET /api/events/:id/participants` - Listar participantes

### Evidencias
- `GET /api/evidences` - Listar evidencias (con filtros)
- `GET /api/evidences/:id` - Obtener evidencia por ID
- `POST /api/evidences` - Crear evidencia (con archivos)
- `PUT /api/evidences/:id` - Actualizar evidencia (con archivos opcionales)
- `DELETE /api/evidences/:id` - Eliminar evidencia
- `GET /api/evidences/stats` - Estadísticas de evidencias
- `GET /api/evidences/recent` - Evidencias recientes
- `GET /api/evidences/:evidenceId/files/:fileId/download` - Descargar archivo
- `DELETE /api/evidences/:evidenceId/files/:fileId` - Eliminar archivo

---

## Seguridad y Autenticación

### Sistema de Autenticación
- **JWT Tokens**: Autenticación basada en tokens JWT
- **Restricción de Acceso**: Solo usuarios con rol `admin` pueden iniciar sesión
- **Encriptación**: Contraseñas encriptadas con Bcrypt
- **Protección de Rutas**: Todas las rutas API protegidas con middleware de autenticación
- **Validación**: Validación de datos en servidor con Express Validator
- **CORS**: Configurado para permitir solicitudes desde el frontend

### Botón de Cerrar Sesión
- Disponible en todas las vistas en el sidebar
- Limpia el token de autenticación
- Redirige automáticamente al login

### Notas de Seguridad para Producción
- Configurar HTTPS
- Implementar protección CSRF
- Agregar límites de tasa (rate limiting)
- Sanitización adicional de entradas
- Logs de seguridad y auditoría

---

## Cambios Recientes (Última Actualización)

### Autenticación y Acceso
- **Login restringido solo a administradores**: Solo usuarios con rol `admin` pueden acceder al sistema
- **Botón de cerrar sesión**: Añadido en todas las vistas del sidebar (Dashboard, Registro de Evidencias, Listados, Supervisión en Vivo, Eventos, Ayuda, Configuración)
- **Validación de roles**: El backend valida el rol antes de permitir el login
- **Mensaje de error claro**: El login muestra mensaje específico si el usuario no es admin

### Integración Frontend-Backend
- **Todas las vistas conectadas**: Dashboard, Registro de Evidencias, Listados, Supervisión en Vivo y Eventos completamente integradas
- **Datos reales**: Todas las tarjetas, calendarios y listas muestran datos de la base de datos PostgreSQL
- **Gestión de archivos**: Subir, descargar y eliminar archivos de evidencias con almacenamiento real
- **Calendario dinámico**: Muestra eventos reales con navegación entre meses y resaltado de días con eventos
- **Estadísticas precisas**: Contadores de participantes y eventos calculados directamente desde la base de datos
- **Modales CRUD completos**: Ver, editar, compartir y descargar evidencias con datos del backend
- **Gestión de participantes**: Agregar participantes a eventos con búsqueda de usuarios

### Mejoras de UI/UX
- **Diseño responsive mejorado**: Optimizado para móvil, tablet y desktop en todas las vistas
- **Sistema de toasts**: Notificaciones estilo Bootstrap en todas las vistas con z-index optimizado
- **Modales interactivos**: Modales para ver, editar, compartir y descargar evidencias
- **Centro de ayuda funcional**: Botones de Email (`mailto:`) y Llamar Soporte (`tel:`) operativos
- **Eliminación de elementos obsoletos**: Removidos barra de búsqueda y dropdown de perfil de todas las vistas
- **Mejoras visuales**: Tarjetas con gradientes, hover effects y sombras mejoradas

### Soporte de Reuniones
- **Múltiples plataformas**: Soporte para Jitsi, Google Meet, Zoom, Teams, Webex, GoToMeeting
- **Detección automática**: El sistema detecta y muestra la plataforma automáticamente
- **Integración con eventos**: Los eventos pueden tener enlaces de reunión asociados
- **Renderizado condicional**: Iframes para plataformas compatibles, botones para otras
- **Supervisión en tiempo real**: Vista mejorada con indicadores de transmisiones activas

### Backend y Base de Datos
- **API REST completa**: 20+ endpoints documentados y funcionales
- **Validación robusta**: Express Validator en todas las rutas
- **Gestión de archivos**: Multer configurado para uploads múltiples
- **Cálculo de participantes**: Consultas optimizadas que cuentan directamente desde `event_participants`
- **Limpieza de datos**: Scripts para eliminar datos de prueba
- **Migraciones**: Sistema de migraciones para esquema de base de datos

### Documentación
- **README completo**: Documentación actualizada con todas las funcionalidades
- **Guía de deployment**: Instrucciones detalladas para Railway, Render y DigitalOcean
- **Checklist de producción**: Lista de verificación antes de deploy
- **Troubleshooting**: Guía de solución de problemas comunes

## Roadmap (Próximas Versiones)

### Versión 2.1 - Mejoras Adicionales
- [ ] Notificaciones push en tiempo real
- [ ] Exportación mejorada de reportes (PDF, Excel)
- [ ] Búsqueda avanzada con filtros múltiples
- [ ] Dashboard personalizable

### Versión 3.0 - Advanced Features
- [ ] Streaming de video real (WebRTC/HLS)
- [ ] App móvil nativa
- [ ] Modo offline con sincronización
- [ ] Reportes avanzados con gráficos interactivos
- [ ] Integración con servicios de almacenamiento en la nube (AWS S3/Azure Blob)

---

## Contribución

Si deseas contribuir al proyecto:

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

---

## Contacto y Soporte

Para preguntas, sugerencias o reportar problemas:

- **Email**: [tu-email@ejemplo.com]
- **GitHub Issues**: [Crear un issue](../../issues)

---

## Agradecimientos

- Diseñado para el RESGUARDO INDÍGENA CATRÚ, DUBASA Y ANCOSÓ
- Resolución N° 215 de 2025
- Sistema desarrollado con tecnologías web modernas y open source

---

## Comandos Útiles

```bash
# Ver estado de servicios Docker
docker-compose ps

# Ver logs del backend
docker-compose logs -f backend

# Reiniciar backend
docker-compose restart backend

# Detener todos los servicios
docker-compose down

# Eliminar todo (incluyendo base de datos)
docker-compose down -v

# Acceder a la base de datos
docker-compose exec postgres psql -U postgres -d supervision_db
```

---

**Versión**: 2.0.0
**Última actualización**: Noviembre 2025
**Estado**: Sistema Completo - Backend + Frontend Integrados - Listo para Producción
