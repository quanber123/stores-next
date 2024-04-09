'use client';
import { useGetUserQuery } from '@/lib/redux/query/userQuery';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react';
import './withAuth.css';
function withAuth(Component: any) {
  return function useAuth(props: any) {
    const { isLoading, isError } = useGetUserQuery(null);
    useEffect(() => {
      if (isError) {
        redirect('/not-found');
      }
    }, [isError]);
    if (isLoading) {
      return (
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
          <div className='loader'></div>
        </div>
      );
    }
    return <Component {...props} />;
  };
}

export default withAuth;
