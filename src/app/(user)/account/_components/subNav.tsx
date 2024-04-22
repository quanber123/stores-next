'use client';
import { removeUser, userInfo } from '@/lib/redux/slice/userSlice';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import coverImg from '@/assets/images/cover-img.jpg';
import { usePathname, useRouter } from 'next/navigation';
import { Icons } from '@/enum/enum';
import { useCallback, useMemo } from 'react';
function SubNav() {
  const user = useSelector(userInfo);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const handleLogout = useCallback(() => {
    dispatch(removeUser());
    window.open(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/auth/logout`,
      '_self'
    );
  }, [dispatch]);
  const renderedRoutes = useMemo(() => {
    const routes = [
      { link: 'dashboard', name: 'Dashboard', icon: Icons.home_icon },
      {
        link: 'notifications',
        name: 'Notifications',
        icon: Icons.bell_icon,
      },
      {
        link: 'orders',
        name: 'My Orders',
        icon: Icons.clip_board_icon,
      },
      {
        link: 'address',
        name: 'Address',
        icon: Icons.location_icon,
      },
    ];
    return routes.map((r: any) => {
      return (
        <div
          key={r.link}
          className={`relative ${
            pathname.includes(r.link) ? 'bg-violet-100' : ''
          }`}
        >
          <span
            className={`absolute top-0 left-0 z-10 w-1 h-full ${
              pathname.includes(r.link) ? 'bg-violet-500' : ''
            }`}
          ></span>
          <button
            className={`w-full py-3 px-8 flex items-center gap-3 ${
              pathname.includes(r.link) ? 'text-violet-500' : ''
            }`}
            onClick={() => router.push(`/account/${r.link}`)}
          >
            <span dangerouslySetInnerHTML={{ __html: r.icon }}></span>
            <span>{r.name}</span>
          </button>
        </div>
      );
    });
  }, [pathname, router]);
  return (
    <div className='max-w-[380px] bg-neutral-100 rounded-2xl overflow-hidden flex flex-col gap-4 pb-4 shadow-lg'>
      <div className='relative max-h-[350px] w-full flex flex-col gap-12'>
        <div className='w-full h-[150px] overflow-hidden'>
          <Image
            width={380}
            height={150}
            src={coverImg}
            alt='cover-img'
            loading='lazy'
          />
        </div>
        <div className='flex flex-col items-center'>
          <p className='text-xl font-bold'>{user?.name}</p>
          <p className='text-sm text-gray-500'>{user?.email}</p>
        </div>
        {user && (
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[108px] h-[108px] rounded-full border-4 border-gray-200 shadow-2xl overflow-hidden'>
            <Image
              className='w-full h-full object-cover'
              width={108}
              height={108}
              src={user.image}
              alt={user.name}
              loading='lazy'
            />
          </div>
        )}
      </div>
      <div className='w-full text-gray-500 pb-2 relative before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-4/5 before:h-[2px] before:bg-gray-200 before:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-4/5 after:h-[2px] after:bg-gray-200 after:absolute'>
        {renderedRoutes}
      </div>
      <button
        className='mx-4 mt-auto h-[48px] flex justify-center items-center gap-4 bg-violet-500 text-white rounded-lg hover:bg-neutral-700 transition-colors'
        onClick={handleLogout}
      >
        <span
          dangerouslySetInnerHTML={{ __html: Icons.arrow_right_bracket }}
        ></span>
        <span>Logout</span>
      </button>
    </div>
  );
}
export default SubNav;
