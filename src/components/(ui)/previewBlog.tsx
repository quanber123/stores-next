import { formatDate } from '@/lib/utils/format';
import { Blog } from '@/types/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import LazyLoadImage from './lazyloadImage';
type Props = {
  blog: Blog;
  type?: string;
  style?: React.CSSProperties;
};
const PreviewBlog: React.FC<Props> = ({ blog, type, style }) => {
  const router = useRouter();
  const { _id, imgSrc, title, author, created_at, open_paragraph } = blog;
  return type === 'home-page' ? (
    <article style={{ ...style }} className='flex flex-col gap-4'>
      <div className='w-full overflow-hidden'>
        <LazyLoadImage
          src={imgSrc}
          width={290}
          height={260}
          alt={title}
          className='hover:scale-110 transition-all duration-300 cursor-pointer'
        />
      </div>
      <div className='flex flex-col gap-2'>
        <p className='text-sm'>
          By <span className='font-bold'>{author}</span> on{' '}
          <span className='font-bold'>{formatDate(created_at)}</span>
        </p>
        <p
          className='min-h-[64px] h-full text-xl sm:text-2xl line-clamp-2 flex-1 cursor-pointer'
          onClick={() => router.push(`/blog/${_id}`, { scroll: true })}
        >
          {title}
        </p>
        <p className='line-clamp-3'>{open_paragraph}</p>
      </div>
    </article>
  ) : (
    <article style={{ ...style }} className='flex flex-col gap-4'>
      <div className='w-full overflow-hidden'>
        <LazyLoadImage
          src={imgSrc}
          width={290}
          height={240}
          alt={title}
          className='w-full object-cover hover:scale-110 transition-all duration-300 cursor-pointer'
        />
      </div>
      <div>
        <p className='text-sm'>
          By <span className='font-bold'>{author}</span> on{' '}
          <span className='font-bold'>{formatDate(created_at)}</span>
        </p>
        <p className='text-2xl line-clamp-2 cursor-pointer'>{title}</p>
        <p className='line-clamp-3'>{open_paragraph}</p>
      </div>
    </article>
  );
};

export default PreviewBlog;
