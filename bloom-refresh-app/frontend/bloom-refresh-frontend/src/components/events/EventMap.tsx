'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { LeafletMouseEvent } from 'leaflet';
import { useMapEvents } from 'react-leaflet';

// Dynamically import leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

interface EventMapProps {
  center: [number, number];
  marker?: [number, number];
  onSelectLocation?: (lat: number, lng: number) => void;
  selectable?: boolean;
  height?: string;
}

const LocationSelector = ({ onSelectLocation }: { onSelectLocation: (lat: number, lng: number) => void }) => {
  const mapEvents = useMapEvents({
    click(e: LeafletMouseEvent) {
      onSelectLocation(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const EventMap: React.FC<EventMapProps> = ({ center, marker, onSelectLocation, selectable = false, height = '300px' }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

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