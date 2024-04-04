'use client';
import { useCallback, useContext, useMemo } from 'react';
import { DropdownContext } from '@/context/DropdownProvider';
import { Favorite } from '@/types/types';
import { usePostFavoritesMutation } from '@/lib/redux/query/productQuery';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import './Dropdown.css';
function FavoriteDropdown({ favorites }: { favorites: Favorite }) {
  const { state } = useContext(DropdownContext);
  const [postFavorite] = usePostFavoritesMutation();
  const handleRedirect = useCallback((id: string) => {
    redirect(`/shop/${id}`);
  }, []);
  const renderedFavorite = useMemo(() => {
    return favorites?.products?.map((p) => {
      return (
        <article
          key={p._id}
          className='h-[80px] text-semiBoldGray flex justify-between gap-[20px]'
        >
          <div className='relative rounded-[12px] overflow-hidden'>
            <Image
              width={200}
              height={80}
              loading='lazy'
              src={p.images[0]}
              alt={p.name}
              className='w-[150px] h-full object-cover'
            />
          </div>
          <div className='flex-1 flex flex-col justify-between gap-[5px]'>
            <h3
              className='font-bold cursor-pointer capitalize'
              onClick={() => handleRedirect(p._id)}
            >
              {p.name}
            </h3>
            <button
              className='w-max ml-auto px-4 py-2 text-base rounded-[2px] text-white bg-violet-500 hover:bg-neutral-700 transition-colors'
              onClick={() => postFavorite(p._id)}
            >
              Unlike
            </button>
          </div>
        </article>
      );
    });
  }, [favorites, handleRedirect, postFavorite]);
  return (
    <div
      className={`favorite-dropdown ${
        state.visibleFavoriteDropdown ? 'active' : ''
      }`}
    >
      <h3 className='pl-[16px] py-[12px] text-md text-semiBoldGray font-bold'>
        Your Favorite
      </h3>
      <div className='flex-1 pl-[16px] pr-[32px] flex flex-col gap-[20px] overflow-auto'>
        {favorites?.products?.length > 0 ? (
          renderedFavorite
        ) : (
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-[10px]'>
            <p className='font-bold'>No products yet.</p>
          </div>
        )}
      </div>
      {favorites?.products?.length > 0 && (
        <button className='py-2 flex justify-center items-center font-bold border-t border-gray-200 hover:text-violet-500 transition-colors'>
          Open Favorites
        </button>
      )}
    </div>
  );
}

export default FavoriteDropdown;
