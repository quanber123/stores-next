'use client';
import { useGetProductsByIdQuery } from '@/lib/redux/query/productQuery';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
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
const DynamicListImages = dynamic(
  () => import('@/components/pages/product-details/listImages'),
  {
    loading: () => <div className='skeleton h-[580px]'></div>,
    ssr: false,
  }
);
const DynamicProductDetails = dynamic(
  () => import('@/components/pages/product-details/productDetails'),
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
export default function ProductDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const pathname = usePathname();
  const { data: productData, isSuccess: isSuccessData } =
    useGetProductsByIdQuery(id);
  return (
    isSuccessData &&
    productData && (
      <div className='container m-auto flex flex-col gap-16 py-8'>
        <DynamicBreadcrumbs
          pathname={pathname}
          name={productData.product.name}
        />
        <div className='w-full px-4 py-8 rounded grid grid-cols-1 lg:grid-cols-2 gap-12 border border-gray-200 shadow-lg'>
          <DynamicListImages images={productData.product.images} />
          <DynamicProductDetails product={productData.product} />
        </div>
      </div>
    )
  );
}
