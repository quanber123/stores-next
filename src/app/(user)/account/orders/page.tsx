'use client';
import CustomPagination from '@/components/(ui)/customPagination';
import { FetchDataContext } from '@/context/FetchDataProvider';
import { Icons } from '@/enum/enum';
import useQueryString from '@/lib/hooks/useQueryString';
import { useGetAllOrdersUserQuery } from '@/lib/redux/query/productQuery';
import { formatDate, formatNumberWithDot } from '@/lib/utils/format';
import { Order } from '@/types/types';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useContext, useMemo } from 'react';

export default function Orders() {
  const router = useRouter();
  const [createQueryString, deleteQueryString] = useQueryString();
  const { statusOrders } = useContext(FetchDataContext);
  const searchQuery = useSearchParams();
  const { data: dataOrders, isSuccess: isSuccessOrders } =
    useGetAllOrdersUserQuery({ query: searchQuery.toString() ?? 'page=1' });
  const handleChangeStatus = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (e.target.value === '') {
        deleteQueryString();
      } else {
        createQueryString('status', e.target.value);
      }
    },
    [createQueryString, deleteQueryString]
  );
  const renderedOrders = useMemo(() => {
    return (
      isSuccessOrders &&
      dataOrders?.orders?.map((o: Order) => {
        const curStatus = statusOrders.find(
          (s) => s.name === o.paymentInfo.status
        );
        return (
          <tr className='text-center border-b border-gray-300' key={o._id}>
            <td className='p-4'>{o.paymentInfo.orderCode}</td>
            <td className='p-4'>{formatDate(o.created_at)}</td>
            <td className='p-4'>{formatDate(o.updated_at)}</td>
            <td className='p-4'>
              {o.paymentInfo.totalPrice &&
                formatNumberWithDot(o.paymentInfo.totalPrice)}{' '}
              VND
            </td>
            <td className='p-4 flex justify-center items-center'>
              <span
                style={{
                  color: `${curStatus?.backgroundColor}`,
                  border: `1px solid ${curStatus?.backgroundColor}`,
                }}
                className='capitalize text-sm px-4 py-1 rounded-2xl'
              >
                {curStatus?.name}
              </span>
            </td>
            <td className='p-4 capitalize'>{o.paymentMethod}</td>
            <td>{o.isPaid ? 'Paid' : 'Unpaid'}</td>
            <td className='p-4'>
              <button
                className='mx-auto cursor-pointer flex justify-center items-center text-violet-500'
                aria-label='view-btn'
                dangerouslySetInnerHTML={{ __html: Icons.view_icon }}
                onClick={() =>
                  router.push(`/account/orders/${o.paymentInfo.orderCode}`)
                }
              ></button>
            </td>
          </tr>
        );
      })
    );
  }, [isSuccessOrders, dataOrders, statusOrders, router]);
  return (
    <div className='h-full flex flex-col gap-8'>
      <div className='text-gray-500 flex justify-between gap-3'>
        <p className='relative px-4 md:px-8 text-lg md:text-xl font-bold before:top-0 before:left-0 before:w-1 before:h-full before:absolute before:bg-violet-500 text-neutral-700'>
          My Orders
        </p>
        <select
          className='mx-4 md:mx-8 px-4 py-2 capitalize cursor-pointer'
          name='status-order'
          id='status-order'
          onChange={handleChangeStatus}
          value={searchQuery.get('status') || ''}
        >
          <option value=''>All</option>
          {statusOrders?.map((s) => {
            return (
              <option
                className='px-4 py-2 capitalize cursor-pointer'
                value={s.name}
              >
                {s.name}
              </option>
            );
          })}
        </select>
      </div>
      <div className='w-full h-full px-4 md:px-8 text-neutral-700'>
        <div className='w-full h-full p-4 bg-white rounded-lg flex flex-col gap-8 overflow-x-auto overflow-y-hidden'>
          {isSuccessOrders && dataOrders.orders.length > 0 && (
            <>
              <table className='w-full whitespace-nowrap'>
                <thead className='bg-neutral-100 font-semibold tracking-wide text-left'>
                  <tr className='text-center font-bold'>
                    <td className='p-4'>Order Code</td>
                    <td className='p-4'>Date</td>
                    <td className='p-4'>Updated At</td>
                    <td className='p-4'>Amount</td>
                    <td className='p-4'>Payment Status</td>
                    <td className='p-4'>Payment Method</td>
                    <td className='p-4'>Paid</td>
                    <td className='p-4'>Option</td>
                  </tr>
                </thead>
                <tbody>{renderedOrders}</tbody>
              </table>
              {dataOrders.total > 1 && (
                <CustomPagination totalPage={dataOrders.totalPage} />
              )}
            </>
          )}
          {isSuccessOrders && dataOrders?.orders?.length === 0 && (
            <div className='h-full flex justify-center items-center'>
              <p className='text-2xl md:text-4xl font-bold'>No Order Yet!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
