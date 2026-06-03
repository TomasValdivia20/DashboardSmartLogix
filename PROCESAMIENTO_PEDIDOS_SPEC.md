# Especificación Backend — Procesamiento de Pedidos (SmartLogix)

> **Contexto del módulo:** Recepción, validación y gestión automatizada de pedidos. Control de estados y trazabilidad de cada transacción.
> Este documento describe todos los campos, entidades, lógica de negocio, endpoints sugeridos y estructura de datos que el backend debe cubrir para alimentar correctamente la vista `ProcesamientoPedidos.html`.

---

## 1. Modelo de Datos — Pedido

Cada pedido expone los siguientes campos. El backend debe persistir y devolver exactamente esta estructura (o equivalente en JSON):

```json
{
  "id": "PED-2024-001",
  "producto": "Camiseta Básica Blanca",
  "sku": "SKU-001",
  "tipoCarga": "Carga General",
  "cantidad": 50,
  "bodega": "Bodega Central",
  "horaRetiro": "09:00 hrs",
  "horaDespacho": "10:30 hrs",
  "direccionEntrega": "Av. Providencia 1234, Providencia, Santiago",
  "estado": "Aprobado",
  "destinatario": {
    "nombre": "Carlos Andrés Pérez González",
    "rut": "12.345.678-9",
    "telefono": "+56 9 8765 4321",
    "correo": "carlos.perez@empresa.cl",
    "direccion": "Av. Providencia 1234, Depto 502, Providencia, Santiago"
  }
}
```

### 1.1 Descripción de cada campo

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | `string` | ✅ | Identificador único del pedido. Formato: `PED-YYYY-NNN` (año + número secuencial de 3 dígitos). Ej: `PED-2024-001`. |
| `producto` | `string` | ✅ | Nombre descriptivo del producto a despachar. |
| `sku` | `string` | ✅ | Código SKU del producto en inventario. Ej: `SKU-001`. |
| `tipoCarga` | `enum` | ✅ | Clasificación del tipo de carga. Ver valores permitidos en sección 2. |
| `cantidad` | `integer` | ✅ | Número de unidades a despachar. Entero positivo mayor a 0. |
| `bodega` | `string` | ✅ | Nombre de la bodega de origen desde donde se retira la carga. Ej: `"Bodega Central"`, `"Sucursal Norte"`. |
| `horaRetiro` | `string` | ✅ | Hora programada de retiro en bodega. Formato: `"HH:MM hrs"`. Ej: `"09:00 hrs"`. |
| `horaDespacho` | `string` | ✅ | Hora programada de salida/despacho hacia el destinatario. Formato: `"HH:MM hrs"`. Ej: `"10:30 hrs"`. |
| `direccionEntrega` | `string` | ✅ | Dirección completa de entrega al destinatario final. Debe incluir calle, número, comuna y ciudad. |
| `estado` | `enum` | ✅ | Estado actual del pedido en el flujo logístico. Ver valores permitidos en sección 3. |
| `destinatario` | `object` | ✅ | Objeto con los datos completos de la persona o empresa que recibe el pedido. Ver sección 1.2. |

### 1.2 Sub-objeto `destinatario`

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `nombre` | `string` | ✅ | Nombre completo del destinatario (persona natural o razón social). |
| `rut` | `string` | ✅ | RUT chileno con formato `XX.XXX.XXX-X`. Requerido para la guía de despacho. |
| `telefono` | `string` | ✅ | Número de teléfono de contacto. Formato sugerido: `"+56 9 XXXX XXXX"`. |
| `correo` | `string` | ✅ | Dirección de correo electrónico del destinatario. |
| `direccion` | `string` | ✅ | Dirección completa del destinatario (puede diferir de `direccionEntrega` si la entrega es en otra ubicación). Incluye número de depto, piso u oficina cuando aplique. |

---

## 2. Tipos de Carga (`tipoCarga`)

El campo `tipoCarga` acepta exclusivamente los siguientes valores. Cada valor tiene un color de badge asociado en el frontend:

