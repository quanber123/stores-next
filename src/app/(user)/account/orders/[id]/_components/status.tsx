import React from 'react';
import pendingImg from '@/assets/images/pending.svg';
import processingImg from '@/assets/images/processing.svg';
import deliveredImg from '@/assets/images/delivered.svg';
import cancelImg from '@/assets/images/cancelled.svg';
import Image from 'next/image';
export default function Status({ status }: { status?: string }) {
  return (
    <div className='w-full px-4 md:px-8'>
      <div className='pr-[20px] py-4 w-full flex items-center justify-between gap-8 overflow-x-auto overflow-y-hidden'>
        <div className='relative px-6 bg-emerald-100 w-full min-w-[200px] h-[70px] flex items-center gap-4 text-lg'>
          <Image width={45} height={45} src={pendingImg} alt='pending' />
          <p>Pending</p>
          <span
            className='absolute top-0 -right-[16px] border-l-emerald-100 border-l-[17px]'
            style={{
              borderTop: `36px solid transparent`,
              borderBottom: `36px solid transparent`,
            }}
          ></span>
        </div>
        {(status === 'processing' || status === 'delivered') && (
          <div className='relative px-6 bg-emerald-100 w-full min-w-[200px] h-[70px] flex items-center gap-4 text-lg'>
            <Image
              width={45}
              height={45}
              src={processingImg}
              alt='processing'
            />
            <p>Processing</p>
            <span
              className='absolute top-0 left-0 border-l-neutral-100  border-l-[17px]'
              style={{
                borderTop: `36px solid transparent`,
                borderBottom: `36px solid transparent`,
              }}
            ></span>
            <span
              className='absolute top-0 -right-[16px] border-l-emerald-100 border-l-[17px]'
              style={{
                borderTop: `36px solid transparent`,
                borderBottom: `36px solid transparent`,
              }}
            ></span>
          </div>
        )}
        {status === 'delivered' && (
          <div className='relative px-6 bg-emerald-100 w-full min-w-[200px] h-[70px] flex items-center gap-4 text-lg'>
            <Image width={45} height={45} src={deliveredImg} alt='delivered' />
            <p>Delivered</p>
            <span
              className='absolute top-0 left-0 border-l-neutral-100  border-l-[17px]'
              style={{
                borderTop: `36px solid transparent`,
                borderBottom: `36px solid transparent`,
              }}
            ></span>
            <span
              className='absolute top-0 -right-[16px] border-l-emerald-100 border-l-[17px]'
              style={{
                borderTop: `36px solid transparent`,
                borderBottom: `36px solid transparent`,
              }}
            ></span>
          </div>
        )}
        {status === 'cancel' && (
          <div className='relative px-6 py-4 bg-red-100 w-full min-w-[200px] h-[70px] flex items-center gap-4 text-lg'>
            <Image width={45} height={45} src={cancelImg} alt='cancelImg' />
            <p>Cancelled</p>
            <span
              className='absolute top-0 left-0 border-l-neutral-100  border-l-[17px]'
              style={{
                borderTop: `36px solid transparent`,
                borderBottom: `36px solid transparent`,
              }}
            ></span>
            <span
              className='absolute top-0 -right-[16px] border-l-red-100 border-l-[17px]'
              style={{
                borderTop: `36px solid transparent`,
                borderBottom: `36px solid transparent`,
              }}
            ></span>
          </div>
        )}
      </div>
    </div>
  );
}
