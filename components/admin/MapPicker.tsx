import React, { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import styles from './MapPicker.module.css'

const MapComponent = dynamic(() => import('../MapComponent'), { ssr: false })

interface MapPickerProps {
  latitude: number | null
  longitude: number | null
  onLocationChange: (lat: number, lng: number) => void
}

export default function MapPicker({ latitude, longitude, onLocationChange }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mapRef.current && latitude && longitude) {
      // Map will be rendered by MapComponent
    }
  }, [latitude, longitude])

  return (
    <div className={styles.mapPicker}>
      <div className={styles.mapContainer} ref={mapRef}>
        <MapComponent
          mapType="administrative"
          filters={{}}
          onMapClick={(lat: number, lng: number) => {
            onLocationChange(lat, lng)
          }}
        />
      </div>
      <p className={styles.hint}>
        Кликните на карте, чтобы выбрать координаты
      </p>
    </div>
  )
}