| Valor | Color badge (frontend) | Descripción |
|---|---|---|
| `Frágil` | Rosa / Pink | Productos que requieren manejo especial por riesgo de rotura o daño. |
| `Duro/Resistente` | Gris / Gray | Productos resistentes que no requieren cuidado especial. |
| `Carga Peligrosa` | Rojo / Red | Materiales o sustancias que representan riesgo (inflamables, químicos, etc.). |
| `Carga Perecedera` | Naranja / Orange | Productos con fecha de vencimiento corta o sensibles a temperatura. |
| `Carga General` | Azul / Blue | Productos estándar sin clasificación especial. |
| `Carga Voluminosa` | Morado / Purple | Productos de gran tamaño o volumen que requieren vehículo especial. |

---

## 3. Estados del Pedido (`estado`)

El campo `estado` controla el flujo logístico del pedido y acepta exclusivamente los siguientes valores:

| Valor | Color badge (frontend) | Descripción del estado |
|---|---|---|
| `Pendiente` | Amarillo / Yellow | El pedido fue recibido pero aún no ha sido validado ni aprobado. |
| `Aprobado` | Azul / Blue | El pedido fue validado y aprobado; está listo para despacho. |
| `Enviado` | Índigo / Indigo | El pedido salió de bodega y se encuentra en tránsito hacia el destinatario. |
| `Entregado` | Verde / Green | El pedido fue recibido y confirmado por el destinatario. |

### 3.1 Transiciones de estado válidas

```
Pendiente → Aprobado → Enviado → Entregado
```

No se debe permitir retroceder estados ni saltar pasos intermedios.

---

## 4. Indicadores (KPI Cards)

El frontend muestra 4 tarjetas de resumen en tiempo real. El backend debe ser capaz de proveer los conteos agrupados por estado, o bien el frontend los calcula desde la lista completa de pedidos.

| Indicador | Lógica | Color icono |
|---|---|---|
| **Pendientes** | `COUNT` de pedidos con `estado === "Pendiente"` | Amarillo |
| **Aprobados** | `COUNT` de pedidos con `estado === "Aprobado"` | Azul |
| **Enviados** | `COUNT` de pedidos con `estado === "Enviado"` | Índigo |
| **Entregados** | `COUNT` de pedidos con `estado === "Entregado"` | Verde |

> **Endpoint sugerido:** `GET /pedidos/indicadores` → `{ pendientes: N, aprobados: N, enviados: N, entregados: N }`
> Alternativamente, el frontend puede calcularlos desde `GET /pedidos`.

---

## 5. Filtros

La vista soporta tres filtros combinables simultáneamente:

### 5.1 Filtro por Estado
- **Opciones:** `Todos`, `Pendiente`, `Aprobado`, `Enviado`, `Entregado`
- **Comportamiento:** `Todos` devuelve todos los pedidos sin importar estado.
- **Parámetro query sugerido:** `?estado=Pendiente`

### 5.2 Búsqueda de texto libre
- **Campos buscados:**
  - `id` (N° de pedido)
  - `producto` (nombre del producto)
  - `sku` (código SKU)
  - `destinatario.nombre` (nombre del destinatario)
- **Tipo:** búsqueda insensible a mayúsculas/minúsculas (`case-insensitive`, `contains`).
- **Parámetro query sugerido:** `?q=PED-2024`

### 5.3 Filtro por Tipo de Carga
- **Opciones:** `Todos`, `Frágil`, `Duro/Resistente`, `Carga Peligrosa`, `Carga Perecedera`, `Carga General`, `Carga Voluminosa`
- **Parámetro query sugerido:** `?tipoCarga=Frágil`

### 5.4 Combinación de filtros
Los tres filtros se aplican con operador `AND`. Ejemplo:
```
GET /pedidos?estado=Aprobado&tipoCarga=Frágil&q=carlos
```

---

## 6. Tabla de Pedidos — Columnas

La tabla principal muestra las siguientes columnas en este orden:

