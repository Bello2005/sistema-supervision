# 🚀 Guía Paso a Paso: Supabase + Railway + Vercel

**La mejor opción GRATIS y PERMANENTE** para tu proyecto.

---

## 📋 Paso 1: Crear Base de Datos en Supabase

### 1.1 Crear Cuenta
1. Ve a [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Inicia sesión con **GitHub** (recomendado)

### 1.2 Crear Proyecto
1. Click **"New Project"**
2. Configura:
   - **Name**: `sistema-supervision`
   - **Database Password**: 
     - Genera una contraseña segura
     - **IMPORTANTE**: Guárdala bien, la necesitarás
     - Ejemplo: Usa un generador de contraseñas
   - **Region**: Elige la más cercana a tus usuarios
     - `South America (São Paulo)` si estás en Colombia
   - **Pricing Plan**: **Free** (500MB es suficiente para empezar)
3. Click **"Create new project"**
4. Espera 2-3 minutos mientras se crea la base de datos

### 1.3 Obtener Credenciales
1. En tu proyecto, ve a **"Settings"** (icono de engranaje) → **"Database"**
2. Busca la sección **"Connection string"**
3. Selecciona **"URI"**
4. Verás algo como:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
5. **Anota estos valores:**
   - **Host**: `db.xxxxx.supabase.co` (sin el `db.` si aparece)
   - **Port**: `5432`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: La que creaste

**Alternativa**: También puedes ver las credenciales en **"Connection pooling"** → **"Session mode"**

---

## 📋 Paso 2: Desplegar Backend en Railway

### 2.1 Crear Cuenta
1. Ve a [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Inicia sesión con **GitHub**

### 2.2 Conectar Repositorio
1. Click **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Si no está conectado, click **"Configure GitHub App"**
4. Selecciona tu repositorio
5. Click **"Deploy Now"**

### 2.3 Configurar Backend
1. Railway detectará automáticamente el proyecto
2. Click en el servicio que se creó
3. Ve a **"Settings"**
4. Configura:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
5. Click **"Save"**

### 2.4 Configurar Variables de Entorno
1. En tu servicio, ve a la pestaña **"Variables"**
2. Click **"New Variable"** y añade cada una:

```
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=tu-password-de-supabase
JWT_SECRET=<genera-una-clave>
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://tu-frontend.vercel.app
```

**Generar JWT_SECRET:**
```bash
# En tu terminal local:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Copia el resultado y úsalo como `JWT_SECRET`

**Nota**: `FRONTEND_URL` lo actualizaremos después de desplegar el frontend.

3. Click **"Deploy"** o espera a que Railway despliegue automáticamente

### 2.5 Ejecutar Migraciones
1. En Railway, ve a tu servicio backend
2. Click en **"Deployments"** (pestaña superior)
3. Selecciona el deployment más reciente
4. Click en **"View Logs"** o busca el botón **"Terminal"**
5. En la terminal, ejecuta:
```bash
cd backend
npm run migrate
npm run seed
```

Esto creará todas las tablas y cargará los datos iniciales.

### 2.6 Obtener URL del Backend
1. En Railway, ve a **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. Railway generará una URL como: `https://tu-backend.up.railway.app`
4. **Copia esta URL**, la necesitarás para el frontend

---

## 📋 Paso 3: Desplegar Frontend en Vercel

### 3.1 Crear Cuenta
1. Ve a [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Inicia sesión con **GitHub**

### 3.2 Importar Proyecto
1. En el Dashboard, click **"Add New"** → **"Project"**
2. Selecciona tu repositorio de GitHub
3. Si no aparece, click **"Adjust GitHub App Permissions"** y autoriza

### 3.3 Configurar Proyecto
1. **Framework Preset**: Selecciona **"Other"**
2. **Root Directory**: Escribe `frontend`
3. **Build Command**: (deja vacío)
4. **Output Directory**: (deja vacío)
5. **Install Command**: (deja vacío)
6. Click **"Deploy"**

### 3.4 Obtener URL del Frontend
1. Vercel desplegará automáticamente
2. Te dará una URL como: `https://tu-proyecto.vercel.app`
3. **Copia esta URL**

---

## 📋 Paso 4: Actualizar URL del API

### 4.1 Editar api.js
1. En tu proyecto local, edita `frontend/js/api.js`
2. Busca la sección de `API_BASE_URL`
3. Cambia a:

```javascript
const API_BASE_URL = (() => {
  if (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')) {
    return 'http://localhost:3000/api';
  }
  
  // URL de tu backend en Railway (reemplaza con tu URL real)
  return 'https://tu-backend.up.railway.app/api';
})();
```

**Reemplaza** `tu-backend.up.railway.app` con la URL real de tu backend en Railway.

### 4.2 Hacer Commit y Push
```bash
git add frontend/js/api.js
git commit -m "Actualizar URL del API para producción"
git push
```

Vercel detectará el cambio y desplegará automáticamente.

---

## 📋 Paso 5: Configurar CORS

1. En Railway, ve a tu servicio backend
2. Ve a **"Variables"**
3. Actualiza `FRONTEND_URL` con la URL de Vercel:
   ```
   FRONTEND_URL=https://tu-proyecto.vercel.app
   ```
4. Railway reiniciará automáticamente el servicio

---

## 📋 Paso 6: Verificar que Todo Funciona

1. Abre tu frontend en el navegador (URL de Vercel)
2. Intenta hacer login:
   - **Email**: `admin@supervision.com`
   - **Password**: `password123`
3. Si funciona, ¡estás listo! 🎉

---

## 🔧 Troubleshooting

### Error de conexión a la base de datos
- Verifica que las credenciales de Supabase sean correctas
- Asegúrate de usar el **Host** correcto (sin `db.` al inicio si aparece)
- Verifica que el proyecto de Supabase esté activo

### Backend no inicia
- Revisa los logs en Railway (pestaña "Deployments" → "View Logs")
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que `JWT_SECRET` tenga al menos 32 caracteres

### Frontend no conecta al backend
- Verifica la URL del API en `frontend/js/api.js`
- Revisa la consola del navegador (F12) para ver errores
- Asegúrate de que `FRONTEND_URL` en Railway sea correcta
- Verifica que el backend esté activo en Railway

### Error 401 (No autorizado)
- Verifica que el usuario tenga rol `admin` en la base de datos
- Asegúrate de que `JWT_SECRET` sea el mismo en todas las instancias

---

## 💰 Costos

**Plan Gratuito:**
- ✅ **Supabase**: 500MB de base de datos (suficiente para empezar)
- ✅ **Railway**: $5 de crédito mensual (suficiente para backend pequeño)
- ✅ **Vercel**: Ilimitado para proyectos personales

**Si necesitas más:**
- Supabase Pro: $25/mes (8GB de base de datos)
- Railway: Pago por uso (muy económico)
- Vercel Pro: $20/mes (solo si necesitas funciones avanzadas)

**Total para empezar: $0/mes** 🎉

---

## ✅ Ventajas de Esta Configuración

- ✅ **Base de datos permanente**: Supabase no elimina tu BD después de 90 días
- ✅ **Backend estable**: Railway tiene mejor plan gratuito que Render
- ✅ **Frontend rápido**: Vercel es el mejor para frontend estático
- ✅ **Auto-deploy**: Todos los servicios se actualizan automáticamente cuando haces push
- ✅ **SSL automático**: Todos los servicios tienen HTTPS automático
- ✅ **Escalable**: Fácil de actualizar cuando crezcas

---

## 🎉 ¡Listo!

Tu sistema está desplegado y funcionando **permanentemente**.

**URLs importantes:**
- Backend: `https://tu-backend.up.railway.app`
- Frontend: `https://tu-proyecto.vercel.app`
- Base de datos: Solo accesible desde el backend

**Próximos pasos:**
1. Cambiar la contraseña del admin en la base de datos
2. Configurar dominio personalizado (opcional)
3. Configurar backups automáticos en Supabase

---

¿Necesitas ayuda? Revisa los logs en Railway o consulta la documentación de cada servicio.

