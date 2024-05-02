export async function getWebInfo() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/web_info`,
      {
        cache: 'no-cache',
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
