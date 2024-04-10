'use client';
import CustomPagination from '@/components/(ui)/customPagination';
import LazyLoadImage from '@/components/(ui)/lazyloadImage';
import { Icons } from '@/enum/enum';
import { useGetReviewsQuery } from '@/lib/redux/query/productQuery';
import { formatTime } from '@/lib/utils/format';
import { Product } from '@/types/types';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useMemo, useState } from 'react';
type Props = {
  product: Product;
};

interface Details {
  weight: string;
  dimensions: string;
  materials: string;
}
const MoreInformation: React.FC<Props> = ({ product }) => {
  const { details } = product;
  const [tab, setTab] = useState(0);
  const searchQuery = useSearchParams();
  const tabpanel = ['description', 'additional information', 'reviews'];
  const { data: dataReviews, isSuccess: isSuccessReviews } = useGetReviewsQuery(
    {
      id: product._id,
      query: `page=${searchQuery.get('page') || 1}`,
    }
  );
  const renderedInformation = useMemo(() => {
    const propertiesToExclude = ['weights', 'dimensions', 'materials'];

    return Object.keys(details)
      .filter((d) => propertiesToExclude.includes(d))
      .map((item, index) => {
        if (typeof details[item as keyof Details] === 'string') {
          return (
            <p key={index} className='flex justify-end gap-[20px]'>
              <span className='max-w-[145px] w-full text-gray-700 capitalize'>
                {item}
              </span>
              <span className='w-1/2'>{details[item as keyof Details]}</span>
            </p>
          );
        } else {
          return null;
        }
      });
  }, [details]);

  const sizes = useMemo(
    () => details.variants.map((v) => v.size),
    [details.variants]
  );
  const colors = useMemo(() => {
    const arrColors = [
      ...details.variants.map((v) => v.color).filter((v) => v),
    ];
    return Array.from(new Set(arrColors));
  }, [details.variants]);

  const renderStars = useCallback((rate: number, size: number) => {
    const fullStars = Math.floor(rate);
    const decimalPart = rate - fullStars;
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span
          key={i}
          className={`text-violet-500 w-[${size}px] h-[${size}px]`}
          dangerouslySetInnerHTML={{ __html: Icons.star_active_icon }}
        />
      );
    }
    if (decimalPart > 0) {
      stars.push(
        <span
          key={fullStars}
          className={`text-violet-500 w-[${size}px] h-[${size}px]`}
          dangerouslySetInnerHTML={{ __html: Icons.star_half_icon }}
          // style={{ width: `${decimalPart * 100}%`, overflow: 'hidden' }}
        />
      );
    }
    const remainingStars = 5 - Math.ceil(rate);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span
          className={`w-[${size}px] h-[${size}px]`}
          key={fullStars + i}
          dangerouslySetInnerHTML={{ __html: Icons.star_icon }}
        />
      );
    }

    return stars;
  }, []);
  const renderReviews = useMemo(() => {
    return dataReviews?.reviews && isSuccessReviews
      ? dataReviews.reviews.map((r: any) => (
          <div
            key={r._id}
            className='py-4 flex items-center gap-[20px] text-gray-700 border-b border-gray-200'
          >
            <div className='w-[42px] h-[42px] rounded-full overflow-hidden'>
              <LazyLoadImage
                src={r.avatar}
                alt={r.username}
                className='object-cover'
                width={42}
                height={42}
              />
            </div>
            <div className='w-full flex flex-col justify-between gap-2'>
              <div className='w-full flex flex-col sm:flex-row justify-between'>
                <p>{r.username}</p>
                <div className='flex items-center order-1 sm:order-2'>
                  {renderStars(r.rate, 24)}
                </div>
              </div>
              <p className='text-sm text-gray'>{formatTime(r.created_at)}</p>
              <p className='text-sm text-gray'>{r.reviews}</p>
            </div>
          </div>
        ))
      : null;
  }, [dataReviews, isSuccessReviews, renderStars]);
  return (
    <>
      <ul className='flex flex-col justify-center sm:flex-row gap-6'>
        {tabpanel.map((t, index) => (
          <li
            key={index}
            className={`${
              tab === index ? 'active' : ''
            } tab cursor-pointer capitalize`}
            onClick={() => setTab(index)}
          >
            {t === 'reviews'
              ? `${t} ${dataReviews?.total ? `(${dataReviews?.total})` : ''}`
              : t}
          </li>
        ))}
      </ul>
      <div className='w-full'>
        <div className={`tabpanel ${tab === 0 ? 'active' : ''}`}>
          <p className='w-4/5 m-auto'>{details?.description}</p>
        </div>
        <div
          className={`tabpanel ${
            tab === 1 ? 'active' : ''
          } flex flex-col items-center gap-4`}
        >
          {renderedInformation}
          <p className='flex justify-end gap-[20px]'>
            <span className='max-w-[145px] w-full'>Color</span>
            <span className='w-1/2 capitalize'>{colors.join(', ')}</span>
          </p>
          <p className='flex justify-end gap-[20px]'>
            <span className='max-w-[145px] w-full'>Size</span>
            <span className='w-1/2 uppercase'>{sizes.join(', ')}</span>
          </p>
        </div>
        <div
          className={`tabpanel ${
            tab === 2 ? 'active' : ''
          } flex flex-col gap-[10px] py-8`}
        >
          {isSuccessReviews && dataReviews?.reviews.length !== 0 && (
            <div className='w-full sm:w-4/5 m-auto flex flex-col gap-[40px] items-start text-violet-500'>
              <div className='flex items-center gap-[20px]'>
                <p className='text-4xl font-medium flex gap-[5px]'>
                  <span>{dataReviews?.avgRate}</span>
                  <span>/</span>
                  <span>5</span>
                </p>
                <div className='flex items-center h-[2px]'>
                  {renderStars(dataReviews?.avgRate, 36)}
                </div>
              </div>
              <div className='w-full flex flex-col gap-[10px]'>
                {renderReviews}
              </div>
              {dataReviews?.totalPage > 1 && (
                <CustomPagination
                  totalPage={dataReviews?.totalPage as number}
                />
              )}
            </div>
          )}
          {isSuccessReviews && !dataReviews?.total && (
            <p className='text-xl font-bold text-gray-700 text-center'>
              No Reviews Yet.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default MoreInformation;
