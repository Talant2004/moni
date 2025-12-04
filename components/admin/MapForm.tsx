import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './AdminForm.module.css'

interface MapLayerData {
  name: string
  name_kk: string
  layer_type: 'polygon' | 'point' | 'heatmap'
  year: number
  season: 'spring' | 'autumn'
  visible: boolean
  color: string
  opacity: number
  animation_start: string
  animation_end: string
  kml_file: File | null
}

export default function MapForm() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<MapLayerData>({
    name: '',
    name_kk: '',
    layer_type: 'polygon',
    year: new Date().getFullYear(),
    season: 'spring',
    visible: false,
    color: '#00FF00',
    opacity: 0.7,
    animation_start: '',
    animation_end: '',
    kml_file: null
  })

  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i)

  const handleChange = (field: keyof MapLayerData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)

    try {
      const dataToSend = {
        ...formData,
        kml_file: null
      }

      const response = await fetch('/api/admin/map-layers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      })

      if (response.ok) {
        setMessage({ type: 'success', text: t('admin.success') })
        setFormData({
          name: '',
          name_kk: '',
          layer_type: 'polygon',
          year: new Date().getFullYear(),
          season: 'spring',
          visible: false,
          color: '#00FF00',
          opacity: 0.7,
          animation_start: '',
          animation_end: '',
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
      <h2 className={styles.formTitle}>{t('admin.maps.title')}</h2>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div className={styles.row}>
        <div className={styles.field}>
          <label>{t('admin.maps.name_ru')} *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label>{t('admin.maps.name_kk')}</label>
          <input
            type="text"
            value={formData.name_kk}
            onChange={(e) => handleChange('name_kk', e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>{t('admin.maps.layer_type')} *</label>
          <select
            value={formData.layer_type}
            onChange={(e) => handleChange('layer_type', e.target.value)}
            required
            className={styles.select}
          >
            <option value="polygon">{t('admin.maps.polygon')}</option>
            <option value="point">{t('admin.maps.point')}</option>
            <option value="heatmap">{t('admin.maps.heatmap')}</option>
          </select>
        </div>
        <div className={styles.field}>
          <label>{t('admin.maps.year')} *</label>
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
      </div>

      <div className={styles.field}>
        <label>{t('admin.maps.season')} *</label>
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

      <div className={styles.row}>
        <div className={styles.field}>
          <label>{t('admin.maps.color')}</label>
          <input
            type="color"
            value={formData.color}
            onChange={(e) => handleChange('color', e.target.value)}
            className={styles.input}
            style={{ height: '48px' }}
          />
        </div>
        <div className={styles.field}>
          <label>{t('admin.maps.opacity')}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={formData.opacity}
            onChange={(e) => handleChange('opacity', parseFloat(e.target.value))}
            className={styles.input}
          />
          <span>{Math.round(formData.opacity * 100)}%</span>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>{t('admin.maps.animation_start')}</label>
          <input
            type="date"
            value={formData.animation_start}
            onChange={(e) => handleChange('animation_start', e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label>{t('admin.maps.animation_end')}</label>
          <input
            type="date"
            value={formData.animation_end}
            onChange={(e) => handleChange('animation_end', e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={formData.visible}
            onChange={(e) => handleChange('visible', e.target.checked)}
          />
          {t('admin.maps.visible_default')}
        </label>
      </div>

      <div className={styles.field}>
        <label>{t('admin.maps.kml_file')}</label>
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

