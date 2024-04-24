import { Metadata } from 'next';
import { getSeo } from '@/api/seo';

interface ShopLayoutProps {
  children: React.ReactNode;
}
type Props = {
  title: string;
  description: string;
  setIndex: string;
  icon: string;
  logo: string;
};
export async function generateMetadata(): Promise<Metadata> {
  const repo: Props = await getSeo('shop');
  return {
    title: repo?.title,
    description: repo?.description,
    openGraph: {
      title: repo?.title,
      images: repo?.logo,
      description: repo?.description,
    },
    icons: repo?.icon,
  };
}
export default async function ShopLayout({
  children,
}: ShopLayoutProps): Promise<JSX.Element> {
  return <>{children}</>;
}
