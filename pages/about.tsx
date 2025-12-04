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
            <h2>О проекте</h2>
            <p>
              Данный интернет-ресурс создан в рамках грантового проекта, направленного на изучение
              мароккской саранчи и разработку методов контроля ее численности. Проект объединяет
              усилия ученых, специалистов и практиков в области защиты растений.
            </p>
          </section>

          <section className={styles.section}>
            <h2>{t('about.team')}</h2>
            <p>
              Над проектом работают ведущие специалисты в области энтомологии, фитопатологии и
              защиты растений из Казахского научно-исследовательского института защиты и карантина растений (КазНИИЗиКР).
            </p>
          </section>

          <section className={styles.section}>
            <h2>{t('about.materials')}</h2>
            <p>
              Материалы проекта включают научные публикации, отчеты о проведенных исследованиях,
              методические рекомендации и базу данных по нашествиям саранчовых.
            </p>
          </section>

          <section className={styles.section}>
            <h2>{t('about.links.kazniizikr')}</h2>
            <p>
              <a href="https://kazniizikr.kz" target="_blank" rel="noopener noreferrer" className={styles.link}>
                Официальный сайт КазНИИЗиКР
              </a>
            </p>
          </section>

          <section className={styles.section}>
            <h2>{t('about.links.publications')}</h2>
            <p>
              Публикации авторов проекта будут размещены на данном ресурсе и доступны для просмотра
              и скачивания.
            </p>
          </section>

          <section className={styles.section}>
            <h2>{t('about.links.sources')}</h2>
            <p>
              Все использованные источники информации указаны в соответствующих разделах ресурса.
              При использовании материалов просим указывать ссылку на источник.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  )
}




