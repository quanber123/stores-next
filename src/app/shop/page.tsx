'use client';

import LoadingItem from '@/components/(ui)/loadingItem';
import dynamic from 'next/dynamic';

const DynamicFilter = dynamic(() => import('./_components/filter'), {
  loading: () => (
    <div className='container flex flex-col md:flex-row justify-between items-center gap-[20px] md:gap-[80px]'>
      <div className='skeleton max-w-[320px] sm:w-full h-[48px]'></div>
      <div className='skeleton w-full h-[48px]'></div>
    </div>
  ),
  ssr: false,
});
const DynamicProducts = dynamic(() => import('./_components/products'), {
  loading: () => (
    <LoadingItem
      sectionClass={
        'container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[40px]'
      }
      heightItem='h-[420px]'
      amount={8}
    />
  ),
  ssr: false,
});
export default function Shop() {
  return (
    <div className='flex flex-col items-center gap-[24px] px-8 py-8'>
      <DynamicFilter />
      <DynamicProducts />
    </div>
  );
}
