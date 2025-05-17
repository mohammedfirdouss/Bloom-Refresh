import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { LeafletMouseEvent } from 'leaflet';

interface EventMapProps {
  center: [number, number];
  marker?: [number, number];
  onSelectLocation?: (lat: number, lng: number) => void;
  selectable?: boolean;
  height?: string;
}

const LocationSelector = ({ onSelectLocation }: { onSelectLocation: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onSelectLocation(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const EventMap: React.FC<EventMapProps> = ({ center, marker, onSelectLocation, selectable = false, height = '300px' }) => {
  return (
    <MapContainer center={center} zoom={13} style={{ height, width: '100%' }} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {marker && <Marker position={marker} />} 
      {selectable && onSelectLocation && <LocationSelector onSelectLocation={onSelectLocation} />}
    </MapContainer>
  );
};

export default EventMap; 