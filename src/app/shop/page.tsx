'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useGetProductsQuery } from '@/lib/redux/query/productQuery';
import { useSearchParams } from 'next/navigation';
import LoadingItem from '@/components/(ui)/loadingItem';
import { getCategories } from '@/api/categoryApi';
import { Category, Tag } from '@/types/types';
import { getTags } from '@/api/tagApi';
const DynamicProductFilter = dynamic(
  () => import('@/components/pages/shop/productFilter'),
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
  () => import('@/components/pages/shop/productList'),
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
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
  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }
    async function fetchTags() {
      try {
        const tagsData = await getTags();
        setTags(tagsData);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }
    fetchCategories();
    fetchTags();
  }, []);
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
