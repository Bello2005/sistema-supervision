# 🚀 Guía Paso a Paso: Deploy en Render

**Render es la MEJOR opción para este proyecto** porque:
- ✅ Hostea backend + PostgreSQL en un solo lugar
- ✅ Plan gratuito generoso
- ✅ Muy fácil de configurar
- ✅ Auto-deploy desde GitHub
- ✅ SSL automático

---

## 📋 Paso 1: Subir Código a GitHub

### Si ya tienes un repositorio:
```bash
# Añadir remote
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git

# Cambiar a branch main (si es necesario)
git branch -M main

# Push inicial
git push -u origin main
```

### Si necesitas crear un repositorio nuevo:
1. Ve a [github.com](https://github.com)
2. Click en **"New repository"**
3. Nombre: `sistema-supervision` (o el que prefieras)
4. **NO** marques "Initialize with README"
5. Click **"Create repository"**
6. Copia la URL del repositorio
7. Ejecuta:
```bash
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git branch -M main
git push -u origin main
```

---

## 📋 Paso 2: Crear Cuenta en Render

1. Ve a [render.com](https://render.com)
2. Click en **"Get Started for Free"**
3. Inicia sesión con **GitHub** (recomendado)
4. Autoriza Render para acceder a tus repositorios

---

## 📋 Paso 3: Crear Base de Datos PostgreSQL

1. En el Dashboard de Render, click **"New +"**
2. Selecciona **"PostgreSQL"**
3. Configura:
   - **Name**: `supervision-db`
   - **Database**: `supervision_db`
   - **User**: `supervision_user`
   - **Region**: Elige la más cercana (ej: `Oregon (US West)`)
   - **PostgreSQL Version**: `15`
   - **Plan**: **Free** (para empezar)
4. Click **"Create Database"**
5. **IMPORTANTE**: Anota las credenciales que Render te muestra:
   - Internal Database URL
   - External Database URL
   - Host, Port, Database, User, Password

---

## 📋 Paso 4: Desplegar Backend

1. En el Dashboard, click **"New +"**
2. Selecciona **"Web Service"**
3. Conecta tu repositorio de GitHub:
   - Si no está conectado, click **"Connect account"**
   - Selecciona tu repositorio
   - Click **"Connect"**
4. Configura el servicio:
   - **Name**: `supervision-backend`
   - **Region**: La misma que la base de datos
   - **Branch**: `main` (o `master`)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **"Advanced"** y configura:
   - **Auto-Deploy**: `Yes` (se actualizará automáticamente)
6. Click **"Create Web Service"**

---

## 📋 Paso 5: Configurar Variables de Entorno

1. En tu servicio backend, ve a la pestaña **"Environment"**
2. Añade estas variables (click **"Add Environment Variable"**):

```
DB_HOST=<host-de-render-postgres>
DB_PORT=5432
DB_NAME=supervision_db
DB_USER=supervision_user
DB_PASSWORD=<contraseña-de-render>
JWT_SECRET=<genera-una-clave-segura>
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://tu-frontend.onrender.com
```

**Cómo obtener los valores:**
- Ve a tu base de datos PostgreSQL en Render
- Click en **"Connections"**
- Copia los valores de:
  - **Host**: para `DB_HOST`
  - **Port**: para `DB_PORT` (normalmente 5432)
  - **Database**: para `DB_NAME`
  - **User**: para `DB_USER`
  - **Password**: para `DB_PASSWORD` (si no la recuerdas, puedes resetearla)

**Generar JWT_SECRET:**
```bash
# En tu terminal local:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Copia el resultado y úsalo como `JWT_SECRET`

**FRONTEND_URL**: Por ahora déjalo como `https://tu-frontend.onrender.com`, lo actualizaremos después.

3. Click **"Save Changes"**

---

## 📋 Paso 6: Ejecutar Migraciones

1. En tu servicio backend, ve a la pestaña **"Shell"**
2. Ejecuta estos comandos:
```bash
cd backend
npm run migrate
npm run seed
```

Esto creará las tablas y cargará los datos iniciales.

---

## 📋 Paso 7: Obtener URL del Backend

1. En tu servicio backend, ve a la pestaña **"Settings"**
2. Busca **"Service URL"** o **"Custom Domain"**
3. Render te dará una URL como: `https://supervision-backend.onrender.com`
4. **Copia esta URL**, la necesitarás para el frontend

---

## 📋 Paso 8: Desplegar Frontend

### Opción A: En Render (Más Fácil)

1. En el Dashboard, click **"New +"**
2. Selecciona **"Static Site"**
3. Conecta tu repositorio (si no está conectado)
4. Configura:
   - **Name**: `supervision-frontend`
   - **Branch**: `main` (o `master`)
   - **Root Directory**: `frontend`
   - **Build Command**: (deja vacío)
   - **Publish Directory**: (deja vacío o pon `frontend`)
5. Click **"Create Static Site"**

**IMPORTANTE**: Antes de que Render termine de desplegar, necesitas actualizar el código.

### Opción B: En Netlify (Recomendado para Frontend)

1. Ve a [netlify.com](https://netlify.com)
2. Inicia sesión con GitHub
3. Click **"Add new site"** → **"Import an existing project"**
4. Selecciona tu repositorio
5. Configura:
   - **Base directory**: `frontend`
   - **Build command**: (deja vacío)
   - **Publish directory**: `frontend`
6. Click **"Deploy site"**

---

## 📋 Paso 9: Actualizar URL del API en Frontend

1. Edita `frontend/js/api.js`
2. Busca la línea con `API_BASE_URL`
3. Cambia a:
```javascript
const API_BASE_URL = (() => {
  if (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')) {
    return 'http://localhost:3000/api';
  }
  
  // URL de tu backend en Render
  return 'https://supervision-backend.onrender.com/api';
})();
```

4. Guarda y haz commit:
```bash
git add frontend/js/api.js
git commit -m "Actualizar URL del API para producción"
git push
```

5. Render/Netlify desplegará automáticamente

---

## 📋 Paso 10: Configurar CORS en Backend

1. Ve a tu servicio backend en Render
2. Ve a **"Environment"**
3. Actualiza `FRONTEND_URL` con la URL de tu frontend:
   - Si está en Render: `https://supervision-frontend.onrender.com`
   - Si está en Netlify: `https://tu-sitio.netlify.app`
4. Click **"Save Changes"**
5. Render reiniciará automáticamente el servicio

---

## 📋 Paso 11: Verificar que Todo Funciona

1. Abre tu frontend en el navegador
2. Intenta hacer login con:
   - Email: `admin@supervision.com`
   - Password: `password123`
3. Si funciona, ¡estás listo! 🎉

---

## 🔧 Troubleshooting

### El backend no inicia
- Verifica las variables de entorno
- Revisa los logs en Render (pestaña "Logs")
- Asegúrate de que las credenciales de la BD sean correctas

### Error de conexión a la base de datos
- Verifica que `DB_HOST` use el host interno de Render
- Asegúrate de que la base de datos esté activa
- Revisa que el usuario y contraseña sean correctos

### El frontend no conecta al backend
- Verifica la URL del API en `frontend/js/api.js`
- Revisa la consola del navegador (F12) para errores
- Asegúrate de que `FRONTEND_URL` en el backend sea correcta

### Error 401 (No autorizado)
- Verifica que el usuario tenga rol `admin` en la base de datos
- Asegúrate de que `JWT_SECRET` sea el mismo en todas las instancias

---

## 💰 Costos

**Plan Gratuito de Render:**
- ✅ Backend: Gratis (se "duerme" después de 15 min de inactividad)
- ✅ PostgreSQL: Gratis (hasta 90 días, luego $7/mes)
- ✅ Static Site: Gratis

**Para producción real:**
- Backend: $7/mes (siempre activo)
- PostgreSQL: $7/mes (después de 90 días)
- **Total: ~$14/mes**

---

## 🎉 ¡Listo!

Tu sistema está desplegado y funcionando. 

**URLs importantes:**
- Backend: `https://supervision-backend.onrender.com`
- Frontend: `https://supervision-frontend.onrender.com` o `https://tu-sitio.netlify.app`
- Base de datos: Solo accesible desde el backend

**Próximos pasos:**
1. Cambiar la contraseña del admin
2. Configurar dominio personalizado (opcional)
3. Configurar backups automáticos

---

¿Necesitas ayuda? Revisa los logs en Render o consulta la documentación.

