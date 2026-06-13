export function isValidPedidoId(id) {
  return typeof id === 'string' && /^\d+$/.test(id);
}

export function addPedido(pedidos, formData) {
  return [formData, ...pedidos];
}

export function deletePedido(pedidos, id) {
  return pedidos.filter((item) => item.id !== id);
}
