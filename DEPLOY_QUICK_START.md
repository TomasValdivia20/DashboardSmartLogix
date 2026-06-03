## 🚀 DEPLOY RÁPIDO EN VERCEL

### Pasos Rápidos (5 minutos)

```bash
# 1. Verificar que el build funciona localmente
npm install
npm run build

# 2. Commit y push a GitHub
git add .
git commit -m "Deploy: Add Vercel configuration"
git push origin main

# 3. En https://vercel.com:
# - Importar proyecto (conectar GitHub)
# - Framework: Vite
# - Build: npm run build
# - Output: dist

# 4. Agregar variables de entorno en Vercel:
# Settings → Environment Variables
VITE_API_URL=https://api.tudominio.com
VITE_API_TIMEOUT=30000
VITE_APP_NAME=SmartLogix Dashboard
VITE_APP_ENVIRONMENT=production

# 5. Deploy
```

### ✅ Validación

- [ ] Build local: `npm run build` ✓
- [ ] Vercel detectó Vite ✓
- [ ] Variables de entorno configuradas ✓
- [ ] Deploy completado ✓
- [ ] URL publica funciona ✓

### 📁 Archivos Agregados

- `.env.example` - Variables de entorno
- `vercel.json` - Configuración de Vercel
- `vite.config.js` - Optimizado para producción
- `DEPLOY_VERCEL_PLAN.md` - Guía completa

### 🔗 Documentación Útil

- [Vercel + Vite](https://vercel.com/guides/nextjs)
- [Variables de Entorno Vite](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel CLI](https://vercel.com/docs/cli)

