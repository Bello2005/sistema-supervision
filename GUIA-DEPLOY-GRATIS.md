# 🚀 Guía Completa de Deployment GRATIS

Esta guía te ayudará a desplegar tu proyecto **100% GRATIS** usando servicios gratuitos permanentes.

---

## 📋 Opciones Recomendadas (100% Gratis)

### ⭐ **Opción 1: Neon + Render + Vercel** (RECOMENDADA)
- **Base de Datos**: Neon PostgreSQL (gratis permanente, 0.5GB)
- **Backend**: Render (gratis, puede dormir después de 15 min de inactividad)
- **Frontend**: Vercel (gratis, sin límites)
- **Costo**: $0/mes
- **Ventaja**: Base de datos permanente, no se elimina

### ⭐ **Opción 2: Supabase + Railway + Vercel**
- **Base de Datos**: Supabase PostgreSQL (gratis, 500MB)
- **Backend**: Railway (gratis, $5 crédito mensual)
- **Frontend**: Vercel (gratis)
- **Costo**: $0/mes
- **Ventaja**: Railway es más rápido que Render

### ⭐ **Opción 3: Railway Todo-en-Uno**
- **Base de Datos**: Railway PostgreSQL (gratis con crédito)
- **Backend**: Railway (gratis con crédito)
- **Frontend**: Railway Static Site (gratis)
- **Costo**: $0/mes (con $5 crédito mensual)
- **Ventaja**: Todo en un solo lugar

---

## 🎯 Opción 1: Neon + Render + Vercel (RECOMENDADA)

### Paso 1: Configurar Base de Datos en Neon

