# 🚀 Guía: Neon + Render (100% Gratis y Permanente)

**La mejor solución GRATIS para tu proyecto:**
- ✅ **Neon**: Base de datos PostgreSQL **GRATIS Y PERMANENTE** (sin eliminaciones)
- ✅ **Render**: Backend gratis (se duerme pero se despierta automáticamente)
- ✅ **Render/Vercel**: Frontend gratis
- ✅ **Total: $0/mes, permanente**

---

## 📋 Paso 1: Crear Base de Datos en Neon

### 1.1 Crear Cuenta
1. Ve a [neon.tech](https://neon.tech)
2. Click **"Sign Up"**
3. Inicia sesión con **GitHub** (recomendado)

### 1.2 Crear Proyecto
1. Click **"Create a project"**
2. Configura:
   - **Project name**: `sistema-supervision`
   - **Region**: Elige la más cercana
     - `us-east-2` (Ohio) - Buena para Colombia
     - `us-west-2` (Oregon) - También buena opción
   - **PostgreSQL version**: `15`
   - **Compute size**: **Free** (0.25 vCPU, 256MB RAM)
3. Click **"Create project"**
4. Espera 1-2 minutos mientras se crea

### 1.3 Obtener Credenciales
1. En tu proyecto de Neon, verás la sección **"Connection Details"**
2. **IMPORTANTE**: Hay dos tipos de conexión:
   - **Connection pooling** (recomendado para producción)
   - **Direct connection** (para desarrollo)

3. Para Render, usa la **"Connection string"** completa:
   ```
   postgresql://usuario:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

4. **Anota estos valores:**
   - **Host**: `ep-xxxxx.us-east-2.aws.neon.tech` (o similar)
   - **Port**: `5432`
   - **Database**: `neondb` (o el nombre que te dé)
   - **User**: El usuario que aparece
   - **Password**: La contraseña generada (cópiala bien)

**💡 Tip**: Neon también te da una **"Connection string"** completa que puedes usar directamente.

---

## 📋 Paso 2: Desplegar Backend en Render

### 2.1 Crear Cuenta
1. Ve a [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Inicia sesión con **GitHub**

### 2.2 Crear Web Service (Backend)
1. En el Dashboard, click **"New +"**
2. Selecciona **"Web Service"**
3. Conecta tu repositorio:
   - Si no está conectado, click **"Connect account"**
   - Autoriza Render para acceder a tus repositorios
   - Selecciona: `Bello2005/sistema-supervision`
4. Click **"Connect"**

### 2.3 Configurar el Servicio
1. Configura:
   - **Name**: `supervision-backend`
   - **Region**: Elige la más cercana (mismo que Neon si es posible)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
2. Click **"Advanced"**:
   - **Auto-Deploy**: `Yes` (se actualizará automáticamente)
3. Click **"Create Web Service"**

### 2.4 Configurar Variables de Entorno
1. En tu servicio backend, ve a la pestaña **"Environment"**
2. Click **"Add Environment Variable"** y añade cada una:

```
DB_HOST=ep-xxxxx.us-east-2.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=tu-usuario-de-neon
DB_PASSWORD=tu-password-de-neon
JWT_SECRET=<genera-una-clave-segura>
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://supervision-frontend.onrender.com
```

**Generar JWT_SECRET:**
```bash
# En tu terminal local:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Copia el resultado y úsalo como `JWT_SECRET`

**Nota**: `FRONTEND_URL` lo actualizaremos después de desplegar el frontend.

3. Click **"Save Changes"**
4. Render iniciará el deployment automáticamente

### 2.5 Ejecutar Migraciones
1. En Render, ve a tu servicio backend
2. Ve a la pestaña **"Shell"** (o busca "Open Shell")
3. Ejecuta:
```bash
cd backend
npm run migrate
npm run seed
```

Esto creará todas las tablas y cargará los datos iniciales.

### 2.6 Obtener URL del Backend
1. En Render, ve a **"Settings"** de tu servicio
2. Busca **"Service URL"** o **"Custom Domain"**
3. Render te dará una URL como: `https://supervision-backend.onrender.com`
4. **Copia esta URL**, la necesitarás para el frontend

**⚠️ Nota**: El backend se "dormirá" después de 15 minutos de inactividad, pero se despertará automáticamente cuando alguien lo use (puede tardar 30-60 segundos la primera vez).

---

## 📋 Paso 3: Desplegar Frontend en Render

### 3.1 Crear Static Site
1. En Render Dashboard, click **"New +"**
2. Selecciona **"Static Site"**
3. Conecta tu repositorio (si no está conectado)
4. Selecciona: `Bello2005/sistema-supervision`

### 3.2 Configurar
1. Configura:
   - **Name**: `supervision-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: (deja vacío)
   - **Publish Directory**: (deja vacío o pon `frontend`)
2. Click **"Create Static Site"**

### 3.3 Obtener URL del Frontend
1. Render te dará una URL como: `https://supervision-frontend.onrender.com`
2. **Copia esta URL**

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
  
  // URL de tu backend en Render (reemplaza con tu URL real)
  return 'https://supervision-backend.onrender.com/api';
})();
```

**Reemplaza** `supervision-backend.onrender.com` con la URL real de tu backend en Render.

### 4.2 Hacer Commit y Push
```bash
git add frontend/js/api.js
git commit -m "Actualizar URL del API para producción con Render"
git push
```

Render detectará el cambio y desplegará automáticamente el frontend.

---

## 📋 Paso 5: Configurar CORS

1. En Render, ve a tu servicio backend
2. Ve a **"Environment"**
3. Actualiza `FRONTEND_URL` con la URL de tu frontend:
   ```
   FRONTEND_URL=https://supervision-frontend.onrender.com
   ```
4. Click **"Save Changes"**
5. Render reiniciará automáticamente el servicio

---

## 📋 Paso 6: Verificar que Todo Funciona

1. Abre tu frontend en el navegador (URL de Render)
2. **Espera 30-60 segundos** si es la primera vez (el backend se está "despertando")
3. Intenta hacer login:
   - **Email**: `admin@supervision.com`
   - **Password**: `password123`
4. Si funciona, ¡estás listo! 🎉

---

## 🔧 Troubleshooting

### El backend no inicia
- Verifica las variables de entorno en Render
- Revisa los logs en Render (pestaña "Logs")
- Asegúrate de que las credenciales de Neon sean correctas
- Verifica que el **Host** de Neon sea correcto (debe incluir `ep-` al inicio)

### Error de conexión a la base de datos
- Verifica que uses el **Host correcto** de Neon (con `ep-` y el dominio completo)
- Asegúrate de que la base de datos de Neon esté activa
- Verifica que el usuario y contraseña sean correctos
- **Importante**: Neon requiere SSL, asegúrate de que la conexión incluya `?sslmode=require`

### El frontend no conecta al backend
- Verifica la URL del API en `frontend/js/api.js`
- Revisa la consola del navegador (F12) para ver errores
- Asegúrate de que `FRONTEND_URL` en Render sea correcta
- **Espera 30-60 segundos** si el backend se acaba de "dormir"

### El backend está "dormido"
- Esto es normal en el plan gratis de Render
- Se despertará automáticamente cuando alguien lo use
- La primera petición puede tardar 30-60 segundos
- Para producción real, considera el plan de $7/mes para que esté siempre activo

### Error 401 (No autorizado)
- Verifica que el usuario tenga rol `admin` en la base de datos
- Asegúrate de que `JWT_SECRET` sea el mismo en todas las instancias

---

## 💰 Costos

**Plan Gratuito:**
- ✅ **Neon**: Base de datos PostgreSQL **GRATIS Y PERMANENTE**
  - 0.25 vCPU, 256MB RAM
  - 512MB de almacenamiento
  - **Sin eliminaciones** (a diferencia de Render)
- ✅ **Render Backend**: Gratis (se duerme después de 15 min)
- ✅ **Render Frontend**: Gratis (Static Site)

**Si necesitas más:**
- Neon Pro: $19/mes (más recursos)
- Render Backend (Always On): $7/mes (no se duerme)
- **Total para producción real: $7-26/mes**

**Para empezar: $0/mes permanente** 🎉

---

## ✅ Ventajas de Esta Configuración

- ✅ **Base de datos permanente**: Neon NO elimina tu BD después de 90 días
- ✅ **100% gratis**: Todo funciona en plan gratuito
- ✅ **Auto-deploy**: Render se actualiza automáticamente cuando haces push
- ✅ **SSL automático**: Todos los servicios tienen HTTPS automático
- ✅ **Escalable**: Fácil de actualizar cuando crezcas

---

## 🎉 ¡Listo!

Tu sistema está desplegado y funcionando **permanentemente** con Neon + Render.

**URLs importantes:**
- Backend: `https://supervision-backend.onrender.com`
- Frontend: `https://supervision-frontend.onrender.com`
- Base de datos: Solo accesible desde el backend (Neon)

**Próximos pasos:**
1. Cambiar la contraseña del admin en la base de datos
2. Configurar dominio personalizado (opcional)
3. Considerar plan de pago si necesitas que el backend esté siempre activo

---

## 📝 Notas Importantes

1. **Backend se duerme**: En el plan gratis, el backend se "duerme" después de 15 minutos. Se despierta automáticamente, pero la primera petición puede tardar 30-60 segundos.

2. **Base de datos permanente**: A diferencia de Render, Neon NO elimina tu base de datos. Es permanente mientras uses el servicio.

3. **Migración desde Render**: Si ya tenías datos en Render, puedes exportarlos e importarlos a Neon usando `pg_dump` y `psql`.

---

¿Necesitas ayuda? Revisa los logs en Render o consulta la documentación de Neon.

