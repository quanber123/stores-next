'use client';
import { ModalContext } from '@/context/ModalProvider';
import React, { Suspense, lazy, useContext } from 'react';
import './Modal.css';
import { useSelector } from 'react-redux';
import { userInfo } from '@/lib/redux/slice/userSlice';
const LoginModal = lazy(() => import('./LoginModal'));
const ToastModal = lazy(() => import('./ToastModal'));

const Modal = () => {
  const { state } = useContext(ModalContext);
  const user = useSelector(userInfo);
  return (
    <Suspense>
      {!user && <LoginModal />}
      {state.visibleToastModal && <ToastModal />}
    </Suspense>
  );
};

export default Modal;
