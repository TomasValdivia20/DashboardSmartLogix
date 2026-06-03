## 📋 PLAN DE ACCIÓN - DEPLOY EN VERCEL

Este documento contiene todos los pasos necesarios para desplegar el Dashboard SmartLogix en Vercel Free tier de forma exitosa.

---

## 1️⃣ PRE-REQUISITOS

✅ **Verificación antes de iniciar:**
- [ ] Proyecto actualizado en GitHub (git push)
- [ ] Node.js 18+ instalado localmente
- [ ] npm packages actualizados (`npm install`)
- [ ] Build local funciona: `npm run build` ✓
- [ ] Repositorio público o con acceso en GitHub

---

## 2️⃣ VERIFICAR BUILD LOCAL

**En tu terminal:**
```bash
# 1. Limpiar y reinstalar dependencias
rm -r node_modules package-lock.json  # O en PowerShell: Remove-Item node_modules, package-lock.json
npm install

# 2. Generar CSS con Tailwind
npm run build:css

# 3. Hacer build de producción
npm run build

# 4. Verificar que la carpeta 'dist/' se creó correctamente
# Debe contener: index.html, assets/, etc.
ls dist/  # O en PowerShell: dir dist/
```

✅ **Criterios de éxito:**
- La carpeta `dist/` existe y contiene archivos
- No hay errores en la consola
- Build completa sin warnings críticos

---

## 3️⃣ PREPARAR REPOSITORIO GIT

```bash
# 1. Agregar archivos de configuración al repositorio
git add .env.example vercel.json

# 2. Actualizar .gitignore para no subir variables de entorno
git add .gitignore

# 3. Hacer commit
git commit -m "feat: Add Vercel configuration and environment variables"

# 4. Push a GitHub
git push origin main
# (o la rama que uses)
```

---

## 4️⃣ CREAR CUENTA Y PROYECTO EN VERCEL

### Paso A: Crear/Acceder a Vercel

1. Ir a: **https://vercel.com**
2. Click en "Sign Up" si es nuevo usuario
3. Registrarse con GitHub (recomendado) o email
4. Autorizar acceso a repositorios de GitHub

### Paso B: Importar Proyecto

1. En dashboard Vercel, click: **"Add New..." → "Project"**
2. Seleccionar repositorio: `DashboardSmartLogix-Front`
3. Click: **"Import"**

---

## 5️⃣ CONFIGURAR VERCEL

### Paso A: Configuración de Build

En la pantalla de configuración del proyecto:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Development Command: vite
```

✅ Vercel debe detectar automáticamente estos valores

### Paso B: Agregar Variables de Entorno

1. En Vercel, ir a: **Settings → Environment Variables**

2. Crear cada variable (reemplazar valores con los reales):

| Variable | Valor Ejemplo | Notas |
|----------|--|--|
| `VITE_API_URL` | `https://api.tudominio.com` | URL de tu backend |
| `VITE_API_TIMEOUT` | `30000` | Timeout en ms |
| `VITE_APP_NAME` | `SmartLogix Dashboard` | Nombre de la app |
| `VITE_APP_ENVIRONMENT` | `production` | No cambiar |
| `VITE_ENABLE_ANALYTICS` | `true` | Para analytics (opcional) |
| `VITE_ENABLE_DEBUG_MODE` | `false` | No activar en prod |

3. Para cada variable:
   - Seleccionar: **Production**
   - Click: **"Add"**

⚠️ **IMPORTANTE:** Las variables `VITE_*` deben estar disponibles en el build

---

## 6️⃣ DESPLEGAR

### Opción A: Deploy Automático (Recomendado)

1. En Vercel, el deploy debería iniciar automáticamente
2. Si no, click: **"Deploy"**
3. Esperar 2-5 minutos

**Monitorear:**
- Ir a: **Deployments** en Vercel
- Ver estado: "Building..." → "Running" → "Ready ✓"
- Revisar logs si hay errores

### Opción B: Deploy desde CLI

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Autenticarse
vercel login

# 3. Deploy
vercel --prod

