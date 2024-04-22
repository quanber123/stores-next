'use client';
import LazyLoadImage from '@/components/(ui)/lazyloadImage';
import { ModalContext } from '@/context/ModalProvider';
import {
  useGetOderDetailsQuery,
  useUpdateOrderUserMutation,
} from '@/lib/redux/query/productQuery';
import { formatNumberWithDot } from '@/lib/utils/format';
import { notFound, useRouter } from 'next/navigation';
import React, { useCallback, useContext, useEffect } from 'react';
import Status from './_components/status';

export default function OrderDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { setVisibleModal } = useContext(ModalContext);
  const {
    data: dataOrder,
    isLoading: isLoadingOrder,
    isError: isErrorOrder,
  } = useGetOderDetailsQuery(id);
  const [
    updateOrder,
    {
      data: dataUpdateOrder,
      isSuccess: isSuccessUpdateOrder,
      isError: isErrorUpdateOrder,
      error: errorUpdateOrder,
    },
  ] = useUpdateOrderUserMutation();
  const handleUpdateCart = useCallback(
    (orderId: string | number, status: string, message: string) => {
      setVisibleModal({
        visibleConfirmModal: {
          message: message,
          function: () =>
            updateOrder({
              orderId: orderId,
              body: { status: status, isPaid: true },
            }),
        },
      });
    },
    [setVisibleModal, updateOrder]
  );
  useEffect(() => {
    if (isSuccessUpdateOrder && dataUpdateOrder) {
      setVisibleModal({
        visibleToastModal: {
          type: 'success',
          message: dataUpdateOrder?.message,
        },
      });
    }
    if (isErrorUpdateOrder && errorUpdateOrder && 'data' in errorUpdateOrder) {
      const err = errorUpdateOrder?.data as { message: string };
      setVisibleModal({
        visibleToastModal: {
          type: 'error',
          message: err?.message,
        },
      });
    }
  }, [
    dataUpdateOrder,
    isSuccessUpdateOrder,
    isErrorUpdateOrder,
    errorUpdateOrder,
    setVisibleModal,
  ]);
  if (isErrorOrder) {
    return notFound();
  }
  if (isLoadingOrder) {
    return (
      <div className='w-full h-full flex justify-center items-center'>
        <div className='loader'></div>
      </div>
    );
  }
  return (
    <div className='h-full flex flex-col gap-8 overflow-hidden'>
      <div className='text-gray-500 flex justify-between gap-3'>
        <p className='relative px-4 md:px-8 text-lg md:text-xl font-bold before:top-0 before:left-0 before:w-1 before:h-full before:absolute before:bg-violet-500 text-neutral-700'>
          Order Number : <span>{dataOrder?.data?.paymentInfo?.orderCode}</span>
        </p>
        {!dataOrder?.data?.isProcessing &&
          dataOrder?.data?.paymentInfo?.status !== 'cancel' &&
          dataOrder?.data?.paymentMethod !== 'transfer' && (
            <button
              className='text-sm px-4 py-2 mx-4 md:mx-8 bg-white border border-neutral-700 hover:bg-neutral-700 hover:text-white transition-colors rounded'
              onClick={() =>
                handleUpdateCart(
                  dataOrder?.data?.paymentInfo?.orderCode,
                  'cancel',
                  'Do you want to cancel this order?'
                )
              }
            >
              Cancel order
            </button>
          )}
        {!dataOrder?.data?.isProcessing &&
          dataOrder?.data?.paymentInfo?.status !== 'cancel' &&
          dataOrder?.data?.paymentMethod === 'transfer' && (
            <button
              className='text-sm px-4 py-2 mx-4 md:mx-8 bg-violet-500 border-violet-500 border hover:border-neutral-700 hover:bg-neutral-700 text-white transition-colors rounded'
              onClick={() =>
                window.open(dataOrder?.data?.paymentInfo.checkoutUrl, '_self')
              }
            >
              Pay immediately
            </button>
          )}
        {dataOrder?.data?.isProcessing && !dataOrder?.data?.isPaid && (
          <button
            className='text-sm px-4 py-2 mx-4 md:mx-8 bg-violet-500 hover:bg-neutral-700 border border-violet-500 hover:border-neutral-700 text-white transition-colors rounded'
            onClick={() =>
              handleUpdateCart(
                dataOrder?.data?.paymentInfo?.orderCode,
                'delivered',
                'Are you sure you have received the goods?'
              )
            }
          >
            Goods received
          </button>
        )}
      </div>
      <Status status={dataOrder?.data?.paymentInfo?.status} />
      <div className='w-full h-full px-4 md:px-8 text-neutral-700'>
        <div className='w-full max-h-[40vh] overflow-y-auto p-4 bg-white rounded-lg flex flex-col gap-8 overflow-x-auto'>
          <table className='bg-white w-full whitespace-nowrap'>
            <thead className='bg-neutral-100 font-semibold tracking-wide text-left'>
              <tr className='text-center font-bold'>
                <td className='p-4'>Image</td>
                <td className='p-4'>Name</td>
                <td className='p-4'>Price</td>
                <td className='p-4'>Sale Price</td>
                <td className='p-4'>Quantity</td>
                <td className='p-4'>Subtotal</td>
                <td className='p-4'>Action</td>
              </tr>
            </thead>
            <tbody className='h-full'>
              {dataOrder?.data?.paymentInfo?.products?.map((p: any) => {
                return (
                  <tr
                    className='text-center border-b border-gray-300'
                    key={p._id}
                  >
                    <td className='p-4'>
                      <div className='flex justify-center items-center'>
                        <LazyLoadImage
                          className='w-[60px] h-[60px]'
                          width={60}
                          height={60}
                          src={p.image}
                          alt={p.name}
                        />
                      </div>
                    </td>
                    <td className='p-4'>{p.name}</td>
                    <td className='p-4'>{formatNumberWithDot(p.price)} VND</td>
                    <td className='p-4'>
                      {formatNumberWithDot(p.salePrice)} VND
                    </td>
                    <td className='p-4'>{p.quantity}</td>
                    <td className='p-4'>{p.totalPrice} VND</td>
                    <td className='p-4'>
                      {dataOrder?.data?.paymentInfo?.status === 'delivered' &&
                        !p?.isReview && (
                          <button
                            className='text-violet-500'
                            onClick={() =>
                              setVisibleModal({
                                visibleReviewsModal: {
                                  ...p,
                                  orderId:
                                    dataOrder?.data?.paymentInfo?.orderCode,
                                },
                              })
                            }
                          >
                            Reviews
                          </button>
                        )}
                      {dataOrder?.data?.paymentInfo?.status === 'delivered' &&
                        p?.isReview && (
                          <button
                            className='text-violet-500'
                            onClick={() => router.push(`/shop/${p.id}`)}
                          >
                            See reviews
                          </button>
                        )}
                      {dataOrder?.data?.paymentInfo?.status !== 'delivered' && (
                        <span>-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className='w-full h-full px-4 md:px-8 text-neutral-700 flex items-stretch flex-col lg:flex-row gap-4'>
        <div className='w-full h-full p-4 bg-white rounded-lg flex flex-col gap-8'>
          <div className='flex flex-col gap-4'>
            <p className='text-xl font-bold'>Consumer Details</p>
            <div className='flex flex-col gap-2'>
              <div>
                <p className='font-bold'>Shipping Address:</p>
                <div className='text-gray-500'>
                  <p>{dataOrder?.data?.paymentInfo?.address}</p>
                  <p>Phone: 0{dataOrder?.data?.paymentInfo?.phone}</p>
                </div>
              </div>
              <div className='flex items-center gap-2 '>
                <p className='font-bold'>Payment Method:</p>
                <p className='uppercase text-gray-500'>
                  {dataOrder?.data?.paymentMethod}
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <p className='font-bold'>Payment Status:</p>
                <p className='uppercase text-gray-500'>
                  {dataOrder?.data?.paymentInfo?.status}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:max-w-[350px] w-full p-4 bg-white rounded-lg flex flex-col gap-4'>
          <p className='text-xl font-bold'>Summary</p>
          <div className='flex flex-col gap-2 pb-4 border-b border-gray-300'>
            <p className='flex justify-between items-center'>
              <span className='font-medium'>Subtotal</span>
              <span>
                {formatNumberWithDot(dataOrder?.data?.paymentInfo?.totalPrice)}{' '}
                VND
              </span>
            </p>
            <p className='flex justify-between items-center'>
              <span className='font-medium'>Shipping</span>
              <span>{formatNumberWithDot(0)} VND</span>
            </p>
            <p className='flex justify-between items-center'>
              <span className='font-medium'>Tax</span>
              <span>{formatNumberWithDot(0)} VND</span>
            </p>
          </div>
          <p className='flex justify-between items-center text-lg'>
            <span className='font-medium'>Total</span>
            <span>
              {formatNumberWithDot(dataOrder?.data?.paymentInfo?.totalPrice)}{' '}
              VND
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
