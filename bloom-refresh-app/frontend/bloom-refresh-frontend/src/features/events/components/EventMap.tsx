'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { LeafletMouseEvent } from 'leaflet';
import { useMapEvents } from 'react-leaflet';
import type { MapContainerProps } from 'react-leaflet';
import type { TileLayerProps } from 'react-leaflet';
import type { MarkerProps } from 'react-leaflet';

// Dynamically import leaflet components to avoid SSR issues
const MapContainer = dynamic<MapContainerProps>(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic<TileLayerProps>(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic<MarkerProps>(
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

const MapWrapper = ({ center, marker, onSelectLocation, selectable, height }: EventMapProps) => {
  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height, width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {marker && <Marker position={marker} />} 
      {selectable && onSelectLocation && <LocationSelector onSelectLocation={onSelectLocation} />}
    </MapContainer>
  );
};

const EventMap: React.FC<EventMapProps> = (props) => {
  return <MapWrapper {...props} />;
};

export default EventMap;