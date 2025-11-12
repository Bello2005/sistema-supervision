# 🚀 Sistema de Supervisión - Backend API

Backend API REST para el Sistema de Supervisión - RES N° 215 DE 2025
**RESGUARDO INDÍGENA CATRÚ, DUBASA Y ANCOSÓ**

---

## 📋 Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Despliegue](#despliegue)
- [Testing](#testing)

---

## 💻 Tecnologías

- **Node.js** 18+
- **Express** 4.18 - Framework web
- **PostgreSQL** 15 - Base de datos
- **JWT** - Autenticación
- **Multer** - Upload de archivos
- **Bcrypt** - Encriptación de contraseñas
- **Docker** - Containerización

---

## 📦 Requisitos Previos

```bash
# Node.js 18 o superior
node --version

# PostgreSQL 15 o superior
psql --version

# Docker (opcional pero recomendado)
docker --version
```

---

## 🔧 Instalación

### Opción 1: Instalación Local

```bash
# 1. Navegar al directorio backend
cd backend

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env
cp .env.example .env

# 4. Editar .env con tus configuraciones
nano .env

# 5. Crear base de datos PostgreSQL
createdb supervision_db

# 6. Ejecutar migraciones
npm run migrate

# 7. (Opcional) Ejecutar seeds
npm run seed

# 8. Iniciar servidor
npm run dev
```

### Opción 2: Docker (RECOMENDADO)

```bash
# 1. Desde la raíz del proyecto
cd ..

# 2. Crear archivo .env en backend
cp backend/.env.example backend/.env

# 3. Levantar todos los servicios
docker-compose up -d

# 4. Ver logs
docker-compose logs -f backend

# 5. Ejecutar migraciones
docker-compose exec backend npm run migrate

# 6. Ejecutar seeds
docker-compose exec backend npm run seed
```

---

## ⚙️ Configuración

### Variables de Entorno (.env)

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=supervision_db
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=52428800
UPLOAD_PATH=./uploads

# CORS
CORS_ORIGIN=http://localhost:8080,http://127.0.0.1:8080
```

### Configuración de PostgreSQL

```sql
-- Crear usuario y base de datos
CREATE USER postgres WITH PASSWORD 'postgres';
CREATE DATABASE supervision_db OWNER postgres;
GRANT ALL PRIVILEGES ON DATABASE supervision_db TO postgres;
```

---

## 🎯 Uso

### Desarrollo

```bash
# Iniciar servidor en modo desarrollo (con nodemon)
npm run dev

# Iniciar servidor en producción
npm start

# Ejecutar migraciones
npm run migrate

# Ejecutar seeds
npm run seed

# Ejecutar tests
npm test
```

### Verificar que el servidor está corriendo

```bash
# Health check
curl http://localhost:3000/health

# Debe responder:
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-11T...",
  "environment": "development"
}
```

---

## 📡 API Endpoints

### Autenticación

#### POST /api/auth/register
Registrar nuevo usuario

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "full_name": "Nombre Completo",
  "role": "viewer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "usuario@ejemplo.com",
      "full_name": "Nombre Completo",
      "role": "viewer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /api/auth/login
Iniciar sesión

**Body:**
```json
{
  "email": "admin@supervision.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### GET /api/auth/profile
Obtener perfil del usuario actual (requiere autenticación)

**Headers:**
```
Authorization: Bearer <token>
```

### Eventos

#### GET /api/events
Obtener todos los eventos

**Query Params:**
- `status` (opcional): programado, en_curso, completado, cancelado
- `type` (opcional): capacitacion, workshop, seminario, taller, conferencia, webinar
- `search` (opcional): Buscar por título o descripción
- `limit` (opcional): Límite de resultados (default: 100)
- `offset` (opcional): Offset para paginación (default: 0)

#### GET /api/events/:id
Obtener evento por ID

#### POST /api/events
Crear nuevo evento (requiere rol: admin, supervisor, instructor)

**Body:**
```json
{
  "title": "Capacitación Tecnológica",
  "description": "Descripción del evento",
  "type": "capacitacion",
  "status": "programado",
  "start_date": "2025-11-15",
  "end_date": "2025-11-15",
  "start_time": "14:30:00",
  "end_time": "18:00:00",
  "location": "Sala Principal",
  "instructor_id": 3,
  "max_participants": 50,
  "color": "blue"
}
```

#### PUT /api/events/:id
Actualizar evento

#### DELETE /api/events/:id
Eliminar evento (requiere rol: admin, supervisor)

#### GET /api/events/stats
Obtener estadísticas de eventos

#### GET /api/events/upcoming
Obtener próximos eventos

#### POST /api/events/:id/participants
Agregar participante a evento

#### GET /api/events/:id/participants
Obtener participantes de evento

### Evidencias

#### GET /api/evidences
Obtener todas las evidencias

**Query Params:**
- `event_id` (opcional): Filtrar por evento
- `evidence_type` (opcional): foto, video, documento, audio
- `tags` (opcional): Filtrar por tags (separados por coma)
- `search` (opcional): Buscar en título y descripción
- `limit` (opcional): Límite de resultados
- `offset` (opcional): Offset para paginación

#### GET /api/evidences/:id
Obtener evidencia por ID (incluye archivos)

#### POST /api/evidences
Crear evidencia con archivos (requiere rol: admin, supervisor, instructor)

**Content-Type:** multipart/form-data

**Body:**
- `title`: Título de la evidencia
- `description`: Descripción
- `evidence_type`: foto, video, documento, audio
- `event_id`: ID del evento (opcional)
- `location`: Ubicación
- `latitude`: Latitud (opcional)
- `longitude`: Longitud (opcional)
- `tags`: Tags separados por coma
- `files`: Array de archivos (máx 10, 50MB cada uno)

**Ejemplo con cURL:**
```bash
curl -X POST http://localhost:3000/api/evidences \
  -H "Authorization: Bearer <token>" \
  -F "title=Fotografía del Evento" \
  -F "description=Grupo de participantes" \
  -F "evidence_type=foto" \
  -F "event_id=1" \
  -F "location=Sala Principal" \
  -F "tags=capacitacion,asistencia" \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.jpg"
```

#### PUT /api/evidences/:id
Actualizar evidencia

#### DELETE /api/evidences/:id
Eliminar evidencia (requiere rol: admin, supervisor)

#### GET /api/evidences/stats
Obtener estadísticas de evidencias

#### GET /api/evidences/recent
Obtener evidencias recientes

#### GET /api/evidences/search/tags
Buscar evidencias por tags

---

## 🔒 Autenticación

Todas las rutas (excepto `/api/auth/login` y `/api/auth/register`) requieren autenticación mediante JWT.

**Enviar token en headers:**
```
Authorization: Bearer <tu-token-jwt>
```

**Roles disponibles:**
- `admin`: Acceso total
- `supervisor`: Puede crear/editar eventos y evidencias
- `instructor`: Puede crear evidencias
- `viewer`: Solo lectura

---

## 🐳 Despliegue con Docker

### Desarrollo

```bash
# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Reiniciar un servicio
docker-compose restart backend
```

### Producción

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Verificar
docker-compose -f docker-compose.prod.yml ps
```

---

## 🚀 Despliegue en Railway

### 1. Preparar el proyecto

```bash
# Asegúrate de tener un repositorio Git
git init
git add .
git commit -m "Initial commit"
```

### 2. Deploy

1. Ve a https://railway.app
2. Click "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Conecta tu repositorio
5. Railway detectará automáticamente Node.js

### 3. Configurar variables de entorno

En Railway dashboard:
- Click en tu servicio
- Ve a "Variables"
- Agrega todas las variables de `.env`

### 4. Agregar PostgreSQL

1. Click "+ New"
2. Selecciona "Database" → "PostgreSQL"
3. Railway creará automáticamente las variables de conexión

### 5. Deploy

Railway desplegará automáticamente. Tu API estará en:
```
https://tu-proyecto.up.railway.app
```

---

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Ejecutar tests con coverage
npm run test:coverage

# Test de endpoints individuales
npm run test:auth
npm run test:events
npm run test:evidences
```

---

## 📊 Estructura de Base de Datos

### Tablas Principales

- **users**: Usuarios del sistema
- **events**: Eventos de capacitación
- **event_participants**: Participantes de eventos
- **evidences**: Evidencias registradas
- **evidence_files**: Archivos de evidencias
- **activity_logs**: Registro de actividades

### Relaciones

```
users (1) ─── (N) events (instructor)
users (1) ─── (N) evidences (uploaded_by)
events (1) ─── (N) event_participants
events (1) ─── (N) evidences
evidences (1) ─── (N) evidence_files
```

---

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ JWT para autenticación
- ✅ CORS configurado
- ✅ Helmet para headers de seguridad
- ✅ Validación de datos con express-validator
- ✅ Rate limiting (recomendado para producción)
- ✅ SQL injection protection (parametrized queries)

---

## 📝 Logs

Los logs se guardan en:
- **Desarrollo**: Console output
- **Producción**: Usar servicio externo (Logtail, Papertrail, etc.)

---

## 🆘 Troubleshooting

### Error: "Cannot connect to database"

```bash
# Verificar que PostgreSQL esté corriendo
pg_isready

# Si usa Docker
docker-compose ps
```

### Error: "Port 3000 already in use"

```bash
# Encontrar proceso
lsof -i :3000

# Matar proceso
kill -9 <PID>

# O cambiar puerto en .env
PORT=3001
```

### Error: "JWT token invalid"

- Verificar que `JWT_SECRET` sea el mismo
- Regenerar token haciendo login nuevamente

---

## 📞 Soporte

Para problemas o preguntas:
- GitHub Issues
- Email de soporte

---

**Versión**: 1.0.0
**Última actualización**: Noviembre 2025
