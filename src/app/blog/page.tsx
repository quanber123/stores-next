import LoadingItem from '@/components/(ui)/loadingItem';
import dynamic from 'next/dynamic';

const DynamicTitle = dynamic(() => import('./_components/title'), {
  loading: () => <div className='skeleton w-full h-[240px]'></div>,
  ssr: false,
});
const DynamicFilter = dynamic(() => import('./_components/filter'), {
  loading: () => <div className='skeleton w-full h-[320px] lg:w-1/3'></div>,
});
const DynamicBlogs = dynamic(() => import('./_components/blogs'), {
  loading: () => (
    <LoadingItem
      sectionClass='w-full lg:w-2/3'
      heightItem='h-[500px]'
      amount={8}
    />
  ),
});
export default function Blog() {
  return (
    <div className='flex flex-col items-center gap-[24px]'>
      <DynamicTitle />
      <section className='container px-4 m-auto flex items-start flex-col lg:flex-row-reverse gap-20'>
        <DynamicFilter />
        <DynamicBlogs />
      </section>
    </div>
  );
}
