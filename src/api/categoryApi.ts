import { nextConfig } from '@/config/config';
export async function getCategories() {
  const res = await fetch(`${nextConfig.BACKEND_URL}categories`, {
    cache: 'force-cache',
    next: {
      revalidate: 3600,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await res.json();
  return data;
}
