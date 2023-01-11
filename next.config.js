// const { i18n } = require('./next-i18next.config');
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:${process.env.PORT}/api/:path*` // Proxy to Backend
      },
    ];
  },
  env: {
    PORT: process.env.PORT,
  },
  distDir: 'build'
}

module.exports = nextConfig
