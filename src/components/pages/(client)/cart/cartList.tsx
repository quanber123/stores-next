'use client';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { Cart } from '@/types/types';
import { ModalContext } from '@/context/ModalProvider';
import { getAllCarts } from '@/lib/redux/slice/userSlice';
import {
  useDeleteCartByIdMutation,
  useDeleteManyCartsByIdMutation,
  useUpdateCartMutation,
} from '@/lib/redux/query/productQuery';
import { useDebounce } from '@/lib/hooks/useDebounced';
import { useRouter } from 'next/navigation';
import LazyLoadImage from '@/components/(ui)/lazyloadImage';
import cartImg from '@/assets/images/cart.png';
import Image from 'next/image';
import { formatNumberWithDot } from '@/lib/utils/format';
function CartList() {
  const { setVisibleModal } = useContext(ModalContext);
  const cart = useSelector(getAllCarts);
  const router = useRouter();
  const [quantity, setQuantity] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Cart[]>([]);
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  useEffect(() => {
    setQuantity(cart.cart.map((c) => c.product.quantity));
  }, [cart.cart]);
  const [deleteCartById, { isLoading: isLoadingDeleteCart }] =
    useDeleteCartByIdMutation();
  const [deleteManyCart, { isLoading: isLoadingDeleteManyCart }] =
    useDeleteManyCartsByIdMutation();
  const [
    updatedCart,
    {
      data: updateCartData,
      isSuccess: isSuccessUpdateCart,
      isError: isErrorUpdateCart,
      error: errorUpdateCart,
      isLoading: isLoadingUpdateCart,
    },
  ] = useUpdateCartMutation();
  const [indexCart, setIndexCart] = useState<number | null>(null);
  const debouncedValue = useDebounce(indexCart, 2000);
  const totalQuantity = useMemo(() => {
    return cart.cart
      .filter((c) => selectedProduct.includes(c))
      .reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.product.totalPrice,
        0
      );
  }, [selectedProduct, cart.cart]);
  const handleChangeQuantity = useCallback(
    (index: number, action: string, e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuantity = [...quantity];

      switch (action) {
        case 'increment': {
          newQuantity[index]++;
          break;
        }
        case 'decrement': {
          newQuantity[index] > 0 && newQuantity[index]--;
          break;
        }
        case 'input': {
          const inputValue = parseInt(e.target.value) || 1;
          newQuantity[index] = inputValue > 1 ? inputValue : 1;
          break;
        }
        default:
          break;
      }
      setIndexCart(index);
      setQuantity(newQuantity);
    },
    [quantity]
  );
  const handleSelectedProduct = useCallback(
    (product: Cart) => {
      setSelectedProduct((prevSelectedProducts) => {
        const isSelected = prevSelectedProducts.includes(product);
        let newSelectedProducts;

        if (isSelected) {
          newSelectedProducts = prevSelectedProducts.filter(
            (product) => product.product.id !== product.product.id
          );
        } else {
          newSelectedProducts = [...prevSelectedProducts, product];
        }
        setIsSelectedAll(newSelectedProducts.length === cart.cart.length);
        return newSelectedProducts;
      });
    },
    [cart]
  );
  const handleSelectAll = useCallback(() => {
    if (isSelectedAll) {
      setSelectedProduct([]);
    } else {
      setSelectedProduct(cart.cart.map((c) => c));
    }
    setIsSelectedAll((prevState) => !prevState);
  }, [isSelectedAll, selectedProduct, cart.cart]);

  useEffect(() => {
    if (debouncedValue !== null) {
      updatedCart({
        id: cart.cart[debouncedValue]._id,
        product: {
          ...cart.cart[debouncedValue].product,
          quantity: quantity[debouncedValue],
        },
      });
    }
  }, [debouncedValue, updatedCart, cart, quantity]);
  useEffect(() => {
    if (isSuccessUpdateCart && updateCartData) {
      setIndexCart(null);
    }
    if (isErrorUpdateCart && errorUpdateCart && 'data' in errorUpdateCart) {
      const errorData = errorUpdateCart.data as {
        message: string;
        data: {
          details: {
            variants: [
              {
                color: string;
                size: string;
                quantity: number;
              }
            ];
          };
        };
      };
      setVisibleModal({
        visibleToastModal: {
          type: 'error',
          message: errorData.message,
        },
      });
      if (errorData.data && errorData.data.details.variants.length > 0) {
        setQuantity((prevQuantity) => {
          const newQuantity = [...prevQuantity];
          indexCart &&
            (newQuantity[indexCart] =
              errorData.data.details.variants[0].quantity);
          return newQuantity;
        });
      }
    }
  }, [isSuccessUpdateCart, updateCartData, isErrorUpdateCart, setVisibleModal]);
  const handleDeleteCartById = useCallback(
    (id: string) => {
      setVisibleModal({
        visibleConfirmModal: {
          message: 'Do you want to delete this product?',
          function: () => deleteCartById(id),
        },
      });
    },
    [deleteCartById, setVisibleModal]
  );
  const handleDeleteManyCart = useCallback(() => {
    setVisibleModal({
      visibleConfirmModal: {
        message: `Do you want to remove ${selectedProduct.length} ${
          selectedProduct.length > 1 ? 'products' : 'product'
        } ?`,
        function: () => deleteManyCart({ products: selectedProduct }),
      },
    });
  }, [deleteManyCart, selectedProduct, setVisibleModal]);
  const handleCheckout = useCallback(() => {
    if (selectedProduct.length) {
      router.push(`/checkout/?state=${btoa(JSON.stringify(selectedProduct))}`, {
        scroll: true,
      });
    } else {
      setVisibleModal({
        visibleToastModal: {
          type: 'error',
          message: 'You have not selected any products to buy!',
        },
      });
    }
  }, [router, setVisibleModal, selectedProduct]);
  const renderedCart = useMemo(() => {
    return cart.cart.map((c, index) => {
      return (
        <tr className='border-b border-lightGray' key={c._id}>
          <td className='p-4'>
            <div className='flex justify-center items-center'>
              <input
                className='m-auto w-[18px] h-[18px] cursor-pointer mr-auto'
                type='checkbox'
                value={c._id}
                checked={selectedProduct.includes(c)}
                onChange={() => handleSelectedProduct(c)}
                aria-label={`checkbox-${c.product.name}`}
              />
            </div>
          </td>
          <td
            className='p-4 line-clamp-1'
            onClick={() =>
              router.push(`/shop/${c.product.id}`, { scroll: true })
            }
          >
            <div className='flex flex-col md:flex-row items-center gap-[14px]'>
              <LazyLoadImage
                width={80}
                height={80}
                className='w-[80px] h-[80px] rounded-[2px]'
                src={c.product.image}
                alt={c.product.name}
              />
              <p className='cursor-pointer'>{c.product.name}</p>
            </div>
          </td>
          <td className='p-4 capitalize'>{c.product.color}</td>
          <td className='p-4 uppercase'>{c.product.size}</td>
          <td className='p-4'>
            <span
              className={`${c.product.salePrice > 0 ? 'line-through' : ''}`}
            >
              {formatNumberWithDot(c.product.price)} VND
            </span>
            {c.product.salePrice > 0 && (
              <span className='font-bold'>
                {formatNumberWithDot(c.product.salePrice)} VND
              </span>
            )}
          </td>
          <td className='p-4'>
            <div className='m-auto w-max flex justify-center items-center border border-lightGray'>
              <button
                className='w-[52px] flex justify-center items-center text-lg'
                onClick={(e) =>
                  handleChangeQuantity(index, 'decrement', e as any)
                }
              >
                -
              </button>
              <input
                className='w-[52px] text-center py-2 border-l border-r border-l-lightGray border-r-lightGray focus:outline-none'
                type='text'
                pattern='\d+'
                value={quantity[index]}
                onChange={(e) => handleChangeQuantity(index, 'input', e)}
              />
              <button
                className='w-[52px] flex justify-center items-center text-lg'
                onClick={(e) =>
                  handleChangeQuantity(index, 'increment', e as any)
                }
              >
                +
              </button>
            </div>
          </td>
          <td className='p-4'>
            {formatNumberWithDot(c.product.totalPrice)} VND
          </td>
          <td className='p-4'>
            <button
              className='hover:text-purple font-bold'
              onClick={() => handleDeleteCartById(c._id)}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
  }, [
    cart.cart,
    quantity,
    selectedProduct,
    router,
    handleDeleteCartById,
    handleChangeQuantity,
    handleSelectedProduct,
  ]);
  return (
    <div className='w-full overflow-hidden border border-lightGray rounded-lg mb-8 text-sm md:text-base'>
      {cart.cart.length ? (
        <div className='w-full overflow-x-auto'>
          <table className='w-full whitespace-nowrap'>
            <thead className='font-semibold tracking-wide  font-gray-700 border-b border-lightGray'>
              <tr>
                <td className='p-4'>
                  <div className='flex justify-center items-center'>
                    <input
                      className='w-[18px] h-[18px] cursor-pointer'
                      type='checkbox'
                      checked={isSelectedAll}
                      onChange={handleSelectAll}
                      aria-label={`select-all`}
                    />
                  </div>
                </td>
                <td className='p-4'>Product</td>
                <td className='p-4'>Color</td>
                <td className='p-4'>Size</td>
                <td className='p-4'>Price</td>
                <td className='p-4 text-center'>Quantity</td>
                <td className='p-4'>Total</td>
                <td className='p-4'>Action</td>
              </tr>
            </thead>
            <tbody className='relative'>
              {renderedCart}
              <tr className='h-[128px]'>
                <td className='p-4'>
                  <div className='flex justify-center items-center'>
                    <input
                      className='w-[18px] h-[18px] m-auto cursor-pointer'
                      type='checkbox'
                      checked={isSelectedAll}
                      onChange={handleSelectAll}
                      aria-label={`select-all`}
                    />
                  </div>
                </td>
                <td className='p-4'>
                  <div className='flex items-center gap-[20px]'>
                    <p>
                      Select All{' '}
                      {selectedProduct.length > 0 &&
                        isSelectedAll &&
                        `(${selectedProduct.length})`}
                    </p>
                    <button
                      className={`text-sm font-bold ${
                        selectedProduct.length === 0
                          ? 'cursor-not-allowed'
                          : 'cursor-pointer'
                      }`}
                      onClick={handleDeleteManyCart}
                      disabled={selectedProduct.length === 0}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <div className='p-4 absolute z-10 bottom-0 right-4'>
                <div className='flex flex-col items-end gap-[20px]'>
                  <p>
                    Total Payment Product {`(${selectedProduct.length})`} :{' '}
                    <span className='font-bold text-red'>${totalQuantity}</span>
                  </p>
                  <button
                    disabled={
                      isLoadingDeleteCart ||
                      isLoadingDeleteManyCart ||
                      isLoadingUpdateCart
                    }
                    className='px-[36px] py-[12px] rounded-[2px] bg-violet-500 hover:bg-neutral-700 text-white font-bold transition-colors'
                    onClick={handleCheckout}
                  >
                    Purchase
                  </button>
                </div>
              </div>
            </tbody>
          </table>
        </div>
      ) : (
        <div className='py-32 flex flex-col justify-center items-center gap-[10px]'>
          <Image
            className='w-[100px] h-[100px] rounded-[2px]'
            width={100}
            height={100}
            src={cartImg}
            alt='cart-img'
            priority
          />
          <p className='font-bold'>Your cart is empty.</p>
          <button
            className='bg-violet-500 hover:bg-neutral-700 px-8 py-2 rounded-[2px] text-white transition-colors'
            onClick={() => router.push('/shop?page=1', { scroll: true })}
          >
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
}

export default CartList;
