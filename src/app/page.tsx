import LoadingPage from '@/components/(ui)/loadingPage';
import { nextConfig } from '@/config/config';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
const DynamicBanners = dynamic(() => import('@/components/pages/home/banner'), {
  loading: () => <LoadingPage />,
  ssr: false,
});
const DynamicCategories = dynamic(
  () => import('@/components/pages/home/category'),
  {
    loading: () => <LoadingPage />,
    ssr: false,
  }
);
const DynamicProducts = dynamic(
  () => import('@/components/pages/home/product'),
  {
    loading: () => <LoadingPage />,
    ssr: false,
  }
);
const DynamicBlogs = dynamic(() => import('@/components/pages/home/blog'), {
  loading: () => <LoadingPage />,
  ssr: false,
});
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
    <main className='flex min-h-screen flex-col items-center justify-between gap-[80px] overflow-x-auto py-24'>
      <DynamicBanners />
      <DynamicCategories />
      <DynamicProducts />
      <DynamicBlogs />
    </main>
  );
}
