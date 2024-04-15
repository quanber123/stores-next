'use client';
import withAuth from '@/auth/withAuth';
import NotFoundItem from '@/components/(ui)/notFoundItem';
import { useGetAllOrdersUserQuery } from '@/lib/redux/query/productQuery';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import React from 'react';
const DynamicOrdersFilter = dynamic(
  () => import('@/components/pages/(client)/purchase/orderFilter')
);
const Purchase = () => {
  const searchQuery = useSearchParams();
  const {
    data: ordersData,
    isSuccess: isSuccessOrder,
    isLoading: isLoadingOrder,
  } = useGetAllOrdersUserQuery({ query: searchQuery.toString() });
  console.log(ordersData);
  return (
    <div className='container m-auto px-4 bg-neutral-50 rounded-md shadow-lg'>
      <DynamicOrdersFilter />
      {isSuccessOrder && !isLoadingOrder && ordersData.orders.length === 0 && (
        <NotFoundItem message='No Order Yet!' />
      )}
    </div>
  );
};

export default withAuth(Purchase);
