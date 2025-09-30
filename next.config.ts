/** @type {import('next').NextConfig} */
const nextConfig = {
  // Din konfiguration her, men UDEN en 'i18n' blok
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com', // Erstat med domæner, du hoster billeder fra
        port: '',
        pathname: '/my-images/**',
      },
    ],
  },
  // Eventuelle andre konfigurationer (f.eks. for TailwindCSS, Webpack, etc.)
  // ...
};

module.exports = nextConfig;