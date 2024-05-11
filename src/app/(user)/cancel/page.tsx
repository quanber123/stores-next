'use client';
import { useContext, useEffect, useState } from 'react';
import cancelImg from '@/assets/images/cancel.png';
import withAuth from '@/auth/withAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useGetOderDetailsQuery,
  useUpdateOrderUserMutation,
} from '@/lib/redux/query/productQuery';
import Image from 'next/image';
import { ModalContext } from '@/context/ModalProvider';
function Cancel() {
  const { setVisibleModal } = useContext(ModalContext);
  const router = useRouter();
  const [countDown, setCountDown] = useState(5);
  const searchQuery = useSearchParams();
  const code = searchQuery.get('orderCode');
  const status = searchQuery.get('status');
  const isCancel = searchQuery.get('cancel');
  const {
    data: dataOrder,
    isSuccess: isSuccessOrder,
    isError: isErrorOrder,
    error: errorOrder,
  } = useGetOderDetailsQuery(
    {
      code,
    },
    { skip: !code }
  );
  const [updateOrder] = useUpdateOrderUserMutation();
  useEffect(() => {
    if (isSuccessOrder) {
      const interval = setInterval(() => {
        setCountDown((prevCount) => {
          if (prevCount === 0) {
            return 0;
          } else {
            return (prevCount -= 1);
          }
        });
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
    if (isSuccessOrder && dataOrder.data?.status === 'CANCELLED') {
      updateOrder({
        orderId: code,
        body: {
          status: 'cancel',
        },
      });
    }
    if (isErrorOrder && errorOrder && 'message' in errorOrder) {
      const err = errorOrder.message as string;
      setVisibleModal({
        visibleToastModal: {
          type: 'error',
          message: err,
        },
      });
    }
  }, [
    code,
    status,
    isCancel,
    isSuccessOrder,
    dataOrder,
    isErrorOrder,
    errorOrder,
    updateOrder,
    setVisibleModal,
  ]);
  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 py-16 rounded-[4px] bg-neutral-100 flex flex-col justify-center items-center gap-[20px]'>
      <div className='w-[180px] h-[180px]'>
        <Image
          width={180}
          height={180}
          className='w-[180px] h-[180px]'
          src={cancelImg}
          alt='cancel-img'
          loading='lazy'
        />
      </div>
      <h1 className='text-xl font-bold'>Payment cancelled!</h1>
      <p>
        We are sorry for the inconvenience this may cause and hope that you will
        find suitable products in the future.
      </p>
      <button
        className='bg-neutral-700 hover:bg-violet-500 text-white px-8 py-3 text-md rounded-[4px] transition-colors'
        onClick={() => router.replace('/')}
      >
        Go To Home ({countDown}s)
      </button>
    </div>
  );
}

export default withAuth(Cancel);
