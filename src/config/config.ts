export const nextConfig = {
  BACKEND_URL: process.env.NEXT_ENVIRONMENT
    ? 'http://localhost:8080/api/'
    : 'https://cozastore.agilts.com/api/',
};
