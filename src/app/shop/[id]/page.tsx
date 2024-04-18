'use client';
import { useGetProductsByIdQuery } from '@/lib/redux/query/productQuery';
import { redirect, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import React from 'react';
const DynamicBreadcrumbs = dynamic(
  () => import('@/components/(ui)/breadcrumbs'),
  {
    loading: () => (
      <div className='container'>
        <div className='skeleton w-1/2 h-[24px] mr-auto'></div>
      </div>
    ),
    ssr: false,
  }
);
const DynamicImages = dynamic(
  () => import('@/app/shop/[id]/_components/images'),
  {
    loading: () => <div className='skeleton h-[580px]'></div>,
    ssr: false,
  }
);
const DynamicProductDetails = dynamic(
  () => import('@/app/shop/[id]/_components/product'),
  {
    loading: () => (
      <div className='h-[580px] flex flex-col gap-6'>
        <div className='skeleton w-1/3 h-[36px]'></div>
        <div className='skeleton w-1/4 h-[24px]'></div>
        <div className='skeleton w-1/2 h-[24px]'></div>
        <div className='skeleton w-full h-1/2'></div>
        <div className='skeleton w-2/3 h-1/3'></div>
      </div>
    ),
    ssr: false,
  }
);
const DynamicInformation = dynamic(
  () => import('@/app/shop/[id]/_components/information'),
  {
    loading: () => <div className='h-[200px] w-full skeleton'></div>,
    ssr: false,
  }
);
const DynamicRelatedProducts = dynamic(
  () => import('@/app/shop/[id]/_components/related'),
  {
    loading: () => (
      <>
        <div className='m-auto w-1/2 h-[60px] skeleton'></div>
        <div className='w-full h-[380px] skeleton'></div>
      </>
    ),
    ssr: false,
  }
);
export default function ProductDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const pathname = usePathname();
  const {
    data: productData,
    isSuccess: isSuccessProduct,
    isError: isErrorProduct,
  } = useGetProductsByIdQuery(id);
  if (isErrorProduct) {
    redirect(`/not-found-product-${id}`);
  }
  return (
    isSuccessProduct &&
    productData && (
      <div className='container m-auto flex flex-col gap-16 py-8 px-4'>
        <DynamicBreadcrumbs
          pathname={pathname}
          name={productData.product.name}
        />
        <section className='w-full px-4 py-8 rounded grid grid-cols-1 lg:grid-cols-2 gap-12 border border-gray-200 shadow-lg'>
          <DynamicImages product={productData.product} />
          <DynamicProductDetails product={productData.product} />
        </section>
        <section className='w-full px-4 py-8 rounded flex flex-col gap-8 border border-gray-200 shadow-lg'>
          <DynamicInformation product={productData.product} />
        </section>
        <section className='flex flex-col gap-8'>
          <DynamicRelatedProducts products={productData.relatedProducts} />
        </section>
      </div>
    )
  );
}
