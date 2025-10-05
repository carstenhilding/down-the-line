// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com', // Erstat med domæner, du hoster billeder fra (hvis relevant)
        port: '',
        pathname: '/my-images/**',
      },
    ],
  },
  // SLET HELE DENNE "experimental" BLOK:
  /*
  experimental: {
    allowedDevOrigins: ['https://3001-cs-af7f34dd-180d-4662-82b8-7622f7348056.cs-europe-west4-fycr.cloudshell.dev'],
  },
  */
};

module.exports = nextConfig;