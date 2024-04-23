export async function getSeo(page: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/seo/${page}`
  );
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await res.json();
  return data;
}

export async function getSeoDetailsPage(id: string, type: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/seo_details_page/${id}?type=${type}`
  );
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await res.json();
  return data;
}
