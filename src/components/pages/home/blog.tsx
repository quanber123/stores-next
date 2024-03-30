'use client';
import Carousel from '@/components/(ui)/carousel';
import PreviewBlog from '@/components/(ui)/previewBlog';
import { useCarousel } from '@/lib/hooks/useCarousel';
import { useGetBlogsQuery } from '@/lib/redux/query/blogQuery';
import { Blog } from '@/types/types';
import React, { useMemo } from 'react';

const Blogs = () => {
  const { data: blogsData, isSuccess: isSuccessBlogs } =
    useGetBlogsQuery(`page=1`);
  const { width } = useCarousel(isSuccessBlogs && blogsData.blogs.length);
  const renderedBlogs = useMemo(() => {
    return (
      isSuccessBlogs &&
      blogsData?.blogs?.map((b: Blog) => {
        return (
          <PreviewBlog
            key={b._id}
            blog={b}
            type='home-page'
            style={{
              width: `calc(${width}% - 20px)`,
              flexShrink: 0,
            }}
          />
        );
      })
    );
  }, [blogsData, width]);
  return (
    <section className='container px-8 flex flex-col items-center gap-8'>
      <h2 className='text-xl sm:text-4xl md:text-6xl text-neutral-700 font-bold'>
        Our Blogs
      </h2>
      <Carousel>{renderedBlogs}</Carousel>
    </section>
  );
};

export default Blogs;
