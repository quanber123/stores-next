import { Product } from '@/types/types';
import { useRouter } from 'next/navigation';
import React, { useCallback, useContext, useMemo } from 'react';
import LazyLoadImage from './lazyloadImage';
import { useSelector } from 'react-redux';
import { userInfo } from '@/lib/redux/slice/userSlice';
import {
  useGetAllFavoritesQuery,
  usePostFavoritesMutation,
} from '@/lib/redux/query/productQuery';
import { Icons } from '@/enum/enum';
import { ModalContext } from '@/context/ModalProvider';
import scrollElement from '@/lib/utils/scrollElement';
type Props = {
  product: Product;
  style?: React.CSSProperties;
};
const PreviewProduct: React.FC<Props> = ({ product, style }) => {
  const { _id, images, name, price, sale, salePrice } = product;
  const { setVisibleModal } = useContext(ModalContext);
  const user = useSelector(userInfo);
  const { data: dataUserFavorite, isSuccess: isSuccessUserFavorite } =
    useGetAllFavoritesQuery(null, { skip: !user?.id });
  const [postFavorite] = usePostFavoritesMutation();
  const isCurUserLiked = useMemo(() => {
    return !!(
      isSuccessUserFavorite &&
      dataUserFavorite.favorite?.products?.find((p: Product) => p._id === _id)
    );
  }, [_id, isSuccessUserFavorite, dataUserFavorite]);
  const handlePostFavorite = useCallback(
    (id: string | number) => {
      if (!user?.id) {
        setVisibleModal({
          visibleToastModal: {
            type: 'error',
            message: 'You have to login first!',
          },
        });
      } else {
        postFavorite(id);
      }
    },
    [user, setVisibleModal, postFavorite]
  );
  const router = useRouter();
  const handleRedirect = useCallback(
    (id: string) => {
      router.push(`/shop/${_id}`, { scroll: true });
      scrollElement();
    },
    [router]
  );
  return (
    <article style={style} className='flex flex-col gap-4'>
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
            onClick={() => handleRedirect(_id)}
          >
            {name}
          </h6>
          {isCurUserLiked ? (
            <button
              dangerouslySetInnerHTML={{ __html: Icons.heart_active_icon }}
              aria-label='heart-btn'
              onClick={() => handlePostFavorite(_id)}
            ></button>
          ) : (
            <button
              dangerouslySetInnerHTML={{ __html: Icons.heart_icon }}
              aria-label='heart-btn'
              onClick={() => handlePostFavorite(_id)}
            ></button>
          )}
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
