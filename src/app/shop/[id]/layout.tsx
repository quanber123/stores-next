interface RootLayoutProps {
  children: React.ReactNode;
}
export default function ProductLayout({
  children,
}: RootLayoutProps): JSX.Element {
  return <>{children}</>;
}
