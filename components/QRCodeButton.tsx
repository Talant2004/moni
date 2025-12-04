import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import styles from './QRCodeButton.module.css'

// Dynamic import to avoid SSR issues  
const QRCodeSVG = dynamic(
  () => import('qrcode.react').then((mod) => mod.QRCodeSVG),
  { 
    ssr: false,
    loading: () => <div className={styles.loading}>Загрузка QR кода...</div>
  }
)

export default function QRCodeButton() {
  const router = useRouter()
  const [showQR, setShowQR] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(`${window.location.origin}${router.asPath}`)
    }
  }, [router.asPath])

  return (
    <>
      <button 
        onClick={() => setShowQR(!showQR)}
        className={styles.qrButton}
        title="Показать QR код"
      >
        QR
      </button>

      {showQR && (
        <div className={styles.qrModal} onClick={() => setShowQR(false)}>
          <div className={styles.qrContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.closeButton}
              onClick={() => setShowQR(false)}
              aria-label="Закрыть"
            >
              ×
            </button>
            <h3>QR код страницы</h3>
            <div className={styles.qrCodeContainer}>
              {currentUrl ? (
                <QRCodeSVG 
                  value={currentUrl} 
                  size={280}
                  level="H"
                  fgColor="#000000"
                  bgColor="#FFFFFF"
                  includeMargin={true}
                />
              ) : (
                <div className={styles.loading}>Загрузка...</div>
              )}
            </div>
            {currentUrl && (
              <p className={styles.url}>{currentUrl}</p>
            )}
            {currentUrl && (
              <button 
                className={styles.downloadButton}
                onClick={() => {
                  const svg = document.querySelector('.qr-code-svg') as SVGElement
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
                      downloadLink.download = 'qr-code.png'
                      downloadLink.href = pngFile
                      downloadLink.click()
                    }
                    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
                  }
                }}
              >
                Скачать QR код
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
