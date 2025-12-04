import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import dynamic from 'next/dynamic'
import styles from './AdminForm.module.css'

const MapPicker = dynamic(() => import('./MapPicker'), { ssr: false })

interface InvasionData {
  title: string
  title_kk: string
  year: number
  season: 'spring' | 'autumn'
  region: string
  district: string
  description: string
  description_kk: string
  full_text: string
  full_text_kk: string
  latitude: number | null
  longitude: number | null
  threat_level: boolean
  treated_area: boolean
  temperature: boolean
  precipitation: boolean
  humidity: boolean
  wind_speed: boolean
  photos: File[]
  links: Array<{ title: string; url: string }>
  kml_file: File | null
}

export default function InvasionForm() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<InvasionData>({
    title: '',
    title_kk: '',
    year: new Date().getFullYear(),
    season: 'spring',
    region: '',
    district: '',
    description: '',
    description_kk: '',
    full_text: '',
    full_text_kk: '',
    latitude: null,
    longitude: null,
    threat_level: false,
    treated_area: false,
    temperature: false,
    precipitation: false,
    humidity: false,
    wind_speed: false,
    photos: [],
    links: [{ title: '', url: '' }],
    kml_file: null
  })

  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const regions = [
    'Алматы', 'Акмола', 'Актобе', 'Атырау', 'Восточно-Казахстанская',
    'Жамбыл', 'Западно-Казахстанская', 'Караганда', 'Костанай', 'Кызылорда',
    'Мангистау', 'Павлодар', 'Северо-Казахстанская', 'Туркестан', 'Южно-Казахстанская'
  ]

  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i)

  const handleChange = (field: keyof InvasionData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleChange('photos', Array.from(e.target.files))
    }
  }

  const handleLinkChange = (index: number, field: 'title' | 'url', value: string) => {
    const newLinks = [...formData.links]
    newLinks[index] = { ...newLinks[index], [field]: value }
    handleChange('links', newLinks)
  }

  const addLink = () => {
    handleChange('links', [...formData.links, { title: '', url: '' }])
  }

  const removeLink = (index: number) => {
    handleChange('links', formData.links.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)

    try {
      const dataToSend = {
        ...formData,
        photos: [], // File upload will be handled separately later
        kml_file: null
      }

      const response = await fetch('/api/admin/invasions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      })

      if (response.ok) {
        setMessage({ type: 'success', text: t('admin.success') })
        // Reset form
        setFormData({
          title: '',
          title_kk: '',
          year: new Date().getFullYear(),
          season: 'spring',
          region: '',
          district: '',
          description: '',
          description_kk: '',
          full_text: '',
          full_text_kk: '',
          latitude: null,
          longitude: null,
          threat_level: false,
          treated_area: false,
          temperature: false,
          precipitation: false,
          humidity: false,
          wind_speed: false,
          photos: [],
          links: [{ title: '', url: '' }],
          kml_file: null
        })
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || t('admin.error') })
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('admin.error') })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.formTitle}>{t('admin.invasions.title')}</h2>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div className={styles.row}>
        <div className={styles.field}>
          <label>{t('admin.invasions.title_ru')} *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label>{t('admin.invasions.title_kk')}</label>
          <input
            type="text"
            value={formData.title_kk}
            onChange={(e) => handleChange('title_kk', e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>{t('admin.invasions.year')} *</label>
          <select
            value={formData.year}
            onChange={(e) => handleChange('year', parseInt(e.target.value))}
            required
            className={styles.select}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label>{t('admin.invasions.season')} *</label>
          <select
            value={formData.season}
            onChange={(e) => handleChange('season', e.target.value)}
            required
            className={styles.select}
          >
            <option value="spring">{t('maps.spring')}</option>
            <option value="autumn">{t('maps.autumn')}</option>
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>{t('admin.invasions.region')} *</label>
          <select
            value={formData.region}
            onChange={(e) => handleChange('region', e.target.value)}
            required
            className={styles.select}
          >
            <option value="">{t('admin.select')}</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label>{t('admin.invasions.district')}</label>
          <input
            type="text"
            value={formData.district}
            onChange={(e) => handleChange('district', e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label>{t('admin.invasions.description_ru')}</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className={styles.textarea}
        />
      </div>

      <div className={styles.field}>
        <label>{t('admin.invasions.description_kk')}</label>
        <textarea
          value={formData.description_kk}
          onChange={(e) => handleChange('description_kk', e.target.value)}
          rows={3}
          className={styles.textarea}
        />
      </div>

      <div className={styles.field}>
        <label>{t('admin.invasions.full_text_ru')}</label>
        <textarea
          value={formData.full_text}
          onChange={(e) => handleChange('full_text', e.target.value)}
          rows={6}
          className={styles.textarea}
        />
      </div>

      <div className={styles.field}>
        <label>{t('admin.invasions.full_text_kk')}</label>
        <textarea
          value={formData.full_text_kk}
          onChange={(e) => handleChange('full_text_kk', e.target.value)}
          rows={6}
          className={styles.textarea}
        />
      </div>

      <div className={styles.field}>
        <label>{t('admin.invasions.coordinates')}</label>
        <MapPicker
          latitude={formData.latitude}
          longitude={formData.longitude}
          onLocationChange={(lat, lng) => {
            handleChange('latitude', lat)
            handleChange('longitude', lng)
          }}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>{t('admin.invasions.latitude')}</label>
          <input
            type="number"
            step="any"
            value={formData.latitude || ''}
            onChange={(e) => handleChange('latitude', e.target.value ? parseFloat(e.target.value) : null)}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label>{t('admin.invasions.longitude')}</label>
          <input
            type="number"
            step="any"
            value={formData.longitude || ''}
            onChange={(e) => handleChange('longitude', e.target.value ? parseFloat(e.target.value) : null)}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.checkboxGroup}>
        <h3>{t('admin.invasions.weather_data')}</h3>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={formData.temperature}
            onChange={(e) => handleChange('temperature', e.target.checked)}
          />
          {t('maps.weatherTemperature')}
        </label>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={formData.precipitation}
            onChange={(e) => handleChange('precipitation', e.target.checked)}
          />
          {t('maps.weatherPrecipitation')}
        </label>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={formData.humidity}
            onChange={(e) => handleChange('humidity', e.target.checked)}
          />
          {t('maps.weatherHumidity')}
        </label>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={formData.wind_speed}
            onChange={(e) => handleChange('wind_speed', e.target.checked)}
          />
          {t('maps.weatherWind')}
        </label>
      </div>

      <div className={styles.checkboxGroup}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={formData.threat_level}
            onChange={(e) => handleChange('threat_level', e.target.checked)}
          />
          {t('admin.invasions.threat_level')}
        </label>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={formData.treated_area}
            onChange={(e) => handleChange('treated_area', e.target.checked)}
          />
          {t('admin.invasions.treated_area')}
        </label>
      </div>

      <div className={styles.field}>
        <label>{t('admin.invasions.photos')}</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoChange}
          className={styles.fileInput}
        />
        {formData.photos.length > 0 && (
          <div className={styles.fileList}>
            {formData.photos.map((photo, i) => (
              <span key={i} className={styles.fileItem}>{photo.name}</span>
            ))}
          </div>
        )}
      </div>

      <div className={styles.field}>
        <label>{t('admin.invasions.links')}</label>
        {formData.links.map((link, index) => (
          <div key={index} className={styles.linkRow}>
            <input
              type="text"
              placeholder={t('admin.invasions.link_title')}
              value={link.title}
              onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
              className={styles.input}
            />
            <input
              type="url"
              placeholder="URL"
              value={link.url}
              onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
              className={styles.input}
            />
            {formData.links.length > 1 && (
              <button
                type="button"
                onClick={() => removeLink(index)}
                className={styles.removeButton}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addLink}
          className={styles.addButton}
        >
          + {t('admin.invasions.add_link')}
        </button>
      </div>

      <div className={styles.field}>
        <label>{t('admin.invasions.kml_file')}</label>
        <input
          type="file"
          accept=".kml,.geojson,.json"
          onChange={(e) => handleChange('kml_file', e.target.files?.[0] || null)}
          className={styles.fileInput}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={styles.submitButton}
      >
        {submitting ? t('admin.submitting') : t('admin.submit')}
      </button>
    </form>
  )
}

