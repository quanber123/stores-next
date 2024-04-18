'use client';
import withAuth from '@/auth/withAuth';
import dynamic from 'next/dynamic';
import React from 'react';
const DynamicTitle = dynamic(() => import('./_components/title'), {
  loading: () => (
    <div className='container'>
      <div className='skeleton w-1/3 h-[24px] mr-auto'></div>
    </div>
  ),
  ssr: false,
});
const DynamicOrders = dynamic(() => import('./_components/orders'), {
  loading: () => (
    <div className='skeleton container w-full h-[350px] rounded-lg'></div>
  ),
  ssr: false,
});
function Cart() {
  return (
    <div className='container m-auto px-4'>
      <DynamicTitle />
      <DynamicOrders />
    </div>
  );
}

export default withAuth(Cart);
