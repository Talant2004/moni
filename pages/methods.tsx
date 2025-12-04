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
            <h2>Мониторинг численности</h2>
            <p>
              Регулярный мониторинг численности мароккской саранчи проводится в весенний и осенний периоды.
              Используются методы учета численности личинок и имаго, а также оценка состояния растительности.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Химические методы борьбы</h2>
            <p>
              При превышении порога вредоносности применяются инсектициды. Обработка проводится в утренние
              или вечерние часы при отсутствии ветра. Используются препараты, разрешенные для применения
              в сельском хозяйстве Казахстана.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Биологические методы</h2>
            <p>
              Биологические методы включают использование природных врагов саранчовых и биопрепаратов.
              Эти методы экологически безопасны и могут применяться в сочетании с другими методами.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Агротехнические методы</h2>
            <p>
              К агротехническим методам относятся правильная обработка почвы, соблюдение севооборота,
              уничтожение сорняков и своевременная уборка урожая. Эти методы направлены на создание
              неблагоприятных условий для развития саранчовых.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Прогнозирование вспышек</h2>
            <p>
              На основе метеорологических данных, состояния популяции и других факторов проводится
              прогнозирование возможных вспышек численности. Это позволяет своевременно принять
              меры по предотвращению нашествий.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  )
}




