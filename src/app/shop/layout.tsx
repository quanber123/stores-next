import type { Metadata } from 'next';

interface RootLayoutProps {
  children: React.ReactNode;
  filter: React.ReactNode;
  products: React.ReactNode;
}
export const metadata: Metadata = {
  title: 'SHOP',
};
export default async function ShopLayout({
  children,
  filter,
  products,
}: RootLayoutProps): Promise<JSX.Element> {
  return (
    <div className='flex flex-col items-center gap-[24px] px-8 py-8'>
      {children}
      {filter}
      {products}
    </div>
  );
}
