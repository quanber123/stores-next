import React from 'react';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import UiProvider from '@/context/UiProvider';
import StoreProvider from '@/context/StoreProvider';
import { Roboto } from 'next/font/google';
import { ModalProvider } from '@/context/ModalProvider';
import { FetchDataProvider } from '@/context/FetchDataProvider';
import { Metadata } from 'next';
import { DropdownProvider } from '@/context/DropdownProvider';
import { getSeo } from '@/api/seo';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
const DynamicHeader = dynamic(() => import('@/components/common/header'), {
  loading: () => (
    <div
      style={{ boxShadow: '0 0px 3px 0px rgba(0, 0, 0, 0.2)' }}
      className='fixed top-0 left-0 w-full h-[64px] z-[100] flex items-center'
    >
      <div className='container m-auto px-4 flex justify-between items-center gap-20'>
        <div className='skeleton w-[150px] h-[32px]'></div>
        <div className='skeleton w-[150px] h-[38px]'></div>
      </div>
    </div>
  ),
  ssr: false,
});
const DynamicFooter = dynamic(() => import('@/components/common/footer'), {
  loading: () => <div className='skeleton mt-24 w-full h-[320px]'></div>,
  ssr: false,
});
const DynamicScroll = dynamic(() => import('@/components/common/scroll'));
const DynamicModal = dynamic(() => import('@/components/modal/Modal'));
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
});
interface RootLayoutProps {
  children: React.ReactNode;
}
type Props = {
  title: string;
  description: string;
  setIndex: string;
  icon: string;
  image: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const repo: Props = await getSeo('home');
  return {
    title: {
      template: `%s | ${repo.title}`,
      default: repo.title,
    },
    description: repo.description,
    openGraph: {
      images: [repo.image],
    },
    icons: repo.icon,
  };
}
export default async function RootLayout({
  children,
}: RootLayoutProps): Promise<JSX.Element> {
  console.log(process.env.NEXT_GAID);
  return (
    <html lang='vi'>
      <head>
        <Script
          async
          src='https://www.googletagmanager.com/gtag/js?id=G-VZB8R6D98C'
        ></Script>
        <Script id='google-analytics'>
          {` window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments)}
  gtag('js', new Date());

  gtag('config', 'G-VZB8R6D98C');`}
        </Script>
      </head>
      <body className={roboto.className}>
        {/* <GoogleAnalytics gaId={process.env.NEXT_GAID as string} /> */}
        <UiProvider>
          <StoreProvider>
            <FetchDataProvider>
              <ModalProvider>
                <DropdownProvider>
                  <DynamicHeader />
                </DropdownProvider>
                <main className='min-h-screen flex-1'>{children}</main>
                <DynamicScroll />
                <DynamicModal />
                <DynamicFooter />
              </ModalProvider>
            </FetchDataProvider>
          </StoreProvider>
        </UiProvider>
      </body>
    </html>
  );
}
