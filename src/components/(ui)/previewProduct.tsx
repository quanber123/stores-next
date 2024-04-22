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
import { formatNumberWithDot } from '@/lib/utils/format';
type Props = {
  product: Product;
  style?: React.CSSProperties;
};
const PreviewProduct: React.FC<Props> = ({ product, style }) => {
  const { _id, images, name, price, finalPrice, coupon } = product;
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
    [router, _id]
  );
  return (
    <article style={style} className='flex flex-col gap-4'>
      <div className='relative w-full overflow-hidden'>
        <LazyLoadImage
          width={680}
          height={320}
          src={images[0]}
          alt={name}
          className='hover:scale-110 transition-all duration-200 cursor-pointer'
        />
        {coupon?.discount && !coupon?.expired && (
          <p className='absolute top-0 right-0 px-4 py-1 z-10 bg-violet-500 text-white'>
            -{coupon?.discount}%
          </p>
        )}
      </div>
      <div className='flex flex-col gap-[5px]'>
        <div className='flex justify-between items-center text-mediumGray font-bold'>
          <p
            className='cursor-pointer capitalize'
            onClick={() => handleRedirect(_id)}
          >
            {name}
          </p>
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
        <div className='mt-3'>
          <p className='flex justify-between items-center gap-[20px]'>
            <span
              className={`${
                coupon?.discount! && !coupon?.expired
                  ? 'block font-bold'
                  : 'hidden'
              }`}
            >
              {finalPrice && formatNumberWithDot(finalPrice)} VND
            </span>
            <span
              className={`${
                coupon?.discount &&
                !coupon?.expired &&
                'text-sm text-red-600 line-through'
              }`}
            >
              {formatNumberWithDot(price)} VND
            </span>
          </p>
        </div>
      </div>
    </article>
  );
};

export default PreviewProduct;
