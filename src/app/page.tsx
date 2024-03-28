import { nextConfig } from '@/config/config';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
const DynamicBanners = dynamic(() => import('@/components/pages/home/banner'), {
  loading: () => (
    <div className='h-[320px] sm:h-[480px] md:h-[640px] lg:h-[100vh] flex justify-center items-center text-4xl font-bold text-neutral-700'>
      ...Loading
    </div>
  ),
  ssr: false,
});
const DynamicCategories = dynamic(
  () => import('@/components/pages/home/category'),
  {
    loading: () => (
      <div className='flex-1 flex justify-center items-center text-4xl font-bold text-neutral-700'>
        ...Loading
      </div>
    ),
    ssr: false,
  }
);
// export async function generateMetadata(): Promise<Metadata> {
//   return {
//     title: '',
//     description: '',
//     openGraph: {
//       images: [],
//     },
//   };
// }
export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between gap-[80px]'>
      <DynamicBanners />
      <DynamicCategories />
    </main>
  );
}
