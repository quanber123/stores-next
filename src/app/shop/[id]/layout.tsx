import React from 'react';

interface RootLayoutProps {
  children: React.ReactNode;
}
export default function ProductDetailsLayout({
  children,
}: RootLayoutProps): JSX.Element {
  return <>{children}</>;
}
