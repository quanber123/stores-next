'use client';
import { userInfo } from '@/lib/redux/slice/userSlice';
import { redirect } from 'next/navigation';
import React, { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';

function withAuth(Component: any) {
  return function withAuth(props: any) {
    const user = useSelector(userInfo);
    useLayoutEffect(() => {
      if (user === null) {
        redirect('/not-found');
      }
    }, [user]);
    return <Component {...props} />;
  };
}

export default withAuth;
