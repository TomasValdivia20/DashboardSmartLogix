import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import ModalPortal from '../components/ModalPortal';
import * as pedidosService from '../services/pedidosService';

const ESTADO_COLORS = {
  Pendiente: { bg: 'bg-orange-100 text-orange-700', dark: 'dark:bg-orange-600 dark:text-white' },
  Aprobado: { bg: 'bg-blue-100 text-blue-700', dark: 'dark:bg-blue-500 dark:text-white' },
  Enviado: { bg: 'bg-purple-100 text-purple-700', dark: 'dark:bg-purple-500 dark:text-white' },
  Entregado: { bg: 'bg-green-100 text-green-700', dark: 'dark:bg-green-600 dark:text-white' },
};

function EstadoBadge({ estado }) {
  const c = ESTADO_COLORS[estado] || ESTADO_COLORS.Pendiente;
  return (
    <span className={`px-2 py-1 font-semibold leading-tight rounded-full text-xs ${c.bg} ${c.dark}`}>
      {estado}
    </span>
  );
}

function truncateId(uuid) {
  return uuid ? uuid.substring(0, 8) + '...' : '';
}

function formatDate(d) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('es-CL', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

function formatCurrency(n) {
  return '$' + Number(n).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function PedidoDetailModal({ pedido, guia, onClose, onGenerarGuia, onAprobar, onEnviar, onEntregar }) {
  if (!pedido) return null;
  const estado = pedido.estado || 'Pendiente';
  const detalles = pedido.detalles || pedido.items || [];
  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 overflow-y-auto" style={{ paddingTop: '5vh', paddingBottom: '5vh' }}>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl mx-4 border dark:border-gray-700">
          <div className="flex justify-between items-center border-b dark:border-gray-700 pb-3 mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">
              Pedido {truncateId(pedido.id)}
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none">&times;</button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <p><span className="font-semibold text-gray-600 dark:text-gray-400">ID:</span> <span className="text-gray-800 dark:text-gray-200">{pedido.id}</span></p>
              <p><span className="font-semibold text-gray-600 dark:text-gray-400">Cliente ID:</span> <span className="text-gray-800 dark:text-gray-200">{pedido.cliente_id}</span></p>
              <p><span className="font-semibold text-gray-600 dark:text-gray-400">Estado:</span> <EstadoBadge estado={estado} /></p>
              <p><span className="font-semibold text-gray-600 dark:text-gray-400">Total:</span> <span className="text-gray-800 dark:text-gray-200 font-bold">{formatCurrency(pedido.total)}</span></p>
              <p><span className="font-semibold text-gray-600 dark:text-gray-400">Tipo:</span> <span className="text-gray-800 dark:text-gray-200">{pedido.notas?.includes('[PRIORITARIO]') ? 'Prioritario' : 'Estándar'}</span></p>
            </div>
            <div>
              <p><span className="font-semibold text-gray-600 dark:text-gray-400">Notas:</span> <span className="text-gray-800 dark:text-gray-200">{pedido.notas || '-'}</span></p>
              <p><span className="font-semibold text-gray-600 dark:text-gray-400">Creado:</span> <span className="text-gray-800 dark:text-gray-200">{formatDate(pedido.fecha_creacion)}</span></p>
              <p><span className="font-semibold text-gray-600 dark:text-gray-400">Actualizado:</span> <span className="text-gray-800 dark:text-gray-200">{formatDate(pedido.fecha_actualizacion)}</span></p>
            </div>
          </div>

          <div className="border-t dark:border-gray-700 pt-4 mb-4">
            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2 uppercase text-sm">Destinatario</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><span className="font-semibold text-gray-600 dark:text-gray-400">Nombre:</span> {pedido.destinatario_nombre}</p>
              <p><span className="font-semibold text-gray-600 dark:text-gray-400">RUT:</span> {pedido.destinatario_rut}</p>
              <p><span className="font-semibold text-gray-600 dark:text-gray-400">Teléfono:</span> {pedido.destinatario_telefono}</p>
              <p><span className="font-semibold text-gray-600 dark:text-gray-400">Correo:</span> {pedido.destinatario_correo}</p>
              <p className="col-span-2"><span className="font-semibold text-gray-600 dark:text-gray-400">Dirección:</span> {pedido.destinatario_direccion}</p>
              <p><span className="font-semibold text-gray-600 dark:text-gray-400">Código Postal:</span> {pedido.destinatario_codigo_postal}</p>
            </div>
          </div>

          <div className="border-t dark:border-gray-700 pt-4 mb-4">
            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2 uppercase text-sm">Detalles ({detalles.length} ítems)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs whitespace-no-wrap">
                <thead>
                  <tr className="text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                    <th className="px-2 py-2">Producto</th>
                    <th className="px-2 py-2">SKU</th>
                    <th className="px-2 py-2">Carga</th>
                    <th className="px-2 py-2 text-right">Cant.</th>
                    <th className="px-2 py-2 text-right">P. Unit.</th>
                    <th className="px-2 py-2 text-right">Subtotal</th>
                    <th className="px-2 py-2">Bodega</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                  {detalles.map((item, i) => (
                    <tr key={item.id || i} className="text-gray-700 dark:text-gray-400">
                      <td className="px-2 py-2">{item.nombre_producto}</td>
                      <td className="px-2 py-2 font-mono">{item.sku}</td>
                      <td className="px-2 py-2">{item.tipo_carga_display || item.tipo_carga}</td>
                      <td className="px-2 py-2 text-right">{item.cantidad}</td>
                      <td className="px-2 py-2 text-right">{formatCurrency(item.precio_unitario)}</td>
                      <td className="px-2 py-2 text-right font-semibold">{formatCurrency(item.subtotal)}</td>
                      <td className="px-2 py-2">{item.bodega_origen?.nombre || item.bodega_origen || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t dark:border-gray-700 pt-4 mb-4">
            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2 uppercase text-sm">Guía de Despacho</h4>
            {guia ? (
              <div className="text-sm">
                <p><span className="font-semibold text-gray-600 dark:text-gray-400">N° Guía:</span> {guia.numero_guia}</p>
                <p><span className="font-semibold text-gray-600 dark:text-gray-400">Emisión:</span> {formatDate(guia.fecha_emision)}</p>
                <p><span className="font-semibold text-gray-600 dark:text-gray-400">Firma Despacho:</span> {guia.firma_responsable_despacho || '-'}</p>
                <p><span className="font-semibold text-gray-600 dark:text-gray-400">Firma Receptor:</span> {guia.firma_receptor || '-'}</p>
                {guia.resumen_impresion && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline">Ver resumen de impresión</summary>
                    <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs whitespace-pre-wrap max-h-64 overflow-y-auto">{guia.resumen_impresion}</pre>
                  </details>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {estado === 'Aprobado' ? (
                  <button onClick={() => onGenerarGuia(pedido.id)} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    + Generar guía de despacho
                  </button>
                ) : (
                  'No disponible'
                )}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 border-t dark:border-gray-700 pt-4">
            {estado === 'Pendiente' && (
              <button onClick={() => { onAprobar(pedido.id); onClose(); }} className="px-4 py-2 text-sm font-medium rounded-lg !text-white !bg-blue-600 hover:!bg-blue-700">Aprobar</button>
            )}
            {estado === 'Aprobado' && (
              <button onClick={() => { onEnviar(pedido.id); onClose(); }} className="px-4 py-2 text-sm font-medium rounded-lg !text-white !bg-purple-600 hover:!bg-purple-700">Enviar</button>
            )}
            {estado === 'Enviado' && (
              <button onClick={() => { onEntregar(pedido.id); onClose(); }} className="px-4 py-2 text-sm font-medium rounded-lg !text-white !bg-green-600 hover:!bg-green-700">Entregar</button>
            )}
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Cerrar</button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

function CreatePedidoModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    cliente_id: '',
    tipo: 'estandar',
    notas: '',
    destinatario_nombre: '',
    destinatario_rut: '',
    destinatario_telefono: '',
    destinatario_correo: '',
    destinatario_direccion: '',
    destinatario_codigo_postal: '',
  });
  const [items, setItems] = useState([{
    nombre_producto: '', sku: '', tipo_carga: 'General', cantidad: 1,
    precio_unitario: '', bodega_origen_id: '', hora_retiro: '', hora_despacho: '',
    direccion_entrega: '', codigo_postal_entrega: '',
  }]);
  const [productos, setProductos] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoadingCatalog(true);
      try {
        const [prodRes, bodegRes] = await Promise.all([
          pedidosService.getProductos(),
          pedidosService.getBodegas(),
        ]);
        setProductos(Array.isArray(prodRes.data) ? prodRes.data : []);
        setBodegas(Array.isArray(bodegRes.data) ? bodegRes.data : []);
      } catch (err) {
        console.error('Error al cargar catálogo:', err);
      } finally {
        setLoadingCatalog(false);
      }
    };
    load();
  }, []);

  const bodegaMap = {};
  bodegas.forEach(b => { bodegaMap[b.id] = b.nombre || b.id; });

  const handleSelectProduct = (i, sku) => {
    const p = productos.find(prod => prod.sku === sku);
    if (!p) return;
    const copy = [...items];
    copy[i] = {
      ...copy[i],
      nombre_producto: p.nombre,
      sku: p.sku,
      tipo_carga: p.tipo_carga || 'General',
      precio_unitario: p.precio_venta || '',
      bodega_origen_id: p.bodega_id || '',
    };
    setItems(copy);
  };

  const setField = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const setItemField = (i, field) => (e) => {
    const copy = [...items];
    copy[i][field] = e.target.value;
    setItems(copy);
  };
  const addItem = () => setItems([...items, {
    nombre_producto: '', sku: '', tipo_carga: 'General', cantidad: 1,
    precio_unitario: '', bodega_origen_id: '', hora_retiro: '', hora_despacho: '',
    direccion_entrega: '', codigo_postal_entrega: '',
  }]);
  const removeItem = (i) => { if (items.length > 1) setItems(items.filter((_, idx) => idx !== i)); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        cliente_id: form.cliente_id,
        tipo: form.tipo,
        notas: form.notas || null,
        destinatario: {
          destinatario_nombre: form.destinatario_nombre,
          destinatario_rut: form.destinatario_rut,
          destinatario_telefono: form.destinatario_telefono,
          destinatario_correo: form.destinatario_correo,
          destinatario_direccion: form.destinatario_direccion,
          destinatario_codigo_postal: form.destinatario_codigo_postal,
        },
        items: items.map(item => ({
          ...item,
          cantidad: Number(item.cantidad),
          precio_unitario: Number(item.precio_unitario),
          hora_retiro: new Date(item.hora_retiro).toISOString(),
          hora_despacho: new Date(item.hora_despacho).toISOString(),
        })),
      });
      onClose();
    } catch (err) {
      console.error('Error al crear pedido:', err);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:border-purple-400 focus:outline-none";
  const inputDisabledClass = "w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 cursor-not-allowed";
  const labelClass = "block text-sm font-bold text-gray-800 dark:text-gray-200 uppercase mb-1";

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 overflow-y-auto" style={{ paddingTop: '5vh', paddingBottom: '5vh' }}>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl mx-4 border dark:border-gray-700">
          <div className="flex justify-between items-center border-b dark:border-gray-700 pb-3 mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">Nuevo Pedido</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none">&times;</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>Cliente ID</label>
                <input required className={inputClass} value={form.cliente_id} onChange={setField('cliente_id')} placeholder="UUID del cliente" />
              </div>
              <div>
                <label className={labelClass}>Tipo</label>
                <select className={inputClass} value={form.tipo} onChange={setField('tipo')}>
                  <option value="estandar">Estándar</option>
                  <option value="prioritario">Prioritario</option>
                </select>
              </div>
            </div>

            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2 uppercase text-sm border-t dark:border-gray-700 pt-4">Destinatario</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>Nombre</label>
                <input required className={inputClass} value={form.destinatario_nombre} onChange={setField('destinatario_nombre')} placeholder="Nombre completo" />
              </div>
              <div>
                <label className={labelClass}>RUT</label>
                <input required className={inputClass} value={form.destinatario_rut} onChange={setField('destinatario_rut')} placeholder="12.345.678-9" />
              </div>
              <div>
                <label className={labelClass}>Teléfono</label>
                <input required className={inputClass} value={form.destinatario_telefono} onChange={setField('destinatario_telefono')} placeholder="+56912345678" />
              </div>
              <div>
                <label className={labelClass}>Correo</label>
                <input required type="email" className={inputClass} value={form.destinatario_correo} onChange={setField('destinatario_correo')} placeholder="correo@ejemplo.cl" />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Dirección</label>
                <input required className={inputClass} value={form.destinatario_direccion} onChange={setField('destinatario_direccion')} placeholder="Dirección completa" />
              </div>
              <div>
                <label className={labelClass}>Código Postal</label>
                <input required className={inputClass} value={form.destinatario_codigo_postal} onChange={setField('destinatario_codigo_postal')} placeholder="8320000" />
              </div>
            </div>

            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2 uppercase text-sm border-t dark:border-gray-700 pt-4">Items</h4>
            {items.map((item, i) => (
              <div key={i} className="border dark:border-gray-700 rounded-lg p-3 mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Ítem #{i + 1}</span>
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700 text-xs font-medium">Eliminar</button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Producto</label>
                    <select required className={inputClass} value={item.sku} onChange={(e) => handleSelectProduct(i, e.target.value)} disabled={loadingCatalog}>
                      <option value="">{loadingCatalog ? 'Cargando productos...' : 'Seleccionar producto...'}</option>
                      {productos.map((p) => (
                        <option key={p.sku} value={p.sku}>{p.nombre} ({p.sku})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Producto</label>
                    <input className={inputDisabledClass} value={item.nombre_producto} readOnly placeholder="Auto-completado" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">SKU</label>
                    <input className={inputDisabledClass} value={item.sku} readOnly placeholder="Auto-completado" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Tipo Carga</label>
                    <input className={inputDisabledClass} value={item.tipo_carga} readOnly placeholder="Auto-completado" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Precio Unitario</label>
                    <input className={inputDisabledClass} value={item.precio_unitario ? formatCurrency(item.precio_unitario) : ''} readOnly placeholder="Auto-completado" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Bodega Origen</label>
                    <input className={inputDisabledClass} value={item.bodega_origen_id ? (bodegaMap[item.bodega_origen_id] || item.bodega_origen_id) : ''} readOnly placeholder="Auto-completado" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Cantidad</label>
                    <input required type="number" min="1" className={inputClass} value={item.cantidad} onChange={setItemField(i, 'cantidad')} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Hora Retiro</label>
                    <input required type="datetime-local" className={inputClass} value={item.hora_retiro} onChange={setItemField(i, 'hora_retiro')} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Hora Despacho</label>
                    <input required type="datetime-local" className={inputClass} value={item.hora_despacho} onChange={setItemField(i, 'hora_despacho')} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Dirección Entrega</label>
                    <input required className={inputClass} value={item.direccion_entrega} onChange={setItemField(i, 'direccion_entrega')} placeholder="Dirección de entrega del ítem" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Código Postal</label>
                    <input required className={inputClass} value={item.codigo_postal_entrega} onChange={setItemField(i, 'codigo_postal_entrega')} placeholder="7500000" />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={addItem} className="mb-4 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">+ Agregar otro ítem</button>

            <div className="mb-4">
              <label className={labelClass}>Notas (opcional)</label>
              <textarea className={inputClass} rows="2" value={form.notas} onChange={setField('notas')} placeholder="Notas del pedido" />
            </div>

            <div className="flex justify-end space-x-3 border-t dark:border-gray-700 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Cancelar</button>
              <button type="submit" disabled={saving || loadingCatalog} className="px-4 py-2 text-sm font-medium rounded-lg !text-white !bg-orange-500 hover:!bg-orange-600 disabled:opacity-50">
                {saving ? 'Guardando...' : 'Crear Pedido'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [guiaData, setGuiaData] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchPedidos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await pedidosService.getPedidos();
      setPedidos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError('Error al cargar pedidos. ¿El servidor está corriendo?');
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPedidos(); }, [fetchPedidos]);

  const showFeedback = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAction = async (actionFn, id, successMsg) => {
    try {
      await actionFn(id);
      showFeedback(successMsg);
      fetchPedidos();
    } catch (err) {
      showFeedback(err.response?.data?.error || 'Error al ejecutar acción', 'error');
    }
  };

  const handleVerDetalle = async (id) => {
    try {
      const res = await pedidosService.getPedido(id);
      setSelectedPedido(res.data);
      let guia = null;
      try {
        const guiaRes = await pedidosService.getGuia(id);
        if (guiaRes.status === 200) guia = guiaRes.data;
      } catch (_) {}
      setGuiaData(guia);
    } catch (err) {
      showFeedback('Error al cargar detalle del pedido', 'error');
    }
  };

  const handleGenerarGuia = async (id) => {
    await handleAction(() => pedidosService.generarGuia(id), id, 'Guía generada correctamente');
    handleVerDetalle(id);
  };

  const handleCreate = async (data) => {
    try {
      await pedidosService.createPedido(data);
      showFeedback('Pedido creado correctamente');
      setShowCreate(false);
      fetchPedidos();
    } catch (err) {
      const body = err.response?.data;
      let msg = 'Error al crear pedido';
      if (typeof body === 'string') {
        msg = body;
      } else if (body?.detail && Array.isArray(body.detail)) {
        msg = body.detail.map(d => `${d.loc?.slice(-1) || ''}: ${d.msg}`).join(' | ');
      } else if (typeof body === 'object') {
        msg = Object.entries(body)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : typeof v === 'object' ? JSON.stringify(v) : v}`)
          .join(' | ');
      } else if (body?.error) {
        msg = body.error;
      }
      showFeedback(msg, 'error');
    }
  };

  return (
    <Layout>
      <div className="container px-6 mx-auto grid">
        <div className="flex justify-between items-center my-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Lista de Pedidos</h2>
          <button onClick={() => setShowCreate(true)}
            className="px-4 py-2 text-sm font-medium leading-5 transition-colors duration-150 rounded-lg focus:outline-none shadow-md border-0 !text-white !bg-orange-500 hover:!bg-orange-600 active:!bg-orange-600 dark:!bg-gray-800 dark:hover:!bg-gray-700 dark:!text-gray-200">
            + Nuevo Pedido
          </button>
        </div>

        {feedback && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${feedback.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100' : 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100'}`}>
            {feedback.msg}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">Cargando pedidos...</div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
            <button onClick={fetchPedidos} className="px-4 py-2 text-sm font-medium rounded-lg !text-white !bg-orange-500 hover:!bg-orange-600">Reintentar</button>
          </div>
        ) : pedidos.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="mb-4">No hay pedidos registrados.</p>
            <button onClick={() => setShowCreate(true)} className="px-4 py-2 text-sm font-medium rounded-lg !text-white !bg-orange-500 hover:!bg-orange-600">Crear primer pedido</button>
          </div>
        ) : (
          <div className="w-full overflow-hidden rounded-lg shadow-xs mb-8">
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-no-wrap">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                    <th className="px-4 py-3">Pedido</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">RUT</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-center">Items</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                  {pedidos.map((p) => {
                    const estado = p.estado || 'Pendiente';
                    const detalles = p.detalles || p.items || [];
                    const tipo = p.notas?.includes('[PRIORITARIO]') ? 'Prioritario' : 'Estándar';
                    return (
                      <tr key={p.id} className="text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 text-sm font-mono font-semibold">{truncateId(p.id)}</td>
                        <td className="px-4 py-3 text-sm dark:text-gray-200">{p.destinatario_nombre}</td>
                        <td className="px-4 py-3 text-sm">{p.destinatario_rut}</td>
                        <td className="px-4 py-3"><EstadoBadge estado={estado} /></td>
                        <td className="px-4 py-3 text-sm text-right font-semibold">{formatCurrency(p.total)}</td>
                        <td className="px-4 py-3 text-sm text-center">{detalles.length}</td>
                        <td className="px-4 py-3 text-sm">{tipo}</td>
                        <td className="px-4 py-3 text-sm">{formatDate(p.fecha_creacion)}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          <div className="flex flex-wrap gap-1 justify-center">
                            <button onClick={() => handleVerDetalle(p.id)} className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs">Ver</button>
                            {estado === 'Pendiente' && (
                              <button onClick={() => handleAction(() => pedidosService.aprobarPedido(p.id), p.id, 'Pedido aprobado')} className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs">Aprobar</button>
                            )}
                            {estado === 'Aprobado' && (
                              <>
                                <button onClick={() => handleAction(() => pedidosService.enviarPedido(p.id), p.id, 'Pedido enviado')} className="text-purple-600 dark:text-purple-400 hover:underline font-medium text-xs">Enviar</button>
                                <button onClick={() => handleGenerarGuia(p.id)} className="text-green-600 dark:text-green-400 hover:underline font-medium text-xs">Guía</button>
                              </>
                            )}
                            {estado === 'Enviado' && (
                              <button onClick={() => handleAction(() => pedidosService.entregarPedido(p.id), p.id, 'Pedido entregado')} className="text-green-600 dark:text-green-400 hover:underline font-medium text-xs">Entregar</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedPedido && (
        <PedidoDetailModal
          pedido={selectedPedido}
          guia={guiaData}
          onClose={() => { setSelectedPedido(null); setGuiaData(null); }}
          onGenerarGuia={handleGenerarGuia}
          onAprobar={(id) => handleAction(() => pedidosService.aprobarPedido(id), id, 'Pedido aprobado')}
          onEnviar={(id) => handleAction(() => pedidosService.enviarPedido(id), id, 'Pedido enviado')}
          onEntregar={(id) => handleAction(() => pedidosService.entregarPedido(id), id, 'Pedido entregado')}
        />
      )}

      {showCreate && (
        <CreatePedidoModal
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
        />
      )}
    </Layout>
  );
}
