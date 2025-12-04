import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './AdminForm.module.css'

interface MethodData {
  name: string
  name_kk: string
  description: string
  description_kk: string
  photos: File[]
  video_url: string
  links: Array<{ title: string; url: string }>
}

export default function MethodForm() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<MethodData>({
    name: '',
    name_kk: '',
    description: '',
    description_kk: '',
    photos: [],
    video_url: '',
    links: [{ title: '', url: '' }]
  })

  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleChange = (field: keyof MethodData, value: any) => {
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

      const response = await fetch('/api/admin/methods', {
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
          description: '',
          description_kk: '',
          photos: [],
          video_url: '',
          links: [{ title: '', url: '' }]
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
      <h2 className={styles.formTitle}>{t('admin.methods.title')}</h2>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div className={styles.row}>
        <div className={styles.field}>
          <label>{t('admin.methods.name_ru')} *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label>{t('admin.methods.name_kk')}</label>
          <input
            type="text"
            value={formData.name_kk}
            onChange={(e) => handleChange('name_kk', e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label>{t('admin.methods.description_ru')}</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={6}
          className={styles.textarea}
        />
      </div>

      <div className={styles.field}>
        <label>{t('admin.methods.description_kk')}</label>
        <textarea
          value={formData.description_kk}
          onChange={(e) => handleChange('description_kk', e.target.value)}
          rows={6}
          className={styles.textarea}
        />
      </div>

      <div className={styles.field}>
        <label>{t('admin.methods.photos')}</label>
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
        <label>{t('admin.methods.video_url')}</label>
        <input
          type="url"
          value={formData.video_url}
          onChange={(e) => handleChange('video_url', e.target.value)}
          placeholder="https://..."
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label>{t('admin.methods.links')}</label>
        {formData.links.map((link, index) => (
          <div key={index} className={styles.linkRow}>
            <input
              type="text"
              placeholder={t('admin.methods.link_title')}
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
          + {t('admin.methods.add_link')}
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

