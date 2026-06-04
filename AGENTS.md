# AGENTS.md — Instrucciones para el agente (Dashboard SmartLogix)

## Proyecto

Dashboard SmartLogix — SPA en **Vite 8 + React 19 + react-router-dom 7**.
Desplegado en **Vercel** (framework auto-detectado: Vite).

- **Repo:** `github.com/TomasValdivia20/DashboardSmartLogix`
- **Rama principal:** `main`
- **Ruta local:** `E:\SmartLogixRepositorio\DashboardSmartLogix-Front`
- **URL producción:** `https://dashboard-smart-logix-raddpxb2j-tomasvaldivia20s-projects.vercel.app`

## Comandos del proyecto

| Comando | Función |
|---|---|
| `npm install` | Instalar dependencias |
| `npm run dev` | Servidor de desarrollo (puerto 3000) |
| `npm run build:css` | Regenerar CSS de Tailwind |
| `npm run build` | Build de producción → `dist/` |
| `npm run tailwind` | Watch mode para Tailwind |

## Comandos de Vercel CLI (instalado globalmente v54.9.0)

| Comando | Función |
|---|---|
| `vercel whoami` | Ver cuenta autenticada |
| `vercel link` | Vincular local con Vercel (ya hecho) |
| `vercel env ls` | Listar env vars del proyecto |
| `vercel env pull <archivo>` | Descargar env vars |
| `vercel dev` | Replicar entorno Vercel localmente |
| `vercel deploy` | Deploy preview |
| `vercel deploy --prod` | Deploy producción |
| `vercel ls` | Listar deployments |
| `vercel logs` | Ver logs en tiempo real |
| `vercel integration add <name>` | Instalar integración del Marketplace |

> ⚠️ Si `vercel` no reconoce la sesión, exportar el token:
> `$env:VERCEL_TOKEN = (Get-Content "$HOME\.vercel\auth.json" -Raw | ConvertFrom-Json).token`

## Proyecto en Vercel

- **Project ID:** `prj_USY2NdQ1vSzJgkcqrthZayNNXGYc`
- **Org ID:** `team_thYTED56avA4Qs5yuv77EHv7`
- **Team:** `tomasvaldivia20s-projects`
- **Variables de entorno** (Production + Preview):
  - `VITE_API_TIMEOUT`, `VITE_APP_NAME`, `VITE_APP_ENVIRONMENT`
  - `VITE_ENABLE_ANALYTICS`, `VITE_ENABLE_DEBUG_MODE`
- ⚠️ `VITE_API_URL` está en `vercel.json` como `@vite_api_url` (verificar en dashboard)

## MCP server de Vercel (disponible)

El agente tiene acceso al **MCP server oficial de Vercel** (`https://mcp.vercel.com`) configurado en `~/.config/opencode/opencode.jsonc`.

Usar para:
- Listar/gestionar proyectos
- Gestionar deployments (promover, rollback)
- Gestionar env vars
- Ver logs en tiempo real
- Buscar en la documentación oficial de Vercel

Si opencode no responde a las tools del MCP, autorizar en el navegador cuando lo pida.

## Skills instaladas

- **`vercel-cli`** (en `~\.agents\skills\vercel-cli`) — conocimiento profundo de la CLI de Vercel. Se activa automáticamente cuando el agente trabaja con Vercel.

## Estructura del proyecto

```
DashboardSmartLogix-Front/
├── api/                (opcional, para Vercel Functions — no existe)
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/          (Login, Inventario, Dashboard, etc.)
│   └── main.jsx
├── App.jsx             (Router principal)
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json         (config Vercel: rewrites, headers, env)
├── vite.config.js
├── .env                (NO commitear)
└── .gitignore          (protege .env*, dist/, node_modules/, .vercel/, planesmd)
```

## Convenciones del código

- **React 19** con hooks
- **Estilos:** Tailwind CSS (NO styled-components, NO CSS-in-JS)
- **Router:** `react-router-dom` v7
- **Sin TypeScript** (solo `.jsx` y `.js`)
- **Comentarios en español**
- **Variables de entorno** siempre con prefijo `VITE_` (expuestas al cliente)

## Reglas de seguridad

- ❌ **NO** commitear `.env*`, `dist/`, `node_modules/`, `.vercel/`, `planesmd/`
- ❌ **NO** instalar paquetes npm sin confirmar con el usuario
- ❌ **NO** hacer deploy a producción (`vercel --prod`) sin confirmación explícita
- ❌ **NO** modificar `vercel.json` (rewrites SPA) sin entender el impacto
- ✅ **SÍ** preferir rama `feat/*` para cambios grandes → PR → merge a `main`
- ✅ **SÍ** correr `npm run build` antes de commitear para verificar que compila
- ✅ **SÍ** mantener `package.json` con versiones coherentes (sin `^` innecesarios)

## Workflows comunes

### Desplegar cambios
```bash
git add .
git commit -m "feat: descripción del cambio"
git push origin main
# Vercel hace auto-deploy del commit
```

### Crear preview deploy sin afectar producción
```bash
vercel deploy --yes
# Devuelve URL temporal tipo *.vercel.app
```

### Actualizar env vars
1. Cambiar en Vercel Dashboard (Settings → Environment Variables)
2. Redesplegar para que tomen efecto

### Diagnosticar deploy fallido
```bash
vercel logs <deployment-url>
# O en el dashboard: Deployments → click → Logs
```
