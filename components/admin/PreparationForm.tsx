import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './AdminForm.module.css'

interface PreparationData {
  name: string
  name_kk: string
  prep_type: string
  dosage: string
  description: string
  description_kk: string
  active_substance: string
  active_substance_kk: string
  application_method: string
  application_method_kk: string
  links: Array<{ title: string; url: string }>
  photos: File[]
}

export default function PreparationForm() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<PreparationData>({
    name: '',
    name_kk: '',
    prep_type: '',
    dosage: '',
    description: '',
    description_kk: '',
    active_substance: '',
    active_substance_kk: '',
    application_method: '',
    application_method_kk: '',
    links: [{ title: '', url: '' }],
    photos: []
  })

  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const prepTypes = ['Газ', 'Гранулы', 'Спрей', 'Порошок', 'Жидкость']

  const handleChange = (field: keyof PreparationData, value: any) => {
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
      // Convert photos to base64
      const photoData: string[] = []
      if (formData.photos.length > 0) {
        for (const photo of formData.photos) {
          const reader = new FileReader()
          const base64 = await new Promise<string>((resolve, reject) => {
            reader.onload = () => {
              const result = reader.result as string
              resolve(result)
            }
            reader.onerror = reject
            reader.readAsDataURL(photo)
          })
          photoData.push(base64)
        }
      }

      const dataToSend = {
        ...formData,
        photos: photoData,
        photos_files: undefined // Remove File objects
      }

      const response = await fetch('/api/admin/preparations', {
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
          prep_type: '',
          dosage: '',
          description: '',
          description_kk: '',
          active_substance: '',
          active_substance_kk: '',
          application_method: '',
          application_method_kk: '',
          links: [{ title: '', url: '' }],
          photos: []
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
      <h2 className={styles.formTitle}>{t('admin.preparations.title')}</h2>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div className={styles.row}>
        <div className={styles.field}>
          <label>{t('admin.preparations.name_ru')} *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label>{t('admin.preparations.name_kk')}</label>
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
          <label>{t('admin.preparations.type')}</label>
          <select
            value={formData.prep_type}
            onChange={(e) => handleChange('prep_type', e.target.value)}
            className={styles.select}
          >
            <option value="">{t('admin.select')}</option>
            {prepTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label>{t('admin.preparations.dosage')}</label>
          <input
            type="text"
            value={formData.dosage}
            onChange={(e) => handleChange('dosage', e.target.value)}
            placeholder="г/га или л/га"
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>{t('admin.preparations.active_substance_ru')}</label>
          <input
            type="text"
            value={formData.active_substance}
            onChange={(e) => handleChange('active_substance', e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label>{t('admin.preparations.active_substance_kk')}</label>
          <input
            type="text"
            value={formData.active_substance_kk}
            onChange={(e) => handleChange('active_substance_kk', e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>{t('admin.preparations.application_method_ru')}</label>
          <input
            type="text"
            value={formData.application_method}
            onChange={(e) => handleChange('application_method', e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label>{t('admin.preparations.application_method_kk')}</label>
          <input
            type="text"
            value={formData.application_method_kk}
            onChange={(e) => handleChange('application_method_kk', e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label>{t('admin.preparations.description_ru')}</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={4}
          className={styles.textarea}
        />
      </div>

      <div className={styles.field}>
        <label>{t('admin.preparations.description_kk')}</label>
        <textarea
          value={formData.description_kk}
          onChange={(e) => handleChange('description_kk', e.target.value)}
          rows={4}
          className={styles.textarea}
        />
      </div>

      <div className={styles.field}>
        <label>{t('admin.preparations.photos')}</label>
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
        <label>{t('admin.preparations.links')}</label>
        {formData.links.map((link, index) => (
          <div key={index} className={styles.linkRow}>
            <input
              type="text"
              placeholder={t('admin.preparations.link_title')}
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
          + {t('admin.preparations.add_link')}
        </button>
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

