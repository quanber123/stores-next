'use client';
import LoadingItem from '@/components/(ui)/loadingItem';
import dynamic from 'next/dynamic';
const DynamicBanners = dynamic(() => import('@/app/_components/banner'), {
  loading: () => (
    <div className='skeleton w-full h-[320px] sm:h-[480px] md:h-[640px] lg:h-[100vh]'></div>
  ),
  ssr: false,
});
const DynamicCategories = dynamic(() => import('@/app/_components/category'), {
  loading: () => <div className='skeleton container w-full h-[180px]'></div>,
  ssr: false,
});
const DynamicProducts = dynamic(() => import('@/app/_components/product'), {
  loading: () => (
    <div className='w-full flex flex-col gap-8 px-4'>
      <div className='skeleton m-auto w-[240px] h-[48px]'></div>
      <LoadingItem
        sectionClass={
          'container m-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[40px]'
        }
        heightItem='h-[420px]'
        amount={8}
      />
    </div>
  ),
  ssr: false,
});
const DynamicBlogs = dynamic(() => import('@/app/_components/blog'), {
  loading: () => (
    <div className='w-full flex flex-col gap-8 px-4'>
      <div className='skeleton m-auto w-[240px] h-[48px]'></div>
      <div className='skeleton container m-auto w-full h-[420px]'></div>
    </div>
  ),
  ssr: false,
});
export default function Home() {
  return (
    <div className='flex flex-col items-center gap-16'>
      <DynamicBanners />
      <DynamicCategories />
      <DynamicProducts />
      <DynamicBlogs />
    </div>
  );
}
