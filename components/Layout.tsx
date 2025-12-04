import React from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import QRCodeButton from './QRCodeButton'
import styles from './Layout.module.css'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const { t, i18n } = useTranslation()

  const changeLanguage = (locale: string) => {
    router.push(router.pathname, router.asPath, { locale })
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            {t('nav.home')}
          </Link>
          
          <div className={styles.navButtons}>
            <Link href="/maps" className={styles.navButton}>
              <span className={styles.navIcon}>🗺️</span>
              {t('nav.maps')}
            </Link>
            <Link href="/invasions" className={styles.navButton}>
              <span className={styles.navIcon}>📅</span>
              {t('nav.invasions')}
            </Link>
            <Link href="/preparations" className={styles.navButton}>
              <span className={styles.navIcon}>💊</span>
              {t('nav.preparations')}
            </Link>
            <Link href="/methods" className={styles.navButton}>
              <span className={styles.navIcon}>📋</span>
              {t('nav.methods')}
            </Link>
            <Link href="/about" className={styles.navButton}>
              <span className={styles.navIcon}>ℹ️</span>
              {t('nav.about')}
            </Link>
          </div>

          <div className={styles.rightButtons}>
            <QRCodeButton />
            <div className={styles.languageSwitcher}>
              <button
                onClick={() => changeLanguage('ru')}
                className={router.locale === 'ru' ? styles.active : ''}
                aria-label="Русский"
              >
                RU
              </button>
              <button
                onClick={() => changeLanguage('kk')}
                className={router.locale === 'kk' ? styles.active : ''}
                aria-label="Қазақша"
              >
                KZ
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 Саранча. База данных по мароккской саранче.</p>
      </footer>
    </div>
  )
}

