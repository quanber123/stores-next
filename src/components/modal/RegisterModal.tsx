import {
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUserRegisterMutation } from '@/lib/redux/query/userQuery';
import useClickOutside from '@/lib/hooks/useClickOutside';
import { ModalContext } from '@/context/ModalProvider';
import { redirect } from 'next/navigation';
import {
  validateEmail,
  validateEmptyStr,
  validatePassword,
} from '@/lib/utils/validate';
import { setToken, setUser } from '@/lib/redux/slice/userSlice';
import { Icons } from '@/enum/enum';
import { getLogoUrl } from '@/lib/redux/slice/pageSlice';
import Image from 'next/image';
import ValidateMessage from '../(ui)/validateMessage';

function RegisterModal() {
  const { state, setVisibleModal, closeAllModal } = useContext(ModalContext);
  const logoUrl = useSelector(getLogoUrl);
  const dispatch = useDispatch();
  const [modalRef, clickOutside] = useClickOutside('visibleRegisterModal');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [
    registerUser,
    {
      data: dataRegister,
      isSuccess: isSuccessRegister,
      isLoading: isLoadingRegister,
      status: statusRegister,
      error: errorRegister,
    },
  ] = useUserRegisterMutation();
  const [focusInput, setFocusInput] = useState<string | null>(null);
  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => {
      return { ...prevForm, [name]: value };
    });
  };
  const changeModal = useCallback(() => {
    setVisibleModal('visibleLoginModal');
    setForm({
      name: '',
      email: '',
      password: '',
    });
  }, [setVisibleModal]);
  const handleVerifiedEmail = useCallback(() => {
    registerUser({
      name: form.name,
      email: form.email,
      password: form.password,
    });
  }, [registerUser, form.name, form.email, form.password]);
  useEffect(() => {
    if (
      isSuccessRegister &&
      !isLoadingRegister &&
      statusRegister === 'fulfilled'
    ) {
      closeAllModal();
      dispatch(setToken(dataRegister));
      dispatch(setUser(dataRegister.user));
      redirect('/verified');
    }
    if (errorRegister && 'data' in errorRegister) {
      const errorData = errorRegister.data as { message: string };
      setVisibleModal({
        visibleToastModal: {
          type: 'error',
          message: `${errorData?.message}`,
        },
      });
    }
  }, [
    isSuccessRegister,
    isLoadingRegister,
    dataRegister,
    statusRegister,
    errorRegister,
    dispatch,
    closeAllModal,
    setVisibleModal,
  ]);
  return (
    <section
      className={`${state.visibleRegisterModal ? 'active' : ''} register-form`}
      onClick={clickOutside}
    >
      <form
        ref={modalRef as MutableRefObject<HTMLFormElement>}
        className='px-[24px] md:px-[55px] py-[75px]'
        onSubmit={(e) => e.preventDefault()}
      >
        <button
          className='absolute top-[20px] right-[20px] w-[40px] h-[40px] flex justify-center items-center text-md bg-lightGray rounded-full'
          aria-label='close-modal'
          onClick={closeAllModal}
          dangerouslySetInnerHTML={{ __html: Icons.xmark_icon }}
        ></button>
        <h1 className='w-full text-gray-700 font-bold text-lg md:text-2xl text-center'>
          Register
        </h1>
        <Image
          width={150}
          height={20}
          className='object-contain'
          src={logoUrl}
          alt='logo'
        />
        <div
          className='wrap-input-register mt-[20px]'
          onClick={() => setFocusInput('name')}
        >
          <label
            className={`text-gray-700 ${
              focusInput === 'name' || form.name ? 'active' : ''
            }`}
            htmlFor='name'
          >
            Name
          </label>
          <input
            type='name'
            id='name'
            name='name'
            value={form.name}
            onFocus={() => setFocusInput('name')}
            onBlur={() => setFocusInput(null)}
            onChange={handleChangeForm}
            autoComplete='username'
          />
          <div
            className={`focus-input-register ${
              focusInput === 'name' || form.name ? 'active' : ''
            }`}
          ></div>
          {form.email && form.password && (
            <ValidateMessage
              isValidate={!validateEmptyStr(form.name)}
              message='Name can not empty!'
              customClassName='absolute top-1/2 right-[10px] -translate-y-1/2 font-bold text-sm flex items-center gap-[10px]'
              icon={
                validateEmptyStr(form.name)
                  ? Icons.xmark_white_icon
                  : Icons.check_icon
              }
              iconClassName={`${
                validateEmptyStr(form.name) ? 'bg-red-500' : 'bg-green-500'
              }  text-white p-1 flex justify-center items-center rounded-full`}
            />
          )}
        </div>
        <div
          className='wrap-input-register'
          onClick={() => setFocusInput('email')}
        >
          <label
            className={`text-mediumGray ${
              focusInput === 'email' || form.email ? 'active' : ''
            }`}
            htmlFor='email-register'
          >
            Email
          </label>
          <input
            type='email'
            id='email-register'
            name='email'
            value={form.email}
            onFocus={() => setFocusInput('email')}
            onBlur={() => setFocusInput(null)}
            onChange={handleChangeForm}
            autoComplete='username'
          />
          <div
            className={`focus-input-register ${
              focusInput === 'email' || form.email ? 'active' : ''
            }`}
          ></div>
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
        </div>
        <div
          className='wrap-input-register'
          onClick={() => setFocusInput('password')}
        >
          <label
            className={`text-mediumGray ${
              focusInput === 'password' || form.password ? 'active' : ''
            }`}
            htmlFor='password-register'
          >
            Password
          </label>
          <input
            id='password-register'
            name='password'
            type='password'
            value={form.password}
            onFocus={() => setFocusInput('password')}
            onBlur={() => setFocusInput(null)}
            onChange={handleChangeForm}
            autoComplete='new-password'
          />
          <div
            className={`focus-input-register ${
              focusInput === 'password' || form.password ? 'active' : ''
            }`}
          ></div>
          <div className='absolute -bottom-[120%] flex items-center gap-[5px]'>
            <span dangerouslySetInnerHTML={{ __html: Icons.bulb_icon }}></span>
            <span>:</span>
            <p className='text-[12px] font-semibold text-gray-700'>
              The password must be longer than 6 characters and contain at least
              1 uppercase letter.
            </p>
          </div>
          {form.password && (
            <ValidateMessage
              isValidate={validatePassword(form.password)}
              message='Password is not valid!'
              customClassName='absolute top-1/2 right-[10px] -translate-y-1/2 font-bold text-sm flex items-center gap-[10px]'
              icon={
                !validatePassword(form.password)
                  ? Icons.xmark_white_icon
                  : Icons.check_icon
              }
              iconClassName={`${
                !validatePassword(form.password) ? 'bg-red-500' : 'bg-green-500'
              }  text-white p-1 flex justify-center items-center rounded-full`}
            />
          )}
        </div>
        <div className='mt-8 w-full register-form-btn'>
          <button
            style={{
              filter: `${
                !validateEmail(form.email) || !validatePassword(form.password)
                  ? 'grayscale(80%)'
                  : 'none'
              }`,
              cursor: `${
                !validateEmail(form.email) || !validatePassword(form.password)
                  ? 'no-drop'
                  : 'pointer'
              }`,
            }}
            disabled={
              !validateEmail(form.email) || !validatePassword(form.password)
            }
            onClick={handleVerifiedEmail}
          >
            Register
          </button>
        </div>
        <div className='flex justify-center items-center gap-[10px]'>
          <p className='text-mediumGray'>Already Have account ?</p>
          <button
            className='text-mediumGray hover:text-blue font-bold'
            onClick={changeModal}
          >
            Login
          </button>
        </div>
      </form>
    </section>
  );
}

export default RegisterModal;
