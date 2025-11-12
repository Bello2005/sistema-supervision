# 🚀 Guía de Hosting Permanente (Sin Eliminaciones)

## ⚠️ Problema con Render Gratis

- **PostgreSQL**: Se elimina después de 90 días
- **Backend**: Se "duerme" después de 15 min (se despierta automáticamente)
- **Frontend**: Funciona bien, pero puede ser lento

---

## ✅ MEJOR OPCIÓN: Supabase + Railway/Vercel

### ¿Por qué esta combinación?
- ✅ **Supabase**: PostgreSQL **GRATIS Y PERMANENTE** (500MB, suficiente para empezar)
- ✅ **Railway**: Backend gratis con mejor plan que Render
- ✅ **Vercel**: Frontend gratis y permanente
- ✅ **Total**: $0/mes para empezar

---

## 📋 Opción 1: Supabase + Railway + Vercel (RECOMENDADA)

### Paso 1: Crear Base de Datos en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Click **"Start your project"** → Inicia sesión con GitHub
3. Click **"New Project"**
4. Configura:
   - **Name**: `sistema-supervision`
   - **Database Password**: Genera una contraseña segura (guárdala)
   - **Region**: Elige la más cercana
   - **Plan**: **Free** (500MB, suficiente para empezar)
5. Click **"Create new project"**
6. Espera 2-3 minutos mientras se crea

### Paso 2: Obtener Credenciales de Supabase

1. En tu proyecto de Supabase, ve a **"Settings"** → **"Database"**
2. Busca **"Connection string"** → **"URI"**
3. Copia la cadena de conexión (se ve así):
   ```
   postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
4. También anota:
   - **Host**: `db.xxxxx.supabase.co`
   - **Port**: `5432`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: La que creaste

### Paso 3: Desplegar Backend en Railway

1. Ve a [railway.app](https://railway.app)
2. Inicia sesión con GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Selecciona tu repositorio
5. Railway detectará automáticamente el backend
6. Configura:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
7. Ve a **"Variables"** y añade:

```
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=tu-password-de-supabase
JWT_SECRET=<genera-una-clave-segura>
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://tu-frontend.vercel.app
```

**Generar JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

8. Click **"Deploy"**

### Paso 4: Ejecutar Migraciones

1. En Railway, ve a tu servicio backend
2. Click en **"Deployments"** → Selecciona el más reciente
3. Abre la **Terminal**
4. Ejecuta:
```bash
npm run migrate
npm run seed
```

### Paso 5: Desplegar Frontend en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con GitHub
3. Click **"Add New"** → **"Project"**
4. Importa tu repositorio
5. Configura:
   - **Framework Preset**: Other
   - **Root Directory**: `frontend`
   - **Build Command**: (deja vacío)
   - **Output Directory**: (deja vacío)
6. Click **"Deploy"**

### Paso 6: Actualizar URL del API

1. Edita `frontend/js/api.js`
2. Cambia a:
```javascript
const API_BASE_URL = (() => {
  if (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')) {
    return 'http://localhost:3000/api';
  }
  
  // URL de tu backend en Railway
  return 'https://tu-backend.up.railway.app/api';
})();
```

3. Haz commit y push:
```bash
git add frontend/js/api.js
git commit -m "Actualizar URL del API para Railway"
git push
```

4. Vercel desplegará automáticamente

### Paso 7: Configurar CORS

1. En Railway, ve a **"Variables"**
2. Actualiza `FRONTEND_URL` con la URL de Vercel:
   ```
   FRONTEND_URL=https://tu-proyecto.vercel.app
   ```
3. Railway reiniciará automáticamente

---

## 📋 Opción 2: Neon + Fly.io + Netlify

### Neon (Base de Datos PostgreSQL)

1. Ve a [neon.tech](https://neon.tech)
2. Inicia sesión con GitHub
3. Click **"Create a project"**
4. Configura:
   - **Project name**: `sistema-supervision`
   - **Region**: Elige la más cercana
   - **PostgreSQL version**: `15`
5. Click **"Create project"**
6. Anota las credenciales de conexión

### Fly.io (Backend)

1. Ve a [fly.io](https://fly.io)
2. Instala Fly CLI:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```
3. Inicia sesión:
   ```bash
   fly auth login
   ```
