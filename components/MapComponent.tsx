import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, useMap, Marker, Popup, Circle, Polygon } from 'react-leaflet'
import { useTranslation } from 'react-i18next'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  })
}

interface MapComponentProps {
  mapType: 'administrative' | 'satellite'
  filters: {
    region: string
    district: string
    year: string
    season: string
    showThreat: boolean
    showTreated: boolean
    weather?: string
  }
}

interface MapDataPoint {
  id: number
  region: string
  district: string
  year: number
  season: string
  latitude: number
  longitude: number
  threat_level: number
  treated_area: number
  population_density: number
  temperature?: number
  precipitation?: number
  humidity?: number
  wind_speed?: number
}

// Basic administrative boundaries for Kazakhstan regions (simplified)
const regionBoundaries: { [key: string]: [number, number][] } = {
  'Алматы': [[43.2, 76.8], [43.4, 76.8], [43.4, 77.0], [43.2, 77.0], [43.2, 76.8]],
  'Акмола': [[51.0, 69.0], [51.5, 69.0], [51.5, 70.0], [51.0, 70.0], [51.0, 69.0]],
  'Актобе': [[50.2, 57.0], [50.5, 57.0], [50.5, 58.0], [50.2, 58.0], [50.2, 57.0]],
  'Атырау': [[47.0, 51.8], [47.3, 51.8], [47.3, 52.0], [47.0, 52.0], [47.0, 51.8]],
  'Восточно-Казахстанская': [[49.5, 82.5], [50.0, 82.5], [50.0, 83.5], [49.5, 83.5], [49.5, 82.5]],
  'Жамбыл': [[42.8, 71.3], [43.0, 71.3], [43.0, 71.5], [42.8, 71.5], [42.8, 71.3]],
  'Западно-Казахстанская': [[51.0, 50.0], [51.5, 50.0], [51.5, 51.0], [51.0, 51.0], [51.0, 50.0]],
  'Караганда': [[49.8, 73.0], [50.2, 73.0], [50.2, 73.5], [49.8, 73.5], [49.8, 73.0]],
  'Костанай': [[53.2, 63.5], [53.5, 63.5], [53.5, 64.0], [53.2, 64.0], [53.2, 63.5]],
  'Кызылорда': [[44.8, 65.5], [45.0, 65.5], [45.0, 65.8], [44.8, 65.8], [44.8, 65.5]],
  'Мангистау': [[43.5, 51.0], [43.8, 51.0], [43.8, 51.3], [43.5, 51.3], [43.5, 51.0]],
  'Павлодар': [[52.2, 76.8], [52.5, 76.8], [52.5, 77.2], [52.2, 77.2], [52.2, 76.8]],
  'Северо-Казахстанская': [[54.0, 69.0], [54.5, 69.0], [54.5, 69.5], [54.0, 69.5], [54.0, 69.0]],
  'Туркестан': [[43.0, 68.0], [43.3, 68.0], [43.3, 68.5], [43.0, 68.5], [43.0, 68.0]],
  'Южно-Казахстанская': [[42.3, 69.5], [42.6, 69.5], [42.6, 70.0], [42.3, 70.0], [42.3, 69.5]],
}

function MapUpdater({ mapType, filters }: MapComponentProps) {
  const map = useMap()

  useEffect(() => {
    // Center on Kazakhstan
    map.setView([48.0196, 66.9237], 6)
  }, [map, mapType])

  return null
}