| # | Columna | Campo(s) fuente | Notas |
|---|---|---|---|
| 1 | **N° Pedido** | `pedido.id` | Mostrado en morado/purple. Actúa como identificador visual. |
| 2 | **Producto** | `pedido.producto` + `pedido.sku` | Nombre en negrita, SKU en texto secundario más pequeño. |
| 3 | **Tipo Carga** | `pedido.tipoCarga` | Badge de color según tabla de sección 2. |
| 4 | **Bodega Origen** | `pedido.bodega` | Texto plano. |
| 5 | **Hora Retiro** | `pedido.horaRetiro` | Texto plano, formato `"HH:MM hrs"`. |
| 6 | **Destinatario** | `pedido.destinatario.nombre` + `pedido.destinatario.telefono` | Nombre en negrita, teléfono en texto secundario. |
| 7 | **Dirección Entrega** | `pedido.direccionEntrega` | Texto truncado si es muy largo (`truncate`). |
| 8 | **Estado** | `pedido.estado` | Badge de color según tabla de sección 3. Centrado. |
| 9 | **Acciones** | — | Dos botones: Ver Detalle (ojo) + Descargar Guía de Despacho (descarga). |

### 6.1 Comportamiento de fila
- Clic sobre cualquier celda de la fila → abre el **Modal Detalle Pedido**.
- El clic en la columna Acciones no propaga el evento a la fila (stopPropagation).

### 6.2 Estado vacío
Si no hay pedidos que coincidan con los filtros, mostrar mensaje: *"No se encontraron pedidos con los filtros aplicados."* en el colspan completo (9 columnas).

### 6.3 Paginación (footer de tabla)
Muestra contador: `"Mostrando X de Y pedidos"` donde X = pedidos filtrados, Y = total.
El frontend actual no implementa paginación por páginas, pero el backend debe estar preparado para soportarla con parámetros `?page=1&limit=10`.

---

## 7. Modal — Detalle de Pedido

Se abre al hacer clic en una fila o en el botón "Ver detalle". Muestra toda la información del pedido seleccionado.

### 7.1 Header del modal
| Elemento | Campo fuente |
|---|---|
| Título | `"Pedido " + pedido.id` |
| Badge de estado | `pedido.estado` (con colores de sección 3) |
| Botón cerrar (X) | Cierra el modal |

### 7.2 Sección "Información del Pedido"

| Campo mostrado | Campo fuente | Ocupa |
|---|---|---|
| Producto | `pedido.producto` (principal) + `pedido.sku` (secundario) | Media fila |
| Tipo de Carga | `pedido.tipoCarga` (badge coloreado) | Media fila |
| Cantidad | `pedido.cantidad + " unidades"` | Media fila |
| Bodega de Origen | `pedido.bodega` | Media fila |
| Hora de Retiro | `pedido.horaRetiro` | Media fila |
| Hora de Despacho | `pedido.horaDespacho` | Media fila |
| Dirección de Entrega | `pedido.direccionEntrega` | **Fila completa** |

### 7.3 Sección "Datos del Destinatario"

| Campo mostrado | Campo fuente | Ocupa |
|---|---|---|
| Nombre Completo | `pedido.destinatario.nombre` | Media fila |
| RUT | `pedido.destinatario.rut` | Media fila |
| Teléfono | `pedido.destinatario.telefono` | Media fila |
| Correo Electrónico | `pedido.destinatario.correo` | Media fila |
| Dirección del Destinatario | `pedido.destinatario.direccion` | **Fila completa** |

### 7.4 Footer del modal
| Elemento | Acción |
|---|---|
| Botón "Cerrar" | Cierra el modal sin acción adicional |
| Botón "Descargar Guía de Despacho" | Llama a la función de impresión/generación de ticket (sección 8) |

---

## 8. Guía de Despacho — Ticket de Impresión

La guía de despacho es un documento HTML generado en el cliente (nueva ventana del navegador) con `window.print()` ejecutado automáticamente al cargar. Es el ticket oficial de entrega.

> **Nota microservicios:** Se recomienda que el backend exponga un endpoint que genere este PDF/HTML con los datos del pedido, en vez de generarlo solo en el cliente, para mayor trazabilidad y para poder reenviarlo por correo.

### 8.1 Estructura del documento imprimible

#### Header
| Elemento | Valor/Campo |
|---|---|
| Título del documento | `"SmartLogix — Guía de Despacho"` |
| Subtítulo | `"Sistema de Gestión Logística"` |
| N° de Guía | `pedido.id` |
| Fecha de emisión | Fecha actual formateada: `DD/MM/YYYY` |
| Hora de emisión | Hora actual: `HH:MM` |
| Badge de estado | `pedido.estado` (con sus colores correspondientes) |

