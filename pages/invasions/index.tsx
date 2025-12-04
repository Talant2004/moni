import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import Link from 'next/link'
import styles from '../../styles/Invasions.module.css'

interface Invasion {
  id: number
  year: number
  title: string
  description: string
  region?: string
}

export default function Invasions() {
  const { t } = useTranslation()
  const router = useRouter()
  const [invasions, setInvasions] = useState<Invasion[]>([])

  useEffect(() => {
    const locale = router.locale || 'ru'
    fetch('/api/invasions', {
      headers: {
        'Accept-Language': locale
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setInvasions(data)
        }
      })
      .catch(err => {
        console.error('Error loading invasions:', err)
        // Fallback to mock data if API fails
        setInvasions([
          {
            id: 1,
            year: 2020,
            title: locale === 'kk' ? 'Марокко шегірткесінің шабуылы 2020' : 'Нашествие мароккской саранчи 2020',
            description: locale === 'kk' ? 'Қазақстанның оңтүстік аймақтарында марокко шегірткесінің үлкен шабуылы' : 'Крупное нашествие мароккской саранчи в южных регионах Казахстана',
            region: locale === 'kk' ? 'Оңтүстік Қазақстан' : 'Южный Казахстан'
          }
        ])
      })
  }, [router.locale])

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('invasions.title')}</h1>
        <p className={styles.description}>{t('invasions.description')}</p>

        <div className={styles.invasionsGrid}>
          {invasions.length > 0 ? (
            invasions.map((invasion) => (
              <Link
                key={invasion.id}
                href={`/invasions/${invasion.id}`}
                className={styles.invasionCard}
              >
                <div className={styles.invasionYear}>{invasion.year}</div>
                <h3 className={styles.invasionTitle}>{invasion.title}</h3>
                {invasion.region && (
                  <p className={styles.invasionRegion}>{invasion.region}</p>
                )}
                <p className={styles.invasionDescription}>{invasion.description}</p>
                <div className={styles.invasionLink}>{t('invasions.readMore')}</div>
              </Link>
            ))
          ) : (
            <p className={styles.noInvasions}>{t('invasions.noInvasions')}</p>
          )}
        </div>
      </div>
    </Layout>
  )
}

