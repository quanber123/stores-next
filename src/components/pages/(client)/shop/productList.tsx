import CustomPagination from '@/components/(ui)/customPagination';
import PreviewProduct from '@/components/(ui)/previewProduct';
import { Product } from '@/types/types';
import React, { useMemo } from 'react';
type Props = {
  products: Product[];
  totalPage: number;
};
const ProductList: React.FC<Props> = ({ products, totalPage }) => {
  const renderedProducts = useMemo(() => {
    return products?.map((p) => {
      return <PreviewProduct key={p._id} product={p} />;
    });
  }, [products]);
  return (
    <section className='container flex flex-col gap-[40px]'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[40px]'>
        {renderedProducts}
      </div>
      {totalPage > 1 && (
        <CustomPagination totalPage={totalPage} isScroll={true} />
      )}
    </section>
  );
};

export default ProductList;
