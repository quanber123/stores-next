import CustomPagination from '@/components/(ui)/customPagination';
import PreviewBlog from '@/components/(ui)/previewBlog';
import { Blog } from '@/types/types';
import React, { useMemo } from 'react';
type Props = {
  blogs: Blog[];
  totalPage: number;
};
const BlogsList: React.FC<Props> = ({ blogs, totalPage }) => {
  const renderedBlogs = useMemo(() => {
    return blogs.map((b) => {
      return <PreviewBlog key={b._id} type='blog-page' blog={b} />;
    });
  }, [blogs]);
  return (
    <div className='w-full lg:w-2/3 flex flex-col gap-20'>
      {renderedBlogs}
      {totalPage > 1 && (
        <CustomPagination totalPage={totalPage} isScroll={true} />
      )}
    </div>
  );
};

export default BlogsList;
