'use client';
import CustomPagination from '@/components/(ui)/customPagination';
import LoadingItem from '@/components/(ui)/loadingItem';
import PreviewBlog from '@/components/(ui)/previewBlog';
import { useGetBlogsQuery } from '@/lib/redux/query/blogQuery';
import { Blog } from '@/types/types';
import { useSearchParams } from 'next/navigation';
import React, { useMemo } from 'react';

export default function Blogs() {
  const searchQuery = useSearchParams();
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
  const renderedBlogs = useMemo(() => {
    return (
      isSuccessBlogsData &&
      blogsData?.blogs?.map((b: Blog) => {
        return <PreviewBlog key={b._id} type='blog-page' blog={b} />;
      })
    );
  }, [isSuccessBlogsData, blogsData?.blogs]);
  return (
    <>
      {isSuccessBlogsData &&
        blogsData?.blogs?.length > 0 &&
        !isLoadingBlogsData && (
          <div className='w-full lg:w-2/3 flex flex-col gap-20'>
            {renderedBlogs}
            {blogsData?.totalPage > 1 && (
              <CustomPagination
                totalPage={blogsData.totalPage}
                isScroll={true}
              />
            )}
          </div>
        )}
      {isLoadingBlogsData && (
        <LoadingItem
          sectionClass='w-full lg:w-2/3'
          heightItem='h-[500px]'
          amount={8}
        />
      )}
    </>
  );
}
