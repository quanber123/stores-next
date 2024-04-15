'use client';
import { useEffect, useLayoutEffect, useState } from 'react';
import successImg from '@/assets/images/successful.png';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import {
  useGetOrderUserByIdQuery,
  useUpdateOrderUserMutation,
} from '@/lib/redux/query/productQuery';
import Image from 'next/image';
import withAuth from '@/auth/withAuth';
function Success() {
  const searchQuery = useSearchParams();
  const [countDown, setCountDown] = useState(5);
  const router = useRouter();
  const code = searchQuery.get('orderCode');
  const paymentMethod = searchQuery.get('paymentMethod');
  const {
    data: dataOrder,
    isSuccess: isSuccessOrder,
    isError: isErrorOrder,
    error: errorOrder,
  } = useGetOrderUserByIdQuery(
    {
      id: code,
      paymentMethod: paymentMethod,
    },
    { skip: !code && !paymentMethod }
  );
  const [updateOrder] = useUpdateOrderUserMutation();
  useEffect(() => {
    if (isSuccessOrder) {
      const interval = setInterval(() => {
        setCountDown((prevCount) => (prevCount -= 1));
      }, 1000);
      const timeId = setTimeout(() => {
        router.replace('/');
      }, 5000);
      return () => {
        clearInterval(interval);
        clearTimeout(timeId);
      };
    }
  }, [isSuccessOrder, router]);
  useEffect(() => {
    if (isSuccessOrder && dataOrder?.data?.status === 'PAID') {
      updateOrder({ orderId: code, body: { status: 'pending', isPaid: true } });
    }
    if (isErrorOrder && errorOrder && 'message' in errorOrder) {
      const err = errorOrder.message as string;
      redirect(`/${err}`);
    }
  }, [
    isSuccessOrder,
    dataOrder,
    isErrorOrder,
    errorOrder,
    updateOrder,
    redirect,
  ]);
  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 py-16 rounded-[4px] bg-neutral-100 flex flex-col justify-center items-center gap-[20px]'>
      <div className='w-[180px] h-[180px]'>
        <Image
          className='w-[180px] h-[180px]'
          width={180}
          height={180}
          src={successImg}
          alt='success-img'
          loading='lazy'
        />
      </div>
      {paymentMethod === 'transfer' && (
        <h1 className='text-xl font-bold'>Payment success!</h1>
      )}
      {paymentMethod === 'transfer' && (
        <p>
          Thank you very much for choosing us. Your support means a lot to us.
        </p>
      )}
      {paymentMethod === 'cash' && (
        <h1 className='text-xl font-bold'>Order success!</h1>
      )}
      {paymentMethod === 'cash' && (
        <p>
          Thank you for ordering from us. We will deliver the goods as soon as
          possible.
        </p>
      )}
      <button
        className='bg-neutral-700 hover:bg-violet-500 text-white px-8 py-3 text-md rounded-[4px] transition-colors'
        onClick={() => router.push('/')}
      >
        Go To Home ({countDown}s)
      </button>
    </div>
  );
}

export default withAuth(Success);
