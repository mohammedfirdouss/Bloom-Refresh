import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapDisplayProps {
  lat: number;
  lng: number;
  markerLabel?: string;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ lat, lng, markerLabel }) => {
  return (
    <MapContainer center={[lat, lng]} zoom={13} style={{ height: '300px', width: '100%' }} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>
        <Popup>{markerLabel || 'Event Location'}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapDisplay; 