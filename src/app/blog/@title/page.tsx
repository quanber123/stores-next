'use client';
import blogImg from '@/assets/images/bg-02.jpg.webp';
import Image from 'next/image';
function Title() {
  return (
    <section className='relative h-[240px] overflow-hidden'>
      <div className='w-full h-full'>
        <Image
          src={blogImg}
          alt='bg-blog-page'
          width={2000}
          height={240}
          className='w-full h-full object-cover'
          priority={true}
        />
      </div>
      <h2
        className='absolute top-1/2 left-1/2 z-20 text-white text-4xl md:text-6xl font-bold'
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        Blog
      </h2>
    </section>
  );
}

export default Title;
