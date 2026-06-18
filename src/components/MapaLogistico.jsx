import { useState, useRef } from 'react';
import Map, { Marker, NavigationControl, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const ESTILOS = {
  day: 'mapbox://styles/mapbox/streets-v12',
};

const estiloLineaRuta = {
  id: 'ruta-layer',
  type: 'line',
  paint: {
    'line-color': '#ff3366',
    'line-width': 6,
    'line-opacity': 0.8,
  },
};

export default function MapaLogistico({
  rutaGeoJSON,
  envios = [],
  envioSeleccionadoId,
  onEnvioClick,
}) {
  const mapRef = useRef(null);

  const [viewState, setViewState] = useState({
    longitude: -70.6506,
    latitude: -33.4372,
    zoom: 12,
    pitch: 0,
    bearing: 0,
  });

  const TOKEN_MAPBOX = import.meta.env.VITE_MAPBOX_TOKEN;

  return (
    <div className="w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={TOKEN_MAPBOX}
        mapStyle={ESTILOS.day}
        style={{ width: '100%', height: '500px' }}
        attributionControl={false}
      >
        <NavigationControl position="top-right" />

        <Marker longitude={-70.6506} latitude={-33.4372} color="#f97316" />

        {envios.map((envio) => {
          if (!envio.latitud || !envio.longitud) return null;
          const seleccionado = envioSeleccionadoId === envio.id;
          return (
            <Marker
              key={envio.id}
              longitude={parseFloat(envio.longitud)}
              latitude={parseFloat(envio.latitud)}
              color={seleccionado ? '#ff3366' : '#3b82f6'}
              onClick={() => onEnvioClick && onEnvioClick(envio.id)}
              style={{ cursor: 'pointer' }}
            />
          );
        })}

        {rutaGeoJSON && rutaGeoJSON.coordinates && (
          <Marker
            longitude={rutaGeoJSON.coordinates.slice(-1)[0][0]}
            latitude={rutaGeoJSON.coordinates.slice(-1)[0][1]}
            color="#22c55e"
          />
        )}

        {rutaGeoJSON && (
          <Source id="ruta-source" type="geojson" data={rutaGeoJSON}>
            <Layer {...estiloLineaRuta} />
          </Source>
        )}
      </Map>
    </div>
  );
}
