import type { Metadata } from 'next';
interface RootLayoutProps {
  children: React.ReactNode;
}
// export const metadata: Metadata = {
//   title: '...',
//   description: '...',
// };
export default async function VerifiedLayout({
  children,
}: RootLayoutProps): Promise<JSX.Element> {
  return <>{children}</>;
}
