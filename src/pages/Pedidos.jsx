import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ModalPortal from '../components/ModalPortal';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [idError, setIdError] = useState(false);
  const [formData, setFormData] = useState({ id: '', cliente: '', tipo: 'Pedido', estado: 'Procesando', fecha: '' });

  useEffect(() => {
    setPedidos([
      { id: '10372', tipo: 'Pedido', cliente: 'Fabian Cuevas', fecha: '10 Jun 2026', estado: 'Completado' },
      { id: '10234', tipo: 'Pedido', cliente: 'Juan Pérez', fecha: '28 May 2026', estado: 'Procesando' },
      { id: '10232', tipo: 'Pedido', cliente: 'Carlos Ruiz', fecha: '26 May 2026', estado: 'Pendiente' },
      { id: '10230', tipo: 'Pedido', cliente: 'Luis Torres', fecha: '25 May 2026', estado: 'Cancelado' },
    ]);
  }, []);

  const handleOpenModal = () => {
    setFormData({ id: '', cliente: '', tipo: 'Pedido', estado: 'Procesando', fecha: '' });
    setIdError(false);
    setIsModalOpen(true);
  };

  const handleSubmitModal = (e) => {
    e.preventDefault();
    
    if (!formData.id || !/^\d+$/.test(formData.id)) {
      setIdError(true);
      return;
    }

    setPedidos([formData, ...pedidos]);
    setIsModalOpen(false);
  };

  const handleConfirmarEliminar = () => {
    if (deleteTarget) {
      setPedidos(pedidos.filter(item => item.id !== deleteTarget));
      setDeleteTarget(null);
    }
  };

  const handleIdChange = (e) => {
    const inputValue = e.target.value;
    
    if (inputValue !== '' && !/^\d+$/.test(inputValue)) {
      setIdError(true);
    } else {
      setIdError(false);
    }
    
    setFormData({ ...formData, id: inputValue });
  };

  return (
    <Layout>
      <div className="container px-6 mx-auto grid">
        <div className="flex justify-between items-center my-6">
          {/* TÍTULO CORREGIDO: Gris oscuro en claro para legibilidad, gris claro en oscuro */}
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Lista de Pedidos
          </h2>
          
          {/* BOTÓN CON FORZADO (!): Naranja absoluto en claro, Gris oscuro absoluto en oscuro */}
          <button 
            onClick={handleOpenModal} 
            className="px-4 py-2 text-sm font-medium leading-5 transition-colors duration-150 rounded-lg focus:outline-none shadow-md border-0 !text-white !bg-orange-500 hover:!bg-orange-600 active:!bg-orange-600 dark:!bg-gray-800 dark:hover:!bg-gray-700 dark:!text-gray-200"
          >
            Agregar pedido
          </button>
        </div>
        
        <div className="w-full overflow-hidden rounded-lg shadow-xs mb-8">
          <div className="w-full overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                {pedidos.map((item) => (
                  <tr key={item.id} className="text-gray-700 dark:text-gray-400">
                    <td className="px-4 py-3 text-sm font-semibold">#{item.id}</td>
                    <td className="px-4 py-3 text-sm dark:text-gray-200">{item.cliente}</td>
                    <td className="px-4 py-3 text-sm">{item.tipo}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${item.estado === 'Completado' ? 'text-green-700 bg-green-100 dark:text-green-100 dark:bg-green-700' : item.estado === 'Procesando' ? 'text-blue-700 bg-blue-100 dark:text-blue-100 dark:bg-blue-500' : item.estado === 'Pendiente' ? 'text-orange-700 bg-orange-100 dark:text-white dark:bg-orange-600' : 'text-red-700 bg-red-100 dark:text-white dark:bg-red-600'}`}>
                        {item.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{item.fecha}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      <button 
                        onClick={() => setDeleteTarget(item.id)} 
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

      {/* MODAL AGREGAR PEDIDO */}
      {isModalOpen && (
        <ModalPortal>
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50" style={{ paddingTop: '18vh', transform: 'translateZ(0)' }}>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 inline-block border dark:border-gray-700 animate-modal-enter">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2 uppercase tracking-wide">
              AGREGAR PEDIDO
            </h3>
            
            <form onSubmit={handleSubmitModal}>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 uppercase mb-1">ID</label>
                <input 
                  type="text" 
                  required 
                  className={`w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray ${idError ? 'border-red-500 focus:border-red-500' : 'dark:border-gray-600 focus:border-purple-400'}`}
                  value={formData.id} 
                  onChange={handleIdChange} 
                  placeholder="Ingrese ID" 
                />
                {idError && (
                  <p className="text-[13px] text-red-500 dark:text-red-400 mt-1.5 font-bold tracking-wide">
                    * El ID debe contener solo números
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 uppercase mb-1">NOMBRE</label>
                <input type="text" required className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray" value={formData.cliente} onChange={(e) => setFormData({...formData, cliente: e.target.value})} placeholder="Ingrese Nombre" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 uppercase mb-1">TIPO</label>
                <input type="text" readOnly className="w-full p-2 text-sm border rounded-md bg-gray-100 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300 cursor-not-allowed" value={formData.tipo} placeholder="TIPO" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 uppercase mb-1">ESTADO</label>
                <select className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray" value={formData.estado} onChange={(e) => setFormData({...formData, estado: e.target.value})}>
                  <option value="Procesando">Procesando</option>
                  <option value="Completado">Completado</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 uppercase mb-1">FECHA</label>
                <input type="text" required className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray" value={formData.fecha} onChange={(e) => setFormData({...formData, fecha: e.target.value})} placeholder="Ingrese FECHA" />
              </div>

              <div className="flex justify-end space-x-4 border-t dark:border-gray-700 mt-6 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition-colors duration-150 border border-gray-300 rounded-lg dark:text-gray-400 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:outline-none focus:shadow-outline-gray"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-medium leading-5 transition-colors duration-150 rounded-lg focus:outline-none shadow-md text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
        </ModalPortal>
      )}

      {/* MODAL ELIMINAR */}
      {deleteTarget && (
        <ModalPortal>
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50" style={{ paddingTop: '18vh', transform: 'translateZ(0)' }}>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-80 text-center border dark:border-gray-700 animate-modal-enter">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-100 mb-6">
              ¿Desea eliminar este usuario de la lista de pedidos?
            </p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => setDeleteTarget(null)} 
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded border border-transparent transition-colors duration-150 focus:outline-none"
              >
                No
              </button>
              <button 
                onClick={handleConfirmarEliminar} 
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 dark:bg-red-800 rounded transition-colors duration-150 focus:outline-none shadow-sm"
              >
                Sí
              </button>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}
    </Layout>
  );
}