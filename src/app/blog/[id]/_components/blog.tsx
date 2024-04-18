import { Icons } from '@/enum/enum';
import { formatDate } from '@/lib/utils/format';
import { Blog } from '@/types/types';
import Image from 'next/image';
import React from 'react';
type Props = {
  blog: Blog;
};
const BlogDetails: React.FC<Props> = ({ blog }) => {
  const {
    author,
    title,
    views,
    open_paragraph,
    body_paragraph,
    close_paragraph,
    quotes,
    created_at,
    imgSrc,
  } = blog;
  return (
    <section className='text-neutral-700 flex flex-col gap-12'>
      <h1 className='text-2xl md:text-4xl lg:text-6xl font-bold'>{title}</h1>
      <div className='flex flex-col md:flex-row md:items-center gap-2 text-sm md:text-base'>
        <p>
          By <span className='font-bold'>{author}</span>
        </p>
        <span className='hidden md:block'>|</span>
        <div className='flex items-center gap-[5px]'>
          <span dangerouslySetInnerHTML={{ __html: Icons.clock_icon }}></span>
          <p>{formatDate(created_at)}</p>
        </div>
        <span className='hidden md:block'>|</span>
        <div className='flex items-center gap-[5px]'>
          <span dangerouslySetInnerHTML={{ __html: Icons.view_icon }}></span>
          {views && <p>{views > 1 ? `${views} views` : `${views} view`}</p>}
        </div>
      </div>
      <div className='h-[200px] md:h-[450px]'>
        <Image
          className='w-full h-full object-cover rounded-lg'
          src={imgSrc}
          alt={title}
          width={1000}
          height={450}
        />
      </div>
      <div className='flex flex-col gap-6 text-base md:text-lg'>
        <p>{open_paragraph}</p>
        {quotes && (
          <div className='relative w-full h-[180px] md:h-[250px] flex justify-center items-center bg-slate-100 rounded-md overflow-hidden'>
            <p title={quotes} className='font-bold text-2xl md:text-4xl'>
              "{quotes}"
            </p>
            <span
              className='text-[#999] absolute top-2 right-[100px] z-10 opacity-50 hidden md:block'
              dangerouslySetInnerHTML={{ __html: Icons.quotes_icon }}
            ></span>
          </div>
        )}
        <p>{body_paragraph}</p>
        <p>{close_paragraph}</p>
      </div>
    </section>
  );
};

export default BlogDetails;
