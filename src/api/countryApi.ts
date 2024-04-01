export async function getProvinces() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/provinces/getAll`,
    {
      cache: 'force-cache',
    }
  );
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await res.json();
  return data;
}

export async function getDistricts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/districts/getByProvince`,
    {
      cache: 'force-cache',
    }
  );
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await res.json();
  return data;
}

export async function getWards() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/wards/getByDistrict`,
    {
      cache: 'force-cache',
    }
  );
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await res.json();
  return data;
}
