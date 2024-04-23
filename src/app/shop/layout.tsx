import { getSeo } from '@/api/seo';
import type { Metadata, ResolvingMetadata } from 'next';

interface RootLayoutProps {
  children: React.ReactNode;
}
type Props = {
  title: string;
  description: string;
  setIndex: string;
  icon: string;
  logo: string;
};
export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
  const repo: Props = await getSeo('shop');
  const prevTitle = (await parent).title || 'Shop';
  const prevDes = (await parent).description || undefined;
  const previousImages = (await parent).openGraph?.images || [];
  const prevIcons = (await parent).icons;
  return {
    title: repo.title ? repo.title : prevTitle,
    description: repo.description ? repo.description : null,
    openGraph: {
      title: repo.title ? repo.title : prevTitle,
      images: repo.logo ? [repo.logo, ...previousImages] : [...previousImages],
      description: repo.description ? repo.description : prevDes,
    },
    icons: repo.icon ? repo.icon : prevIcons,
  };
}
export default async function ShopLayout({
  children,
}: RootLayoutProps): Promise<JSX.Element> {
  return <>{children}</>;
}
