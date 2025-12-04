import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import Link from 'next/link'
import styles from '../../styles/InvasionDetail.module.css'

interface InvasionDetail {
  id: number
  year: number
  title: string
  description: string
  full_text?: string
  fullText?: string
  region?: string
  photos?: string[]
  links?: Array<{ title: string; url: string }>
}

export default function InvasionDetail() {
  const { t } = useTranslation()
  const router = useRouter()
  const { id } = router.query
  const [invasion, setInvasion] = useState<InvasionDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetch(`/api/invasions/${id}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Invasion not found')
          }
          return res.json()
        })
        .then(data => {
          setInvasion(data)
          setLoading(false)
        })
        .catch(err => {
          console.error('Error loading invasion:', err)
          setLoading(false)
        })
    }
  }, [id])

  if (loading) {
    return (
      <Layout>
        <div className={styles.container}>
          <p>{t('common.loading')}</p>
        </div>
      </Layout>
    )
  }

  if (!invasion) {
    return (
      <Layout>
        <div className={styles.container}>
          <p>{t('invasions.noInvasions')}</p>
          <Link href="/invasions" className={styles.backLink}>
            {t('common.back')}
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className={styles.container}>
        <Link href="/invasions" className={styles.backLink}>
          ← {t('common.back')}
        </Link>

        <article className={styles.article}>
          <h1 className={styles.title}>{invasion.title}</h1>
          
          {invasion.region && (
            <p className={styles.region}>Регион: {invasion.region}</p>
          )}

          <div className={styles.content}>
            <div className={styles.textContent}>
              <p className={styles.description}>{invasion.description}</p>
              <div className={styles.fullText}>
                {(invasion.fullText || invasion.full_text || '').split('\n').map((paragraph, index) => (
                  paragraph.trim() && <p key={index}>{paragraph}</p>
                ))}
              </div>

              {invasion.links && invasion.links.length > 0 && (
                <div className={styles.linksSection}>
                  <h3>Ссылки:</h3>
                  <ul>
                    {invasion.links.map((link, index) => (
                      <li key={index}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* TODO: Add animated map component here */}
              <div className={styles.mapPlaceholder}>
                <p>Анимированная карта распространения будет отображаться здесь</p>
              </div>
            </div>

            {invasion.photos && invasion.photos.length > 0 && (
              <div className={styles.photos}>
                {invasion.photos.map((photo, index) => (
                  <img key={index} src={photo} alt={`Фото ${index + 1}`} />
                ))}
              </div>
            )}
          </div>
        </article>
      </div>
    </Layout>
  )
}