function MapLayers({ filters, mapData }: { filters: MapComponentProps['filters'], mapData: MapDataPoint[] }) {
  return (
    <>
      {/* Administrative boundaries */}
      {filters.region && regionBoundaries[filters.region] && (
        <Polygon
          positions={regionBoundaries[filters.region]}
          pathOptions={{ color: '#0066cc', fillColor: '#0066cc', fillOpacity: 0.1, weight: 2 }}
        />
      )}

      {/* Threat markers and circles */}
      {filters.showThreat && mapData
        .filter(point => point.threat_level > 0 && point.latitude && point.longitude)
        .map(point => (
          <Circle
            key={`threat-${point.id}`}
            center={[point.latitude, point.longitude]}
            radius={point.threat_level * 10000}
            pathOptions={{
              color: point.threat_level >= 3 ? '#ff0000' : point.threat_level >= 2 ? '#ff8800' : '#ffaa00',
              fillColor: point.threat_level >= 3 ? '#ff0000' : point.threat_level >= 2 ? '#ff8800' : '#ffaa00',
              fillOpacity: 0.3,
              weight: 2
            }}
          >
            <Popup>
              <div>
                <strong>Угроза вспышки</strong><br />
                Область: {point.region}<br />
                Район: {point.district}<br />
                Уровень угрозы: {point.threat_level}/5<br />
                Год: {point.year}, {point.season === 'spring' ? 'Весна' : 'Осень'}<br />
                {point.temperature !== null && point.temperature !== undefined && <>Температура: {point.temperature.toFixed(1)}°C<br /></>}
                {point.precipitation !== null && point.precipitation !== undefined && <>Осадки: {point.precipitation.toFixed(1)} мм<br /></>}
                {point.humidity !== null && point.humidity !== undefined && <>Влажность: {point.humidity.toFixed(0)}%<br /></>}
                {point.wind_speed !== null && point.wind_speed !== undefined && <>Ветер: {point.wind_speed.toFixed(1)} м/с<br /></>}
              </div>
            </Popup>
          </Circle>
        ))}

      {/* Treated areas */}
      {filters.showTreated && mapData
        .filter(point => point.treated_area > 0 && point.latitude && point.longitude)
        .map(point => (
          <Circle
            key={`treated-${point.id}`}
            center={[point.latitude, point.longitude]}
            radius={Math.sqrt(point.treated_area) * 1000}
            pathOptions={{
              color: '#00aa00',
              fillColor: '#00aa00',
              fillOpacity: 0.2,
              weight: 2
            }}
          >
            <Popup>
              <div>
                <strong>Обработанная площадь</strong><br />
                Область: {point.region}<br />
                Район: {point.district}<br />
                Площадь: {point.treated_area.toFixed(2)} га<br />
                Год: {point.year}, {point.season === 'spring' ? 'Весна' : 'Осень'}<br />
                {point.temperature !== null && point.temperature !== undefined && <>Температура: {point.temperature.toFixed(1)}°C<br /></>}
                {point.precipitation !== null && point.precipitation !== undefined && <>Осадки: {point.precipitation.toFixed(1)} мм<br /></>}
                {point.humidity !== null && point.humidity !== undefined && <>Влажность: {point.humidity.toFixed(0)}%<br /></>}
                {point.wind_speed !== null && point.wind_speed !== undefined && <>Ветер: {point.wind_speed.toFixed(1)} м/с<br /></>}
              </div>
            </Popup>
          </Circle>
        ))}

      {/* Data points markers */}
      {mapData
        .filter(point => point.latitude && point.longitude)
        .map(point => (
          <Marker key={point.id} position={[point.latitude, point.longitude]}>
            <Popup>
              <div>
                <strong>{point.region}</strong><br />
                Район: {point.district || 'Не указан'}<br />
                Год: {point.year}, {point.season === 'spring' ? 'Весна' : 'Осень'}<br />
                {point.threat_level > 0 && <>Уровень угрозы: {point.threat_level}/5<br /></>}
                {point.treated_area > 0 && <>Обработано: {point.treated_area.toFixed(2)} га<br /></>}
                {point.population_density > 0 && <>Плотность: {point.population_density.toFixed(2)}<br /></>}
                {point.temperature !== null && point.temperature !== undefined && <>Температура: {point.temperature.toFixed(1)}°C<br /></>}
                {point.precipitation !== null && point.precipitation !== undefined && <>Осадки: {point.precipitation.toFixed(1)} мм<br /></>}
                {point.humidity !== null && point.humidity !== undefined && <>Влажность: {point.humidity.toFixed(0)}%<br /></>}
                {point.wind_speed !== null && point.wind_speed !== undefined && <>Ветер: {point.wind_speed.toFixed(1)} м/с<br /></>}
              </div>
            </Popup>
          </Marker>
        ))}
    </>
  )
}

export default function MapComponent({ mapType, filters }: MapComponentProps) {
  const { t } = useTranslation()
  const center: [number, number] = [48.0196, 66.9237] // Kazakhstan center
  const zoom = 6
  const [mapData, setMapData] = useState<MapDataPoint[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchMapData = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          ...(filters.region && { region: filters.region }),
          ...(filters.district && { district: filters.district }),
          ...(filters.year && { year: filters.year }),
          ...(filters.season && { season: filters.season }),
          ...(filters.weather && { weather: filters.weather }),
          showThreat: filters.showThreat.toString(),
          showTreated: filters.showTreated.toString(),
        })

        const response = await fetch(`/api/map-data?${params}`)
        if (response.ok) {
          const data = await response.json()
          setMapData(data)
        }
      } catch (error) {
        console.error('Error fetching map data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMapData()
  }, [filters])

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <MapUpdater mapType={mapType} filters={filters} />
      
      {mapType === 'satellite' ? (
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a> &copy; <a href="https://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
      ) : (
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      )}
      
      <MapLayers filters={filters} mapData={mapData} />
      
      {loading && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'white',
          padding: '10px',
          borderRadius: '4px',
          zIndex: 1000,
          border: '2px solid #333',
          fontWeight: 'bold'
        }}>
          {t('maps.loading')}
        </div>
      )}
    </MapContainer>
  )
}



