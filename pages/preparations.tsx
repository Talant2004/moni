import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Layout from '../components/Layout'
import styles from '../styles/Preparations.module.css'

interface Preparation {
  id: number
  name: string
  description: string
  activeSubstance?: string
  applicationMethod?: string
}

export default function Preparations() {
  const { t } = useTranslation()
  const [preparations, setPreparations] = useState<Preparation[]>([])

  useEffect(() => {
    fetch('/api/preparations')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPreparations(data.map((prep: any) => ({
            id: prep.id,
            name: prep.name,
            description: prep.description,
            activeSubstance: prep.active_substance,
            applicationMethod: prep.application_method
          })))
        }
      })
      .catch(err => {
        console.error('Error loading preparations:', err)
        // Fallback to mock data if API fails
        setPreparations([
          {
            id: 1,
            name: 'Диазинон',
            description: 'Инсектицид контактно-кишечного действия для борьбы со стадными саранчовыми',
            activeSubstance: 'Диазинон',
            applicationMethod: 'Опрыскивание'
          }
        ])
      })
  }, [])

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('preparations.title')}</h1>
        <p className={styles.description}>{t('preparations.description')}</p>

        <div className={styles.preparationsList}>
          {preparations.length > 0 ? (
            preparations.map((prep) => (
              <div key={prep.id} className={styles.preparationCard}>
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

