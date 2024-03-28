import { Blog } from '@/types/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
type Props = {
  blog: Blog;
  style?: React.CSSProperties;
};
const PreviewBlog: React.FC<Props> = ({ blog, style }) => {
  const router = useRouter();
  return (
    <article style={{ ...style }} className='flex flex-col gap-4'>
      <Image
        src={blog.imgSrc}
        width={290}
        height={240}
        alt={blog.title}
        className='w-full object-cover'
      />
    </article>
  );
};

export default PreviewBlog;
