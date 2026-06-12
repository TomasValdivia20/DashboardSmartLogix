import React, { useState, useEffect } from 'react';

import Layout from '../components/Layout';
import MapaLogistico from '../components/MapaLogistico';
import { getVehiculos } from '../services/vehiculosService';
import { createEnvio, calcularCostos, createRuta, calcularRuta, getRuta } from '../services/enviosService';
import { getPedidos } from '../services/pedidosService';

const BODEGA_CENTRAL = { lat: -33.4372, lng: -70.6506 };
const STEP_LABELS = ['Seleccionar Pedidos', 'Configurar Envío', 'Confirmar y Costos'];

function distanciaHaversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function geocodificar(direccion) {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  if (!token) return null;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(direccion)}.json?access_token=${token}&country=CL&limit=1`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.features?.length > 0) {
      const [lng, lat] = data.features[0].center;
      return { lat, lng };
    }
  } catch {
    return null;
  }
  return null;
}

function googleMapsUrl(items) {
  const base = 'https://www.google.com/maps/dir/?api=1';
  const origin = 'Bodega+Central,+Santiago,+Chile';
  const dests = items.map((it) => encodeURIComponent(it.pedido.direccion));
  if (dests.length === 0) return base;
  const destination = dests[dests.length - 1];
  const waypoints = dests.slice(0, -1).join('|');
  let url = `${base}&origin=${origin}&destination=${destination}&travelmode=driving`;
  if (waypoints) url += `&waypoints=${waypoints}`;
  return url;
}

export default function Envios() {
  const [envios, setEnvios] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [rutaGeoJSON, setRutaGeoJSON] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [envioSeleccionadoId, setEnvioSeleccionadoId] = useState(null);

  const [despachoStep, setDespachoStep] = useState(1);
  const [pedidosDisponibles, setPedidosDisponibles] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [itemsDespacho, setItemsDespacho] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [busquedaPedido, setBusquedaPedido] = useState('');
  const [resultadoRuta, setResultadoRuta] = useState(null);

  useEffect(() => {
    getVehiculos()
      .then((res) => setVehiculos(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setEnvios([
      { id: 'uuid-1', codigo_seguimiento: 'ENV-001', direccion_destino: 'Av. Providencia 1234, Santiago', estado: 'En_Camino', lat: -33.425, lng: -70.617 },
      { id: 'uuid-2', codigo_seguimiento: 'ENV-002', direccion_destino: 'Av. Apoquindo 456, Las Condes', estado: 'Entregado', lat: -33.416, lng: -70.590 },
      { id: 'uuid-3', codigo_seguimiento: 'ENV-003', direccion_destino: 'Gran Avenida 789, San Miguel', estado: 'Bodega', lat: -33.481, lng: -70.650 },
    ]);
  }, []);

  const handleOpenModal = async () => {
    try {
      const res = await getPedidos();
      setPedidosDisponibles(res.data);
    } catch {
      setPedidosDisponibles([]);
    }
    setDespachoStep(1);
    setSelectedIds(new Set());
    setItemsDespacho([]);
    setResultadoRuta(null);
    setIsModalOpen(true);
  };

  const togglePedido = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const avanzarAPaso2 = () => {
    const seleccionados = pedidosDisponibles.filter((p) => selectedIds.has(p.id));
    const items = seleccionados.map((p) => ({
      pedidoId: p.id,
      pedido: p,
      vehiculoId: vehiculos.length > 0 ? vehiculos[0].id : '',
      vehiculoTipo: vehiculos.length > 0 ? vehiculos[0].tipo_vehiculo : '',
      requiereInstalacion: false,
      costos: null,
      calculando: false,
      distanciaKm: 0,
      error: null,
    }));
    setItemsDespacho(items);
    setDespachoStep(2);
  };

  const actualizarItem = (pedidoId, campos) => {
    setItemsDespacho((prev) => prev.map((it) => (it.pedidoId === pedidoId ? { ...it, ...campos } : it)));
  };

  const handleCalcularItem = async (item) => {
    if (!item.vehiculoId) return;
    actualizarItem(item.pedidoId, { calculando: true, error: null });

    const coords = await geocodificar(item.pedido.direccion);
    let distanciaKm = 5;
    if (coords) {
      distanciaKm = Math.round(distanciaHaversine(BODEGA_CENTRAL.lat, BODEGA_CENTRAL.lng, coords.lat, coords.lng) * 100) / 100;
    }

    try {
      const payload = {
        vehiculo_id: item.vehiculoId,
        valor_base_producto: item.pedido.valor_base,
        requiere_instalacion: item.requiereInstalacion,
        distancia_km: String(distanciaKm),
      };
      const res = await calcularCostos(payload);
      actualizarItem(item.pedidoId, { costos: res.data, distanciaKm, calculando: false });
    } catch {
      actualizarItem(item.pedidoId, { error: 'Error al calcular costos', calculando: false });
    }
  };

  const todosCalculados = itemsDespacho.length > 0 && itemsDespacho.every((it) => it.costos !== null);

  const handleCrearDespacho = async () => {
    setEnviando(true);
    const enviosCreados = [];

    try {
      const rutaRes = await createRuta({ estado: 'Planificacion' });
      const rutaId = rutaRes.data.id;

      for (const item of itemsDespacho) {
        const coords = await geocodificar(item.pedido.direccion);
        const envioData = {
          codigo_seguimiento: `ENV-${String(envios.length + enviosCreados.length + 1).padStart(3, '0')}`,
          referencia_externa_id: item.pedidoId,
          valor_base_producto: item.pedido.valor_base,
          requiere_instalacion: item.requiereInstalacion,
          costo_final: item.costos,
          direccion_destino: item.pedido.direccion,
          latitud: coords ? String(coords.lat) : String(BODEGA_CENTRAL.lat),
          longitud: coords ? String(coords.lng) : String(BODEGA_CENTRAL.lng),
          ruta: rutaId,
          estado: 'Asignado',
        };
        const res = await createEnvio(envioData);
        enviosCreados.push(res.data);
      }

      const calcRes = await calcularRuta(rutaId);
      if (calcRes.data.status === 'success') {
        const rutaUpdated = await getRuta(rutaId);
        const geo = rutaUpdated.data.geometria_ruta;
        if (geo) {
          const parsed = typeof geo === 'string' ? JSON.parse(geo) : geo;
          setRutaGeoJSON(parsed);
        }
        setResultadoRuta({
          distancia: rutaUpdated.data.distancia_total_km,
          tiempo: rutaUpdated.data.tiempo_estimado_min,
          rutaId: rutaId,
        });
      }
    } catch {
      for (const item of itemsDespacho) {
        const coords = await geocodificar(item.pedido.direccion);
        enviosCreados.push({
          id: crypto.randomUUID(),
          codigo_seguimiento: `ENV-${String(envios.length + enviosCreados.length + 1).padStart(3, '0')}`,
          referencia_externa_id: item.pedidoId,
          direccion_destino: item.pedido.direccion,
          lat: coords?.lat || BODEGA_CENTRAL.lat,
          lng: coords?.lng || BODEGA_CENTRAL.lng,
          estado: 'Bodega',
        });
      }
    }

    setEnvios((prev) => [...enviosCreados, ...prev]);
    setEnviando(false);
    setDespachoStep(4);
  };

  const handleConfirmarEliminar = () => {
    if (deleteTarget) {
      setEnvios(envios.filter((item) => item.id !== deleteTarget));
      setDeleteTarget(null);
    }
  };

  const pedidosFiltrados = pedidosDisponibles.filter(
    (p) => p.id.includes(busquedaPedido) || p.cliente.toLowerCase().includes(busquedaPedido.toLowerCase())
  );

  const totalDespacho = itemsDespacho.reduce((sum, it) => sum + (it.costos ? Number(it.costos.total) : 0), 0);

  return (
    <Layout>
      <div className="container px-6 mx-auto grid">
        <div className="flex justify-between items-center my-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Panel Logístico y Envíos</h2>
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 text-sm font-medium leading-5 transition-colors duration-150 rounded-lg shadow-md !text-white !bg-orange-500 hover:!bg-orange-600 dark:!bg-gray-800 dark:hover:!bg-gray-700 focus:outline-none"
          >
            Nuevo Despacho
          </button>
        </div>

        <div className="w-full mb-8">
          <MapaLogistico
            rutaGeoJSON={rutaGeoJSON}
            envios={envios}
            envioSeleccionadoId={envioSeleccionadoId}
            onEnvioClick={(id) => setEnvioSeleccionadoId(id === envioSeleccionadoId ? null : id)}
          />
        </div>

        <div className="w-full overflow-hidden rounded-lg shadow-xs mb-8 border dark:border-gray-700">
          <div className="w-full overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Dirección Destino</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                {envios.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setEnvioSeleccionadoId(item.id)}
                    className={`text-gray-700 dark:text-gray-400 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      envioSeleccionadoId === item.id ? 'bg-orange-100 dark:bg-gray-600' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200">{item.codigo_seguimiento}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.direccion_destino}</td>
                    <td className="px-4 py-3 text-xs">
                      <span
                        className={`px-2 py-1 font-semibold leading-tight rounded-full ${
                          item.estado === 'Entregado'
                            ? 'text-green-700 bg-green-100 dark:text-green-100 dark:bg-green-700'
                            : item.estado === 'En_Camino'
                              ? 'text-blue-700 bg-blue-100 dark:text-blue-100 dark:bg-blue-600'
                              : item.estado === 'Bodega'
                                ? 'text-orange-700 bg-orange-100 dark:text-white dark:bg-orange-600'
                                : 'text-red-700 bg-red-100 dark:text-white dark:bg-red-600'
                        }`}
                      >
                        {item.estado.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(item.id);
                        }}
                        className="text-red-600 dark:text-red-400 hover:underline font-medium focus:outline-none"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 w-full max-w-4xl flex flex-col overflow-hidden" style={{ height: '85vh' }}>
            {/* HEADER */}
            <div className="flex justify-between items-center px-6 pt-6 pb-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                NUEVO DESPACHO
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-200 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* STEP INDICATOR */}
            <div className="flex items-center px-6 pt-4 pb-4">
              {STEP_LABELS.map((label, idx) => {
                const paso = idx + 1;
                const activo = despachoStep === paso;
                const completado = despachoStep > paso;
                return (
                  <React.Fragment key={paso}>
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                          activo
                            ? 'bg-orange-500 text-white'
                            : completado
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {completado ? '\u2713' : paso}
                      </div>
                      <span
                        className={`ml-2 text-sm font-medium hidden sm:inline ${
                          activo
                            ? 'text-orange-600 dark:text-orange-400'
                            : completado
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                    {idx < STEP_LABELS.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-3 ${
                          completado ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* CONTENIDO SCROLLABLE */}
            <div className="flex-1 overflow-y-auto px-6" style={{ minHeight: 0 }}>
              {/* STEP 1: SELECCIONAR PEDIDOS */}
              {despachoStep === 1 && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Selecciona los pedidos que deseas despachar:
                  </p>
                  <input
                    type="text"
                    placeholder="Buscar por ID o cliente..."
                    value={busquedaPedido}
                    onChange={(e) => setBusquedaPedido(e.target.value)}
                    className="w-full p-2 mb-4 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-orange-500"
                  />
                  <div className="max-h-64 overflow-y-auto border dark:border-gray-700 rounded-md divide-y dark:divide-gray-700">
                    {pedidosFiltrados.map((p) => (
                      <label
                        key={p.id}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                        selectedIds.has(p.id) ? 'pedido-seleccionado bg-orange-50' : ''
                      }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedIds.has(p.id)}
                          onChange={() => togglePedido(p.id)}
                          className="accent-orange-500 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            #{p.id} - {p.cliente}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{p.direccion}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 shrink-0">
                          ${Number(p.valor_base).toLocaleString('es-CL')}
                        </span>
                      </label>
                    ))}
                    {pedidosFiltrados.length === 0 && (
                      <p className="px-4 py-6 text-sm text-gray-400 dark:text-gray-500 text-center">No se encontraron pedidos.</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{selectedIds.size} pedido(s) seleccionado(s)</p>
                </div>
              )}

              {/* STEP 2: CONFIGURAR PARÁMETROS */}
              {despachoStep === 2 && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Configura el vehículo y las opciones para cada pedido:
                  </p>
                  <div className="space-y-4">
                    {itemsDespacho.map((item) => (
                      <div
                        key={item.pedidoId}
                        className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                              #{item.pedido.id} - {item.pedido.cliente}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.pedido.direccion}</p>
                          </div>
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 shrink-0">
                            ${Number(item.pedido.valor_base).toLocaleString('es-CL')}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">
                              Vehículo
                            </label>
                            <select
                              value={item.vehiculoId}
                              onChange={(e) => {
                                const v = vehiculos.find((ve) => ve.id === e.target.value);
                                actualizarItem(item.pedidoId, {
                                  vehiculoId: e.target.value,
                                  vehiculoTipo: v?.tipo_vehiculo || '',
                                  costos: null,
                                });
                              }}
                              className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:border-orange-500"
                            >
                              {vehiculos.map((v) => (
                                <option key={v.id} value={v.id}>
                                  {v.patente} - {v.tipo_vehiculo_display || v.modelo}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-end pb-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item.requiereInstalacion}
                                onChange={(e) =>
                                  actualizarItem(item.pedidoId, {
                                    requiereInstalacion: e.target.checked,
                                    costos: null,
                                  })
                                }
                                className="accent-orange-500"
                              />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Requiere Instalación
                              </span>
                            </label>
                          </div>
                          <div className="flex items-end justify-end">
                            <button
                              onClick={() => handleCalcularItem(item)}
                              disabled={item.calculando || !item.vehiculoId}
                              className="px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                              {item.calculando ? 'Calculando...' : item.costos ? 'Recalcular' : 'Calcular'}
                            </button>
                          </div>
                        </div>
                        {item.costos && (
                          <div className="cost-card mt-3 p-3 bg-white rounded border border-gray-200 text-sm">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">Base: </span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                  ${Number(item.costos.valor_base).toLocaleString('es-CL')}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">IVA (19%): </span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                  ${Number(item.costos.iva).toLocaleString('es-CL')}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">Transacción: </span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                  ${Number(item.costos.costo_transaccion).toLocaleString('es-CL')}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">Logística: </span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                  ${Number(item.costos.costo_logistica).toLocaleString('es-CL')}
                                </span>
                              </div>
                              {Number(item.costos.costo_instalacion) > 0 && (
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">Instalación: </span>
                                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                                    ${Number(item.costos.costo_instalacion).toLocaleString('es-CL')}
                                  </span>
                                </div>
                              )}
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">Tiempo: </span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                  {item.costos.tiempo_estimado_min} min
                                </span>
                              </div>
                              <div className="col-span-2 text-right">
                                <span className="text-gray-800 dark:text-gray-200 font-bold">
                                  Total: ${Number(item.costos.total).toLocaleString('es-CL')}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        {item.error && <p className="mt-2 text-xs text-red-500">{item.error}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: CONFIRMAR Y COSTOS */}
              {despachoStep === 3 && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Revisa el resumen final antes de crear el despacho:
                  </p>
                  <div className="overflow-x-auto border dark:border-gray-700 rounded-md">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                          <th className="px-3 py-2">Pedido</th>
                          <th className="px-3 py-2">Cliente</th>
                          <th className="px-3 py-2 text-right">Base</th>
                          <th className="px-3 py-2 text-right">IVA</th>
                          <th className="px-3 py-2 text-right">Trans.</th>
                          <th className="px-3 py-2 text-right">Logíst.</th>
                          <th className="px-3 py-2 text-right">Instal.</th>
                          <th className="px-3 py-2 text-right">Tiempo</th>
                          <th className="px-3 py-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y dark:divide-gray-700">
                        {itemsDespacho.map((item) => (
                          <tr key={item.pedidoId} className="text-gray-700 dark:text-gray-300">
                            <td className="px-3 py-2 font-semibold text-gray-800 dark:text-gray-200">#{item.pedidoId}</td>
                            <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{item.pedido.cliente}</td>
                            <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">
                              ${Number(item.costos.valor_base).toLocaleString('es-CL')}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">
                              ${Number(item.costos.iva).toLocaleString('es-CL')}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">
                              ${Number(item.costos.costo_transaccion).toLocaleString('es-CL')}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">
                              ${Number(item.costos.costo_logistica).toLocaleString('es-CL')}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">
                              ${Number(item.costos.costo_instalacion).toLocaleString('es-CL')}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">
                              {item.costos.tiempo_estimado_min} min
                            </td>
                            <td className="px-3 py-2 text-right font-bold text-gray-900 dark:text-gray-100">
                              ${Number(item.costos.total).toLocaleString('es-CL')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="text-sm font-bold text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700/50">
                          <td colSpan="2" className="px-3 py-3 text-right uppercase text-gray-600 dark:text-gray-400">
                            Total Despacho
                          </td>
                          <td className="px-3 py-3 text-right">
                            ${itemsDespacho.reduce((s, i) => s + Number(i.costos.valor_base), 0).toLocaleString('es-CL')}
                          </td>
                          <td className="px-3 py-3 text-right">
                            ${itemsDespacho.reduce((s, i) => s + Number(i.costos.iva), 0).toLocaleString('es-CL')}
                          </td>
                          <td className="px-3 py-3 text-right">
                            ${itemsDespacho.reduce((s, i) => s + Number(i.costos.costo_transaccion), 0).toLocaleString('es-CL')}
                          </td>
                          <td className="px-3 py-3 text-right">
                            ${itemsDespacho.reduce((s, i) => s + Number(i.costos.costo_logistica), 0).toLocaleString('es-CL')}
                          </td>
                          <td className="px-3 py-3 text-right">
                            ${itemsDespacho.reduce((s, i) => s + Number(i.costos.costo_instalacion), 0).toLocaleString('es-CL')}
                          </td>
                          <td className="px-3 py-3 text-right text-gray-500 dark:text-gray-400">-</td>
                          <td className="px-3 py-3 text-right text-orange-600 dark:text-orange-400">
                            ${totalDespacho.toLocaleString('es-CL')}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* STEP 4: DESPACHO CREADO */}
              {despachoStep === 4 && (
                <div className="py-4">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl text-green-600 dark:text-green-400">\u2713</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Despacho Creado Exitosamente</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Se crearon {itemsDespacho.length} envío(s) y se asignaron a una ruta.
                    </p>
                  </div>

                  {resultadoRuta && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 border dark:border-gray-700 rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Resumen de la Ruta</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Distancia total: </span>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{resultadoRuta.distancia} km</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Tiempo estimado: </span>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{resultadoRuta.tiempo} min</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={googleMapsUrl(itemsDespacho)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 text-center"
                    >
                      Abrir en Google Maps
                    </a>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* FOOTER (solo pasos 1-3) */}
            {despachoStep < 4 && (
              <div className="border-t dark:border-gray-700 px-6 py-4 shrink-0">
                <div className="flex justify-between">
                  {despachoStep > 1 ? (
                    <button
                      onClick={() => setDespachoStep((prev) => prev - 1)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Atrás
                    </button>
                  ) : (
                    <div />
                  )}
                  {despachoStep === 1 && (
                    <button
                      onClick={avanzarAPaso2}
                      disabled={selectedIds.size === 0}
                      className="btn-siguiente px-4 py-2 text-sm font-medium rounded-lg focus:outline-none shadow-md disabled:opacity-50"
                    >
                      Siguiente ({selectedIds.size})
                    </button>
                  )}
                  {despachoStep === 2 && (
                    <button
                      onClick={() => setDespachoStep(3)}
                      disabled={!todosCalculados}
                      className="px-4 py-2 text-sm font-medium text-orange bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none shadow-md"
                    >
                      {todosCalculados ? `Ver Resumen` : 'Calcula todos los costos primero'}
                    </button>
                  )}
                  {despachoStep === 3 && (
                    <button
                      onClick={handleCrearDespacho}
                      disabled={enviando}
                      className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none shadow-md disabled:opacity-50"
                    >
                      {enviando ? 'Creando...' : `Confirmar Despacho ($${totalDespacho.toLocaleString('es-CL')})`}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-80 text-center border dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-100 mb-6">
              ¿Desea cancelar y eliminar este envío del sistema?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-semibold uppercase text-gray-500 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded focus:outline-none"
              >
                No
              </button>
              <button
                onClick={handleConfirmarEliminar}
                className="px-4 py-2 text-xs font-semibold uppercase text-white bg-red-600 hover:bg-red-700 rounded focus:outline-none"
              >
                Sí
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
