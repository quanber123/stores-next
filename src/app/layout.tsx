import React from 'react';
import dynamic from 'next/dynamic';
import UiProvider from '@/context/UiProvider';
import StoreProvider from '@/context/StoreProvider';
import { Roboto } from 'next/font/google';
import { ModalProvider } from '@/context/ModalProvider';
import { FetchDataProvider } from '@/context/FetchDataProvider';
import { Metadata } from 'next';
import './globals.css';
const DynamicScroll = dynamic(() => import('@/components/common/scroll'));
const DynamicModal = dynamic(() => import('@/components/modal/Modal'));
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
});
interface RootLayoutProps {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}
export const metadata: Metadata = {
  title: {
    template: '%s | COZASTORE',
    default: 'COZASTORE',
  },
};
export default async function RootLayout({
  children,
  header,
  footer,
}: RootLayoutProps): Promise<JSX.Element> {
  return (
    <html lang='vi'>
      <head>
        <link
          rel='icon'
          href={`${process.env.NEXT_PUBLIC_BACKEND_URL}public/images/logo-04.png-fotor-2023121102555.png`}
        />
      </head>
      <body className={roboto.className}>
        <UiProvider>
          <StoreProvider>
            <FetchDataProvider>
              <ModalProvider>
                {header}
                <main className='min-h-screen flex-1'>{children}</main>
                {footer}
                <DynamicScroll />
                <DynamicModal />
              </ModalProvider>
            </FetchDataProvider>
          </StoreProvider>
        </UiProvider>
      </body>
    </html>
  );
}
