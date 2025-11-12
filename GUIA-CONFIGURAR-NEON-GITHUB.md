# 🔧 Configurar Neon con GitHub Actions

Para que el workflow de GitHub Actions funcione correctamente, necesitas configurar los secrets y variables en tu repositorio de GitHub.

---

## 📋 Paso 1: Obtener API Key de Neon

1. Ve a [console.neon.tech](https://console.neon.tech)
2. Inicia sesión en tu cuenta
3. Ve a **"Settings"** → **"Developer Settings"** (o busca "API Keys")
4. Click **"Create API Key"**
5. Dale un nombre (ej: `github-actions`)
6. **Copia la API Key** (solo se muestra una vez, guárdala bien)

---

## 📋 Paso 2: Obtener Project ID de Neon

1. En Neon Console, selecciona tu proyecto
2. Ve a **"Settings"** → **"General"**
3. Busca **"Project ID"**
4. **Copia el Project ID** (es un string como `ep-xxxxx-xxxxx`)

---

## 📋 Paso 3: Configurar Secrets en GitHub

1. Ve a tu repositorio en GitHub: `https://github.com/Bello2005/sistema-supervision`
2. Click en **"Settings"** (arriba del repositorio)
3. En el menú lateral, click **"Secrets and variables"** → **"Actions"**
4. Click **"New repository secret"**
5. Crea el secret:
   - **Name**: `NEON_API_KEY`
   - **Secret**: Pega la API Key que copiaste de Neon
6. Click **"Add secret"**

---

## 📋 Paso 4: Configurar Variables en GitHub

1. En la misma página de **"Secrets and variables"** → **"Actions"**
2. Click en la pestaña **"Variables"**
3. Click **"New repository variable"**
4. Crea la variable:
   - **Name**: `NEON_PROJECT_ID`
   - **Value**: Pega el Project ID que copiaste de Neon
5. Click **"Add variable"**

---

## 📋 Paso 5: Verificar Configuración

1. Ve a la pestaña **"Actions"** en tu repositorio de GitHub
2. El workflow debería estar listo para ejecutarse
3. Cuando crees un Pull Request, el workflow:
   - Creará automáticamente un branch de base de datos en Neon
   - Ejecutará las migraciones en ese branch
   - Eliminará el branch cuando cierres el PR

---

## ✅ ¿Qué hace el Workflow?

El workflow de GitHub Actions:

1. **Cuando abres un Pull Request:**
   - Crea un nuevo branch de base de datos en Neon
   - Ejecuta las migraciones en ese branch
   - El branch expira en 14 días automáticamente

2. **Cuando actualizas el Pull Request:**
   - Sincroniza el branch de base de datos

3. **Cuando cierras el Pull Request:**
   - Elimina automáticamente el branch de base de datos

Esto te permite probar cambios en la base de datos sin afectar la base de datos principal.

---

## 🔧 Troubleshooting

### El workflow no se ejecuta
- Verifica que los secrets y variables estén configurados correctamente
- Asegúrate de que el archivo esté en `.github/workflows/neon_workflow.yml`
- Verifica que el workflow esté en la rama `main` o `master`

### Error: "NEON_API_KEY not found"
- Verifica que el secret esté creado en GitHub
- Asegúrate de que el nombre sea exactamente `NEON_API_KEY`

### Error: "NEON_PROJECT_ID not found"
- Verifica que la variable esté creada en GitHub
- Asegúrate de que el nombre sea exactamente `NEON_PROJECT_ID`

### Error al crear branch
- Verifica que la API Key tenga permisos suficientes
- Asegúrate de que el Project ID sea correcto
- Revisa los logs del workflow en GitHub Actions

---

## 📝 Notas

- Los branches de base de datos en Neon son temporales (14 días)
- Cada PR tiene su propio branch de base de datos
- Los branches se eliminan automáticamente cuando cierras el PR
- Puedes ver los branches en Neon Console → Branches

---

¡Listo! Tu workflow de GitHub Actions está configurado y funcionando. 🎉

