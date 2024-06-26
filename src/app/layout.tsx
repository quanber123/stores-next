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
import { SpeedInsights } from '@vercel/speed-insights/next';
import { getWebInfo } from '@/api/webInfoApi';
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
type SeoProps = {
  title: string;
  description: string;
  setIndex: string;
  icon: string;
  logo: string;
};
type WebInfo = {
  icon: string;
  logo: string;
  shopName: string;
  vatNumber: number;
  postCode: number;
};
export async function generateMetadata(): Promise<Metadata> {
  const repo: SeoProps = await getSeo('home');
  const info: WebInfo = await getWebInfo();
  return {
    title: {
      template: `%s | ${info?.shopName}`,
      default: info?.shopName,
    },
    description: repo?.description,
    openGraph: {
      title: repo?.title,
      images: [info?.logo],
      description: repo?.description,
    },
    icons: info?.icon,
  };
}
export default async function RootLayout({
  children,
}: RootLayoutProps): Promise<JSX.Element> {
  return (
    <html lang='vi'>
      <head>
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_GOOGLE_ANALYTICS}`}
        ></Script>
        <Script id='google-analytics'>
          {` window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments)}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_GOOGLE_ANALYTICS}');`}
        </Script>
      </head>
      <body className={roboto.className}>
        <UiProvider>
          <StoreProvider>
            <FetchDataProvider>
              <ModalProvider>
                <DropdownProvider>
                  <DynamicHeader />
                </DropdownProvider>
                <main className='pt-16 min-h-screen flex-1'>{children}</main>
                <DynamicScroll />
                <DynamicModal />
                <DynamicFooter />
              </ModalProvider>
            </FetchDataProvider>
          </StoreProvider>
        </UiProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