#### Sección "Información del Pedido"
| Campo | Fuente |
|---|---|
| Producto | `pedido.producto` |
| SKU | `pedido.sku` |
| Tipo de Carga | `pedido.tipoCarga` (badge morado) |
| Cantidad | `pedido.cantidad + " unidades"` |
| Bodega de Origen | `pedido.bodega` |
| Hora de Retiro | `pedido.horaRetiro` |
| Hora de Despacho | `pedido.horaDespacho` |
| Dirección de Entrega | `pedido.direccionEntrega` (fila completa) |

#### Sección "Datos del Destinatario"
| Campo | Fuente |
|---|---|
| Nombre | `pedido.destinatario.nombre` |
| RUT | `pedido.destinatario.rut` |
| Teléfono | `pedido.destinatario.telefono` |
| Correo | `pedido.destinatario.correo` |
| Dirección | `pedido.destinatario.direccion` (fila completa) |

#### Sección de Firmas
Dos espacios de firma al pie del documento:
1. **Firma Responsable Despacho** — firmado por quien entrega desde bodega.
2. **Firma Receptor** — firmado por `pedido.destinatario.nombre`, confirmando recepción conforme.

#### Footer del documento
| Elemento | Valor |
|---|---|
| Copyright | `"SmartLogix © YYYY"` (año dinámico) |
| Referencia | `"Guía N° " + pedido.id + " — " + fecha` |

### 8.2 Colores de badge de estado en el documento imprimible
| Estado | Fondo | Texto |
|---|---|---|
| `Aprobado` | `#dbeafe` | `#1d4ed8` |
| `Pendiente` | `#fef3c7` | `#92400e` |
| `Enviado` | `#e0e7ff` | `#3730a3` |
| `Entregado` | `#d1fae5` | `#065f46` |

---

## 9. Endpoints REST Sugeridos

El backend (microservicio de pedidos) debe exponer al menos los siguientes endpoints:

```
GET    /pedidos                          → Lista todos los pedidos (con filtros opcionales por query params)
GET    /pedidos/:id                      → Obtiene un pedido específico por ID
POST   /pedidos                          → Crea un nuevo pedido
PUT    /pedidos/:id                      → Actualiza todos los campos de un pedido
PATCH  /pedidos/:id/estado               → Actualiza únicamente el estado del pedido
DELETE /pedidos/:id                      → Elimina un pedido (solo si está en estado Pendiente)
GET    /pedidos/indicadores              → Devuelve conteo agrupado por estado
GET    /pedidos/:id/guia-despacho        → (Opcional) Genera y devuelve la guía de despacho como PDF/HTML
```

### 9.1 Query params para `GET /pedidos`

| Parámetro | Tipo | Descripción |
|---|---|---|
| `estado` | `string` | Filtra por estado exacto. Valores: `Pendiente`, `Aprobado`, `Enviado`, `Entregado`. |
| `tipoCarga` | `string` | Filtra por tipo de carga exacto. Ver sección 2. |
| `q` | `string` | Búsqueda de texto en: `id`, `producto`, `sku`, `destinatario.nombre`. Case-insensitive, contains. |
| `page` | `integer` | Página actual para paginación. Default: `1`. |
| `limit` | `integer` | Pedidos por página. Default: `10`. |

### 9.2 Respuesta estándar de lista

```json
{
  "data": [ ...arreglo de pedidos... ],
  "total": 42,
  "page": 1,
  "limit": 10
}
```

### 9.3 Respuesta de indicadores `GET /pedidos/indicadores`

```json
{
  "pendientes": 3,
  "aprobados": 4,
  "enviados": 2,
  "entregados": 1
}
```

---

## 10. Validaciones Requeridas

### Al crear o actualizar un pedido (`POST` / `PUT`):

