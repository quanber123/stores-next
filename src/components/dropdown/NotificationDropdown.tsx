'use client';
import { useCallback, useContext, useMemo } from 'react';
import { DropdownContext } from '@/context/DropdownProvider';
import LazyLoadImage from '../(ui)/lazyloadImage';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { getWebInfo } from '@/lib/redux/slice/pageSlice';
import { useUpdateNotificationsMutation } from '@/lib/redux/query/userQuery';
import { formatDistance } from 'date-fns';
import './Dropdown.css';
function NotificationsDropdown({ notifications }: { notifications: any }) {
  const { state, setVisibleDropdown } = useContext(DropdownContext);
  const webInfo = useSelector(getWebInfo);
  const router = useRouter();
  const [updateNotification] = useUpdateNotificationsMutation();
  const redirectCart = useCallback(() => {
    setVisibleDropdown('visibleNotificationsDropdown');
    router.push('/account/notifications', { scroll: true });
  }, [setVisibleDropdown, router]);
  const redirectRoute = useCallback(
    async (n: any) => {
      setVisibleDropdown('visibleNotificationsDropdown');
      await updateNotification({ id: n._id, read: true });
      router.push(n.url_client);
    },
    [setVisibleDropdown, router]
  );
  const renderedNotifications = useMemo(() => {
    return notifications?.notifications?.map((n: any) => {
      return (
        <article
          key={n._id}
          className='px-1 py-4 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-6 text-sm rounded-lg cursor-pointer'
          onClick={() => redirectRoute(n)}
        >
          <div className='w-[42px] h-[42px] overflow-hidden'>
            <LazyLoadImage
              src={webInfo?.icon as string}
              alt={webInfo?.shopName as string}
              className='w-full h-auto object-contain'
              width={32}
              height={32}
            />
          </div>
          <div className='relative flex flex-col gap-2'>
            <p dangerouslySetInnerHTML={{ __html: n.message }}></p>
            <p className={`${n.read ? 'text-neutral-700' : 'text-violet-500'}`}>
              {formatDistance(new Date(n.created_at), new Date(), {
                addSuffix: true,
              })}
            </p>
          </div>
          <div>
            {!n.read && (
              <div className='w-[12px] h-[12px] rounded-full bg-violet-500'></div>
            )}
          </div>
        </article>
      );
    });
  }, [notifications]);
  return (
    <div
      className={`notifications-dropdown ${
        state.visibleNotificationsDropdown ? 'active' : ''
      }`}
    >
      <div className='mt-3 px-4 flex flex-col gap-4'>
        <h3 className='text-xl text-gray-700 font-bold'>Notifications</h3>
        <div className='flex items-center justify-between gap-2'>
          <p>Earlier</p>
          <button className='text-violet-500' onClick={redirectCart}>
            See all
          </button>
        </div>
      </div>
      <div className='mb-3 px-2 overflow-auto'>
        {notifications?.notifications?.length ? (
          renderedNotifications
        ) : (
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-[10px]'>
            <p className='font-bold'>No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsDropdown;
