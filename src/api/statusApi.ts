export async function getStatusOrder() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/status-order`,
    {
      cache: 'force-cache',
      next: {
        revalidate: 3600,
      },
    }
  );
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await res.json();
  return data;
}
