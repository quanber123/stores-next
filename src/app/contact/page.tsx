'use client';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import bgImg from '@/assets/images/bg-01.jpg.webp';
import { ModalContext } from '@/context/ModalProvider';
import { useSendContactMutation } from '@/lib/redux/query/userQuery';
import Image from 'next/image';
import { getStores } from '@/api/storeApi';
import { Icons } from '@/enum/enum';
const ContactViews = () => {
  const { setVisibleModal } = useContext(ModalContext);
  const [stores, setStores] = useState([]);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const [
    sendContact,
    {
      data: dataContact,
      isSuccess: isSuccessContact,
      isLoading: isLoadingContact,
    },
  ] = useSendContactMutation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storesData = await getStores();
        setStores(storesData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (isSuccessContact) {
      setVisibleModal({
        visibleToastModal: {
          type: 'success',
          message: dataContact.message,
        },
      });
    }
  }, [isSuccessContact, setVisibleModal]);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (emailRef.current?.value && messageRef.current?.value) {
      sendContact({
        email: emailRef.current?.value,
        message: messageRef.current?.value,
      });
    }
  };
  const renderedStores = useMemo(() => {
    const data = [
      {
        name: 'Address',
        type: 'location',
        icon: Icons.location_icon,
      },
      {
        name: 'Lets Talk',
        type: 'phone',
        icon: Icons.phone_icon,
      },
      {
        name: 'Sale Support',
        type: 'email',
        icon: Icons.email_icon,
      },
    ];
    return data.map((d) => {
      const curType = d.type;
      return (
        <div key={d.name} className='flex flex-col gap-[20px] text-neutral-600'>
          <div className='flex items-center gap-[20px]'>
            <span dangerouslySetInnerHTML={{ __html: d.icon }}></span>
            <p className='text-lg md:text-xl'>{d.name}</p>
          </div>
          <ul className='px-12 flex flex-col gap-[14px]'>
            {stores?.map((s: any) => {
              return (
                <li
                  className={`${
                    curType !== 'location' ? 'text-violet-500' : ''
                  }`}
                >
                  {curType === 'location' ? `${s.name}: ${s[curType]}` : ''}
                  {curType === 'phone' ? `+0${s[curType]}` : ''}
                  {curType === 'email' ? s[curType] : ''}
                </li>
              );
            })}
          </ul>
        </div>
      );
    });
  }, [stores]);
  return (
    <div className='text-lg md:text-xl text-neutral-700 flex flex-col gap-12'>
      <section className='relative h-[240px] overflow-hidden'>
        <div className='w-full h-full'>
          <Image
            src={bgImg}
            alt='bg-contact-page'
            width={2000}
            height={240}
            className='w-full h-full object-cover'
            priority={true}
          />
        </div>
        <h2
          className='absolute top-1/2 left-1/2 z-20 text-white text-4xl md:text-6xl font-bold'
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          Contact
        </h2>
      </section>
      <section className='container m-auto flex flex-col lg:flex-row items-stretch'>
        <div className='lg:w-1/2 order-2 lg:order-1 p-8 flex flex-col items-center gap-[20px] border border-lightGray'>
          <p className='text-lg md:text-xl font-medium'>Send Us A Message</p>
          <form
            className='w-full text-sm flex flex-col gap-[20px]'
            onSubmit={handleSubmit}
          >
            <div className='relative w-full'>
              <input
                ref={emailRef}
                name='email'
                className='w-full border border-lightGray px-12 py-4 rounded-[4px]'
                type='email'
                placeholder='Your Email Address'
                required
              />
              <span
                className='absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-700'
                dangerouslySetInnerHTML={{ __html: Icons.email_icon }}
              ></span>
            </div>
            <textarea
              ref={messageRef}
              className='w-full p-4 border border-lightGray rounded-[4px] focus:outline-none'
              name='message'
              cols={30}
              rows={10}
              placeholder='How Can We Help?'
              required
            />
            <button
              className='w-full bg-neutral-700 hover:bg-violet-500 text-white py-4 rounded-[24px] transition-colors'
              type='submit'
              disabled={isLoadingContact}
            >
              Submit
            </button>
          </form>
        </div>
        <div className='lg:w-1/2 order-1 lg:order-2 py-8 px-8 md:px-32 flex flex-col gap-[20px] border border-lightGray overflow-y-auto'>
          {renderedStores}
        </div>
      </section>
    </div>
  );
};

export default ContactViews;
