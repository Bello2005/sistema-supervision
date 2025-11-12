# 🚀 INICIO RÁPIDO - 10 MINUTOS

Guía para tener el sistema completo funcionando en menos de 10 minutos.

---

## ⚡ Opción 1: Docker (MÁS RÁPIDO - 5 minutos)

### Prerequisitos
- Docker instalado
- Docker Compose instalado

### Pasos

```bash
# 1. Clonar o navegar al proyecto
cd /home/deiner-bello/Documents/Projects/mockup

# 2. Crear archivo .env para el backend
cp backend/.env.example backend/.env

# 3. Editar .env (opcional - los valores por defecto funcionan)
nano backend/.env

# 4. Levantar todo el stack
docker-compose up -d

# 5. Esperar a que los servicios estén listos (30-60 segundos)
docker-compose ps

# 6. Ejecutar migraciones
docker-compose exec backend npm run migrate

# 7. Ejecutar seeds (datos de ejemplo)
docker-compose exec backend npm run seed

# 8. ¡LISTO! Abrir en el navegador
```

**URLs:**
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000
- PostgreSQL: localhost:5432

**Credenciales de prueba:**
- Email: `admin@supervision.com`
- Password: `password123`

---

## 🛠️ Opción 2: Instalación Local (10 minutos)

### Prerequisitos
- Node.js 18+
- PostgreSQL 15+
- npm o yarn

### Paso 1: Backend

```bash
# 1. Navegar al backend
cd backend

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env
cp .env.example .env

# 4. Editar variables (especialmente DB_PASSWORD)
nano .env

# 5. Crear base de datos
createdb supervision_db

# 6. Ejecutar migraciones
npm run migrate

# 7. Cargar datos de ejemplo
npm run seed

# 8. Iniciar servidor
npm run dev
```

El servidor estará en: http://localhost:3000

### Paso 2: Frontend

```bash
# 1. En otra terminal, desde la raíz del proyecto
cd frontend

# 2. Copiar archivos HTML a carpeta frontend
# (Ya deberían estar ahí)

# 3. Servir con un servidor HTTP simple

# Opción A: Python
python -m http.server 8080

# Opción B: Node.js
npx http-server -p 8080

# Opción C: PHP
php -S localhost:8080
```

El frontend estará en: http://localhost:8080

---

## ✅ Verificación

### 1. Verificar Backend

```bash
# Test de salud
curl http://localhost:3000/health

# Debe responder:
# {"success":true,"message":"Server is running",...}

# Test de login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@supervision.com","password":"password123"}'

# Debe responder con token JWT
```

### 2. Verificar Frontend

1. Abrir: http://localhost:8080/login.html
2. Ingresar credenciales:
   - Email: `admin@supervision.com`
   - Password: `password123`
3. Debe redirigir al dashboard

---

## 🎯 Usuarios de Prueba

| Email | Password | Rol |
|-------|----------|-----|
| admin@supervision.com | password123 | Admin |
| supervisor@supervision.com | password123 | Supervisor |
| carlos.rodriguez@supervision.com | password123 | Instructor |
| viewer@supervision.com | password123 | Viewer |

---

## 📝 Comandos Útiles

### Docker

```bash
# Ver logs del backend
docker-compose logs -f backend

# Ver logs de PostgreSQL
docker-compose logs -f postgres

# Reiniciar un servicio
docker-compose restart backend

# Detener todo
docker-compose down

# Eliminar todo (incluyendo volúmenes)
docker-compose down -v
```

### Local

```bash
# Ver logs de PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-15-main.log

# Conectar a la base de datos
psql -U postgres -d supervision_db

# Ver tablas
\dt

# Ver usuarios
SELECT * FROM users;

# Salir
\q
```

---

## 🐛 Problemas Comunes

### Backend no inicia

```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps postgres

# O en local
sudo systemctl status postgresql

# Ver logs del backend
docker-compose logs backend
```

### Frontend no carga datos

1. Verificar que el backend esté corriendo en http://localhost:3000
2. Abrir consola del navegador (F12) para ver errores
3. Verificar que `frontend/js/api.js` tenga la URL correcta

### Error de CORS

Asegurarse de que en `backend/.env`:
```
CORS_ORIGIN=http://localhost:8080,http://127.0.0.1:8080
```

### Puerto ocupado

```bash
# Cambiar puerto del backend en .env
PORT=3001

# O matar el proceso
lsof -i :3000
kill -9 <PID>
```

---

## 🚀 Próximos Pasos

1. **Explorar el Dashboard**: http://localhost:8080/index.html
2. **Crear un Evento**: http://localhost:8080/eventos-capacitacion.html
3. **Subir Evidencias**: http://localhost:8080/registro-evidencias.html
4. **Ver Documentación de API**: `README-BACKEND.md`
5. **Personalizar**: Editar colores, textos, logos, etc.

---

## 📚 Documentación Completa

- [README Principal](README.md)
- [Backend API](README-BACKEND.md)
- [Frontend](README.md)
- [Despliegue](README-BACKEND.md#despliegue)

---

## 💡 Tips

1. **Para desarrollo**: Usa `npm run dev` para hot reload
2. **Para producción**: Usa Docker Compose
3. **Para deploy en la nube**: Ver README-BACKEND.md sección Railway
4. **Para personalizar**: Edita los archivos HTML y CSS

---

¡Listo! En menos de 10 minutos deberías tener el sistema completo funcionando. 🎉
