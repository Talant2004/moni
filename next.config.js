/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['kk', 'ru'],
    defaultLocale: 'ru',
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig




