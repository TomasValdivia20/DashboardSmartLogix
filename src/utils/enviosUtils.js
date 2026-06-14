const GOOGLE_MAPS_BASE = 'https://www.google.com/maps/dir/?api=1';
const ORIGIN = 'Bodega+Central,+Santiago,+Chile';

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
