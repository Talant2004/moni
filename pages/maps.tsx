import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'
import Layout from '../components/Layout'
import styles from '../styles/Maps.module.css'

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import('../components/MapComponent'), {
  ssr: false
})

export default function Maps() {
  const { t } = useTranslation()
  const [mapType, setMapType] = useState<'administrative' | 'satellite'>('administrative')
  const [filters, setFilters] = useState({
    region: '',
    district: '',
    year: new Date().getFullYear().toString(),
    season: 'spring',
    showThreat: false,
    showTreated: false,
    weather: ''
  })
  const [appliedFilters, setAppliedFilters] = useState(filters)

  // Regions of Kazakhstan
  const regions = [
    'Алматы',
    'Акмола',
    'Актобе',
    'Атырау',
    'Восточно-Казахстанская',
    'Жамбыл',
    'Западно-Казахстанская',
    'Караганда',
    'Костанай',
    'Кызылорда',
    'Мангистау',
    'Павлодар',
    'Северо-Казахстанская',
    'Туркестан',
    'Южно-Казахстанская'
  ]

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    setAppliedFilters(filters)
  }

  const resetFilters = () => {
    const defaultFilters = {
      region: '',
      district: '',
      year: new Date().getFullYear().toString(),
      season: 'spring',
      showThreat: false,
      showTreated: false,
      weather: ''
    }
    setFilters(defaultFilters)
    setAppliedFilters(defaultFilters)
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i)

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('maps.title')}</h1>

        <div className={styles.mapControls}>
          <div className={styles.mapTypeButtons}>
            <button
              onClick={() => setMapType('administrative')}
              className={mapType === 'administrative' ? styles.active : ''}
            >
              {t('maps.administrative')}
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={mapType === 'satellite' ? styles.active : ''}
            >
              {t('maps.satellite')}
            </button>
          </div>
        </div>

        <div className={styles.content}>
          <aside className={styles.filtersPanel}>
            <h2>{t('maps.filters')}</h2>
            
            <div className={styles.filterGroup}>
              <label htmlFor="region">{t('maps.region')}</label>
              <select
                id="region"
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
                className={styles.select}
              >
                <option value="">{t('maps.region')}</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="district">{t('maps.district')}</label>
              <input
                id="district"
                type="text"
                value={filters.district}
                onChange={(e) => handleFilterChange('district', e.target.value)}
                className={styles.input}
                placeholder={t('maps.district')}
              />
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="year">{t('maps.year')}</label>
              <select
                id="year"
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className={styles.select}
              >
                {years.map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="season">{t('maps.season')}</label>
              <select
                id="season"
                value={filters.season}
                onChange={(e) => handleFilterChange('season', e.target.value)}
                className={styles.select}
              >
                <option value="spring">{t('maps.spring')}</option>
                <option value="autumn">{t('maps.autumn')}</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.showThreat}
                  onChange={(e) => handleFilterChange('showThreat', e.target.checked)}
                  className={styles.checkbox}
                />
                {t('maps.threat')}
              </label>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.showTreated}
                  onChange={(e) => handleFilterChange('showTreated', e.target.checked)}
                  className={styles.checkbox}
                />
                {t('maps.treated')}
              </label>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="weather">{t('maps.weather')}</label>
              <select
                id="weather"
                value={filters.weather}
                onChange={(e) => handleFilterChange('weather', e.target.value)}
                className={styles.select}
              >
                <option value="">{t('maps.weatherAll')}</option>
                <option value="temperature">{t('maps.weatherTemperature')}</option>
                <option value="precipitation">{t('maps.weatherPrecipitation')}</option>
                <option value="humidity">{t('maps.weatherHumidity')}</option>
                <option value="wind">{t('maps.weatherWind')}</option>
              </select>
            </div>

            <div className={styles.filterActions}>
              <button onClick={applyFilters} className={styles.applyButton}>
                {t('maps.apply')}
              </button>
              <button onClick={resetFilters} className={styles.resetButton}>
                {t('maps.reset')}
              </button>
            </div>
          </aside>

          <div className={styles.mapContainer}>
            <MapComponent mapType={mapType} filters={appliedFilters} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

