export async function getWebInfo() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/page`, {
    cache: 'no-cache',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await res.json();
  return data;
}
