import type { Metadata } from 'next';

interface RootLayoutProps {
  children: React.ReactNode;
}
export const metadata: Metadata = {
  title: 'SHOP',
};
export default async function ShopLayout({
  children,
}: RootLayoutProps): Promise<JSX.Element> {
  return <>{children}</>;
}
