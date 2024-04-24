export async function getStatusOrder() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/status-order`,
      {
        cache: 'force-cache',
        next: {
          revalidate: 3600,
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
