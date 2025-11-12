# 🔧 Variables de Entorno para Render

## Variables que debes configurar en Render

Ve a tu servicio backend en Render → **Environment** → **Add Environment Variable**

### ✅ Variables Obligatorias

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Entorno de producción |
| `PORT` | `3000` | Puerto del servidor |
| `DB_HOST` | `ep-spring-shape-ah045t96-pooler.c-3.us-east-1.aws.neon.tech` | Host de Neon |
| `DB_PORT` | `5432` | Puerto de PostgreSQL |
| `DB_NAME` | `neondb` | Nombre de la base de datos |
| `DB_USER` | `neondb_owner` | Usuario de la base de datos |
| `DB_PASSWORD` | `npg_4dp8RPznWEGb` | Contraseña de la base de datos |
| `JWT_SECRET` | `dX1aCabicT1sbnhd0Kucfqjb9kYZnvaw2UoonE9s1dU=` | Clave secreta para JWT (ya generada) |
| `JWT_EXPIRES_IN` | `7d` | Tiempo de expiración del token |
| `CORS_ORIGIN` | `https://tu-frontend.vercel.app` | URL de tu frontend (actualiza después) |
| `FRONTEND_URL` | `https://tu-frontend.vercel.app` | URL de tu frontend (actualiza después) |

## 📋 Cómo configurarlas en Render

1. Ve a tu servicio backend en Render
2. Click en **Environment** (en el menú lateral)
3. Click en **Add Environment Variable**
4. Añade cada variable una por una:
   - **Key**: El nombre de la variable (ej: `DB_HOST`)
   - **Value**: El valor correspondiente
5. Guarda los cambios
6. Render redeployará automáticamente

## ⚠️ Importante

- **CORS_ORIGIN y FRONTEND_URL**: Actualiza estos valores después de desplegar tu frontend en Vercel
- **JWT_SECRET**: Ya está generado arriba, úsalo tal cual
- **DB_PASSWORD**: Es sensible, Render lo ocultará automáticamente

## 🔄 Después de configurar

1. Render redeployará automáticamente
2. Ve a **Shell** en Render
3. Ejecuta las migraciones:
   ```bash
   cd backend
   npm run migrate
   npm run seed
   ```

## ✅ Verificar que funciona

1. Ve a la URL de tu backend (ej: `https://supervision-backend.onrender.com`)
2. Visita: `https://tu-backend.onrender.com/health`
3. Deberías ver: `{"success":true,"message":"Server is running"}`

