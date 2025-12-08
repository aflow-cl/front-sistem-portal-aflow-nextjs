/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Optimización de producción
  productionBrowserSourceMaps: false,
  
  // Configuración de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  
  // Variables de entorno públicas
  env: {
    NEXT_PUBLIC_APP_NAME: 'AFLOW Portal',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
  
  // Configuración experimental
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
