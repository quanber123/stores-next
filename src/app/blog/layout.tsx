import { Metadata } from 'next';
import { getSeo } from '@/api/seo';
interface BlogLayoutProps {
  children: React.ReactNode;
}
type Props = {
  title: string;
  description: string;
  setIndex: string;
};
export async function generateMetadata(): Promise<Metadata> {
  const repo: Props = await getSeo('blog');
  // const prevTitle = (await parent)?.title || 'Blog';
  // const prevDes = (await parent)?.description || undefined;
  // const previousImages = (await parent)?.openGraph?.images || [];
  // const prevIcons = (await parent)?.icons;
  return {
    title: repo?.title,
    description: repo?.description,
    openGraph: {
      title: repo?.title,
      description: repo?.description,
    },
  };
}
export default async function BlogLayout({
  children,
}: BlogLayoutProps): Promise<JSX.Element> {
  return <>{children}</>;
}
