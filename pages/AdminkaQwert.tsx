import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Layout from '../components/Layout'
import styles from '../styles/Admin.module.css'
import dynamic from 'next/dynamic'
import AdminList from '../components/admin/AdminList'

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
          {activeTab === 'invasions' && (
            <>
              <InvasionForm />
              <AdminList
                endpoint="/api/invasions"
                titleKey="admin.tabs.invasions"
                fields={[
                  { key: 'title', labelKey: 'admin.invasions.title_ru' },
                  { key: 'year', labelKey: 'admin.invasions.year' },
                  { key: 'region', labelKey: 'admin.invasions.region' }
                ]}
                onDelete={(id) => {
                  fetch(`/api/admin/invasions/${id}`, { method: 'DELETE' })
                    .then(() => window.location.reload())
                }}
              />
            </>
          )}
          {activeTab === 'maps' && (
            <>
              <MapForm />
              <AdminList
                endpoint="/api/admin/map-layers"
                titleKey="admin.tabs.maps"
                fields={[
                  { key: 'name', labelKey: 'admin.maps.name_ru' },
                  { key: 'layer_type', labelKey: 'admin.maps.layer_type' },
                  { key: 'year', labelKey: 'admin.maps.year' }
                ]}
                onDelete={(id) => {
                  fetch(`/api/admin/map-layers/${id}`, { method: 'DELETE' })
                    .then(() => window.location.reload())
                }}
              />
            </>
          )}
          {activeTab === 'preparations' && (
            <>
              <PreparationForm />
              <AdminList
                endpoint="/api/preparations"
                titleKey="admin.tabs.preparations"
                fields={[
                  { key: 'name', labelKey: 'admin.preparations.name_ru' },
                  { key: 'active_substance', labelKey: 'admin.preparations.active_substance_ru' }
                ]}
                onDelete={(id) => {
                  fetch(`/api/admin/preparations/${id}`, { method: 'DELETE' })
                    .then(() => window.location.reload())
                }}
              />
            </>
          )}
          {activeTab === 'methods' && (
            <>
              <MethodForm />
              <AdminList
                endpoint="/api/admin/methods"
                titleKey="admin.tabs.methods"
                fields={[
                  { key: 'name', labelKey: 'admin.methods.name_ru' }
                ]}
                onDelete={(id) => {
                  fetch(`/api/admin/methods/${id}`, { method: 'DELETE' })
                    .then(() => window.location.reload())
                }}
              />
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}

