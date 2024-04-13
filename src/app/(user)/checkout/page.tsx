'use client';

import withAuth from '@/auth/withAuth';
import dynamic from 'next/dynamic';
import { redirect, usePathname, useSearchParams } from 'next/navigation';
import React, { useLayoutEffect, useState } from 'react';
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
const DynamicCheckoutList = dynamic(
  () => import('@/components/pages/(client)/checkout/checkoutList'),
  {
    loading: () => (
      <div className='skeleton container w-full h-[350px] rounded-lg'></div>
    ),
    ssr: false,
  }
);
const Checkout = () => {
  const pathname = usePathname();
  const searchQuery = useSearchParams();
  const [tempOrders, setTempOrders] = useState([]);
  useLayoutEffect(() => {
    const stateParam = searchQuery.get('state');
    if (stateParam) {
      try {
        const decodedTempOrder = JSON.parse(atob(stateParam));
        setTempOrders(decodedTempOrder);
      } catch (error) {
        redirect('/not-found');
      }
    } else {
      redirect('/not-found');
    }
  }, [redirect, searchQuery]);
  return (
    <div className='container m-auto flex flex-col py-8 px-4'>
      <DynamicBreadcrumbs pathname={pathname} name='checkout' />
      <DynamicCheckoutList orders={tempOrders} />
    </div>
  );
};

export default withAuth(Checkout);
