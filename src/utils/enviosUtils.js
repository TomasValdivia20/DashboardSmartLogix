const GOOGLE_MAPS_BASE = 'https://www.google.com/maps/dir/?api=1';
const ORIGIN = 'Bodega+Central,+Santiago,+Chile';

export function distanciaHaversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function googleMapsUrl(items) {
  const base = GOOGLE_MAPS_BASE;
  const origin = ORIGIN;
  const dests = items.map((it) => encodeURIComponent(it.pedido.direccion));
  if (dests.length === 0) return base;

  const destination = dests[dests.length - 1];
  const waypoints = dests.slice(0, -1).join('|');
  let url = `${base}&origin=${origin}&destination=${destination}&travelmode=driving`;
  if (waypoints) url += `&waypoints=${waypoints}`;
  return url;
}
