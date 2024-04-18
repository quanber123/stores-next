'use client';
import { useGetUserQuery } from '@/lib/redux/query/userQuery';
import { notFound } from 'next/navigation';
import React from 'react';
import './withAuth.css';
function withAuth(Component: any) {
  return function useAuth(props: any) {
    const { isLoading, isError } = useGetUserQuery(null);
    if (isLoading) {
      return (
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
          <div className='loader'></div>
        </div>
      );
    }
    if (isError) {
      notFound();
    }
    return <Component {...props} />;
  };
}

export default withAuth;
