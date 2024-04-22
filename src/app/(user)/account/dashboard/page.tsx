'use client';
import { getCurAddress, userInfo } from '@/lib/redux/slice/userSlice';
import Image from 'next/image';
import React from 'react';
import { useSelector } from 'react-redux';
import profileImg from '@/assets/images/dashboard-profile.png';
export default function Dashboard() {
  const user = useSelector(userInfo);
  const curDelivery = useSelector(getCurAddress);
  return (
    <div className='h-full flex flex-col gap-8'>
      <div className='text-gray-500 flex flex-col gap-3'>
        <p className='relative px-4 md:px-8 text-lg md:text-xl font-bold before:top-0 before:left-0 before:w-1 before:h-full before:absolute before:bg-violet-500 text-neutral-700'>
          My DashBoard
        </p>
        <div className='px-4 md:px-8 flex flex-col gap-1'>
          <p>
            Hello, <span className='font-bold'>{user?.name}</span>
          </p>
          <p>
            Welcome to your personalized My Account Dashboard. Here, you have
            the power to manage your entire e-commerce experience in one place.
            Whether you're exploring the latest products or updating your
            profile, everything is at your fingertips
          </p>
        </div>
      </div>
      <div className='h-full px-4 md:px-8 text-neutral-700'>
        <div className='h-full relative bg-white rounded-lg p-4 flex flex-col gap-4 overflow-hidden'>
          <p className='text-lg md:text-xl'>Profile Information</p>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-4'>
              <p className='w-1/12'>Name:</p>
              <p className='w-full'>{user?.name}</p>
            </div>
            <div className='flex items-center gap-4'>
              <p className='w-1/12'>Email: </p>
              <p className='w-full'>
                {user?.email ? user.email : 'No Email Yet.'}
              </p>
            </div>
            <div className='flex items-center gap-4'>
              <p className='w-1/12'>Phone: </p>
              <p className='w-full'>
                {curDelivery?.phone ? curDelivery?.phone : 'No Phone Yet.'}
              </p>
            </div>
            <div className='flex items-center gap-4'>
              <p className='w-1/12'>Address: </p>
              <p className='w-full'>
                {curDelivery
                  ? `${curDelivery.address}, ${curDelivery.district}, ${curDelivery.city}, ${curDelivery.state}`
                  : 'No Address Yet.'}
              </p>
            </div>
          </div>
          <div className='absolute top-0 right-0 lg:block hidden'>
            <Image
              width={350}
              height={350}
              className='object-cover'
              src={profileImg}
              alt='profile-dashboard'
              loading='lazy'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
