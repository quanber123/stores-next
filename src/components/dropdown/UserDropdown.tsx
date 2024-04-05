import { useDispatch } from 'react-redux';
import { useCallback, useContext } from 'react';
import { DropdownContext } from '@/context/DropdownProvider';
import { User } from '@/types/types';
import { removeUser } from '@/lib/redux/slice/userSlice';
import { Icons } from '@/enum/enum';
import './Dropdown.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
type Props = {
  user: User;
};
const UserDropdown: React.FC<Props> = ({ user }) => {
  const { state, closeDropdown } = useContext(DropdownContext);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleRedirect = useCallback(
    (route: string) => {
      router.push(`${route}`);
      closeDropdown();
    },
    [router]
  );
  const handleLogout = useCallback(() => {
    dispatch(removeUser());
    window.open(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/auth/logout`,
      '_self'
    );
  }, [dispatch]);
  return (
    <div
      className={`user-dropdown ${state.visibleUserDropdown ? 'active' : ''}`}
    >
      <div className='mx-[26px] my-[16px] flex items-center gap-[20px]'>
        <Image
          width={42}
          height={42}
          className='w-[42px] h-[42px] rounded-full'
          src={user.image}
          alt={user.name}
          loading='lazy'
        />
        <div>
          <h3 className='font-bold text-base'>{user.name}</h3>
          {user.email !== null && (
            <p
              className='max-w-[150px] w-max text-darkGray text-ellipsis whitespace-nowrap overflow-hidden'
              title={user.email}
            >
              {user.email}
            </p>
          )}
        </div>
      </div>
      <div className='mx-[26px] my-[16px] flex flex-col gap-[20px] text-darkGray font-bold'>
        <button
          className='flex items-center gap-[15px]'
          onClick={() => handleRedirect('purchase')}
        >
          <span
            dangerouslySetInnerHTML={{ __html: Icons.clip_board_icon }}
          ></span>
          <span>My Purchase</span>
        </button>
        <button
          className='flex items-center gap-[15px]'
          onClick={() => handleRedirect('settings')}
        >
          <span dangerouslySetInnerHTML={{ __html: Icons.gear_icon }}></span>
          <span>Settings</span>
        </button>
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
