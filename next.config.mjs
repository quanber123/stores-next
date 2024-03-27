/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:
          process.env.NEXT_ENVIRONMENT === 'development'
            ? 'picsum.photos'
            : 'cozastore.agilts',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
