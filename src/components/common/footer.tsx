'use client';
import { getCategories } from '@/api/categoryApi';
import { Category } from '@/types/types';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const helps = ['Track Order', 'Returns', 'Shipping', 'FAQs'];
  const router = useRouter();
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
  const renderedCategories = useMemo(
    () =>
      categories.map((c, index) => {
        return (
          <li key={index}>
            <button
              className='text-sm capitalize'
              onClick={() => router.push(`/shop?page=1&category=${c.name}`)}
            >
              {c.name}
            </button>
          </li>
        );
      }),
    [categories, router]
  );
  const renderHelps = useMemo(
    () =>
      helps.map((h, index) => {
        return (
          <li key={index}>
            <button className='text-sm'>{h}</button>
          </li>
        );
      }),
    []
  );
  return (
    <footer className='mt-24 py-[75px] px-8 bg-neutral-800 text-gray-100'>
      <div className='container w-full m-auto grid gird-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[40px]'>
        <div className='flex flex-col gap-[20px]'>
          <p className='text-md text-white font-bold uppercase'>Categories</p>
          <ul className='flex flex-col gap-[10px]'>{renderedCategories}</ul>
        </div>
        <div className='flex flex-col gap-[20px]'>
          <p className='text-md text-white font-bold uppercase'>Help</p>
          <ul className='flex flex-col gap-[10px]'>{renderHelps}</ul>
        </div>
        <div className='flex flex-col gap-[20px]'>
          <p className='text-md text-white font-bold uppercase'>Get in touch</p>
          <p className='text-sm'>
            Any questions? Let us know in store at 8th floor, 379 Hudson St, New
            York, NY 10018 or call us on (+1) 96 716 6879
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
