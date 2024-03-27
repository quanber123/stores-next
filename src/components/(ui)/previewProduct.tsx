import { Product } from '@/types/types';
import Image from 'next/image';
import React from 'react';
type Props = {
  product: Product;
};
const PreviewProduct: React.FC<Props> = ({ product }) => {
  const { _id, images, name, price, sale, salePrice } = product;
  return (
    <article className='flex flex-col gap-4'>
      <div className='overflow-hidden cursor-pointer'>
        <Image
          width={680}
          height={480}
          style={{ transition: 'all 0.2s linear' }}
          className='w-full hover:scale-110'
          src={images[0]}
          alt={name}
          // loading='lazy'
          priority
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
            // onClick={() => handleLinkClick(_id)}
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
            ${price}
          </span>
          <span
            className={`${
              sale?.rate && sale?.active ? 'block text-sm font-bold' : 'hidden'
            }`}
          >
            ${salePrice}
          </span>
        </p>
      </div>
    </article>
  );
};

export default PreviewProduct;
