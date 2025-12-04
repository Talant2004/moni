import React from 'react'
import { useTranslation } from 'react-i18next'
import Layout from '../components/Layout'
import styles from '../styles/About.module.css'

export default function About() {
  const { t } = useTranslation()

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('about.title')}</h1>
        <p className={styles.description}>{t('about.description')}</p>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>{t('about.project.title')}</h2>
            <p>{t('about.project.description')}</p>
          </section>

          <section className={styles.section}>
            <h2>{t('about.team.title')}</h2>
            <p>{t('about.team.description')}</p>
          </section>

          <section className={styles.section}>
            <h2>{t('about.materials.title')}</h2>
            <p>{t('about.materials.description')}</p>
          </section>

          <section className={styles.section}>
            <h2>{t('about.links.kazniizikr')}</h2>
            <p>
              <a href="https://kazniizikr.kz" target="_blank" rel="noopener noreferrer" className={styles.link}>
                {t('about.links.kazniizikrSite')}
              </a>
            </p>
          </section>

          <section className={styles.section}>
            <h2>{t('about.links.publications.title')}</h2>
            <p>{t('about.links.publications.description')}</p>
          </section>

          <section className={styles.section}>
            <h2>{t('about.links.sources.title')}</h2>
            <p>{t('about.links.sources.description')}</p>
          </section>
        </div>
      </div>
    </Layout>
  )
}




