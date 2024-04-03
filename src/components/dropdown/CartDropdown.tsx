'use client';
import { useCallback, useContext, useMemo } from 'react';
import cartImg from '@/assets/images/cart.png';
import { DropdownContext } from '@/context/DropdownProvider';
import LazyLoadImage from '../(ui)/lazyloadImage';
import { Cart } from '@/types/types';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import './Dropdown.css';
function CartDropdown({ carts }: { carts: Cart[] }) {
  const { state, setVisibleDropdown } = useContext(DropdownContext);
  const redirectCart = useCallback(() => {
    setVisibleDropdown('visibleCartDropdown');
    redirect('/cart');
  }, [setVisibleDropdown, redirect]);
  const renderedCart = useMemo(() => {
    return carts.map((c) => {
      return (
        <article
          key={c._id}
          className='text-semiBoldGray flex items-center gap-[20px]'
        >
          <div className='relative rounded-[12px] overflow-hidden'>
            <LazyLoadImage
              src={c.product.image}
              alt={c.product.name}
              className='w-full h-full object-cover'
              width={150}
              height={80}
            />
          </div>
          <div className='flex flex-col gap-[5px]'>
            <h3 className='font-bold capitalize'>{c.product.name}</h3>
            <p>Size: {c.product?.size}</p>
            <p>Color: {c.product?.color}</p>
          </div>
        </article>
      );
    });
  }, [carts]);
  return (
    <div className={`cart-modal ${state.visibleCartDropdown ? 'active' : ''}`}>
      <h3 className='pl-[16px] text-lg text-gray-700 font-bold'>Your Cart</h3>
      <div className='flex-1 pl-[16px] pr-[32px] flex flex-col gap-[20px] overflow-auto'>
        {carts.length ? (
          renderedCart
        ) : (
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-[10px]'>
            <Image
              className='w-full h-full rounded-[2px]'
              width={100}
              height={100}
              src={cartImg}
              alt='cart-img'
              priority
            />
            <p className='font-bold'>No products yet.</p>
          </div>
        )}
      </div>
      {carts.length > 0 && (
        <div className='pr-[16px] my-4 flex justify-end'>
          <button
            className='h-[42px] px-4 bg-purple hover:bg-darkGray text-white rounded-[4px]'
            onClick={redirectCart}
          >
            View your cart
          </button>
        </div>
      )}
    </div>
  );
}

export default CartDropdown;
