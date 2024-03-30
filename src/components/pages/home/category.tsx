'use client';
import { getCategories } from '@/api/categoryApi';
import { Category } from '@/types/types';
import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import LazyLoadImage from '@/components/(ui)/lazyloadImage';
function Categories() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryHover, setCategoryHover] = useState<number | null>(null);
  useEffect(() => {
    async function fetchCategories() {
      try {
        const dataCategories = await getCategories();
        setCategories(dataCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }
    fetchCategories();
  }, []);
  const renderedCategories = useMemo(() => {
    return categories.map((c, index) => {
      return (
        <article
          className='relative w-full max-w-[280px] flex-shrink-0 h-[180px] border border-gray-200 cursor-pointer overflow-hidden'
          key={c._id}
          onMouseEnter={() => setCategoryHover(index)}
          onMouseLeave={() => setCategoryHover(null)}
        >
          <LazyLoadImage
            className='w-full h-full object-cover'
            width={300}
            height={250}
            src={c.image}
            alt={c.name}
          />
          <div
            className={`absolute top-0 left-0 w-max h-max p-8 z-20 transition-colors ${
              index === categoryHover ? 'text-gray-100' : 'text-neutral-700'
            }`}
          >
            <p className='text-xl font-bold capitalize'>{c.name}</p>
            <p>{c.description}</p>
          </div>
          <div
            style={{ transition: 'all 0.3s linear' }}
            className={`absolute w-full h-full p-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-end ${
              index === categoryHover ? 'bg-violet-500 opacity-80' : 'opacity-0'
            }`}
          >
            <button
              className='relative text-gray-100 font-bold p-2 w-max overflow-hidden'
              onClick={() =>
                router.push(`/shop?page=1&category=${c.name}`, { scroll: true })
              }
            >
              <p
                style={{ transition: 'all 0.3s linear' }}
                className={`${
                  index === categoryHover
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-[200px] opacity-0'
                }`}
              >
                Shop now
              </p>
              <span
                style={{
                  transition: 'width 0.3s linear',
                  transitionDelay: '0.2s',
                }}
                className={`absolute left-1/2 bottom-0 -translate-x-1/2 ${
                  index === categoryHover ? 'w-full' : 'w-0'
                } h-[2px] bg-gray-100`}
              ></span>
            </button>
          </div>
        </article>
      );
    });
  }, [categories, categoryHover]);
  return (
    <section className='container px-8 flex justify-center items-center'>
      <div className='m-auto w-full flex justify-start items-center gap-9 overflow-y-auto'>
        {renderedCategories}
      </div>
    </section>
  );
}

export default Categories;
