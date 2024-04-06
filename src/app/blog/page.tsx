'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getCategories } from '@/api/categoryApi';
import { getTags } from '@/api/tagApi';
import { useGetBlogsQuery } from '@/lib/redux/query/blogQuery';
import { Category, Tag } from '@/types/types';
import { useSearchParams } from 'next/navigation';
import LoadingItem from '@/components/(ui)/loadingItem';
const DynamicBlogTitle = dynamic(
  () => import('@/components/pages/(client)/blog/blogTitle'),
  {
    loading: () => <div className='skeleton w-full h-[240px]'></div>,
    ssr: false,
  }
);
const DynamicBlogFilter = dynamic(
  () => import('@/components/pages/(client)/blog/blogFilter'),
  {
    loading: () => <div className='skeleton w-full h-[320px] lg:w-1/3'></div>,
    ssr: false,
  }
);
const DynamicBlogList = dynamic(
  () => import('@/components/pages/(client)/blog/blogList'),
  {
    ssr: false,
  }
);
const DynamicNotFoundItem = dynamic(
  () => import('@/components/(ui)/notFoundItem')
);
function Blog() {
  const searchQuery = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const currPage = Number(searchQuery.get('page')) || 1;
  const {
    data: blogsData,
    isSuccess: isSuccessBlogsData,
    isLoading: isLoadingBlogsData,
  } = useGetBlogsQuery(
    `page=${currPage}&category=${searchQuery.get(
      'category'
    )}&tag=${searchQuery.get('tag')}`,
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
    <div className='flex flex-col gap-12'>
      <DynamicBlogTitle />
      <section className='container px-4 m-auto flex items-start flex-col lg:flex-row-reverse gap-20'>
        <DynamicBlogFilter tags={tags} categories={categories} />
        {isSuccessBlogsData &&
          blogsData?.blogs?.length === 0 &&
          !isLoadingBlogsData && (
            <DynamicNotFoundItem message='No Blogs Yet!' />
          )}
        {isSuccessBlogsData &&
          blogsData?.blogs?.length > 0 &&
          !isLoadingBlogsData && (
            <DynamicBlogList
              blogs={blogsData.blogs}
              totalPage={blogsData.totalPage}
            />
          )}
        {isLoadingBlogsData && (
          <LoadingItem
            sectionClass='w-full lg:w-2/3 flex flex-col gap-20'
            heightItem='h-[500px]'
            amount={8}
          />
        )}
      </section>
    </div>
  );
}

export default Blog;
