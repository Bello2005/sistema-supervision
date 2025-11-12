# 📤 Instrucciones para Hacer Push a GitHub

## Paso 1: Crear Repositorio en GitHub

1. Ve a [github.com](https://github.com) e inicia sesión
2. Click en el botón **"+"** (arriba derecha) → **"New repository"**
3. Configura:
   - **Repository name**: `sistema-supervision` (o el nombre que prefieras)
   - **Description**: `Sistema de Supervisión - RES N° 215 DE 2025`
   - **Visibility**: Público o Privado (tu elección)
   - **NO marques** "Add a README file" (ya tenemos uno)
   - **NO marques** "Add .gitignore" (ya tenemos uno)
4. Click **"Create repository"**

## Paso 2: Conectar y Hacer Push

Ejecuta estos comandos en tu terminal (desde la carpeta del proyecto):

```bash
# Añadir el repositorio remoto (reemplaza TU-USUARIO y TU-REPO)
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git

# Cambiar a branch main (si es necesario)
git branch -M main

# Hacer push
git push -u origin main
```

**Si GitHub te pide autenticación:**
- Usa un **Personal Access Token** en lugar de tu contraseña
- Cómo crear uno: GitHub → Settings → Developer settings → Personal access tokens → Generate new token
- Selecciona permisos: `repo` (todos los permisos de repositorio)

## Paso 3: Verificar

Ve a tu repositorio en GitHub y verifica que todos los archivos estén ahí.

---

## 🚀 Después del Push: Deploy en Render

Una vez que el código esté en GitHub, sigue la guía en **GUIA-RENDER.md** para desplegar en Render.

**Resumen rápido:**
1. Ve a [render.com](https://render.com)
2. Crea cuenta con GitHub
3. Crea PostgreSQL database
4. Crea Web Service (backend)
5. Crea Static Site (frontend)
6. Configura variables de entorno
7. Ejecuta migraciones
8. ¡Listo!

---

## 📝 Comandos Útiles

```bash
# Ver estado
git status

# Ver commits
git log --oneline

# Ver remotes
git remote -v

# Hacer cambios y push
git add .
git commit -m "Descripción de cambios"
git push

# Ver branches
git branch
```