4. Crea app:
   ```bash
   cd backend
   fly launch
   ```
5. Sigue las instrucciones
6. Configura variables de entorno:
   ```bash
   fly secrets set DB_HOST=xxx DB_PORT=5432 DB_NAME=xxx DB_USER=xxx DB_PASSWORD=xxx JWT_SECRET=xxx NODE_ENV=production
   ```

### Netlify (Frontend)

Igual que Vercel, pero en [netlify.com](https://netlify.com)

---

## 📋 Opción 3: DigitalOcean (Todo en Uno - $6/mes)

**Ventajas:**
- ✅ Todo en un solo lugar
- ✅ Muy económico ($6/mes)
- ✅ Sin limitaciones de tiempo
- ✅ Control total

**Desventajas:**
- ❌ Requiere configuración manual
- ❌ Necesitas conocimientos de servidor

### Configuración Rápida

1. Crea cuenta en [digitalocean.com](https://digitalocean.com)
2. Crea un Droplet:
   - **Image**: Ubuntu 22.04
   - **Plan**: Basic - $6/mes (1GB RAM)
   - **Region**: Más cercana
3. Sigue la guía en `DEPLOYMENT.md` (Opción 3: DigitalOcean)

**Costo**: $6/mes (muy económico para producción)

---

## 📋 Opción 4: Railway Todo (Pago después de gratis)

Railway tiene un plan gratuito con $5 de crédito mensual:

1. **Backend**: Gratis (usa créditos)
2. **PostgreSQL**: Gratis (usa créditos)
3. **Frontend**: Gratis (Static Site)

**Después de agotar créditos**: ~$5-10/mes

---

## 💰 Comparación de Costos

| Opción | Base de Datos | Backend | Frontend | Total/Mes |
|--------|---------------|---------|----------|-----------|
| **Supabase + Railway + Vercel** | $0 (gratis) | $0 (gratis) | $0 (gratis) | **$0** |
| **Neon + Fly.io + Netlify** | $0 (gratis) | $0 (gratis) | $0 (gratis) | **$0** |
| **DigitalOcean** | Incluido | Incluido | Incluido | **$6** |
| **Railway Todo** | Incluido | Incluido | Incluido | **$0-10** |
| **Render** | $7 (después 90 días) | $7 | $0 | **$14** |

---

## 🎯 Recomendación Final

### Para Desarrollo/Pruebas (Gratis):
**Supabase + Railway + Vercel**
- Base de datos permanente
- Backend estable
- Frontend rápido
- Total: $0/mes

### Para Producción Real ($6/mes):
**DigitalOcean Droplet**
- Todo en un solo lugar
- Control total
- Sin sorpresas
- Muy económico

---

## 🚀 Migración desde Render

Si ya tienes datos en Render:

1. **Exportar base de datos:**
   ```bash
   pg_dump -h <render-host> -U <user> -d <database> > backup.sql
   ```

2. **Importar a Supabase:**
   - Ve a Supabase → SQL Editor
   - Ejecuta el archivo `backup.sql`

3. **Actualizar variables de entorno** en Railway con las credenciales de Supabase

4. **Redeploy** y verificar

---

## ✅ Checklist de Migración

- [ ] Crear cuenta en Supabase
- [ ] Crear proyecto y base de datos
- [ ] Exportar datos de Render (si los tienes)
- [ ] Importar datos a Supabase
- [ ] Crear cuenta en Railway
- [ ] Desplegar backend en Railway
- [ ] Configurar variables de entorno
- [ ] Ejecutar migraciones
- [ ] Desplegar frontend en Vercel
- [ ] Actualizar URL del API
- [ ] Configurar CORS
- [ ] Probar login y funcionalidades
- [ ] Verificar que todo funciona

---

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs en Railway/Supabase
2. Verifica las variables de entorno
3. Consulta la documentación de cada servicio
4. Revisa `DEPLOYMENT.md` para más detalles

---

**¡Con esta configuración tu proyecto estará funcionando permanentemente!** 🎉

