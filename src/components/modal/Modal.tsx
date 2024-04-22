'use client';
import { ModalContext } from '@/context/ModalProvider';
import React, { Suspense, lazy, useContext } from 'react';
import './Modal.css';
import { useSelector } from 'react-redux';
import { userInfo } from '@/lib/redux/slice/userSlice';
const LoginModal = lazy(() => import('./LoginModal'));
const RegisterModal = lazy(() => import('./RegisterModal'));
const ToastModal = lazy(() => import('./ToastModal'));
const ConfirmModal = lazy(() => import('./ConfirmModal'));
const ReviewsModal = lazy(() => import('./ReviewModal'));
const Modal = () => {
  const { state } = useContext(ModalContext);
  const user = useSelector(userInfo);
  return (
    <Suspense>
      {!user && <LoginModal />}
      {!user && <RegisterModal />}
      {state.visibleToastModal && <ToastModal />}
      {state.visibleConfirmModal && <ConfirmModal />}
      {state.visibleReviewsModal && <ReviewsModal />}
      {state.visibleConfirmModal && <ConfirmModal />}
    </Suspense>
  );
};

export default Modal;
