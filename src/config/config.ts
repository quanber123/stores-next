export const nextConfig = {
  BACKEND_URL:
    process.env.NEXT_ENVIRONMENT == 'production'
      ? 'https://cozastore.agilts.com/api/'
      : 'http://localhost:3000/api/',
};
