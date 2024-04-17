'use client';
import React, { useContext, useMemo } from 'react';
import NotFoundItem from '@/components/(ui)/notFoundItem';
import { useGetAllOrdersUserQuery } from '@/lib/redux/query/productQuery';
import { useRouter, useSearchParams } from 'next/navigation';
import { Order } from '@/types/types';
import { ModalContext } from '@/context/ModalProvider';
import LazyLoadImage from '@/components/(ui)/lazyloadImage';
import { formatNumberWithDot } from '@/lib/utils/format';
import CustomPagination from '@/components/(ui)/customPagination';
export default function Orders() {
  const searchQuery = useSearchParams();
  const {
    data: ordersData,
    isSuccess: isSuccessOrder,
    isLoading: isLoadingOrder,
  } = useGetAllOrdersUserQuery({ query: searchQuery.toString() });
  const router = useRouter();
  const { setVisibleModal } = useContext(ModalContext);
  const renderedOrders = useMemo(
    () =>
      isSuccessOrder &&
      ordersData?.orders?.map((o: Order) => (
        <div className='p-4 border border-gray-200 my-8' key={o._id}>
          <div className='w-full flex justify-between mb-4'>
            <p className='text-neutral-500 text-sm'>
              Payment Method:{' '}
              <span className='capitalize'>{o.paymentMethod}</span>
            </p>
            <p className='text-lg font-bold text-red-500 uppercase'>
              {o.paymentInfo.status}
            </p>
          </div>
          {o.paymentInfo.products.map((p: any) => {
            return (
              <article
                className={`${
                  o.paymentInfo.status === 'delivered' ||
                  o.paymentInfo.status === 'cancel'
                    ? 'my-8'
                    : 'my-0'
                } flex flex-col gap-4`}
                key={p._id}
              >
                <div className='py-3 border-t border-b border-gray-200'>
                  <div className='flex gap-4'>
                    <div className='w-[80px] h-[80px]'>
                      <LazyLoadImage
                        className='w-full h-full object-cover'
                        src={p.image}
                        alt={p.name}
                        width={80}
                        height={80}
                      />
                    </div>
                    <div className='w-full'>
                      <p className='text-lg text-neutral-700'>{p.name}</p>
                      <div className='text-sm flex justify-between items-center'>
                        <div className='flex items-center gap-4 text-neutral-500'>
                          <p>
                            Color:{' '}
                            <span className='text-neutral-700 capitalize'>
                              {p.color}
                            </span>
                          </p>
                          <p>
                            Size:{' '}
                            <span className='text-neutral-700 uppercase'>
                              {p.size}
                            </span>
                          </p>
                        </div>
                        <p className='text-base font-bold flex items-center gap-2'>
                          <span
                            className={`${
                              p.salePrice > 0
                                ? 'text-neutral-500 line-through'
                                : 'text-red-500'
                            }`}
                          >
                            {formatNumberWithDot(p.price)} VND
                          </span>
                          {p.salePrice > 0 && (
                            <span
                              className={`${
                                p.salePrice > 0 ? 'text-red-500' : ''
                              }`}
                            >
                              {formatNumberWithDot(p.salePrice)} VND
                            </span>
                          )}
                        </p>
                      </div>
                      <p>x{p.quantity}</p>
                    </div>
                  </div>
                </div>
                {o.paymentInfo.status === 'delivered' && (
                  <div className='my-4 w-full flex justify-end gap-4'>
                    {!p.isReview && (
                      <button
                        className='w-full md:w-[150px] bg-violet-500 hover:bg-neutral-700 text-white py-2 transition-colors rounded-[4px]'
                        onClick={() =>
                          setVisibleModal({
                            visibleReviewsModal: { ...p, orderId: o._id },
                          })
                        }
                      >
                        Reviews
                      </button>
                    )}
                    {p.isReview && (
                      <button
                        className='w-full md:w-[150px] bg-violet-500 hover:bg-neutral-700 text-white py-2 transition-colors rounded-[4px]'
                        onClick={() =>
                          router.push(`shop/${p.id}`, { scroll: true })
                        }
                      >
                        See reviews
                      </button>
                    )}
                    <button
                      className='w-full md:w-[150px] bg-violet-500 hover:bg-neutral-700 text-white py-2 transition-colors rounded-[4px]'
                      onClick={() =>
                        router.push(`shop/${p.id}`, { scroll: true })
                      }
                    >
                      Repurchase
                    </button>
                  </div>
                )}
              </article>
            );
          })}
          <p className='my-4 flex justify-end items-center gap-4'>
            <span>Into Money:</span>
            <span className='text-lg font-bold text-red-500'>
              {o.paymentInfo.totalPrice} VND
            </span>
          </p>
          {o.paymentInfo.status === 'pending' && (
            <div className='my-4 w-full flex flex-col md:flex-row justify-end md:items-center gap-6'>
              {o.paymentMethod === 'transfer' && (
                <button
                  className='w-full md:w-[150px] py-2 bg-violet-500 hover:bg-neutral-700 text-white rounded-[4px] transition-colors'
                  onClick={() =>
                    window.open(o.paymentInfo?.checkoutUrl, '_self')
                  }
                >
                  Pay immediately
                </button>
              )}
              <button className='w-full md:w-[150px] hover:bg-neutral-700 hover:text-white py-2 border border-neutral-700 transition-colors rounded-[4px]'>
                Cancel
              </button>
            </div>
          )}
          {o.paymentInfo.status === 'processing' && (
            <div className='my-4 w-full flex justify-end'>
              <button className='ml-auto w-full md:w-[150px] bg-violet-500 hover:bg-neutral-700 text-white py-2 transition-colors rounded-[4px]'>
                Delivered
              </button>
            </div>
          )}
        </div>
      )),
    [isSuccessOrder, ordersData, router, setVisibleModal]
  );
  return (
    <>
      {isSuccessOrder && ordersData.orders.length > 0 && (
        <section className='py-4 flex-1 flex flex-col items-start gap-[20px] text-neutral-700'>
          <div className='w-full flex flex-col'>{renderedOrders}</div>
          {ordersData.totalPage > 1 && (
            <div className='container'>
              <CustomPagination totalPage={ordersData.totalPage as number} />
            </div>
          )}
        </section>
      )}
      {isSuccessOrder && !isLoadingOrder && ordersData.orders.length === 0 && (
        <NotFoundItem message='No Order Yet!' />
      )}
    </>
  );
}
