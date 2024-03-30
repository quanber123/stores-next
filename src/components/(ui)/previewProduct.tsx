import { Product } from '@/types/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import LazyLoadImage from './lazyloadImage';
type Props = {
  product: Product;
};
const PreviewProduct: React.FC<Props> = ({ product }) => {
  const { _id, images, name, price, sale, salePrice } = product;
  const router = useRouter();
  return (
    <article className='flex flex-col gap-4'>
      <div className='w-full overflow-hidden'>
        <LazyLoadImage
          width={680}
          height={320}
          src={images[0]}
          alt={name}
          className='hover:scale-110 transition-all duration-200 cursor-pointer'
        />
        {sale?.rate && sale?.active && (
          <p className='absolute top-0 right-0 px-2 py-1 z-50 bg-purple text-white'>
            -{sale?.rate}%
          </p>
        )}
      </div>
      <div className='flex flex-col gap-[5px]'>
        <div className='flex justify-between items-center text-mediumGray font-bold'>
          <h6
            className='cursor-pointer capitalize'
            onClick={() => router.push(`/shop/${_id}`, { scroll: true })}
          >
            {name}
          </h6>
          {/* {loveProduct ? (
            <FaHeart
              className='cursor-pointer text-purple'
              onClick={handlePostFavorite}
            />
          ) : (
            <FaRegHeart
              className='cursor-pointer hover:text-purple transition-colors'
              onClick={handlePostFavorite}
            />
          )} */}
        </div>
        <p className='flex items-center gap-[20px]'>
          <span
            className={`${
              sale?.rate && sale?.active && 'text-red-600 line-through'
            }`}
          >
            {price} VND
          </span>
          <span
            className={`${
              sale?.rate && sale?.active ? 'block text-sm font-bold' : 'hidden'
            }`}
          >
            {salePrice} VND
          </span>
        </p>
      </div>
    </article>
  );
};

export default PreviewProduct;
