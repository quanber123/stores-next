'use client';
import { useGetUserQuery } from '@/lib/redux/query/userQuery';
import { setUser, token } from '@/lib/redux/slice/userSlice';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Header = () => {
  const [dropdownRoutes, setDropdownRoutes] = useState(false); // open dropdown in mobile responsive
  const accessToken = useSelector(token);
  const dispatch = useDispatch();
  const { data: userData, isSuccess: isSuccessGetUser } = useGetUserQuery(
    null,
    { skip: !accessToken }
  );
  useEffect(() => {
    if (isSuccessGetUser) {
      dispatch(setUser(userData));
    }
  }, [isSuccessGetUser]);
  const router = useRouter();
  const pathname = usePathname();
  const routes = [
    {
      link: 'about',
    },
    {
      link: 'shop?page=1',
    },
    { link: 'blog?page=1' },
    {
      link: 'contact',
    },
  ];
  const route = useMemo(() => {
    return routes.map((r, index) => {
      return (
        <li key={index}>
          <button
            className={`capitalize text-sm ${
              pathname.split('/')[1] === r.link.split('?')[0] &&
              'text-violet-500'
            }`}
            onClick={() => router.push(`/${r.link}`)}
          >
            {r.link.split('?')[0]}
          </button>
        </li>
      );
    });
  }, [routes, pathname]);
  return (
    <header
      style={{ boxShadow: '0 0px 3px 0px rgba(0, 0, 0, 0.2)' }}
      className='fixed top-0 left-0 w-full h-[64px] z-[100] bg-white flex items-center'
    >
      <nav className='container m-auto px-4 flex items-center gap-20'>
        <Image
          className='object-cover cursor-pointer'
          width={150}
          height={20}
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}public/images/logo-01.png.webp`}
          alt='logo'
          priority
          onClick={() => router.push(`/`, { scroll: true })}
        />
        {/* desktop display */}
        <section className='hidden md:block'>
          <ul className='p-[16px] h-max flex items-center gap-[20px] font-bold'>
            {route}
          </ul>
        </section>
        <section className='w-full ml-auto text-sm hidden md:flex items-center gap-6'>
          <button
            className='ml-auto font-bold'
            // onClick={() => setVisibleModal('visibleLoginModal')}
          >
            Login
          </button>
          <button
            className='px-5 py-2 font-bold bg-neutral-700 text-white hover:bg-purple rounded-[28px]'
            // onClick={() => setVisibleModal('visibleRegisterModal')}
          >
            Register
          </button>
        </section>
        {/* mobile display */}
        <section className='md:hidden ml-auto flex items-center gap-[10px]'>
          <div
            className={`relative m-auto w-[24px] h-[42px] cursor-pointer`}
            onClick={() => setDropdownRoutes(!dropdownRoutes)}
          >
            <span className={`bars ${dropdownRoutes ? 'active' : ''}`}></span>
            <span className={`bars ${dropdownRoutes ? 'active' : ''}`}></span>
            <span className={`bars ${dropdownRoutes ? 'active' : ''}`}></span>
          </div>
        </section>
      </nav>
    </header>
  );
};

export default Header;
