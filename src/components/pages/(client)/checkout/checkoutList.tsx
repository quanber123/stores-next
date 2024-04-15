import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { Cart } from '@/types/types';
import { ModalContext } from '@/context/ModalProvider';
import { getCurAddress } from '@/lib/redux/slice/userSlice';
import { redirect, useSearchParams } from 'next/navigation';
import LazyLoadImage from '@/components/(ui)/lazyloadImage';
import { Icons } from '@/enum/enum';
import { useCreatePaymentMutation } from '@/lib/redux/query/productQuery';
type Props = {
  orders: Cart[];
};
const CheckoutList: React.FC<Props> = ({ orders }) => {
  const { setVisibleModal } = useContext(ModalContext);
  const currAddress = useSelector(getCurAddress);
  const searchQuery = useSearchParams();
  const [paymentMethod, setPaymentMethod] = useState(
    window.localStorage.getItem('cozastore-payment') || 'cash'
  );
  const message = useRef<HTMLInputElement | null>(null);
  const [
    createPayment,
    {
      data: dataPayment,
      isSuccess: isSuccessPayment,
      isLoading: isLoadingPayment,
      isError: isErrorPayment,
      error: errorPayment,
    },
  ] = useCreatePaymentMutation();
  const addressUser = useMemo(
    () =>
      currAddress
        ? `${currAddress.address}, ${currAddress.district}, ${currAddress.city},${currAddress.state}`
        : '',
    [currAddress]
  );
  const renderedOrders = useMemo(() => {
    return orders.map((o) => {
      return (
        <tr key={o._id}>
          <td className='p-4'>
            <div className='flex items-center md:flex-row flex-col gap-[20px]'>
              <LazyLoadImage
                width={40}
                height={40}
                className='w-[40px] h-[40px]'
                src={o.product.image}
                alt={o.product.name}
              />
              <p>{o.product.name}</p>
            </div>
          </td>
          <td className='p-4'>
            <div className='flex gap-[20px] items-center'>
              <p>
                Size:{' '}
                <span className='uppercase font-bold'>{o.product.size}</span>
              </p>
              <p>
                Color:{' '}
                <span className='capitalize font-bold'>{o.product.color}</span>
              </p>
            </div>
          </td>
          <td className='p-4 text-center'>{o.product.finalPrice} VND</td>
          <td className='p-4 text-center'>{o.product.quantity}</td>
          <td className='p-4 text-center'>{o.product.totalPrice} VND</td>
        </tr>
      );
    });
  }, []);
  const totalPrice = useMemo(() => {
    return orders.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.product.totalPrice;
    }, 0);
  }, [orders]);
  const handlePaymentMethod = useCallback(
    (payment: string) => {
      setPaymentMethod(payment);
      window.localStorage.setItem('cozastore-payment', payment);
    },
    [orders]
  );

  const handlePayment = useCallback(() => {
    if (currAddress) {
      createPayment({
        totalPrice: totalPrice,
        products: orders,
        user_name: currAddress.name,
        phone: currAddress.phone,
        message: message.current?.value,
        address: addressUser,
        type: paymentMethod,
      });
    } else {
      setVisibleModal({
        visibleToastModal: {
          type: 'error',
          message: 'You forgot add your address!',
        },
      });
    }
  }, [paymentMethod, currAddress, addressUser]);
  useEffect(() => {
    if (isSuccessPayment && paymentMethod === 'transfer') {
      redirect(dataPayment.order.paymentInfo.checkoutUrl);
    }
    if (isSuccessPayment && paymentMethod === 'cash') {
      redirect(
        `/success?paymentMethod=cash&status=${dataPayment.order.paymentInfo.status}&orderCode=${dataPayment.order.paymentInfo.orderCode}`
      );
    }
    if (isErrorPayment && errorPayment && 'data' in errorPayment) {
      const errorData = errorPayment.data as { message: string };
      setVisibleModal({
        visibleToastModal: {
          type: 'error',
          message: errorData.message,
        },
      });
    }
  }, [
    isSuccessPayment,
    isErrorPayment,
    errorPayment,
    paymentMethod,
    redirect,
    searchQuery,
    setVisibleModal,
  ]);
  return (
    <>
      <section className='container bg-neutral-100 my-[20px] px-4 py-8 flex flex-col gap-[20px] text-gray-700'>
        <div className='text-lg flex items-center gap-[20px] font-semibold text-violet-500'>
          <span
            dangerouslySetInnerHTML={{ __html: Icons.location_icon }}
          ></span>
          <h2>Delivery address</h2>
        </div>
        {currAddress && (
          <div className='flex items-center gap-[20px] text-sm lg:text-base'>
            <div className='flex lg:flex-row flex-col gap-[12px]'>
              <p className='font-bold'>
                {currAddress.name} | {currAddress.phone}
              </p>
              <p>{addressUser}</p>
              {currAddress.isDefault && (
                <div className='px-2 text-[12px] border border-violet-500 text-violet-500'>
                  Default
                </div>
              )}
            </div>
            <button
              className='text-violet-500 text-sm'
              onClick={() => setVisibleModal('visibleAddressModal')}
            >
              Change
            </button>
          </div>
        )}
        {!currAddress && (
          <button
            className='flex items-center gap-[5px] border border-violet-500 w-max px-4'
            onClick={() => setVisibleModal('visibleAddressModal')}
          >
            <span className='text-lg'>+</span>
            <span className='text-sm text-violet-500'>Add New Address</span>
          </button>
        )}
      </section>
      <section className='container bg-neutral-100 px-4 py-8 rounded-[2px] text-gray-700'>
        <div className='w-full overflow-x-auto'>
          <table className='w-full whitespace-nowrap'>
            <thead>
              <tr className='font-bold'>
                <td className='p-4 text-center md:text-start'>Products</td>
                <td className='p-4 text-center md:text-start'>Type</td>
                <td className='p-4 text-center'>Price</td>
                <td className='p-4 text-center'>Quantity</td>
                <td className='p-4 text-center'>Into money</td>
              </tr>
            </thead>
            <tbody>{renderedOrders}</tbody>
          </table>
        </div>
      </section>
      <section className='container bg-neutral-100 border-t-2 border-b-2 border-lightGray border-dotted px-4 py-8 text-gray-700 flex md:flex-row flex-col md:justify-between items-start md:items-center gap-[20px]'>
        <div className='md:w-1/2 flex-1 flex items-center gap-[20px] text-sm'>
          <label htmlFor='message'>Message:</label>
          <input
            ref={message}
            className='w-4/5 bg-lightGray px-4 py-2'
            type='text'
            placeholder='Note to sellers...'
          />
        </div>
        <div className='md:w-1/2 flex justify-center items-center gap-[40px]'>
          <p className='text-center'>Total Price ({orders.length}):</p>
          <p className='text-center font-bold'>{totalPrice} VND</p>
        </div>
      </section>
      <section className='container my-8 px-4 py-8 bg-neutral-100 text-gray-700 rounded-[2px] flex flex-col gap-[40px]'>
        <div className='flex flex-col md:flex-row md:items-center md:gap-[40px] gap-[20px]'>
          <h3 className='text-md font-bold'>Payment methods:</h3>
          <div className='flex flex-col md:flex-row md:items-center gap-[20px]'>
            <button
              className={`border border-lightGray px-4 py-2 ${
                paymentMethod === 'transfer'
                  ? 'bg-violet-500 text-white'
                  : 'bg-slate-50'
              }`}
              onClick={() => handlePaymentMethod('transfer')}
            >
              Transfer
            </button>
            <button
              className={`border border-lightGray px-4 py-2 ${
                paymentMethod === 'cash'
                  ? 'bg-violet-500 text-white'
                  : 'bg-slate-50'
              }`}
              onClick={() => handlePaymentMethod('cash')}
            >
              Payment on delivery
            </button>
          </div>
        </div>
        <div className='border-t border-b border-gray border-dotted py-8 text-gray-700 text-sm'>
          <div className='flex flex-col lg:items-end gap-[20px]'>
            <p className='lg:w-1/4 flex justify-between items-center'>
              <span>Total cost of goods</span>
              <span>{totalPrice} VND</span>
            </p>
            <p className='lg:w-1/4 flex justify-between items-center'>
              <span>Transport fee</span>
              <span>-</span>
            </p>
            <p className='lg:w-1/4 flex justify-between items-center'>
              <span>Total payment</span>
              <span className='text-lg text-red font-bold'>
                {totalPrice} VND
              </span>
            </p>
          </div>
        </div>
        <div className='text-sm flex flex-col lg:flex-row justify-between lg:items-center gap-[40px] md:gap-[20px] lg:gap-0'>
          <div className='flex flex-col md:flex-row md:items-center md:gap-[10px]'>
            <p> Clicking "Place Order" means you agree to abide by</p>
            <button className='text-violet-500'>The CozaStore Terms</button>
          </div>
          <button
            className='py-2 px-8 text-md bg-violet-500 hover:bg-gray-700 text-white rounded-[2px] transition-colors'
            onClick={handlePayment}
            disabled={isLoadingPayment}
          >
            Place Order
          </button>
        </div>
      </section>
    </>
  );
};

export default CheckoutList;
