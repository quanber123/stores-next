import Carousel from '@/components/(ui)/carousel';
import PreviewProduct from '@/components/(ui)/previewProduct';
import { useCarousel } from '@/lib/hooks/useCarousel';
import { Product } from '@/types/types';
import React, { useMemo } from 'react';

const RelatedProducts = ({ products }: { products: Product[] }) => {
  const { width } = useCarousel(products.length);
  const renderedProducts = useMemo(() => {
    return products.map((p) => {
      return (
        <PreviewProduct
          key={p._id}
          product={p}
          style={{
            width: `calc(${width}% - 20px)`,
            flexShrink: 0,
          }}
        />
      );
    });
  }, [products, width]);
  return (
    <>
      <h2 className='text-center text-xl md:text-6xl text-gray-700 font-bold'>
        Related Products
      </h2>
      <Carousel>{renderedProducts}</Carousel>
    </>
  );
};

export default RelatedProducts;
