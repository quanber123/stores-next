'use client';
import React, { useContext } from 'react';
import dynamic from 'next/dynamic';
import { useGetProductsQuery } from '@/lib/redux/query/productQuery';
import { useSearchParams } from 'next/navigation';
import LoadingItem from '@/components/(ui)/loadingItem';
import { FetchDataContext } from '@/context/FetchDataProvider';
const DynamicProductFilter = dynamic(
  () => import('@/components/pages/(client)/shop/productFilter'),
  {
    loading: () => (
      <div className='container flex flex-col md:flex-row justify-between items-center gap-[20px] md:gap-[80px]'>
        <div className='skeleton max-w-[320px] sm:w-full h-[48px]'></div>
        <div className='skeleton w-full h-[48px]'></div>
      </div>
    ),
    ssr: false,
  }
);
const DynamicProductList = dynamic(
  () => import('@/components/pages/(client)/shop/productList'),
  {
    ssr: false,
  }
);
const DynamicNotFoundItem = dynamic(
  () => import('@/components/(ui)/notFoundItem'),
  {
    ssr: false,
  }
);
export default function Shop() {
  const searchQuery = useSearchParams();
  const { categories, tags } = useContext(FetchDataContext);
  const currPage = Number(searchQuery.get('page')) || 1;
  const {
    data: productsData,
    isSuccess: isSuccessProductsData,
    isLoading: isLoadingProductsData,
  } = useGetProductsQuery(
    `page=${currPage}&category=${searchQuery.get(
      'category'
    )}&tag=${searchQuery.get('tag')}&sort=${searchQuery.get(
      'sort'
    )}&search=${searchQuery.get('search')}`,
    {
      pollingInterval: Number(process.env.NEXT_DEFAULT_POLLING) * 1000,
    }
  );
  return (
    <div className='flex flex-col items-center gap-[24px] px-8 py-8'>
      <DynamicProductFilter categories={categories} tags={tags} />
      {isSuccessProductsData &&
        productsData?.products?.length === 0 &&
        !isLoadingProductsData && (
          <DynamicNotFoundItem message='No Products Yet!' />
        )}
      {isSuccessProductsData &&
        productsData?.products?.length > 0 &&
        !isLoadingProductsData && (
          <DynamicProductList
            products={productsData.products}
            totalPage={productsData.totalPage}
          />
        )}
      {isLoadingProductsData && (
        <LoadingItem
          sectionClass={
            'container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[40px]'
          }
          heightItem='h-[420px]'
          amount={8}
        />
      )}
    </div>
  );
}
