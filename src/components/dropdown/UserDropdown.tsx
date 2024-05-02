import { useDispatch } from 'react-redux';
import { useCallback, useContext } from 'react';
import { DropdownContext } from '@/context/DropdownProvider';
import { removeUser } from '@/lib/redux/slice/userSlice';
import { Icons } from '@/enum/enum';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/lib/utils/getAuthToken';
import './Dropdown.css';
const UserDropdown = () => {
  const { state, closeDropdown } = useContext(DropdownContext);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleRedirect = useCallback(
    (route: string) => {
      router.push(`/${route}`);
      closeDropdown();
    },
    [router, closeDropdown]
  );
  const fetchData = useCallback(async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/auth/logout`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    const data = await res.json();
    if (data?.success) {
      router.replace('/');
      dispatch(removeUser());
    }
  }, [dispatch, router]);
  const handleLogout = useCallback(() => {
    fetchData();
  }, []);
  return (
    <div
      className={`user-dropdown ${state.visibleUserDropdown ? 'active' : ''}`}
    >
      <div className='text-sm px-4 py-2 flex flex-col gap-2 text-gray-700 font-bold'>
        <button
          className='flex items-center gap-[15px]'
          onClick={() => handleRedirect('account/dashboard')}
        >
          <span dangerouslySetInnerHTML={{ __html: Icons.user_icon }}></span>
          <span>My Account</span>
        </button>
        <span className='w-full h-[2px] bg-gray-200'></span>
        <button className='flex items-center gap-[15px]' onClick={handleLogout}>
          <span
            dangerouslySetInnerHTML={{ __html: Icons.arrow_right_bracket }}
          ></span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default UserDropdown;
