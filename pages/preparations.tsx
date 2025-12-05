import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import styles from '../styles/Preparations.module.css'

interface Preparation {
  id: number
  name: string
  description: string
  activeSubstance?: string
  applicationMethod?: string
  photos?: string[]
  links?: Array<{ title: string; url: string }>
}

export default function Preparations() {
  const { t } = useTranslation()
  const router = useRouter()
  const [preparations, setPreparations] = useState<Preparation[]>([])

  useEffect(() => {
    const locale = router.locale || 'ru'
    fetch('/api/preparations', {
      headers: {
        'Accept-Language': locale
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPreparations(data.map((prep: any) => ({
            id: prep.id,
            name: prep.name,
            description: prep.description,
            activeSubstance: prep.active_substance,
            applicationMethod: prep.application_method,
            photos: prep.photos || [],
            links: prep.links || []
          })))
        }
      })
      .catch(err => {
        console.error('Error loading preparations:', err)
        // Fallback to mock data if API fails
        setPreparations([
          {
            id: 1,
            name: locale === 'kk' ? 'Диазинон' : 'Диазинон',
            description: locale === 'kk' ? 'Контактты-ішек әсері бар инсектицид' : 'Инсектицид контактно-кишечного действия для борьбы со стадными саранчовыми',
            activeSubstance: locale === 'kk' ? 'Диазинон' : 'Диазинон',
            applicationMethod: locale === 'kk' ? 'Бүрку' : 'Опрыскивание'
          }
        ])
      })
  }, [router.locale])

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('preparations.title')}</h1>
        <p className={styles.description}>{t('preparations.description')}</p>

        <div className={styles.preparationsList}>
          {preparations.length > 0 ? (
            preparations.map((prep) => (
              <div key={prep.id} className={styles.preparationCard}>
                {prep.photos && prep.photos.length > 0 && (
                  <div className={styles.preparationPhotos}>
                    {prep.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`${prep.name} - ${t('preparations.photo', { number: index + 1 })}`}
                        className={styles.preparationPhoto}
                      />
                    ))}
                  </div>
                )}
                <h3 className={styles.preparationName}>{prep.name}</h3>
                <p className={styles.preparationDescription}>{prep.description}</p>
                {prep.activeSubstance && (
                  <p className={styles.preparationDetail}>
                    <strong>{t('preparations.activeSubstance')}:</strong> {prep.activeSubstance}
                  </p>
                )}
                {prep.applicationMethod && (
                  <p className={styles.preparationDetail}>
                    <strong>{t('preparations.applicationMethod')}:</strong> {prep.applicationMethod}
                  </p>
                )}
                {prep.links && prep.links.length > 0 && (
                  <div className={styles.preparationLinks}>
                    {prep.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.preparationLink}
                      >
                        {link.title || link.url}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className={styles.noPreparations}>{t('preparations.noPreparations')}</p>
          )}
        </div>
      </div>
    </Layout>
  )
}

