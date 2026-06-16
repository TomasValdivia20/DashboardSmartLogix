import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getProductos, crearProducto } from '../services/inventarioService';

const TIPOS_CARGA = [
  { value: 'General', label: 'Carga General' },
  { value: 'Fragil', label: 'Frágil' },
  { value: 'Duro', label: 'Duro/Resistente' },
  { value: 'Peligrosa', label: 'Carga Peligrosa' },
  { value: 'Perecedera', label: 'Carga Perecedera' },
  { value: 'Voluminosa', label: 'Carga Voluminosa' },
];

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const BODEGA_ID = 'de305d54-75b4-431b-adb2-eb6b9e546013';

  const [formData, setFormData] = useState({
    sku: '', nombre: '', descripcion: '', tipo_carga: 'General',
    precio_costo: '', precio_venta: '', stock_inicial: '', umbral_critico: '', umbral_bajo: '',
  });
  const [formError, setFormError] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await getProductos();
      setProductos(res.data || []);
    } catch {
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProductos(); }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    setCreating(true);
    try {
      const payload = {
        sku: formData.sku,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        tipo_carga: formData.tipo_carga,
        bodega_id: BODEGA_ID,
        precio_costo: parseFloat(formData.precio_costo) || 0,
        precio_venta: parseFloat(formData.precio_venta) || 0,
        stock_inicial: parseInt(formData.stock_inicial) || 0,
        umbral_critico: parseInt(formData.umbral_critico) || 0,
        umbral_bajo: parseInt(formData.umbral_bajo) || 0,
      };
      await crearProducto(payload);
      setModalOpen(false);
      setFormData({
        sku: '', nombre: '', descripcion: '', tipo_carga: 'General',
        precio_costo: '', precio_venta: '', stock_inicial: '', umbral_critico: '', umbral_bajo: '',
      });
      fetchProductos();
    } catch (err) {
      setFormError(err.response?.data?.error || err.response?.data?.detail || 'Error al crear producto');
    } finally {
      setCreating(false);
    }
  };

  const estadoBadge = (producto) => {
    if (producto.stock_actual <= producto.umbral_critico) {
      return <span className="px-2 py-1 font-semibold leading-tight rounded-full text-red-700 bg-red-100 dark:text-red-100 dark:bg-red-700">Crítico</span>;
    }
    if (producto.stock_actual <= producto.umbral_bajo) {
      return <span className="px-2 py-1 font-semibold leading-tight rounded-full text-yellow-700 bg-yellow-100 dark:text-yellow-100 dark:bg-yellow-700">Bajo</span>;
    }
    return <span className="px-2 py-1 font-semibold leading-tight rounded-full text-green-700 bg-green-100 dark:text-green-100 dark:bg-green-700">Normal</span>;
  };

  const totalStock = productos.reduce((s, p) => s + (typeof p.stock_actual === 'number' ? p.stock_actual : parseFloat(p.stock_actual) || 0), 0);
  const criticos = productos.filter((p) => p.stock_actual <= p.umbral_critico).length;

  return (
    <Layout>
      <div className="container px-6 mx-auto grid">
        <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Gestión de Inventario
        </h2>

        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <div className="p-3 mr-4 text-purple-500 bg-purple-100 rounded-full dark:text-purple-100 dark:bg-purple-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Total SKUs</p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{productos.length}</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <div className="p-3 mr-4 text-red-500 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Stock Crítico</p>
              <p className="text-lg font-semibold text-red-600 dark:text-red-400">{criticos} producto{criticos !== 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div className="flex flex-col">
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Stock Total</p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{totalStock} unidades</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-6 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800 md:flex-row md:items-center">
          <div className="flex-1">
            <label className="block mb-1 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Buscar producto</label>
            <div className="relative focus-within:text-purple-500">
              <div className="absolute inset-y-0 flex items-center pl-3">
                <svg className="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                </svg>
              </div>
              <input type="text" placeholder="Nombre o SKU..." className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 bg-gray-100 border-0 rounded-md dark:bg-gray-700 dark:text-gray-200 focus:bg-white focus:outline-none focus:shadow-outline-purple form-input" />
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center px-4 py-2 text-sm font-medium leading-5 text-white bg-orange-500 border border-transparent rounded-lg hover:bg-orange-600 focus:outline-none focus:shadow-outline-purple"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
              Agregar Producto
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-8">Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No hay productos registrados.</p>
        ) : (
          <div className="w-full overflow-hidden rounded-lg shadow-xs mb-8">
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-no-wrap min-w-[1200px]">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Descripción</th>
                    <th className="px-4 py-3">Tipo Carga</th>
                    <th className="px-4 py-3 text-right">Costo</th>
                    <th className="px-4 py-3 text-right">Venta</th>
                    <th className="px-4 py-3 text-right">Stock Total</th>
                    <th className="px-4 py-3 text-right">Umbral Min</th>
                    <th className="px-4 py-3 text-center">Estado</th>
                    <th className="px-4 py-3">Fecha</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                  {productos.map((p) => (
                    <tr key={p.id} className="text-gray-700 dark:text-gray-400">
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">{p.nombre}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{p.sku}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-normal w-48">{p.descripcion || '—'}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">{p.tipo_carga_display || p.tipo_carga}</td>
                      <td className="px-4 py-3 text-sm text-right">${parseFloat(p.precio_costo).toLocaleString('es-CL', { minimumFractionDigits: 0 })}</td>
                      <td className="px-4 py-3 text-sm text-right font-bold">${parseFloat(p.precio_venta).toLocaleString('es-CL', { minimumFractionDigits: 0 })}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium">{p.stock_actual}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-500 dark:text-gray-400">{p.umbral_critico || '—'}</td>
                      <td className="px-4 py-3 text-xs text-center">{estadoBadge(p)}</td>
                      <td className="px-4 py-3 text-sm">{p.fecha_creacion ? new Date(p.fecha_creacion).toLocaleDateString('es-CL') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:bg-gray-800">
              <span className="flex items-center col-span-3">
                Mostrando <span className="mx-1 font-bold">{productos.length}</span> de <span className="mx-1 font-bold">{productos.length}</span> productos
              </span>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">Nuevo Producto</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <input name="sku" placeholder="SKU" value={formData.sku} onChange={handleChange} required className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
              <input name="nombre" placeholder="Nombre del producto" value={formData.nombre} onChange={handleChange} required className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
              <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} rows={2} className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
              <select name="tipo_carga" value={formData.tipo_carga} onChange={handleChange} className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                {TIPOS_CARGA.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input name="precio_costo" type="number" step="0.01" placeholder="Precio costo" value={formData.precio_costo} onChange={handleChange} required className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                <input name="precio_venta" type="number" step="0.01" placeholder="Precio venta" value={formData.precio_venta} onChange={handleChange} required className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                <input name="stock_inicial" type="number" placeholder="Stock inicial" value={formData.stock_inicial} onChange={handleChange} required className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                <input name="umbral_critico" type="number" placeholder="Umbral crítico" value={formData.umbral_critico} onChange={handleChange} className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                <input name="umbral_bajo" type="number" placeholder="Umbral bajo" value={formData.umbral_bajo} onChange={handleChange} className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
              </div>
              {formError && <p className="text-red-500 text-sm text-center">{formError}</p>}
              <button
                type="submit"
                disabled={creating}
                className="w-full py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                {creating ? 'Creando...' : 'Crear Producto'}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
