'use client';
import { useCallback, useContext, useMemo } from 'react';
import cartImg from '@/assets/images/cart.png';
import { DropdownContext } from '@/context/DropdownProvider';
import LazyLoadImage from '../(ui)/lazyloadImage';
import { Cart } from '@/types/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatNumberWithDot } from '@/lib/utils/format';
import './Dropdown.css';
function CartDropdown({ carts }: { carts: Cart[] }) {
  const { state, setVisibleDropdown } = useContext(DropdownContext);
  const router = useRouter();
  const redirectCart = useCallback(() => {
    setVisibleDropdown('visibleCartDropdown');
    router.push('/cart', { scroll: true });
  }, [setVisibleDropdown, router]);
  const renderedCart = useMemo(() => {
    return carts.map((c) => {
      return (
        <article
          key={c._id}
          className='text-gray-700 flex gap-6 text-sm md:text-base'
        >
          <div className='relative w-[150px] rounded-[12px] overflow-hidden'>
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
            <div className='flex items-center gap-4'>
              <p>
                Size:{' '}
                <span className='uppercase font-bold'>{c.product.size}</span>
              </p>
              <p>
                Color:{' '}
                <span className='capitalize font-bold'>{c.product.color}</span>
              </p>
            </div>
            <p>
              Quantity: <span className='font-bold'>{c.product.quantity}</span>
            </p>
            <p
              className='max-w-[180px] text-ellipsis whitespace-nowrap overflow-hidden'
              title={`${formatNumberWithDot(
                c.product.totalPrice
              ).toString()} VND`}
            >
              TotalPrice:{' '}
              <span className='font-bold'>
                {formatNumberWithDot(c.product.totalPrice)}
              </span>{' '}
              VND
            </p>
          </div>
        </article>
      );
    });
  }, [carts]);
  return (
    <div
      className={`cart-dropdown ${state.visibleCartDropdown ? 'active' : ''}`}
    >
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
            className='transition-colors h-[42px] px-4 bg-violet-500 hover:bg-neutral-700 text-white rounded-[4px]'
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
