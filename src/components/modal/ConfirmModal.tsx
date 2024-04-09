'use client';
import { ModalContext } from '@/context/ModalProvider';
import useClickOutside from '@/lib/hooks/useClickOutside';
import { useCallback, useContext } from 'react';
const ConfirmModal = () => {
  const { state, closeAllModal } = useContext(ModalContext);
  const [modalRef, clickOutside] = useClickOutside('visibleConfirmModal');
  const closeModal = useCallback(() => {
    state.visibleConfirmModal.function();
    closeAllModal();
  }, [state.visibleConfirmModal, closeAllModal]);
  return (
    <section
      onClick={clickOutside}
      className={`${
        state.visibleConfirmModal.message ? 'block' : 'hidden'
      } fixed top-0 left-0 w-full h-full bg-neutral-900 opacity-80 z-[1000] flex justify-center items-center`}
    >
      <div
        ref={modalRef}
        className='container p-8 bg-slate-50 max-w-[360px] flex flex-col gap-[20px] rounded'
      >
        <p>{state.visibleConfirmModal.message}</p>
        <div className='flex justify-center gap-[40px]'>
          <button
            className='bg-black hover:bg-violet-500 text-slate-50 rounded-[2px] px-4 py-2 transition-colors'
            onClick={closeAllModal}
          >
            Return
          </button>
          <button onClick={closeModal}>Yes</button>
        </div>
      </div>
    </section>
  );
};

export default ConfirmModal;