| Campo | Validación |
|---|---|
| `id` | Único en base de datos. Formato `PED-YYYY-NNN`. Generado automáticamente por el backend. |
| `producto` | Requerido, string no vacío, máx. 200 caracteres. |
| `sku` | Requerido, string no vacío, debe existir en el catálogo de inventario. |
| `tipoCarga` | Requerido, debe ser uno de los 6 valores permitidos (sección 2). |
| `cantidad` | Requerido, entero, mayor a 0. |
| `bodega` | Requerido, string no vacío. Debe ser una bodega registrada en el sistema. |
| `horaRetiro` | Requerido, formato `"HH:MM hrs"`. |
| `horaDespacho` | Requerido, formato `"HH:MM hrs"`. Debe ser posterior a `horaRetiro`. |
| `direccionEntrega` | Requerido, string no vacío, máx. 300 caracteres. |
| `estado` | Por defecto `"Pendiente"` al crear. Solo actualizable vía `PATCH /estado`. |
| `destinatario.nombre` | Requerido, string no vacío, máx. 200 caracteres. |
| `destinatario.rut` | Requerido, formato RUT chileno válido: `XX.XXX.XXX-X` o `X.XXX.XXX-X`. |
| `destinatario.telefono` | Requerido, string, formato sugerido `+56 9 XXXX XXXX`. |
| `destinatario.correo` | Requerido, formato email válido. |
| `destinatario.direccion` | Requerido, string no vacío, máx. 300 caracteres. |

### Al cambiar estado (`PATCH /pedidos/:id/estado`):

```json
{ "estado": "Aprobado" }
```

- Solo se permiten las transiciones definidas en sección 3.1.
- Si la transición no es válida, responder con `HTTP 422 Unprocessable Entity`.

---

## 11. Datos de Ejemplo (Seed)

Los siguientes 10 pedidos son los que actualmente muestra el frontend como datos de prueba. El backend debe poder reproducirlos al hacer seed de la base de datos:

| ID | Producto | SKU | Tipo Carga | Cantidad | Bodega | Estado |
|---|---|---|---|---|---|---|
| PED-2024-001 | Camiseta Básica Blanca | SKU-001 | Carga General | 50 | Bodega Central | Aprobado |
| PED-2024-002 | Zapatilla Running Pro | SKU-002 | Frágil | 10 | Sucursal Norte | Pendiente |
| PED-2024-003 | Mochila Urbana 30L | SKU-003 | Carga General | 20 | Bodega Central | Enviado |
| PED-2024-004 | Pantalón Cargo Negro | SKU-004 | Carga General | 5 | Sucursal Norte | Entregado |
| PED-2024-005 | Chaqueta Impermeable | SKU-006 | Frágil | 8 | Bodega Central | Aprobado |
| PED-2024-006 | Cinturón de Cuero | SKU-010 | Duro/Resistente | 30 | Bodega Central | Pendiente |
| PED-2024-007 | Gorra Snapback | SKU-008 | Carga Voluminosa | 100 | Sucursal Norte | Enviado |
| PED-2024-008 | Calcetines Pack x6 | SKU-009 | Carga Perecedera | 15 | Bodega Central | Entregado |
| PED-2024-009 | Polo Deportivo Azul | SKU-005 | Carga Peligrosa | 25 | Sucursal Norte | Pendiente |
| PED-2024-010 | Tenis Casual Blanco | SKU-007 | Carga Voluminosa | 3 | Bodega Central | Aprobado |

Los destinatarios y demás campos completos se encuentran en el archivo `ProcesamientoPedidos.html` dentro del array `pedidos` en el script de Alpine.js.

---

## 12. Notas de Arquitectura (Microservicios)

- Este módulo corresponde al **microservicio de Pedidos** (`orders-service` o `pedidos-service`).
- Debe comunicarse con el **microservicio de Inventario** para validar que el `sku` existe y que hay stock suficiente (`cantidad <= stock disponible`) al crear o aprobar un pedido.
- Al cambiar el estado a `Enviado`, se puede emitir un evento/mensaje hacia un servicio de notificaciones para alertar al destinatario por correo o SMS.
- La guía de despacho puede generarse como PDF en un microservicio dedicado de documentos o directamente en este servicio, usando los datos del pedido almacenados.
- El `id` del pedido debe generarse automáticamente por el backend con formato `PED-{AÑO}-{SECUENCIAL_3_DÍGITOS}`.

---

*Generado el 04/05/2026 — SmartLogix Frontend Team*
