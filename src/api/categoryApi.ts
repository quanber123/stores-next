export async function getCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/categories`,
      { cache: 'no-cache' }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
