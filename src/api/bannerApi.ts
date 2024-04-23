export async function getBanners() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/banners`, {
    cache: 'no-cache',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await res.json();
  return data;
}
