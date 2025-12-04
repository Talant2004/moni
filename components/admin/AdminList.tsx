import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './AdminList.module.css'

interface AdminListProps {
  endpoint: string
  titleKey: string
  fields: Array<{ key: string; labelKey: string }>
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
}

export default function AdminList({ endpoint, titleKey, fields, onEdit, onDelete }: AdminListProps) {
  const { t } = useTranslation()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [endpoint])

  const fetchItems = async () => {
    try {
      const response = await fetch(endpoint)
      if (response.ok) {
        const data = await response.json()
        setItems(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm(t('admin.confirm_delete'))) {
      try {
        const response = await fetch(`${endpoint}/${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          fetchItems()
        }
      } catch (error) {
        console.error('Error deleting item:', error)
      }
    }
  }

  if (loading) {
    return <div className={styles.loading}>{t('common.loading')}</div>
  }

  return (
    <div className={styles.list}>
      <h3 className={styles.listTitle}>{t(titleKey)}</h3>
      {items.length === 0 ? (
        <p className={styles.empty}>{t('admin.no_items')}</p>
      ) : (
        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                {fields.map(field => (
                  <th key={field.key}>{t(field.labelKey)}</th>
                ))}
                <th>{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  {fields.map(field => (
                    <td key={field.key}>{item[field.key] || '-'}</td>
                  ))}
                  <td>
                    <div className={styles.actions}>
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item.id)}
                          className={styles.editButton}
                        >
                          {t('admin.edit')}
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className={styles.deleteButton}
                        >
                          {t('admin.delete')}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

