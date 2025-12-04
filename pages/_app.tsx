import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../lib/i18n'
import '../styles/globals.css'
import 'leaflet/dist/leaflet.css'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  
  useEffect(() => {
    // Sync i18n with Next.js router locale
    if (router.locale && i18n.language !== router.locale) {
      i18n.changeLanguage(router.locale)
    }
  }, [router.locale])

  return (
    <I18nextProvider i18n={i18n}>
      <Component {...pageProps} />
    </I18nextProvider>
  )
}

