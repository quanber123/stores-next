export async function getProvinces() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/provinces/getAll`,
      {
        cache: 'force-cache',
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getDistricts(code: string | number) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/districts/getByProvince?provinceCode=${code}`,
      {
        cache: 'force-cache',
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getWards(code: string | number) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/wards/getByDistrict?districtCode=${code}`,
      {
        cache: 'force-cache',
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
