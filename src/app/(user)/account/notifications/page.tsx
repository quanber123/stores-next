'use client';
import { Icons } from '@/enum/enum';
import {
  useDeleteNotificationsMutation,
  useGetNotificationsQuery,
  useUpdateNotificationsMutation,
} from '@/lib/redux/query/userQuery';
import { formatTime } from '@/lib/utils/format';
import React, { useEffect, useRef, useState } from 'react';

export default function Notifications() {
  const [curPage, setCurPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [curNotifications, setCurNotifications] = useState<any[]>([]);
  const [curSettings, setCurSettings] = useState<null | string>(null);
  const [updateNotification, { data: dataUpdate, isSuccess: isSuccessUpdate }] =
    useUpdateNotificationsMutation();
  const [deleteNotification, { data: dataDelete, isSuccess: isSuccessDelete }] =
    useDeleteNotificationsMutation();
  const { data: dataNotifications, isSuccess: isSuccessNotifications } =
    useGetNotificationsQuery(`offset=${curPage * 10}&limit=10`);
  const itemRef = useRef(null);
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };
    const observer = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        hasMore &&
        dataNotifications?.notifications &&
        isSuccessNotifications
      ) {
        setCurPage((prevPage) => prevPage + 1);
        setCurNotifications((prevNotifications) => [
          ...prevNotifications,
          ...dataNotifications?.notifications,
        ]);
      }
    }, options);

    if (observer && itemRef.current)
      observer.observe(itemRef.current as HTMLElement);
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [hasMore, isSuccessNotifications, dataNotifications?.notifications]);
  useEffect(() => {
    if (
      isSuccessNotifications &&
      dataNotifications?.notifications?.length === 0
    ) {
      setHasMore(false);
    }
  }, [isSuccessNotifications, dataNotifications]);
  useEffect(() => {
    if (isSuccessUpdate && dataUpdate?.notification) {
      const updatedNotificationIndex = curNotifications.findIndex(
        (n: any) => n._id === dataUpdate.notification._id
      );
      if (updatedNotificationIndex !== -1) {
        const updatedNotifications = [...curNotifications];
        updatedNotifications[updatedNotificationIndex] =
          dataUpdate.notification;
        setCurNotifications(updatedNotifications);
      }
    }
  }, [isSuccessUpdate, dataUpdate]);
  useEffect(() => {
    if (isSuccessDelete && dataDelete?.notification) {
      setCurNotifications((prevNotifications) => {
        return prevNotifications.filter((n: any) => {
          return n._id !== dataDelete?.notification?._id;
        });
      });
    }
  }, [isSuccessDelete, dataDelete]);
  return (
    <div className='h-full flex flex-col gap-8'>
      <p className='relative px-4 md:px-8 text-lg md:text-xl font-bold before:top-0 before:left-0 before:w-1 before:h-full before:absolute before:bg-violet-500 text-neutral-700'>
        Notifications
      </p>
      <div className='max-h-[50vh] h-full overflow-y-auto'>
        {curNotifications?.map((n: any) => {
          return (
            <article
              className={`relative ${
                !n?.read
                  ? 'before:top-0 before:left-0 before:w-1 before:h-full before:absolute before:bg-violet-500 bg-violet-50'
                  : ''
              } px-8 md:px-12 py-6 flex gap-4 border border-neutral-200`}
              key={n._id}
              onMouseEnter={() => setCurSettings(n._id)}
              onMouseLeave={() => setCurSettings(null)}
            >
              <div className='my-2 w-[8px] h-[8px] bg-neutral-300 rounded-full'></div>
              <div className='flex flex-col gap-2'>
                <p dangerouslySetInnerHTML={{ __html: n?.message }}></p>
                <div className='flex items-center gap-2 text-sm'>
                  <div
                    dangerouslySetInnerHTML={{ __html: Icons.clock_icon }}
                  ></div>
                  <p>{formatTime(n?.created_at)}</p>
                </div>
              </div>
              {curSettings === n._id && (
                <div className='p-1 absolute h-full top-0 right-8 bg-white flex flex-col justify-center'>
                  <button
                    className='px-4 py-2 flex items-center gap-2 text-sm hover:bg-neutral-100 transition-colors'
                    aria-label='btn-update'
                    onClick={() =>
                      updateNotification({ id: n._id, read: !n.read })
                    }
                  >
                    <span
                      className='text-gray-700 w-[24px] h-[24px]'
                      dangerouslySetInnerHTML={{
                        __html: Icons.check_icon,
                      }}
                    ></span>
                    <p>{n?.read ? 'Mask as unread' : 'Mask as read'}</p>
                  </button>
                  <button
                    className='px-4 py-2 flex items-center gap-2 text-sm hover:bg-neutral-100 transition-colors'
                    aria-label='btn-remove'
                    onClick={() => deleteNotification(n._id)}
                  >
                    <span
                      className='text-gray-700 w-[24px] h-[24px]'
                      dangerouslySetInnerHTML={{
                        __html: Icons.xmark_square_icon,
                      }}
                    ></span>
                    <p>Remove this notification</p>
                  </button>
                </div>
              )}
            </article>
          );
        })}
        {hasMore && <p ref={itemRef}>Loading more...</p>}
      </div>
    </div>
  );
}