1. **Crear cuenta en Neon**
   - Ve a [neon.tech](https://neon.tech)
   - Inicia sesión con GitHub
   - Es 100% gratis y permanente

2. **Crear proyecto**
   - Click en "Create Project"
   - Nombre: `supervision-db`
   - Región: Elige la más cercana
   - PostgreSQL version: 15
   - Click "Create Project"

3. **Obtener string de conexión**
   - En el dashboard, verás "Connection string"
   - Copia la URL completa, se ve así:
     ```
     postgresql://usuario:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
     ```

4. **Ejecutar migraciones**
   - En Neon, ve a "SQL Editor"
   - Copia el contenido de `backend/src/database/schema.sql`
   - Pégalo y ejecuta
   - Luego ejecuta `backend/src/database/seed.sql` (opcional)

---

### Paso 2: Desplegar Backend en Render

1. **Crear cuenta en Render**
   - Ve a [render.com](https://render.com)
   - Inicia sesión con GitHub
   - Plan gratuito disponible

2. **Crear Web Service (Backend)**
   - Dashboard → "New" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Configuración:
     - **Name**: `supervision-backend`
     - **Environment**: `Node`
     - **Region**: Elige la más cercana
     - **Branch**: `main`
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start>`
     - **Plan**: Free

3. **Configurar Variables de Entorno**
   - En la sección "Environment" del servicio backend en Render, añade estas variables:
   
   **Variables Obligatorias:**
   ```env
   NODE_ENV=production
   PORT=3000
   
   # Base de datos Neon (extrae estos valores de tu connection string)
   DB_HOST=ep-spring-shape-ah045t96-pooler.c-3.us-east-1.aws.neon.tech
   DB_PORT=5432
   DB_NAME=neondb
   DB_USER=neondb_owner
   DB_PASSWORD=npg_4dp8RPznWEGb
   
   # JWT (genera una clave secreta segura)
   JWT_SECRET=tu-secret-key-muy-segura-minimo-32-caracteres-aleatorios
   JWT_EXPIRES_IN=7d
   
   # CORS (actualiza con la URL de tu frontend después de desplegarlo)
   CORS_ORIGIN=https://tu-frontend.vercel.app
   FRONTEND_URL=https://tu-frontend.vercel.app
   ```
   
   **💡 Cómo extraer los valores de tu connection string de Neon:**
   
   Si tu connection string es:
   ```
   postgresql://neondb_owner:npg_4dp8RPznWEGb@ep-spring-shape-ah045t96-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
   
   Los valores son:
   - `DB_HOST`: `ep-spring-shape-ah045t96-pooler.c-3.us-east-1.aws.neon.tech`
   - `DB_PORT`: `5432` (por defecto)
   - `DB_NAME`: `neondb`
   - `DB_USER`: `neondb_owner`
   - `DB_PASSWORD`: `npg_4dp8RPznWEGb`
   
   **🔐 Generar JWT_SECRET seguro:**
   ```bash
   # En tu terminal local:
   openssl rand -base64 32
   ```
   O usa cualquier generador de strings aleatorios (mínimo 32 caracteres).

   **✅ Nota importante:** El código ya está configurado para usar SSL automáticamente con Neon. No necesitas configurar nada adicional.

4. **Ejecutar migraciones**
   - Ve a "Shell" en Render
   - Ejecuta:
     ```bash
     npm run migrate
     npm run seed
     ```

5. **Obtener URL del Backend**
   - Render te dará una URL como: `https://supervision-backend.onrender.com`
   - **Nota**: En el plan gratis, el servicio puede "dormir" después de 15 min de inactividad. La primera petición puede tardar ~30 segundos.

---

### Paso 3: Desplegar Frontend en Vercel

1. **Crear cuenta en Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Inicia sesión con GitHub
   - 100% gratis

2. **Desplegar proyecto**
   - Dashboard → "Add New" → "Project"
   - Importa tu repositorio de GitHub
   - Configuración:
     - **Framework Preset**: Other
     - **Root Directory**: `frontend`
     - **Build Command**: (dejar vacío)
     - **Output Directory**: (dejar vacío)
     - Click "Deploy"

3. **Actualizar URL del API**
   - Después del deploy, edita `frontend/js/api.js`
   - Cambia la línea 22:
     ```javascript
     // return 'https://supervision-backend.onrender.com/api';
     return 'https://supervision-backend.onrender.com/api';
     ```
   - Haz commit y push:
     ```bash
     git add frontend/js/api.js
     git commit -m "Actualizar URL del API para producción"
     git push
     ```
   - Vercel redeployará automáticamente

4. **Obtener URL del Frontend**
   - Vercel te dará una URL como: `https://tu-proyecto.vercel.app`
   - Puedes configurar un dominio personalizado gratis

---

## 🎯 Opción 2: Supabase + Railway + Vercel

### Paso 1: Configurar Base de Datos en Supabase

1. **Crear cuenta en Supabase**
   - Ve a [supabase.com](https://supabase.com)
   - Inicia sesión con GitHub
   - Plan gratuito: 500MB de base de datos

2. **Crear proyecto**
   - Click "New Project"
   - Nombre: `supervision-db`
   - Database Password: (guarda esta contraseña)
   - Región: Elige la más cercana
   - Click "Create new project"

3. **Obtener credenciales**
   - Ve a Settings → Database
   - Copia:
     - Host
     - Database name
     - Port (5432)
     - User
     - Password

4. **Ejecutar migraciones**
   - Ve a SQL Editor
   - Ejecuta `backend/src/database/schema.sql`
   - Luego `backend/src/database/seed.sql` (opcional)

---

### Paso 2: Desplegar Backend en Railway

1. **Crear cuenta en Railway**
   - Ve a [railway.app](https://railway.app)
   - Inicia sesión con GitHub
   - Te dan $5 crédito gratis mensual

2. **Crear proyecto**
   - Click "New Project"
   - "Deploy from GitHub repo"
   - Selecciona tu repositorio

3. **Configurar servicio Backend**
   - Click "New" → "GitHub Repo"
   - Selecciona tu repo
   - Configuración:
     - **Root Directory**: `backend`
     - **Start Command**: `npm start`
     - Railway detectará automáticamente Node.js

4. **Configurar Variables de Entorno**
   - En Variables, añade:
     ```env
     NODE_ENV=production
     PORT=3000
     
     DB_HOST=db.xxx.supabase.co
     DB_PORT=5432
     DB_NAME=postgres
     DB_USER=postgres
     DB_PASSWORD=tu-password-de-supabase
     
     JWT_SECRET=tu-secret-key-muy-segura
     JWT_EXPIRES_IN=7d
     
     CORS_ORIGIN=https://tu-frontend.vercel.app
     FRONTEND_URL=https://tu-frontend.vercel.app
     ```

5. **Ejecutar migraciones**
   - Ve a la terminal del servicio
   - Ejecuta:
     ```bash
     npm run migrate
     npm run seed
     ```

6. **Obtener URL**
   - Railway generará una URL como: `https://tu-backend.up.railway.app`

---

### Paso 3: Desplegar Frontend en Vercel

Sigue los mismos pasos de la Opción 1, pero actualiza la URL del API a la de Railway.

---

## 🎯 Opción 3: Railway Todo-en-Uno

### Paso 1: Crear Base de Datos en Railway

1. **En tu proyecto Railway**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway creará la base de datos automáticamente

2. **Obtener credenciales**
   - Click en la base de datos
   - Ve a "Variables"
   - Railway expone variables como:
     - `PGHOST`
     - `PGPORT`
     - `PGDATABASE`
     - `PGUSER`
     - `PGPASSWORD`

---

### Paso 2: Desplegar Backend en Railway

1. **Crear servicio Backend**
   - Click "New" → "GitHub Repo"
   - Selecciona tu repositorio
   - Root Directory: `backend`

2. **Configurar Variables de Entorno**
   - Usa las variables de la base de datos:
     ```env
     DB_HOST=${{Postgres.PGHOST}}
     DB_PORT=${{Postgres.PGPORT}}
     DB_NAME=${{Postgres.PGDATABASE}}
     DB_USER=${{Postgres.PGUSER}}
     DB_PASSWORD=${{Postgres.PGPASSWORD}}
     
     NODE_ENV=production
     PORT=3000
     JWT_SECRET=tu-secret-key-muy-segura
     JWT_EXPIRES_IN=7d
     CORS_ORIGIN=https://tu-frontend.railway.app
     FRONTEND_URL=https://tu-frontend.railway.app
     ```

3. **Ejecutar migraciones**
   - Terminal del servicio → `npm run migrate && npm run seed`

---

### Paso 3: Desplegar Frontend en Railway

1. **Crear servicio Frontend**
   - Click "New" → "Static Site"
   - Root Directory: `frontend`
   - Build Command: (vacío)
   - Output Directory: `frontend`

2. **Actualizar URL del API**
   - Edita `frontend/js/api.js`
   - Cambia a la URL de Railway del backend

---

## 🔧 Configuración Adicional

### Actualizar CORS en Backend

Asegúrate de que el backend permita peticiones desde tu frontend. En `backend/src/server.js`, verifica:

```javascript
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
```

### Variables de Entorno Necesarias

Crea un archivo `.env` en `backend/` con:

```env
# Base de Datos
DB_HOST=tu-host
DB_PORT=5432
DB_NAME=tu-db
DB_USER=tu-usuario
DB_PASSWORD=tu-password

# JWT
JWT_SECRET=tu-secret-key-muy-segura-minimo-32-caracteres
JWT_EXPIRES_IN=7d

# Servidor
NODE_ENV=production
PORT=3000

# CORS
CORS_ORIGIN=https://tu-frontend.vercel.app
FRONTEND_URL=https://tu-frontend.vercel.app
```

---

## 📝 Checklist de Deployment

- [ ] Base de datos creada y migrada
- [ ] Backend desplegado y funcionando
- [ ] Variables de entorno configuradas
- [ ] Migraciones ejecutadas
- [ ] Frontend desplegado
- [ ] URL del API actualizada en `frontend/js/api.js`
- [ ] CORS configurado correctamente
- [ ] Probar login y funcionalidades principales

---

## 🐛 Troubleshooting

### Backend no inicia
- Verifica variables de entorno
- Revisa logs en Render/Railway
- Verifica conexión a base de datos

### Frontend no conecta al backend
- Verifica URL del API en `frontend/js/api.js`
- Verifica CORS en backend
- Revisa consola del navegador (F12)

### Base de datos no conecta
- Verifica credenciales
- Asegúrate de que la IP esté permitida (en Neon/Supabase)
- Verifica que uses SSL (`sslmode=require`)

### Render se "duerme"
- En plan gratis, Render duerme después de 15 min de inactividad
- La primera petición puede tardar ~30 segundos
- Considera usar Railway si necesitas respuesta inmediata

---

## 💡 Recomendaciones Finales

1. **Para producción seria**: Considera la Opción 1 (Neon + Render + Vercel) porque:
   - Base de datos permanente (no se elimina)
   - Vercel es muy rápido para frontend
   - Render es confiable para backend

2. **Para desarrollo rápido**: Opción 3 (Railway todo-en-uno) porque:
   - Todo en un solo lugar
   - Más fácil de gestionar
   - $5 crédito mensual gratis

3. **Para mejor rendimiento**: Opción 2 (Supabase + Railway) porque:
   - Railway es más rápido que Render
   - Supabase tiene buen rendimiento
   - Menos "sueño" del servicio

---

## 🎉 ¡Listo!

Tu aplicación estará desplegada 100% gratis. Recuerda:
- Las bases de datos gratuitas tienen límites (0.5GB - 500MB)
- Los servicios pueden "dormir" en planes gratis
- Siempre haz backups de tu base de datos

**¿Necesitas ayuda?** Revisa los logs de cada servicio o consulta la documentación oficial.

