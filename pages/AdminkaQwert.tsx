import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Layout from '../components/Layout'
import styles from '../styles/Admin.module.css'
import dynamic from 'next/dynamic'

// Dynamic imports для избежания SSR проблем
const InvasionForm = dynamic(() => import('../components/admin/InvasionForm'), { ssr: false })
const MapForm = dynamic(() => import('../components/admin/MapForm'), { ssr: false })
const PreparationForm = dynamic(() => import('../components/admin/PreparationForm'), { ssr: false })
const MethodForm = dynamic(() => import('../components/admin/MethodForm'), { ssr: false })

type AdminTab = 'invasions' | 'maps' | 'preparations' | 'methods'

export default function AdminPanel() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<AdminTab>('invasions')

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('admin.title')}</h1>
        
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'invasions' ? styles.active : ''}`}
            onClick={() => setActiveTab('invasions')}
          >
            {t('admin.tabs.invasions')}
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'maps' ? styles.active : ''}`}
            onClick={() => setActiveTab('maps')}
          >
            {t('admin.tabs.maps')}
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'preparations' ? styles.active : ''}`}
            onClick={() => setActiveTab('preparations')}
          >
            {t('admin.tabs.preparations')}
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'methods' ? styles.active : ''}`}
            onClick={() => setActiveTab('methods')}
          >
            {t('admin.tabs.methods')}
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'invasions' && <InvasionForm />}
          {activeTab === 'maps' && <MapForm />}
          {activeTab === 'preparations' && <PreparationForm />}
          {activeTab === 'methods' && <MethodForm />}
        </div>
      </div>
    </Layout>
  )
}

