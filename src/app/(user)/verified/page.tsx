'use client';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, userInfo } from '@/lib/redux/slice/userSlice';
import {
  useResendEmailMutation,
  useVerifiedEmailMutation,
} from '@/lib/redux/query/userQuery';
import { redirect } from 'next/navigation';
import { ModalContext } from '@/context/ModalProvider';
function Verified() {
  const user = useSelector(userInfo);
  const { setVisibleModal } = useContext(ModalContext);
  const dispatch = useDispatch();
  const [code, setCode] = useState('');
  const formRef = useRef(null);
  const [
    verifiedEmail,
    {
      data: dataVerified,
      isSuccess: isSuccessVerified,
      isLoading: isLoadingVerified,
      error: errorVerified,
    },
  ] = useVerifiedEmailMutation();
  const [
    resendEmail,
    { isSuccess: isResendEmailSuccess, isLoading: isLoadingSendMail },
  ] = useResendEmailMutation();
  const handleChangeCode = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCode(e.target.value);
    },
    []
  );
  const handleVerified = useCallback(() => {
    verifiedEmail({ email: user?.email, code: code });
  }, [verifiedEmail, user, code]);
  const handleResendEmail = useCallback(() => {
    resendEmail(user?.email);
  }, [resendEmail, user]);
  useEffect(() => {
    if (isResendEmailSuccess) {
      setVisibleModal({
        visibleToastModal: {
          type: 'success',
          message: 'Success: Code was sent!',
        },
      });
    }
  }, [resendEmail, dispatch, setVisibleModal, isResendEmailSuccess]);
  useEffect(() => {
    if (isSuccessVerified) {
      dispatch(setUser(dataVerified));
      redirect('/');
    }
    if (errorVerified && 'data' in errorVerified) {
      const errorData = errorVerified.data as { message: string };
      setVisibleModal({
        visibleToastModal: {
          type: 'error',
          message: `${errorData.message}`,
        },
      });
    }
  }, [
    dataVerified,
    setVisibleModal,
    verifiedEmail,
    dispatch,
    isSuccessVerified,
    errorVerified,
  ]);
  if (user === null) {
    return redirect('/not-found-verified-page');
  }
  if (user?.isVerified) {
    return redirect('/');
  }
  return (
    <form
      ref={formRef}
      className='bg-neutral-50 absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[8px] shadow-lg'
      onSubmit={(e) => e.preventDefault()}
    >
      <h1 className='px-[16px] py-[18px] text-[20px] font-bold'>
        Enter the code from your email
      </h1>
      <div className='p-[16px] text-gray-500 flex flex-col gap-[20px] border-t border-b border-gray-50'>
        <p>
          Let us know that this email address belongs to you. Enter the code
          from the email sent to{' '}
          <span className='font-bold'>{user?.email}</span>.
        </p>
        <input
          className='w-[136px] border border-gray-200 rounded-[4px] p-[16px]'
          type='text'
          aria-label='code'
          placeholder='Enter code...'
          value={code}
          onChange={handleChangeCode}
        />
        <button className='mr-auto text-[#1877f2]' onClick={handleResendEmail}>
          Send Email Again
        </button>
      </div>
      <div className='flex justify-end p-4'>
        <button
          className={`${
            !code || isLoadingSendMail || isLoadingVerified
              ? 'bg-gray-300'
              : 'bg-[#1877f2]'
          } text-white w-[145px] h-[36px] rounded-[4px]`}
          disabled={!code || isLoadingSendMail || isLoadingVerified}
          onClick={handleVerified}
        >
          {isLoadingSendMail || isLoadingVerified ? '...Loading' : 'Continue'}
        </button>
      </div>
    </form>
  );
}

export default Verified;
