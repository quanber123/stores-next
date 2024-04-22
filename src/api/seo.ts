export async function getSeo(page: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}seo/${page}`);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await res.json();
  return data;
}
