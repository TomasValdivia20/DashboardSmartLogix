# AGENTS.md — Dashboard SmartLogix

## Proyecto

SPA en **Vite 8 + React 19 + react-router-dom 7**. Desplegado en **Vercel**.

- **Sin TypeScript** (solo `.jsx`/`.js`)
- **Estilos:** Tailwind CSS v1 (PostCSS), NO CSS-in-JS
- **Prettier:** singleQuote, sin semicolon (`.prettierrc`)
- **Branding:** Windmill template con colores morados sobrescritos a naranja SmartLogix (`#ff7a00`). Colores personalizados `smart.{naranja,azul,blanco}` en `tailwind.config.js`
- **Modo oscuro:** clase `dark` en `<html>`, persistido en `localStorage.theme`. Lo maneja `ThemeToggle.jsx`. Transiciones y overrides globales en `index.html` (Tailwind v1 no soporta `darkMode: 'class'`)

## Comandos

| Comando | Función |
|---|---|
| `npm run dev` | Dev server (puerto 3000) |
| `npm run build` | Build: css → `dist/` |
| `npm run build:css` | Solo regenerar Tailwind CSS con PostCSS |
| `npm run test` | Vitest watch mode |
| `npm run test:run` | Vitest run (CI) |
| `vercel deploy --prod` | Deploy producción (requiere confirmación) |

## Tests

- **Vitest** con `jsdom`, `globals: true`. Tests en `test/**/*.jsx` y `src/**/*.test.jsx`
- No hay config de lint ni typecheck (sin TS)
- `npm run build` antes de commitear

## Backend: ms-envios (hermano del frontend)

`ms-envios/` al mismo nivel. Django 6 + DRF. Swagger en `http://localhost:8000/api/docs/`.

```powershell
cd ..\ms-envios
.venv\Scripts\python.exe manage.py runserver 8000
```

Endpoints clave: `/vehiculos/`, `/repartidores/`, `/rutas/`, `/rutas/{id}/calcular/`, `/envios/`, `/calcular-costos/`. Ver schema completo en Swagger.

### Conexión frontend-backend

- **axios** en `src/services/api.js` — baseURL desde `VITE_API_URL`, JWT desde `localStorage.access_token`, redirect a `/login` en 401
- Servicios: `enviosService.js`, `vehiculosService.js` (API real)
- ⚠️ `pedidosService.js` usa datos mock hardcodeados (NO llama al backend real)

## CSS build quirk

- `main.jsx` importa `./assets/css/tailwind.output.css` → resuelve a `src/assets/css/tailwind.output.css`
- `build:css` escribe a `public/assets/css/tailwind.output.css` (ruta distinta)
- Hay dos copias. Si regeneras CSS, sincroniza manualmente o actualiza el script. La importada está en `src/assets/css/`.

## Estructura relevante

```
src/
├── services/        ← api.js (axios), enviosService, vehiculosService, pedidosService
├── components/
│   ├── Layout.jsx, Sidebar.jsx, Navbar.jsx
│   ├── ThemeToggle.jsx, LogoutButton.jsx
│   ├── MapaLogistico.jsx    (react-map-gl)
│   └── SalesChart.jsx, TrafficChart.jsx
├── pages/
│   ├── index.jsx    (Dashboard)
│   ├── Envios.jsx   (envíos + mapa)
│   ├── Pedidos.jsx, Inventario.jsx
│   ├── Login.jsx, CreateAccount.jsx, ForgotPassword.jsx
│   └── Profile.jsx, EditarPerfil.jsx, CambiarContrasena.jsx
├── main.jsx
└── assets/css/      (tailwind.css fuente + tailwind.output.css importado)
```

**Layout**: cada página auth importa `Layout` individualmente (no envuelve rutas globalmente en App.jsx).

## Variables de entorno

Variables `VITE_*` expuestas al cliente. Ver `.env` para defaults locales.

- `VITE_API_URL` — backend Django (default `http://localhost:8000/api/envios/`)
- `VITE_API_TIMEOUT` — default 30000
- `VITE_MAPBOX_TOKEN` — necesario para `react-map-gl` + `mapbox-gl`
- `VITE_ENABLE_ANALYTICS`, `VITE_ENABLE_DEBUG_MODE`

## Reglas clave

- ❌ NO commitear `.env*`, `dist/`, `node_modules/`, `.vercel/`, `planesmd/`
- ❌ NO instalar paquetes npm sin confirmar
- ❌ NO hacer `vercel --prod` sin confirmación explícita
- ✅ SÍ `npm run build` antes de commitear
- ✅ SÍ rama `feat/*` para cambios grandes → PR → `main`
