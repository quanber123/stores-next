export async function getTags() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/tags`, {
      cache: 'no-cache',
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
