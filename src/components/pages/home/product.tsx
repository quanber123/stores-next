'use client';
import PreviewProduct from '@/components/(ui)/previewProduct';
import { useGetProductsQuery } from '@/lib/redux/query/productQuery';
import { Product } from '@/types/types';
import React, { useMemo } from 'react';

const Products = () => {
  const { data: productsData, isSuccess: isSuccessProductsData } =
    useGetProductsQuery(`page=1`);

  const renderedProducts = useMemo(() => {
    return (
      isSuccessProductsData &&
      productsData?.products?.map((p: Product) => {
        return <PreviewProduct key={p._id} product={p} />;
      })
    );
  }, [productsData]);
  return (
    <section className='container px-8 flex flex-col items-center gap-8'>
      <h2 className='text-xl sm:text-4xl md:text-6xl text-neutral-700 font-bold'>
        Store Overview
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[40px]'>
        {renderedProducts}
      </div>
    </section>
  );
};

export default Products;
