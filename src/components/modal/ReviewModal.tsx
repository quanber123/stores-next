import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ModalContext } from '@/context/ModalProvider';
import { useSelector } from 'react-redux';
import { userInfo } from '@/lib/redux/slice/userSlice';
import { useReviewsProductMutation } from '@/lib/redux/query/productQuery';
import useClickOutside from '@/lib/hooks/useClickOutside';
import { Icons } from '@/enum/enum';
import { hidePartialUsername } from '@/lib/utils/format';
import { validateEmptyStr } from '@/lib/utils/validate';
import LazyLoadImage from '../(ui)/lazyloadImage';

const ReviewsModal = () => {
  const user = useSelector(userInfo);
  const { state, setVisibleModal } = useContext(ModalContext);
  const [
    reviewsProduct,
    {
      data: dataReviews,
      isSuccess: isSuccessReviews,
      isLoading: isLoadingReviews,
    },
  ] = useReviewsProductMutation();
  const [modalRef, clickOutside] = useClickOutside('visibleReviewsModal');
  const [rate, setRate] = useState(5);
  const [reviewsForm, setReviewsForm] = useState({
    reviews: '',
    showUser: false,
  });
  const [err, setErr] = useState(false);
  const product = useMemo(
    () => state.visibleReviewsModal,
    [state.visibleReviewsModal]
  );
  console.log(product);
  const handleStarClick = (selectedRate: number) => {
    setRate(selectedRate);
  };
  const handleChangeReviews = (e: React.ChangeEvent<any>) => {
    const { name, type, value, checked } = e.target;
    setReviewsForm((prevForm) => {
      return { ...prevForm, [name]: type === 'checkbox' ? checked : value };
    });
  };

  const getRatingText = () => {
    switch (rate) {
      case 1:
        return 'Poor';
      case 2:
        return 'Not Satisfied';
      case 3:
        return 'Average';
      case 4:
        return 'Satisfied';
      case 5:
        return 'Excellent';
      default:
        return '';
    }
  };
  const renderedStars = useMemo(() => {
    return [...Array(5)].map((_, index) => {
      return (
        <div
          key={index}
          className='cursor-pointer'
          onClick={() => handleStarClick(index + 1)}
        >
          {rate >= index + 1 ? (
            <div className='w-[24px] h-[24px]'>
              <span
                dangerouslySetInnerHTML={{ __html: Icons.star_active_icon }}
              />
            </div>
          ) : (
            <div className='w-[24px] h-[24px]'>
              <span dangerouslySetInnerHTML={{ __html: Icons.star_icon }} />
            </div>
          )}
        </div>
      );
    });
  }, [rate]);
  const handleReviews = () => {
    if (!validateEmptyStr(reviewsForm.reviews)) {
      reviewsProduct({
        ...reviewsForm,
        rate: rate,
        productId: product.id,
        orderId: product.orderId,
      });
    } else {
      setErr(true);
    }
  };
  useEffect(() => {
    if (isSuccessReviews && dataReviews) {
      setErr(false);
      setVisibleModal({
        visibleToastModal: {
          type: 'success',
          message: dataReviews?.message,
        },
      });
    }
  }, [isSuccessReviews, dataReviews, setVisibleModal]);
  return (
    <section
      className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-900 opacity-90 flex justify-center items-center text-neutral-700 ${
        state.visibleReviewsModal ? 'w-full h-full z-[999]' : 'w-0 h-0 -z-10'
      }`}
      onClick={clickOutside}
    >
      <div
        className='bg-white w-4/5 lg:w-1/3 py-6 flex flex-col justify-between gap-[20px] rounded text-neutral-700'
        ref={modalRef}
      >
        <div className='px-6 flex flex-col gap-[20px]'>
          <p className='text-lg font-bold'>Product reviews</p>
          <div className='flex gap-[10px]'>
            <div className='w-[56px] h-[56px]'>
              <LazyLoadImage
                width={56}
                height={56}
                src={product.image}
                alt={product.name}
                className='w-full h-full object-cover'
              />
            </div>
            <div className='text-sm flex flex-col gap-[4px]'>
              <p className='capitalize text-neutral-700'>{product.name}</p>
              <div className='flex items-center gap-[10px] text-neutral-500'>
                <p>
                  Color:{' '}
                  <span className='capitalize font-bold'>{product.color}</span>
                </p>
                <p>
                  Size:{' '}
                  <span className='uppercase font-bold'>{product.size}</span>
                </p>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-[20px]'>
            <p>Product quality:</p>
            <div className='flex text-lg'>{renderedStars}</div>
            <p className='text-yellow'>{getRatingText()}</p>
          </div>
          <textarea
            className={`border ${
              validateEmptyStr(reviewsForm.reviews) && err
                ? 'border-red-500'
                : 'border-neutral-500'
            } focus:outline-none rounded-[4px] p-4`}
            name='reviews'
            id='reviews'
            placeholder='Please share what you like about this product with others.'
            cols={10}
            rows={10}
            value={reviewsForm.reviews}
            onChange={handleChangeReviews}
          />
          <div className='flex items-center gap-[10px]'>
            <input
              className='w-[20px] h-[20px]'
              type='checkbox'
              id='showUser'
              name='showUser'
              checked={reviewsForm.showUser}
              onChange={handleChangeReviews}
            />
            <label htmlFor='showUser' className='flex flex-col text-sm'>
              <p>Username displayed on this review</p>
              <p className='text-[12px] text-neutral-800'>
                The account will be displayed as{' '}
                {reviewsForm.showUser
                  ? user?.name
                  : hidePartialUsername(user?.name || '')}
              </p>
            </label>
          </div>
          <div className='flex justify-end items-center gap-[20px]'>
            <button
              disabled={isLoadingReviews}
              onClick={() => setVisibleModal('visibleReviewsModal')}
            >
              Return
            </button>
            <button
              className='bg-violet-500 hover:bg-neutral-700 transition-colors px-2 py-1 text-white rounded-[2px]'
              onClick={handleReviews}
              disabled={isLoadingReviews}
            >
              Complete
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsModal;
