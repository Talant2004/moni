/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['kk', 'ru'],
    defaultLocale: 'ru',
    localeDetection: true,
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig




