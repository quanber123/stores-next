import { Icons } from '@/enum/enum';
import { Product } from '@/types/types';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
type Props = {
  product: Product;
};
const ProductDetails: React.FC<Props> = ({ product }) => {
  const { name, price, sale, salePrice, details } = product;
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
    [selectedSizes]
  );
  const [selectedColors, setSelectedColors] = useState<string>(colors[0]);
  const curVariants = useMemo(() => {
    return details.variants.find(
      (v) => v.size === selectedSizes && v.color === selectedColors
    );
  }, [selectedColors, selectedSizes]);
  const [amount, setAmount] = useState<number>(curVariants?.quantity || 0);
  const [totalQuantity, setTotalQuantity] = useState(1);
  const handleSelectedSizes = useCallback(
    (size: string) => {
      setSelectedSizes(size);
    },
    [selectedSizes, selectedColors, product]
  );
  useEffect(() => {
    setSelectedColors(colors[0]);
    curVariants?.quantity &&
      curVariants?.quantity > 0 &&
      setAmount(curVariants?.quantity);
  }, [colors, curVariants?.quantity]);

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
  }, [selectedSizes, product]);
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
  }, [selectedSizes, selectedColors, product]);
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
    [product]
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
    [product]
  );
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
          {price} VND
        </span>
        <span
          className={`${
            sale?.rate && sale?.active ? 'block text-sm font-bold' : 'hidden'
          }`}
        >
          {salePrice} VND
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
      <div className='w-full flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 sm:gap-[40px]'>
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
        {amount && (
          <p className='flex gap-[5px] text-md font-medium'>
            ( <span>{amount}</span>
            <span>available</span>
            <span>{amount > 1 ? 'products' : 'product'}</span>)
          </p>
        )}
      </div>
      <div className='flex flex-col sm:flex-row justify-center lg:justify-start lg:items-stretch gap-4'>
        <button className='rounded px-6 py-3 border bg-violet-50 border-violet-500 text-violet-500 hover:bg-white transition-all duration-200 flex justify-center items-center gap-2'>
          <span className='uppercase'>Add to cart</span>
          <span
            dangerouslySetInnerHTML={{ __html: Icons.cart_plus_icon }}
          ></span>
        </button>
        <button className='uppercase rounded px-12 py-3 bg-violet-500 text-white hover:opacity-80 transition-all duration-200'>
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
