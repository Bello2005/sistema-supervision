# 🚀 Guía de Deployment a Producción

Esta guía te ayudará a desplegar el Sistema de Supervisión en producción paso a paso.

## 📋 Tabla de Contenidos

1. [Pre-requisitos](#pre-requisitos)
2. [Variables de Entorno](#variables-de-entorno)
3. [Railway (Recomendado)](#railway-recomendado)
4. [Render](#render)
5. [DigitalOcean VPS](#digitalocean-vps)
6. [Configuración de Seguridad](#configuración-de-seguridad)
7. [Checklist Final](#checklist-final)

---

## Pre-requisitos

- ✅ Cuenta en servicio de hosting (Railway, Render, DigitalOcean)
- ✅ Repositorio Git configurado
- ✅ Dominio propio (opcional pero recomendado)
- ✅ Conocimiento básico de terminal/CLI

---

## Variables de Entorno

Crea un archivo `.env` en `backend/` con estas variables:

```env
# Base de Datos PostgreSQL
DB_HOST=tu-host-postgresql
DB_PORT=5432
DB_NAME=supervision_db
DB_USER=tu-usuario
DB_PASSWORD=tu-contraseña-segura

# JWT (IMPORTANTE: Usa una clave segura de al menos 32 caracteres)
JWT_SECRET=tu-secret-key-muy-segura-y-larga-minimo-32-caracteres-aleatorios
JWT_EXPIRES_IN=7d

# Servidor
NODE_ENV=production
PORT=3000

# CORS (URL de tu frontend en producción)
FRONTEND_URL=https://tu-dominio.com
```

**Generar JWT_SECRET seguro:**
```bash
# Opción 1: Usando OpenSSL
openssl rand -base64 32

# Opción 2: Usando Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Railway (Recomendado)

Railway es la opción más fácil y rápida para deployment.

### Paso 1: Crear Cuenta
1. Ve a [railway.app](https://railway.app)
2. Inicia sesión con GitHub
3. Autoriza Railway para acceder a tus repositorios

### Paso 2: Crear Proyecto
1. Click en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Selecciona tu repositorio
4. Railway detectará automáticamente el proyecto

### Paso 3: Agregar Base de Datos PostgreSQL
1. En tu proyecto, click **"New"**
2. Selecciona **"Database"** → **"PostgreSQL"**
3. Railway creará automáticamente la base de datos
4. Anota el nombre del servicio (ej: `Postgres`)

### Paso 4: Desplegar Backend
1. Click **"New"** → **"GitHub Repo"**
2. Selecciona tu repositorio
3. Configura:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
4. Railway iniciará el deployment automáticamente

### Paso 5: Configurar Variables de Entorno
1. Ve a tu servicio backend → **"Variables"**
2. Añade estas variables usando las referencias de Railway:

```
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
JWT_SECRET=tu-secret-key-generada
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://tu-frontend.vercel.app
```

**Nota**: Reemplaza `Postgres` con el nombre exacto de tu servicio de base de datos.

### Paso 6: Ejecutar Migraciones
1. Ve a **"Deployments"** → Selecciona el deployment más reciente
2. Abre la **Terminal**
3. Ejecuta:
   ```bash
   npm run migrate
   npm run seed
   ```

### Paso 7: Obtener URL del Backend
1. Ve a **"Settings"** → **"Networking"**
2. Railway generará una URL como: `https://tu-backend.up.railway.app`
3. Copia esta URL

### Paso 8: Desplegar Frontend en Vercel
1. Instala Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Desde la carpeta `frontend`:
   ```bash
   cd frontend
   vercel
   ```

3. Sigue las instrucciones:
   - Build command: (deja vacío)
   - Output directory: (deja vacío)

4. Actualiza `frontend/js/api.js`:
   ```javascript
   const API_BASE_URL = window.location.origin.includes('localhost')
     ? 'http://localhost:3000/api'
     : 'https://tu-backend.up.railway.app/api';
   ```

5. Redeploy:
   ```bash
   vercel --prod
   ```

---

## Render

Render es otra excelente opción gratuita con buena documentación.

### Paso 1: Crear Base de Datos
1. Ve a [render.com](https://render.com)
2. Dashboard → **"New"** → **"PostgreSQL"**
3. Configura:
   - **Name**: `supervision-db`
   - **Database**: `supervision_db`
   - **User**: `supervision_user`
   - **Plan**: Free (o pago)
4. Anota las credenciales de conexión

### Paso 2: Crear Web Service (Backend)
1. Dashboard → **"New"** → **"Web Service"**
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Name**: `supervision-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: `backend`

### Paso 3: Variables de Entorno
En la sección **"Environment"**:
```
DB_HOST=<host-de-render>
DB_PORT=5432
DB_NAME=supervision_db
DB_USER=supervision_user
DB_PASSWORD=<contraseña-de-render>
JWT_SECRET=tu-secret-key-generada
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://tu-frontend.netlify.app
```

### Paso 4: Ejecutar Migraciones
1. Ve a **"Shell"** en Render
2. Ejecuta:
   ```bash
   cd backend
   npm run migrate
   npm run seed
   ```

### Paso 5: Desplegar Frontend en Netlify
1. Instala Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Desde `frontend`:
   ```bash
   cd frontend
   netlify deploy --prod
   ```

3. Actualiza `frontend/js/api.js` con la URL de Render

---

## DigitalOcean VPS

Para control total sobre el servidor.

### Paso 1: Crear Droplet
1. Ve a [digitalocean.com](https://digitalocean.com)
2. Crea un Droplet:
   - **Image**: Ubuntu 22.04
   - **Plan**: Mínimo 2GB RAM ($12/mes)
   - **Region**: Más cercana a tus usuarios
   - **Authentication**: SSH keys

### Paso 2: Configurar Servidor
Conecta vía SSH:
```bash
ssh root@tu-ip-servidor
```

Instala dependencias:
```bash
# Actualizar sistema
apt update && apt upgrade -y

# Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# PostgreSQL
apt install -y postgresql postgresql-contrib

# Nginx
apt install -y nginx

# PM2
npm install -g pm2
```

### Paso 3: Configurar PostgreSQL
```bash
sudo -u postgres psql

# En PostgreSQL:
CREATE DATABASE supervision_db;
CREATE USER supervision_user WITH PASSWORD 'tu-contraseña-segura';
GRANT ALL PRIVILEGES ON DATABASE supervision_db TO supervision_user;
\q
```

### Paso 4: Desplegar Backend
```bash
# Clonar repositorio
cd /var/www
git clone https://github.com/tu-usuario/tu-repo.git supervision
cd supervision/backend

# Instalar dependencias
npm install --production

# Crear .env
nano .env
# Pegar variables de entorno

# Migraciones
npm run migrate
npm run seed

# Iniciar con PM2
pm2 start src/server.js --name supervision-api
pm2 save
pm2 startup
```

### Paso 5: Configurar Nginx
Backend (`/etc/nginx/sites-available/supervision-api`):
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

Frontend (`/etc/nginx/sites-available/supervision-frontend`):
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

Activar sitios:
```bash
ln -s /etc/nginx/sites-available/supervision-api /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/supervision-frontend /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Paso 6: SSL con Let's Encrypt
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
certbot --nginx -d api.tu-dominio.com
```

---

## Configuración de Seguridad

### 1. Cambiar Contraseña del Admin
```sql
-- Conectarse a la BD
psql -U supervision_user -d supervision_db

-- Generar hash de nueva contraseña (en Node.js):
-- const bcrypt = require('bcrypt');
-- bcrypt.hash('nueva-contraseña', 10).then(console.log);

-- Actualizar en PostgreSQL:
UPDATE users SET password = '$2b$10$hash-generado' WHERE email = 'admin@supervision.com';
```

### 2. Firewall
```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 3. Backups Automáticos
Crear script `/usr/local/bin/backup-db.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -U supervision_user supervision_db > $BACKUP_DIR/backup_$DATE.sql
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

Programar en crontab:
```bash
chmod +x /usr/local/bin/backup-db.sh
crontab -e
# Añadir: 0 2 * * * /usr/local/bin/backup-db.sh
```

---

## Checklist Final

Antes de considerar el deployment completo:

- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada (`npm run migrate`)
- [ ] Datos iniciales cargados (`npm run seed`)
- [ ] URL del API actualizada en `frontend/js/api.js`
- [ ] SSL/HTTPS configurado
- [ ] Dominio apuntando correctamente
- [ ] Firewall configurado (VPS)
- [ ] Backups automáticos configurados (VPS)
- [ ] Contraseña del admin cambiada
- [ ] Logs monitoreados
- [ ] Pruebas de funcionalidad completadas
- [ ] CORS configurado correctamente
- [ ] JWT_SECRET seguro generado

---

## Troubleshooting

### Backend no inicia
- Verifica variables de entorno
- Revisa logs: `pm2 logs supervision-api` o en Railway/Render
- Verifica conexión a base de datos

### Frontend no conecta al backend
- Verifica CORS en backend (`FRONTEND_URL`)
- Verifica URL del API en `frontend/js/api.js`
- Revisa consola del navegador (F12)

### Errores de base de datos
- Verifica credenciales de conexión
- Asegúrate de que las migraciones se ejecutaron
- Revisa logs de PostgreSQL

### Error 401 (No autorizado)
- Verifica que el token JWT esté siendo enviado
- Revisa que `JWT_SECRET` sea el mismo en todas las instancias
- Verifica que el usuario tenga rol `admin`

---

## Soporte

Si encuentras problemas:
1. Revisa los logs del servicio
2. Verifica la documentación de la plataforma
3. Consulta los issues en GitHub
4. Revisa la sección de troubleshooting del README principal

---

**¡Listo para producción!** 🎉

