import { Metadata, ResolvingMetadata } from 'next';
import { getSeoDetailsPage } from '@/api/seo';
interface ProductDetailsLayoutProps {
  children: React.ReactNode;
}
type Seo = {
  name: string;
  images: string[];
  details: {
    description: string;
  };
};
type Params = {
  params: { id: string };
  // searchParams: { [key: string]: string | string[] | undefined };
};
export async function generateMetadata(
  { params }: Params,
  parent: ResolvingMetadata
): Promise<Metadata | ResolvingMetadata> {
  const id = params.id;
  const repo: Seo = await getSeoDetailsPage(id, 'product');
  const prevTitle = (await parent).title || 'Shop';
  const prevDes = (await parent).description || undefined;
  const previousImages = (await parent).openGraph?.images || [];
  return {
    title: repo?.name ? repo.name : prevTitle,
    description: repo?.details?.description ? repo.details.description : null,
    openGraph: {
      title: repo?.name ? repo.name : prevTitle,
      images: repo?.images ? [...repo.images] : [...previousImages],
      description: repo?.details?.description
        ? repo.details.description
        : prevDes,
    },
  };
}
export default async function ProductDetailsLayout({
  children,
}: ProductDetailsLayoutProps): Promise<JSX.Element> {
  return <>{children}</>;
}
