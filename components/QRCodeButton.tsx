import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import dynamic from 'next/dynamic'
import styles from './QRCodeButton.module.css'

// Dynamic import для QR кода (чтобы избежать SSR проблем)
const QRCodeSVG = dynamic(() => import('qrcode.react').then(mod => mod.QRCodeSVG), {
  ssr: false
})

export default function QRCodeButton() {
  const router = useRouter()
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    // Получаем полный URL текущей страницы
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }
  }, [router.asPath])

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleDownload = () => {
    const svg = document.getElementById('qrcode-svg')
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        const pngFile = canvas.toDataURL('image/png')
        const downloadLink = document.createElement('a')
        downloadLink.download = 'qrcode.png'
        downloadLink.href = pngFile
        downloadLink.click()
      }
      
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
    }
  }

  return (
    <>
      <button 
        onClick={handleOpen} 
        className={styles.qrButton}
        aria-label={t('qr.button')}
        title={t('qr.button')}
      >
        QR
      </button>

      {isOpen && (
        <div className={styles.qrModal} onClick={handleClose}>
          <div className={styles.qrContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={handleClose} aria-label={t('qr.close')}>
              ×
            </button>
            <h3 className={styles.qrTitle}>{t('qr.title')}</h3>
            <div className={styles.qrCodeContainer}>
              {currentUrl && (
                <QRCodeSVG
                  id="qrcode-svg"
                  value={currentUrl}
                  size={280}
                  level="H"
                  includeMargin={true}
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              )}
            </div>
            <p className={styles.qrUrl}>{currentUrl}</p>
            <button onClick={handleDownload} className={styles.downloadButton}>
              {t('qr.download')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

