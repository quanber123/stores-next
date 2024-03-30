interface RootLayoutProps {
  children: React.ReactNode;
}
export default async function ShopLayout({
  children,
}: RootLayoutProps): Promise<JSX.Element> {
  return <>{children}</>;
}
