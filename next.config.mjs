/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_HOST_NAME,
        port: '',
        pathname: '/**',
      },
      process.env.NEXT_ENVIRONMENT === 'development' && {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;