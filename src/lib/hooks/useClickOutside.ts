'use client';
import { ModalContext } from '@/context/ModalProvider';
import React, { useCallback, useContext, useRef, useEffect } from 'react';
const useClickOutside = (modal: any) => {
  const { setVisibleModal, closeAllModal } = useContext(ModalContext);
  const modalRef = useRef<any | null>(null);
  const clickOutside = useCallback(
    (e: React.MouseEvent) => {
      const dialogDemission = modalRef.current?.getBoundingClientRect();
      if (
        e.clientX < dialogDemission!.left ||
        e.clientX > dialogDemission!.right ||
        e.clientY < dialogDemission!.top ||
        e.clientY > dialogDemission!.bottom
      ) {
        setVisibleModal(modal);
      }
    },
    [setVisibleModal, modalRef, modal]
  );
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAllModal();
      }
    },
    [closeAllModal]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
  return [modalRef, clickOutside] as const;
};

export default useClickOutside;
