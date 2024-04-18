'use client';
import {
  useGetBlogByIdQuery,
  useGetCommentBlogQuery,
} from '@/lib/redux/query/blogQuery';
import dynamic from 'next/dynamic';
import { redirect, usePathname } from 'next/navigation';
import React, { useLayoutEffect } from 'react';
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
const DynamicBlogDetails = dynamic(
  () => import('@/app/blog/[id]/_components/blog'),
  {
    loading: () => (
      <div className='flex flex-col gap-12'>
        <div className='skeleton w-full h-[120px]'></div>
        <div className='skeleton w-full h-[24px]'></div>
        <div className='skeleton w-full h-[100vh]'></div>
      </div>
    ),
    ssr: false,
  }
);
const DynamicComments = dynamic(
  () => import('@/app/blog/[id]/_components/comments'),
  {
    ssr: false,
  }
);
export default function BlogDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const pathname = usePathname();
  const {
    data: blogData,
    isSuccess: isSuccessBlog,
    isError: isErrorBlog,
  } = useGetBlogByIdQuery(id);
  const { data: commentsData, isSuccess: isSuccessComments } =
    useGetCommentBlogQuery(id);
  if (isErrorBlog) {
    redirect(`/not-found-blog-${id}`);
  }
  return (
    isSuccessBlog &&
    blogData && (
      <div className='container m-auto flex flex-col gap-8 md:gap-16 py-8 px-4'>
        <DynamicBreadcrumbs pathname={pathname} name={blogData.blog.title} />
        <DynamicBlogDetails blog={blogData.blog} />
        {isSuccessComments && (
          <DynamicComments
            comment={commentsData.comment}
            blog={blogData.blog}
          />
        )}
      </div>
    )
  );
}
