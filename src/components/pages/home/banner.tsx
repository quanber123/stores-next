'use client';
import { getBanners } from '@/api/bannerApi';
import { Banner } from '@/types/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

export default function Banners() {
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currArticle, setCurrArticle] = useState(0);
  useEffect(() => {
    async function fetchBanners() {
      try {
        const dataBanners = await getBanners();
        setBanners(dataBanners);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }
    fetchBanners();
  }, []);
  const handleChangeSlide = useCallback(
    (type: string) => {
      if (type === 'prev') {
        setCurrArticle(currArticle <= 0 ? banners.length - 1 : currArticle - 1);
      }
      if (type === 'next') {
        setCurrArticle(currArticle >= banners.length - 1 ? 0 : currArticle + 1);
      }
    },
    [currArticle, banners]
  );
  const renderedBanners = useMemo(() => {
    return banners.map((b, index) => {
      return (
        <article
          className={`banner absolute top-0 left-0 w-full h-full flex items-center ${
            currArticle === index && 'cur-slide'
          } ${index === currArticle - 1 && 'prev-slide'} ${
            index === currArticle + 1 && 'next-slide'
          }`}
          key={b._id}
        >
          <Image
            className='absolute top-1/2 left-0 object-cover'
            width={2000}
            height={640}
            src={b.image}
            alt={b.content}
            priority
          />
          <div
            className={`absolute w-full top-1/2 md:left-[15%] flex flex-col justify-center md:justify-start items-center md:items-start gap-[12px] md:gap-[24px]`}
          >
            <p className='text-md md:text-2xl font-medium capitalize'>
              {b.content}
            </p>
            <p className='text-2xl md:text-6xl font-bold capitalize'>
              {b.sub_content}
            </p>
            <button
              className='w-[128px] md:w-[162px] h-[36px] md:h-[46px] font-medium text-white bg-neutral-700 transition-colors hover:bg-violet-500 rounded-[23px]'
              onClick={() =>
                router.push(`/shop?page=1?category=${b.category.name}`)
              }
            >
              Shop Now
            </button>
          </div>
        </article>
      );
    });
  }, [banners, currArticle]);
  return (
    <section className='relative w-full h-[320px] sm:h-[480px] md:h-[640px] lg:h-[100vh] overflow-hidden'>
      {renderedBanners}
      <button
        className='absolute z-50 left-2 lg:left-[5%] top-1/2 -translate-y-1/2 -rotate-90'
        // dangerouslySetInnerHTML={{ __html: Icons.left_icon }}
        aria-label='btn-prev'
        onClick={() => handleChangeSlide('prev')}
      >
        <span className='triangle'></span>
      </button>
      <button
        className='absolute z-50 right-2 lg:right-[5%] top-1/2 -translate-y-1/2 rotate-90'
        // dangerouslySetInnerHTML={{ __html: Icons.right_icon }}
        aria-label='btn-next'
        onClick={() => handleChangeSlide('next')}
      >
        <span className='triangle'></span>
      </button>
    </section>
  );
}
