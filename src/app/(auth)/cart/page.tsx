'use client';
import withAuth from '@/auth/withAuth';
import { redirect, usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAllCarts, userInfo } from '@/lib/redux/slice/userSlice';
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
const Cart = () => {
  const pathname = usePathname();
  const carts = useSelector(getAllCarts);
  return (
    <div className='container m-auto flex flex-col gap-16 py-8 px-4'>
      <DynamicBreadcrumbs pathname={pathname} name='cart' />
    </div>
  );
};

export default withAuth(Cart);