# 4. Seguir las instrucciones del CLI
```

---

## 7️⃣ VALIDAR DEPLOY

### Paso A: Verificar URL

Vercel proporciona:
- **Production URL:** `https://tu-proyecto.vercel.app`
- **Preview URLs:** Para cada git push

### Paso B: Pruebas Funcionales

✅ Checklist de validación:

1. **Cargar la aplicación:**
   - [ ] La página carga sin errores 404
   - [ ] Los estilos CSS se aplican correctamente
   - [ ] Las imágenes se ven bien

2. **Navegación:**
   - [ ] Click en links funciona
   - [ ] Las rutas redirigen correctamente
   - [ ] No hay errores en console (F12)

3. **Funcionalidades críticas:**
   - [ ] Login funciona
   - [ ] Crear cuenta funciona
   - [ ] LocalStorage persiste datos
   - [ ] Cambio de tema funciona
   - [ ] Las gráficas se renderean

4. **Performance:**
   - [ ] Página carga en < 3 segundos
   - [ ] No hay warnings de CORS
   - [ ] Responsive en mobile (F12 → Device Mode)

### Paso C: Revisar Logs

En Vercel:
1. **Deployments → Click en el deployment**
2. **Logs → Building & Deployment**
3. Buscar errores (en rojo)

---

## 8️⃣ PROBLEMAS COMUNES Y SOLUCIONES

### ❌ Error: "dist folder not found"

**Causa:** Build falla
**Solución:**
```bash
# Verificar build localmente
npm run build:css
npm run build
```

### ❌ Error: "Cannot find module 'react-router-dom'"

**Causa:** Falta dependencia en package.json
**Solución:** En Vercel → Settings → Environment Variables
- Asegurar que las variables están configuradas correctamente

### ❌ Estilos CSS no cargan

**Causa:** Path absoluto en CSS o variables de entorno
**Solución:** Verificar que `tailwind.css` se genera correctamente
```bash
npm run build:css
```

### ❌ Rutas no funcionan (404 en refresh)

**Causa:** Vercel no redirige a index.html para SPA
**Solución:** ✅ Ya está en `vercel.json` con rewrites

### ❌ Variables de entorno no se cargan

**Solución:**
1. Verificar que están en Settings → Environment Variables
2. Redeploy después de agregar variables:
   - **Deployments → Redeploy**
   - Select "Use existing Build Cache" = OFF
3. Esperar que se rebuilde (2-5 min)

---

## 9️⃣ OPTIMIZE VERCEL.JSON

Si quieres más control, puedes actualizar `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "regions": ["sfo1"],
  "functions": {
    "src/**/*.js": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

---

## 🔟 SIGUIENTES PASOS

### Post-Deploy:

1. **Dominio personalizado (opcional):**
   - Vercel → Settings → Domains
   - Agregar tu dominio
   - Seguir instrucciones de DNS

2. **SSL/TLS:**
   - ✅ Vercel proporciona automaticamente

3. **CI/CD:**
   - ✅ Automático en Vercel (git push = auto-deploy)

4. **Monitoreo:**
   - Vercel → Analytics
   - Ver visitantes, performance, errores

---

## 📊 VERIFICACIÓN FINAL

- [ ] Deploy completado
- [ ] Aplicación funciona en URL publica
- [ ] Todas las rutas funcionan
- [ ] CSS cargado correctamente
- [ ] Variables de entorno disponibles
- [ ] No hay errores en navegador (console)
- [ ] Mobile responsive funciona
- [ ] Performance aceptable

---

## 🆘 SOPORTE

Si hay problemas:

1. **Ver logs en Vercel:**
   - Deployments → Click deployment → Logs

2. **Rebuild:**
   - Deployments → Click deployment → Redeploy

3. **Verificar build local:**
   ```bash
   npm run build:css && npm run build
   ```

4. **Limpiar cache:**
   - Vercel → Deployments → Redeploy → "Use existing Build Cache" = OFF

---

**✅ ¡Listo! Tu aplicación estará en vivo en Vercel en poco tiempo.**
