import type { Metadata } from 'next';

interface RootLayoutProps {
  children: React.ReactNode;
}
export const metadata: Metadata = {
  title: 'BLOG',
};
export default async function BlogLayout({
  children,
}: RootLayoutProps): Promise<JSX.Element> {
  return <>{children}</>;
}
