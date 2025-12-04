import React from 'react'
import { useTranslation } from 'react-i18next'
import Layout from '../components/Layout'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  const { t } = useTranslation()

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('home.title')}</h1>
        
        <section className={styles.intro}>
          <h2>{t('home.gregarious')}</h2>
          <p>{t('home.gregariousDesc')}</p>
        </section>

        <div className={styles.locustTypes}>
          <div className={styles.locustCard}>
            <div className={styles.locustImage}>
              <img 
                src="/images/locusts/Мароккская саранча.jpg" 
                alt={t('home.moroccan')}
                className={styles.image}
              />
            </div>
            <h3>{t('home.moroccan')}</h3>
            <p>{t('home.moroccanDesc')}</p>
            <Link href="/maps" className={styles.cardButton}>
              {t('home.viewMaps')}
            </Link>
          </div>

          <div className={styles.locustCard}>
            <div className={styles.locustImage}>
              <img 
                src="/images/locusts/Итальянский прус.jpg" 
                alt={t('home.italian')}
                className={styles.image}
              />
            </div>
            <h3>{t('home.italian')}</h3>
            <p>{t('home.italianDesc')}</p>
            <Link href="/maps" className={styles.cardButton}>
              {t('home.viewMaps')}
            </Link>
          </div>

          <div className={styles.locustCard}>
            <div className={styles.locustImage}>
              <img 
                src="/images/locusts/Азиатская саранча.jpg" 
                alt={t('home.asian')}
                className={styles.image}
              />
            </div>
            <h3>{t('home.asian')}</h3>
            <p>{t('home.asianDesc')}</p>
            <Link href="/maps" className={styles.cardButton}>
              {t('home.viewMaps')}
            </Link>
          </div>
        </div>

        <section className={styles.quickActions}>
          <Link href="/maps" className={styles.actionButton}>
            {t('nav.maps')}
          </Link>
          <Link href="/invasions" className={styles.actionButton}>
            {t('nav.invasions')}
          </Link>
        </section>
      </div>
    </Layout>
  )
}




