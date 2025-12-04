import React, { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import styles from './MapPicker.module.css'

// Fix for default marker icons
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  })
}

interface MapPickerProps {
  latitude: number | null
  longitude: number | null
  onLocationChange: (lat: number, lng: number) => void
}

function MapClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationChange(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function MapPicker({ latitude, longitude, onLocationChange }: MapPickerProps) {
  const center: [number, number] = latitude && longitude ? [latitude, longitude] : [48.0196, 66.9237]

  return (
    <div className={styles.mapPicker}>
      <div className={styles.mapContainer}>
        <MapContainer
          center={center}
          zoom={latitude && longitude ? 10 : 6}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationChange={onLocationChange} />
          {latitude && longitude && (
            <Marker position={[latitude, longitude]} />
          )}
        </MapContainer>
      </div>
      <p className={styles.hint}>
        Кликните на карте, чтобы выбрать координаты
      </p>
    </div>
  )
}

