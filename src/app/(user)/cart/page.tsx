'use client';
import withAuth from '@/auth/withAuth';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import React from 'react';
const DynamicBreadcrumbs = dynamic(
  () => import('@/components/(ui)/breadcrumbs'),
  {
    loading: () => (
      <div className='container'>
        <div className='skeleton w-1/3 h-[24px] mr-auto'></div>
      </div>
    ),
    ssr: false,
  }
);
const DynamicCartList = dynamic(
  () => import('@/components/pages/(client)/cart/cartList'),
  {
    loading: () => (
      <div className='skeleton container w-full h-[350px] rounded-lg'></div>
    ),
    ssr: false,
  }
);
const Cart = () => {
  const pathname = usePathname();
  return (
    <div className='container m-auto flex flex-col gap-16 py-8 px-4'>
      <DynamicBreadcrumbs pathname={pathname} name='cart' />
      <DynamicCartList />
    </div>
  );
};

export default withAuth(Cart);
