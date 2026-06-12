const pedidosMock = [
  { id: '10372', cliente: 'Fabian Cuevas', direccion: 'Av. Providencia 1234, Santiago', valor_base: '45000.00' },
  { id: '10234', cliente: 'Juan Perez', direccion: 'Av. Apoquindo 456, Las Condes', valor_base: '32500.00' },
  { id: '10232', cliente: 'Carlos Ruiz', direccion: 'Gran Avenida 789, San Miguel', valor_base: '28000.00' },
  { id: '10230', cliente: 'Luis Torres', direccion: 'Av. Matta 1010, Santiago Centro', valor_base: '52000.00' },
  { id: '10228', cliente: 'Maria Soto', direccion: 'Los Héroes 555, Ñuñoa', valor_base: '18750.00' },
  { id: '10225', cliente: 'Pedro Ramirez', direccion: 'Vitacura 3200, Las Condes', valor_base: '67300.00' },
  { id: '10222', cliente: 'Ana Gonzalez', direccion: 'Irarrázaval 1234, Ñuñoa', valor_base: '41000.00' },
];

export const getPedidos = () => {
  return Promise.resolve({ data: pedidosMock });
};

export const getPedido = (id) => {
  const pedido = pedidosMock.find((p) => p.id === id);
  return Promise.resolve({ data: pedido });
};
