import { Metadata, ResolvingMetadata } from 'next';
import { getSeoDetailsPage } from '@/api/seo';
interface BlogDetailsLayoutProps {
  children: React.ReactNode;
}
type Seo = {
  title: string;
  imgSrc: string;
};
type Params = {
  params: { id: string };
  // searchParams: { [key: string]: string | string[] | undefined };
};
export async function generateMetadata(
  { params }: Params,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const repo: Seo = await getSeoDetailsPage(id, 'blog');
  const prevTitle = (await parent).title || 'Blog';
  const prevDes = (await parent).description || undefined;
  return {
    title: repo?.title ? repo.title : prevTitle,
    description: repo?.title ? repo.title : null,
    openGraph: {
      title: repo?.title ? repo.title : prevTitle,
      images: repo.imgSrc,
      description: repo?.title ? repo.title : prevDes,
    },
  };
}
export default async function BlogDetailsLayout({
  children,
}: BlogDetailsLayoutProps): Promise<JSX.Element> {
  return <>{children}</>;
}
