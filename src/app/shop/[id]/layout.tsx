'use client';
import { useGetProductsByIdQuery } from '@/lib/redux/query/productQuery';
import { redirect, useParams } from 'next/navigation';
import React from 'react';

interface RootLayoutProps {
  children: React.ReactNode;
  images: React.ReactNode;
  products: React.ReactNode;
  information: React.ReactNode;
}
export default function ProductDetailsLayout({
  children,
  images,
  information,
  products,
}: RootLayoutProps): JSX.Element {
  const { id } = useParams();
  const {
    data: productData,
    isSuccess: isSuccessProduct,
    isError: isErrorProduct,
  } = useGetProductsByIdQuery(id);
  if (isErrorProduct) {
    redirect(`/not-found-product-${id}`);
  }
  return (
    <>
      {children}
      {images}
      {information}
      {products}
    </>
  );
}
