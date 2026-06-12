# AGENTS.md — Dashboard SmartLogix

## Proyecto

SPA en **Vite 8 + React 19 + react-router-dom 7**. Desplegado en **Vercel**.

- **Repo:** `github.com/TomasValdivia20/DashboardSmartLogix` (rama `main`)
- **URL prod:** `https://dashboard-smart-logix-raddpxb2j-tomasvaldivia20s-projects.vercel.app`
- **Sin TypeScript** (solo `.jsx`/`.js`)
- **Estilos:** Tailwind CSS v1 (NO CSS-in-JS)

## Comandos

| Comando | Función |
|---|---|
| `npm run dev` | Dev server (puerto 3000) |
| `npm run build` | Build producción → `dist/` |
| `npm run build:css` | Regenerar Tailwind CSS |
| `vercel deploy --prod` | Deploy producción (requiere confirmación) |

## Backend: ms-envios (hermano del frontend)

`ms-envios/` está al mismo nivel que `DashboardSmartLogix-Front/`. Es un **Django 6 + DRF** con PostgreSQL en prod, SQLite en dev.

```powershell
# Iniciar backend
cd ..\ms-envios
.venv\Scripts\python.exe manage.py runserver 8000
```

### Endpoints disponibles

| Método | Endpoint | Descripción |
|---|---|---|
| GET/POST | `/api/envios/vehiculos/` | CRUD vehículos |
| GET/POST | `/api/envios/repartidores/` | CRUD repartidores |
| GET/POST | `/api/envios/rutas/` | CRUD rutas |
| POST | `/api/envios/rutas/{id}/calcular/` | Optimizar ruta (OpenRouteService) |
| GET/POST | `/api/envios/envios/` | CRUD envíos |
| POST | `/api/envios/calcular-costos/` | Calcular desglose de costos |

### POST /api/envios/calcular-costos/

```json
{
  "vehiculo_id": "uuid-del-vehiculo",
  "valor_base_producto": "45000.00",
  "requiere_instalacion": false,
  "distancia_km": "12.50"
}
```

Retorna: `{ vehiculo_id, vehiculo_tipo, valor_base, iva, costo_transaccion, costo_logistica, costo_instalacion, tiempo_estimado_min, total }`

### Modelo Vehiculo (tipos)

`tipo_vehiculo` choices: `moto`, `furgon_ligero`, `furgon_mediano`, `camion_urbano`. Cada uno tiene `tarifa_base`, `costo_por_km`, `costo_por_hora`.

### Conexión frontend-backend

- Usar **axios** (ya instalado en la Fase 2)
- Servicios en `src/services/api.js` (instancia axios) y `src/services/enviosService.js` etc.
- Auth vía JWT en header `Authorization: Bearer <token>` (token desde `localStorage`)
- `VITE_API_URL` apunta a `http://localhost:8000/api/envios/`

## Swagger / Docs

El backend tiene Swagger UI en `http://localhost:8000/api/docs/` y schema en `http://localhost:8000/api/schema/`.

## Estructura relevante

```
src/
├── services/        ← capa API (axios), creada en Fase 2
├── components/
│   ├── Layout.jsx, Sidebar.jsx, Navbar.jsx
│   ├── MapaLogistico.jsx    (react-map-gl)
│   └── SalesChart.jsx, TrafficChart.jsx
├── pages/
│   ├── index.jsx    (Dashboard)
│   ├── Envios.jsx   (página principal de envíos + mapa)
│   ├── Pedidos.jsx, Inventario.jsx
│   └── Login.jsx, CreateAccount.jsx, ForgotPassword.jsx
├── main.jsx
└── assets/
```

## Reglas clave

- ❌ NO commitear `.env*`, `dist/`, `node_modules/`, `.vercel/`, `planesmd/`
- ❌ NO instalar paquetes npm sin confirmar
- ❌ NO hacer `vercel --prod` sin confirmación explícita
- ✅ SÍ correr `npm run build` antes de commitear
- ✅ SÍ rama `feat/*` para cambios grandes → PR → `main`
- ✅ SÍ variables `VITE_*` para cosas expuestas al cliente
