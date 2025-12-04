import React from 'react'
import { useTranslation } from 'react-i18next'
import Layout from '../components/Layout'
import styles from '../styles/Methods.module.css'

export default function Methods() {
  const { t } = useTranslation()

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('methods.title')}</h1>
        <p className={styles.description}>{t('methods.description')}</p>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>{t('methods.monitoring.title')}</h2>
            <p>{t('methods.monitoring.description')}</p>
          </section>

          <section className={styles.section}>
            <h2>{t('methods.chemical.title')}</h2>
            <p>{t('methods.chemical.description')}</p>
          </section>

          <section className={styles.section}>
            <h2>{t('methods.biological.title')}</h2>
            <p>{t('methods.biological.description')}</p>
          </section>

          <section className={styles.section}>
            <h2>{t('methods.agrotechnical.title')}</h2>
            <p>{t('methods.agrotechnical.description')}</p>
          </section>

          <section className={styles.section}>
            <h2>{t('methods.forecasting.title')}</h2>
            <p>{t('methods.forecasting.description')}</p>
          </section>
        </div>
      </div>
    </Layout>
  )
}




