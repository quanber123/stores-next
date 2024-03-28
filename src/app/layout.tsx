import { Roboto } from 'next/font/google';
import StoreProvider from './StoreProvider';
import UiProvider from './UiProvider';
import './globals.css';
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
});
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang='vi'>
      <head>
        <link
          rel='icon'
          href='http://localhost:3000/public/images/logo-04.png-fotor-2023121102555.png'
        />
      </head>
      <body className={roboto.className}>
        <UiProvider>
          <StoreProvider>{children}</StoreProvider>
        </UiProvider>
      </body>
    </html>
  );
}
