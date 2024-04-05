import { ModalContext } from '@/context/ModalProvider';
import { Icons } from '@/enum/enum';
import {
  useGetAllFavoritesQuery,
  useGetFavoriteByProductQuery,
  usePostFavoritesMutation,
} from '@/lib/redux/query/productQuery';
import { userInfo } from '@/lib/redux/slice/userSlice';
import { Product } from '@/types/types';
import Image from 'next/image';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
type Props = {
  product: Product;
};
const ListImages: React.FC<Props> = ({ product }) => {
  const { _id, images } = product;
  const { setVisibleModal } = useContext(ModalContext);
  const user = useSelector(userInfo);
  const { data: dataFavorite, isSuccess: isSuccessFavorite } =
    useGetFavoriteByProductQuery(_id);
  const { data: dataUserFavorite, isSuccess: isSuccessUserFavorite } =
    useGetAllFavoritesQuery(null, { skip: !user?.id });
  const isCurUserLiked = useMemo(() => {
    return !!(
      isSuccessUserFavorite &&
      dataUserFavorite.favorite?.products?.find((p: Product) => p._id === _id)
    );
  }, [isSuccessUserFavorite, dataUserFavorite]);
  const [indexImage, setIndexImage] = useState<number>(0);
  const handleIndex = (index: number) => {
    setIndexImage(index);
  };
  const [postFavorite] = usePostFavoritesMutation();
  const handlePostFavorite = useCallback(() => {
    if (user?.id) {
      postFavorite(product._id);
    } else {
      setVisibleModal('visibleLoginModal');
    }
  }, [setVisibleModal, postFavorite, user]);
  const handlePrev = useCallback(() => {
    setIndexImage((prevIndex) => {
      if (prevIndex === 0) return images?.length - 1;
      return prevIndex - 1;
    });
  }, [images?.length]);
  const handleNext = useCallback(() => {
    setIndexImage((prevIndex) => {
      if (prevIndex === images?.length - 1) return 0;
      return prevIndex + 1;
    });
  }, [images?.length]);
  useEffect(() => {
    const infiniteSlider = setInterval(() => {
      handleNext();
    }, 5000);
    return clearInterval(infiniteSlider);
  }, [handleNext]);
  const renderListImage = useMemo(
    () =>
      images?.map((image, index) => {
        return (
          <Image
            width={520}
            height={630}
            key={index}
            className='w-full h-full object-cover'
            src={image}
            alt={`${image}`}
            style={{
              transform: `translateX(${-100 * indexImage}%)`,
              transition: 'all 0.3s ease-in-out',
            }}
          />
        );
      }),
    [images, indexImage]
  );
  const wrapImages = useMemo(
    () =>
      images?.map((image, index) => {
        return (
          <div
            key={index}
            className='max-w-[76px] w-full min-h-[64px] p-1 rounded overflow-hidden'
            style={{
              border: `${indexImage === index ? '1px solid #ccc' : ''}`,
            }}
          >
            <Image
              key={index}
              className='object-cover w-full h-full cursor-pointer'
              width={70}
              height={84}
              src={image}
              alt={`${image}`}
              onClick={() => handleIndex(index)}
            />
          </div>
        );
      }),
    [images, indexImage]
  );
  return (
    <div className='w-full flex flex-col sm:flex-row gap-[20px]'>
      <div className='md:max-w-[94px] w-full py-2 flex flex-row sm:flex-col justify-between sm:justify-start sm:gap-[40px] overflow-x-auto overflow-y-hidden md:overflow-y-auto md:overflow-x-hidden'>
        {wrapImages}
      </div>
      <div className='flex flex-col gap-8'>
        <div className='relative w-full h-full max-h-[630px] overflow-hidden flex'>
          {renderListImage}
          {images.length > 1 && (
            <>
              <button
                className='absolute top-1/2 left-0 z-20 w-[40px] h-[40px] flex justify-center items-center text-white hover:bg-neutral-800 transition-all duration-200'
                onClick={handlePrev}
                aria-label='Previous'
                dangerouslySetInnerHTML={{ __html: Icons.left_icon }}
              ></button>
              <button
                className='absolute top-1/2 right-0 z-20 w-[40px] h-[40px] flex justify-center items-center text-white hover:bg-neutral-800 transition-all duration-200'
                onClick={handleNext}
                aria-label='Next'
                dangerouslySetInnerHTML={{ __html: Icons.right_icon }}
              ></button>
            </>
          )}
        </div>
        <div className='flex justify-center items-center gap-6'>
          <button className='flex items-center gap-2 text-lg font-bold'>
            <span>Share:</span>
            <span
              className='text-blue-700'
              dangerouslySetInnerHTML={{ __html: Icons.facebook_icon }}
            ></span>
          </button>
          <span className='w-[2px] h-[24px] bg-gray-200'></span>
          <button
            className='flex items-center gap-2 text-lg font-bold'
            onClick={handlePostFavorite}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: isCurUserLiked
                  ? Icons.heart_active_icon
                  : Icons.heart_icon,
              }}
            ></span>
            <span>Liked</span>
            <span>
              (
              {isSuccessFavorite && dataFavorite.totalLiked > 0
                ? dataFavorite.totalLiked
                : 0}
              )
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListImages;
