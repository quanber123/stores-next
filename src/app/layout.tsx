import dynamic from 'next/dynamic';
import UiProvider from '@/context/UiProvider';
import StoreProvider from '@/context/StoreProvider';
import { Roboto } from 'next/font/google';
import { ModalProvider } from '@/context/ModalProvider';
import { DropdownProvider } from '@/context/DropdownProvider';
import { StatusOrderProvider } from '@/context/StatusOrderProvider';
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
const DynamicScroll = dynamic(() => import('@/components/common/scroll'));
const DynamicModal = dynamic(() => import('@/components/modal/Modal'));
const DynamicFooter = dynamic(() => import('@/components/common/footer'), {
  loading: () => <div className='skeleton mt-24 w-full h-[320px]'></div>,
  ssr: false,
});
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
});
type RootLayoutProps = {
  children: React.ReactNode;
};
export default async function RootLayout({
  children,
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
            <StatusOrderProvider>
              <ModalProvider>
                <DropdownProvider>
                  <DynamicHeader />
                </DropdownProvider>
                <main className='min-h-screen flex-1'>{children}</main>
                <DynamicScroll />
                <DynamicModal />
                <DynamicFooter />
              </ModalProvider>
            </StatusOrderProvider>
          </StoreProvider>
        </UiProvider>
      </body>
    </html>
  );
}
