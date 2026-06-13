import { describe, it, expect } from 'vitest';
import { isValidPedidoId, addPedido, deletePedido } from '../src/utils/pedidosUtils';
import { distanciaHaversine, googleMapsUrl } from '../src/utils/enviosUtils';

const mockPedidos = [
  { id: '1', cliente: 'Fabian' },
  { id: '2', cliente: 'Juan' },
];

const mockItems = [
  { pedido: { direccion: 'Av. Providencia 1234, Santiago' } },
  { pedido: { direccion: 'Av. Apoquindo 456, Las Condes' } },
];

describe('Pedidos utility functions', () => {
  it('valida IDs numéricos correctos', () => {
    expect(isValidPedidoId('10372')).toBe(true);
  });

  it('rechaza IDs vacíos', () => {
    expect(isValidPedidoId('')).toBe(false);
  });

  it('rechaza IDs con letras', () => {
    expect(isValidPedidoId('ABC123')).toBe(false);
  });

  it('agrega un pedido al inicio de la lista', () => {
    const formData = { id: '3', cliente: 'María' };
    const result = addPedido(mockPedidos, formData);

    expect(result[0]).toEqual(formData);
    expect(result).toHaveLength(mockPedidos.length + 1);
    expect(mockPedidos).toHaveLength(2);
  });

  it('elimina un pedido por su ID', () => {
    const result = deletePedido(mockPedidos, '1');
    expect(result).toEqual([{ id: '2', cliente: 'Juan' }]);
  });
});

describe('Envios utility functions', () => {
  it('calcula 0 km cuando las coordenadas son idénticas', () => {
    expect(distanciaHaversine(-33.4372, -70.6506, -33.4372, -70.6506)).toBeCloseTo(0, 5);
  });

  it('calcula una distancia mayor a 0 para puntos distintos', () => {
    const distance = distanciaHaversine(-33.4372, -70.6506, -33.425, -70.617);
    expect(distance).toBeGreaterThan(0);
  });

  it('devuelve la URL base cuando no hay items', () => {
    expect(googleMapsUrl([])).toBe('https://www.google.com/maps/dir/?api=1');
  });

  it('genera URL de Google Maps con un solo destino', () => {
    const oneItem = [{ pedido: { direccion: 'Av. Providencia 1234, Santiago' } }];
    expect(googleMapsUrl(oneItem)).toContain('destination=Av.%20Providencia%201234%2C%20Santiago');
    expect(googleMapsUrl(oneItem)).not.toContain('waypoints=');
  });

  it('genera URL de Google Maps con waypoint cuando hay varios destinos', () => {
    const result = googleMapsUrl(mockItems);
    expect(result).toContain('waypoints=Av.%20Providencia%201234%2C%20Santiago%7CAv.%20Apoquindo%20456%2C%20Las%20Condes');
    expect(result).toContain('destination=Av.%20Apoquindo%20456%2C%20Las%20Condes');
  });
});
