'use client';
import React, { useMemo } from 'react';
import { useGetProductsQuery } from '@/lib/redux/query/productQuery';
import { useSearchParams } from 'next/navigation';
import LoadingItem from '@/components/(ui)/loadingItem';
import CustomPagination from '@/components/(ui)/customPagination';
import PreviewProduct from '@/components/(ui)/previewProduct';
import { Product } from '@/types/types';
export default function Products() {
  const searchQuery = useSearchParams();
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
  const renderedProducts = useMemo(() => {
    return (
      isSuccessProductsData &&
      productsData?.products?.map((p: Product) => {
        return <PreviewProduct key={p._id} product={p} />;
      })
    );
  }, [isSuccessProductsData, productsData?.products]);
  return (
    <>
      {isSuccessProductsData &&
        productsData?.products?.length > 0 &&
        !isLoadingProductsData && (
          <section className='container flex flex-col gap-[40px]'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[40px]'>
              {renderedProducts}
            </div>
            {productsData?.totalPage > 1 && (
              <CustomPagination
                totalPage={productsData?.totalPage}
                isScroll={true}
              />
            )}
          </section>
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
    </>
  );
}
