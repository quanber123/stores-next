import { Metadata, ResolvingMetadata } from 'next';
import { getSeo } from '@/api/seo';
interface BlogLayoutProps {
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
  const repo: Props = await getSeo('blog');
  const prevTitle = (await parent)?.title || 'Blog';
  const prevDes = (await parent)?.description || undefined;
  const previousImages = (await parent)?.openGraph?.images || [];
  const prevIcons = (await parent)?.icons;
  return {
    title: repo?.title ? repo.title : prevTitle,
    description: repo?.description ? repo.description : null,
    openGraph: {
      title: repo?.title ? repo.title : prevTitle,
      images: repo?.logo ? [repo.logo, ...previousImages] : [...previousImages],
      description: repo?.description ? repo.description : prevDes,
    },
    icons: repo?.icon ? repo.icon : prevIcons,
  };
}
export default async function BlogLayout({
  children,
}: BlogLayoutProps): Promise<JSX.Element> {
  return <>{children}</>;
}
