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

export async function getDistricts(code: string | number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/districts/getByProvince?provinceCode=${code}`,
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

export async function getWards(code: string | number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/wards/getByDistrict?districtCode=${code}`,
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
