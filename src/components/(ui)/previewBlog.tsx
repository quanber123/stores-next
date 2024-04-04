import { formatDate } from '@/lib/utils/format';
import { Blog } from '@/types/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import LazyLoadImage from './lazyloadImage';
import { Icons } from '@/enum/enum';
type Props = {
  blog: Blog;
  type?: string;
  style?: React.CSSProperties;
};
const PreviewBlog: React.FC<Props> = ({ blog, type, style }) => {
  const router = useRouter();
  const { _id, imgSrc, title, author, created_at, open_paragraph, tags } = blog;
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
    <article
      style={{ ...style }}
      className='relative flex flex-col gap-4 text-gray-700'
    >
      <p className='absolute top-6 left-6 px-4 py-2 bg-gray-200 z-10'>
        {formatDate(created_at)}
      </p>
      <div className='w-full overflow-hidden'>
        <LazyLoadImage
          src={imgSrc}
          width={680}
          height={380}
          alt={title}
          className='w-full object-cover hover:scale-110 transition-all duration-300 cursor-pointer'
        />
      </div>
      <div className='flex flex-col gap-2'>
        <p className='text-2xl lg:text-3xl font-bold line-clamp-2 cursor-pointer'>
          {title}
        </p>
        <p className='line-clamp-3'>{open_paragraph}</p>
        <div className='text-sm flex flex-col md:flex-row md:items-center gap-4'>
          <div className='flex items-center gap-2'>
            <p>
              By <span className='font-bold'>{author}</span>
            </p>
            <span>|</span>
            <p className='capitalize font-bold'>
              {tags.map((t) => t.name).join(', ')}
            </p>
          </div>
          <button className='ml-auto uppercase text-lg font-bold flex items-center gap-2 hover:text-violet-500 transition-colors'>
            Continue reading
            <span
              dangerouslySetInnerHTML={{ __html: Icons.arrow_right_icon }}
            ></span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default PreviewBlog;
