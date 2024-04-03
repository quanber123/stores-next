'use client';
import {
  useState,
  useEffect,
  useCallback,
  useContext,
  MutableRefObject,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalContext } from '@/context/ModalProvider';
import { Icons } from '@/enum/enum';
import useClickOutside from '@/lib/hooks/useClickOutside';
import { validateEmail } from '@/lib/utils/validate';
import { useUserLoginMutation } from '@/lib/redux/query/userQuery';
import { getLogoUrl } from '@/lib/redux/slice/pageSlice';
import Image from 'next/image';
import { redirect, usePathname } from 'next/navigation';
import ValidateMessage from '../(ui)/validateMessage';
import { userInfo } from '@/lib/redux/slice/userSlice';
function LoginModal() {
  const pathname = usePathname();
  const user = useSelector(userInfo);
  const logoUrl = useSelector(getLogoUrl);
  const { state, setVisibleModal, closeAllModal } = useContext(ModalContext);
  const dispatch = useDispatch();
  const [modalRef, clickOutside] = useClickOutside('visibleLoginModal');
  const [
    loginUser,
    {
      data: dataLogin,
      isSuccess: isSuccessLogin,
      isLoading: isLoadingUser,
      status: statusLogin,
      error: errorLogin,
    },
  ] = useUserLoginMutation();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [focusInput, setFocusInput] = useState<string | null>(null);
  const handleChangeForm = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm((prevForm) => {
        return { ...prevForm, [name]: value };
      });
    },
    []
  );
  const googleLogin = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/auth/google`,
      '_self'
    );
  };
  const facebookLogin = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/auth/facebook`,
      '_self'
    );
  };
  const handleLoginUser = () => {
    loginUser(form);
  };
  const changeModal = useCallback(() => {
    setVisibleModal('visibleRegisterModal');
    setForm({
      email: '',
      password: '',
    });
  }, [setVisibleModal]);
  useEffect(() => {
    if (isSuccessLogin && !isLoadingUser && statusLogin === 'fulfilled') {
      closeAllModal();
      window.localStorage.setItem('coza-store-token', dataLogin.accessToken);
      user?.isVerified ? redirect(pathname) : redirect('/verified');
    }
    if (errorLogin && 'data' in errorLogin) {
      const errorData = errorLogin.data as { message: string };
      setVisibleModal({
        visibleToastModal: {
          type: 'error',
          message: errorData.message,
        },
      });
    }
    setForm({
      email: '',
      password: '',
    });
  }, [
    isSuccessLogin,
    isLoadingUser,
    dataLogin,
    statusLogin,
    errorLogin,
    pathname,
    user,
    dispatch,
    setVisibleModal,
    closeAllModal,
  ]);
  return (
    <section
      className={`login-form ${state.visibleLoginModal ? 'active' : ''}`}
      onClick={clickOutside}
    >
      <form
        ref={modalRef as MutableRefObject<HTMLFormElement>}
        className='px-[24px] md:px-[55px] py-[75px]'
        onSubmit={(e) => e.preventDefault()}
      >
        <button
          className='absolute top-[20px] right-[20px] w-[40px] h-[40px] flex justify-center items-center text-md bg-neutral-200 rounded-full'
          aria-label='close-modal'
          onClick={closeAllModal}
          dangerouslySetInnerHTML={{ __html: Icons.xmark_icon }}
        ></button>
        <h1 className='w-full text-gray-700 font-bold text-lg md:text-2xl text-center'>
          Welcome
        </h1>
        <Image
          className='object-contain'
          width={150}
          height={20}
          src={logoUrl}
          alt='logo'
        />
        <div className='w-full flex flex-col gap-8'>
          <div className='wrap-input-login mt-[20px]'>
            <label
              className={`text-mediumGray ${
                focusInput === 'email' || form.email ? 'active' : ''
              }`}
              htmlFor='email-login'
            >
              Email
            </label>
            <input
              type='email'
              id='email-login'
              name='email'
              value={form.email}
              onFocus={() => setFocusInput('email')}
              onBlur={() => setFocusInput(null)}
              onChange={handleChangeForm}
              autoComplete='username'
            />
            {form.email && (
              <ValidateMessage
                isValidate={validateEmail(form.email)}
                message='The email must contain @.'
                customClassName='absolute top-1/2 right-[10px] -translate-y-1/2 font-bold text-sm flex items-center gap-[10px]'
                icon={
                  !validateEmail(form.email)
                    ? Icons.xmark_white_icon
                    : Icons.check_icon
                }
                iconClassName={`${
                  !validateEmail(form.email) ? 'bg-red-500' : 'bg-green-500'
                }  text-white p-1 flex justify-center items-center rounded-full`}
              />
            )}
            <div
              className={`focus-input-login ${
                focusInput === 'email' || form.email ? 'active' : ''
              }`}
            ></div>
            {/* {!validateEmail(form.email) && form.email ? (
              <ErrValidate message='The email must contain @.' />
            ) : (
              <></>
            )}
            {validateEmail(form.email) && form.email ? (
              <SuccessValidate />
            ) : (
              <></>
            )} */}
          </div>
          <div className='wrap-input-login'>
            <label
              className={`text-mediumGray ${
                focusInput === 'password' || form.password ? 'active' : ''
              }`}
              htmlFor='password-login'
            >
              Password
            </label>
            <input
              id='password-login'
              name='password'
              type='password'
              value={form.password}
              onFocus={() => setFocusInput('password')}
              onBlur={() => setFocusInput(null)}
              onChange={handleChangeForm}
              autoComplete='current-password'
            />
            <div
              className={`focus-input-login ${
                focusInput === 'password' || form.password ? 'active' : ''
              }`}
            ></div>
          </div>
        </div>
        <div className='w-full login-form-btn'>
          <button
            style={{
              filter: `${
                !validateEmail(form.email) || statusLogin === 'pending'
                  ? 'grayscale(80%)'
                  : 'none'
              }`,
              cursor: `${
                !validateEmail(form.email) || statusLogin === 'pending'
                  ? 'no-drop'
                  : 'pointer'
              }`,
            }}
            disabled={!validateEmail(form.email) || statusLogin === 'pending'}
            onClick={handleLoginUser}
          >
            {statusLogin === 'pending' ? '...Loading' : 'Login'}
          </button>
        </div>
        <div className='w-full grid grid-cols-2 justify-center items-center gap-[20px] text-white'>
          <button
            type='submit'
            className='w-full h-[48px] bg-blue-700 flex justify-center items-center gap-[10px] rounded-[4px]'
            aria-label='facebook-btn'
            onClick={facebookLogin}
          >
            <span
              dangerouslySetInnerHTML={{ __html: Icons.facebook_icon }}
            ></span>
            <span>Facebook</span>
          </button>
          <button
            type='submit'
            className='w-full h-[48px] bg-red-500 flex justify-center items-center gap-[10px] rounded-[4px]'
            aria-label='google-btn'
            onClick={googleLogin}
          >
            <span
              dangerouslySetInnerHTML={{ __html: Icons.google_icon }}
            ></span>
            <span>Google</span>
          </button>
        </div>
        <div className='flex justify-center items-center gap-[10px]'>
          <p className='text-mediumGray'>Don&#39;t have an account?</p>
          <button
            className='text-mediumGray hover:text-blue font-bold'
            onClick={changeModal}
          >
            Sign Up
          </button>
        </div>
      </form>
    </section>
  );
}

export default LoginModal;
