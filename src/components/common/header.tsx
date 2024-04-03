'use client';
import { DropdownContext } from '@/context/DropdownProvider';
import { ModalContext } from '@/context/ModalProvider';
import { Icons } from '@/enum/enum';
import {
  useGetAllCartsQuery,
  useGetAllFavoritesQuery,
} from '@/lib/redux/query/productQuery';
import { useGetUserQuery } from '@/lib/redux/query/userQuery';
import { setUser, token, userInfo } from '@/lib/redux/slice/userSlice';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, {
  Suspense,
  lazy,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserDropdown from '../dropdown/UserDropdown';
const CartDropdown = lazy(() => import('@/components/dropdown/CartDropdown'));
const FavoriteDropdown = lazy(
  () => import('@/components/dropdown/FavoriteDropdown')
);
const Header = () => {
  const [dropdownRoutes, setDropdownRoutes] = useState(false); // open dropdown in mobile responsive
  const { setVisibleModal, closeAllModal } = useContext(ModalContext);
  const { setVisibleDropdown, closeDropdown } = useContext(DropdownContext);
  const accessToken = useSelector(token);
  const user = useSelector(userInfo);
  const dispatch = useDispatch();
  const { data: cartsData, isSuccess: isSuccessCarts } = useGetAllCartsQuery(
    null,
    { skip: !user?.id }
  );
  const { data: favoritesData, isSuccess: isSuccessFavorites } =
    useGetAllFavoritesQuery(null, { skip: !user?.id });
  const { data: userData, isSuccess: isSuccessGetUser } = useGetUserQuery(
    null,
    { skip: !accessToken }
  );
  useEffect(() => {
    if (isSuccessGetUser) {
      dispatch(setUser(userData));
    }
  }, [isSuccessGetUser, userData, dispatch]);
  const router = useRouter();
  const pathname = usePathname();
  const routerRedirect = useCallback(
    (link: string) => {
      router.push(`/${link}`, { scroll: true });
      closeAllModal();
      closeDropdown();
    },
    [closeAllModal, closeDropdown, router]
  );
  const route = useMemo(() => {
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
    return routes.map((r, index) => {
      return (
        <li key={index}>
          <button
            className={`capitalize text-sm ${
              pathname.split('/')[1] === r.link.split('?')[0] &&
              'text-violet-500'
            }`}
            onClick={() => routerRedirect(r.link)}
          >
            {r.link.split('?')[0]}
          </button>
        </li>
      );
    });
  }, [pathname, router]);
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
          priority={true}
          onClick={() => routerRedirect('/')}
        />
        {/* desktop display */}
        <section className='hidden md:block'>
          <ul className='p-[16px] h-max flex items-center gap-[20px] font-bold'>
            {route}
          </ul>
        </section>
        {!user && (
          <section className='w-full ml-auto text-sm hidden md:flex items-center gap-6'>
            <button
              className='ml-auto font-bold'
              onClick={() => setVisibleModal('visibleLoginModal')}
            >
              Login
            </button>
            <button
              className='px-5 py-2 font-bold bg-neutral-700 text-white hover:bg-purple rounded-[28px]'
              onClick={() => setVisibleModal('visibleRegisterModal')}
            >
              Register
            </button>
          </section>
        )}
        {user && (
          <section className='ml-auto flex items-center gap-[20px]'>
            <div className='relative'>
              <button
                className='hover:text-violet-500 transition-colors'
                aria-label='cart-btn'
                onClick={() => setVisibleDropdown('visibleCartDropdown')}
              >
                <span
                  dangerouslySetInnerHTML={{ __html: Icons.cart_icon }}
                ></span>
                {isSuccessCarts && cartsData.total > 0 && (
                  <span className='absolute -top-3 -right-2 text-[12px] bg-violet-500 text-gray-100 px-1'>
                    {cartsData.total}
                  </span>
                )}
              </button>
              {isSuccessCarts && (
                <Suspense>
                  <CartDropdown carts={cartsData.cart} />
                </Suspense>
              )}
            </div>
            <div className='relative'>
              <button
                className='hover:text-violet-500 transition-colors'
                aria-label='heart-btn'
                onClick={() => setVisibleDropdown('visibleFavoriteDropdown')}
              >
                <span
                  dangerouslySetInnerHTML={{ __html: Icons.heart_icon }}
                ></span>
                {isSuccessFavorites &&
                  favoritesData.favorite?.products?.length > 0 && (
                    <span className='absolute -top-3 -right-2 text-[12px] bg-violet-500 text-gray-100 px-1'>
                      {favoritesData.favorite?.products?.length}
                    </span>
                  )}
              </button>
              {isSuccessFavorites && (
                <Suspense>
                  <FavoriteDropdown favorites={favoritesData.favorite} />
                </Suspense>
              )}
            </div>
            <div className='relative'>
              <button
                className='hover:text-violet-500 transition-colors'
                aria-label='notify-btn'
              >
                <span
                  dangerouslySetInnerHTML={{ __html: Icons.bell_icon }}
                ></span>
                <span className='absolute -top-3 -right-2 text-[12px] bg-violet-500 text-gray-100 px-1'>
                  1
                </span>
              </button>
            </div>
            <div className='relative'>
              <Image
                className='rounded-full cursor-pointer'
                src={user.image}
                width={32}
                height={32}
                alt={user.name}
                onClick={() => setVisibleDropdown('visibleUserDropdown')}
              />
              {isSuccessGetUser && <UserDropdown user={userData} />}
            </div>
          </section>
        )}
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
