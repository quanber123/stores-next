import { ModalContext } from '@/context/ModalProvider';
import { Icons } from '@/enum/enum';
import { useCreateCartMutation } from '@/lib/redux/query/productQuery';
import { formatNumberWithDot } from '@/lib/utils/format';
import { Product } from '@/types/types';
import { useRouter } from 'next/navigation';
import React, {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
type Props = {
  product: Product;
};
const ProductDetails: React.FC<Props> = ({ product }) => {
  const { setVisibleModal } = useContext(ModalContext);
  const { _id, name, price, sale, salePrice, details, images } = product;
  const router = useRouter();
  const [isBuyNow, setIsBuyNow] = useState(false);
  const [
    createCart,
    {
      data: cartData,
      isSuccess: isSuccessCreateCart,
      isError: isErrorCreateCart,
      error: errorCart,
    },
  ] = useCreateCartMutation();
  const sizes = Array.from(new Set(details.variants.flatMap((v) => v.size)));
  const [selectedSizes, setSelectedSizes] = useState<string>(sizes[0]);
  const colors = useMemo(
    () =>
      Array.from(
        new Set(
          details.variants
            .filter((v) => v.size === selectedSizes)
            .flatMap((v) => v.color)
        )
      ),
    [selectedSizes, details.variants]
  );
  const [selectedColors, setSelectedColors] = useState<string>(colors[0]);
  const curVariants = useMemo(() => {
    return details.variants.find(
      (v) => v.size === selectedSizes && v.color === selectedColors
    );
  }, [selectedColors, selectedSizes, details.variants]);
  const [amount, setAmount] = useState<number>(
    curVariants?.availableQuantity || 0
  );
  const [totalQuantity, setTotalQuantity] = useState(1);
  const handleSelectedSizes = useCallback((size: string) => {
    setSelectedSizes(size);
  }, []);
  useEffect(() => {
    setSelectedColors(colors[0]);
    curVariants?.availableQuantity &&
      curVariants?.availableQuantity > 0 &&
      setAmount(curVariants?.availableQuantity);
  }, [colors, curVariants?.availableQuantity]);

  const renderedSizes = useMemo(() => {
    return sizes.map((s, index) => {
      return (
        <li key={index}>
          <button
            className={`uppercase font-bold px-2 py-1 rounded border ${
              selectedSizes === s
                ? 'border-violet-500 text-violet-500'
                : 'border-slate-200 text-slate-300'
            }`}
            onClick={() => handleSelectedSizes(s)}
          >
            {s}
          </button>
        </li>
      );
    });
  }, [selectedSizes, handleSelectedSizes, sizes]);
  const renderedColors = useMemo(() => {
    return colors.map((c, index) => {
      return (
        <li key={index}>
          <button
            className={`capitalize font-bold px-2 py-1 rounded border ${
              selectedColors === c
                ? 'border-violet-500 text-violet-500'
                : 'border-slate-200 text-slate-300'
            }`}
            onClick={() => setSelectedColors(c)}
          >
            {c}
          </button>
        </li>
      );
    });
  }, [selectedColors, colors]);
  const handleChangeCount = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (Number(e.target.value) >= amount) {
        return setTotalQuantity(amount);
      }
      if (Number(e.target.value) <= 1) {
        return setTotalQuantity(1);
      }
      return setTotalQuantity(Number(e.target.value));
    },
    [amount]
  );
  const handleUpdateCount = useCallback(
    (type: string) => {
      if (type === 'increase') {
        setTotalQuantity((prevQuantity) => {
          if (prevQuantity >= amount) {
            return amount;
          } else {
            return (prevQuantity += 1);
          }
        });
      }
      if (type === 'decrease') {
        setTotalQuantity((prevQuantity) => {
          if (prevQuantity <= 1) {
            return 1;
          } else {
            return (prevQuantity -= 1);
          }
        });
      }
    },
    [amount]
  );
  const handleAddToCart = useCallback(() => {
    createCart({
      cart: {
        productId: _id,
        name: name,
        category: details.category.name,
        image: images[0],
        color: selectedColors,
        size: selectedSizes,
        quantity: totalQuantity,
        price: price,
        sale: sale,
        salePrice: salePrice,
      },
    });
  }, [
    createCart,
    totalQuantity,
    _id,
    name,
    details,
    selectedColors,
    selectedSizes,
    price,
    sale,
    salePrice,
    images,
  ]);
  const handleBuyNow = useCallback(() => {
    createCart({
      cart: {
        productId: _id,
        name: name,
        category: details.category.name,
        image: images[0],
        color: selectedColors,
        size: selectedSizes,
        quantity: totalQuantity,
        price: price,
        sale: sale,
        salePrice: salePrice,
      },
    });
    setIsBuyNow(true);
  }, [
    createCart,
    totalQuantity,
    _id,
    name,
    details,
    selectedColors,
    selectedSizes,
    price,
    sale,
    salePrice,
    images,
  ]);
  useEffect(() => {
    if (isSuccessCreateCart && cartData && !isBuyNow) {
      setVisibleModal({
        visibleToastModal: {
          type: 'success',
          message: 'Add to cart successfully!',
        },
      });
    }
    if (isErrorCreateCart && errorCart && 'data' in errorCart && !isBuyNow) {
      const errorData = errorCart.data as { message: string };
      setVisibleModal({
        visibleToastModal: {
          type: 'error',
          message: errorData.message,
        },
      });
    }
    if (isBuyNow && isSuccessCreateCart && cartData) {
      router.push('/cart', { scroll: true });
    }
  }, [
    isSuccessCreateCart,
    cartData,
    isErrorCreateCart,
    errorCart,
    router,
    isBuyNow,
  ]);
  return (
    <div className='flex flex-col gap-6'>
      <h3 className='text-2xl font-medium capitalize'>{name}</h3>
      <div className='text-darkGray flex gap-[20px]'>
        <p>
          Category: <span className='capitalize'>{details.category.name}</span>
        </p>
      </div>
      <p className='flex items-center gap-[20px] font-bold text-xl md:text-2xl lg:text-4xl'>
        <span
          className={`${
            sale?.rate && sale?.active && 'text-red-600 line-through'
          }`}
        >
          {formatNumberWithDot(price)} VND
        </span>
        <span
          className={`${
            sale?.rate && sale?.active ? 'block text-sm font-bold' : 'hidden'
          }`}
        >
          {salePrice && formatNumberWithDot(salePrice)} VND
        </span>
      </p>
      <p className='text-darkGray'>{details.shortDescription}</p>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-6'>
          <p className='max-w-[62px] w-full'>Sizes:</p>
          <ul className='grid grid-cols-4 lg:grid-cols-6 gap-4 text-sm'>
            {renderedSizes}
          </ul>
        </div>
        <div className='flex items-center gap-6'>
          <p className='max-w-[62px] w-full'>Colors:</p>
          <ul className='flex items-center gap-4 text-sm'>{renderedColors}</ul>
        </div>
      </div>
      <div className='w-full flex flex-col sm:flex-row justify-start sm:items-center gap-6'>
        <div className='flex gap-6 items-center'>
          <p className='max-w-[62px] w-full'>Quantity:</p>
          <div className='relative max-w-[135px] flex justify-between'>
            <button
              className='w-[45px] h-[38px] text-lg flex justify-center items-center border border-gray-200 rounded-l-sm'
              onClick={() => handleUpdateCount('decrease')}
              aria-label='Decrease'
            >
              -
            </button>
            <input
              className='w-[45px] h-[38px] px-2 text-center text-md outline-none border border-gray-200 bg-gray-200'
              type='number'
              min='1'
              max={amount}
              maxLength={3}
              value={totalQuantity}
              onChange={handleChangeCount}
              aria-label='Number'
            />
            <button
              className='w-[45px] h-[38px] text-lg flex justify-center items-center border border-gray-200 rounded-r-sm'
              onClick={() => handleUpdateCount('increase')}
              aria-label='Increase'
            >
              +
            </button>
          </div>
        </div>
        {amount && (
          <p className='m-auto sm:m-0 flex gap-[5px] text-md font-medium'>
            ( <span>{amount}</span>
            <span>available</span>
            <span>{amount > 1 ? 'products' : 'product'}</span>)
          </p>
        )}
      </div>
      <div className='my-4 flex flex-col sm:flex-row justify-center lg:justify-start lg:items-stretch gap-4'>
        <button
          className='rounded px-6 py-3 border bg-violet-50 border-violet-500 text-violet-500 hover:bg-white transition-all duration-200 flex justify-center items-center gap-2'
          onClick={handleAddToCart}
        >
          <span className='uppercase'>Add to cart</span>
          <span
            dangerouslySetInnerHTML={{ __html: Icons.cart_plus_icon }}
          ></span>
        </button>
        <button
          className='uppercase rounded px-12 py-3 bg-violet-500 text-white hover:opacity-80 transition-all duration-200'
          onClick={handleBuyNow}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
