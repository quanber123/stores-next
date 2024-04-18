'use client';
import { FetchDataContext } from '@/context/FetchDataProvider';
import useQueryString from '@/lib/hooks/useQueryString';
import { useSearchParams } from 'next/navigation';
import { useContext, useMemo } from 'react';

export default function Filter() {
  const { statusOrders } = useContext(FetchDataContext);
  const [createQueryString, deleteQueryString] = useQueryString();
  const searchQuery = useSearchParams();
  const renderedFilters = useMemo(
    () =>
      statusOrders
        .sort((a, b) => a.number - b.number)
        .map((s) => {
          return (
            <div
              className='w-full relative flex-1 flex justify-center items-center'
              key={s._id}
            >
              <button
                className={`w-full h-full py-4 uppercase text-start lg:text-center ${
                  searchQuery.get('status') === s.name ? 'text-violet-500' : ''
                } `}
                onClick={() => createQueryString('status', s.name)}
                data-name='status'
              >
                {s.name}
              </button>
              <div
                style={{ transition: 'all 0.3s ease' }}
                className={`absolute left-1/2 -translate-x-1/2 bottom-0 ${
                  searchQuery.get('status') === s.name ? 'w-full' : 'w-0'
                } h-[2px] bg-violet-500`}
              ></div>
            </div>
          );
        }),
    [statusOrders, searchQuery, createQueryString]
  );
  return (
    <section className='my-4 flex flex-col lg:flex-row justify-between items-center text-neutral-700 font-bold'>
      <div className='w-full relative flex-1 flex justify-center items-center'>
        <button
          className={`w-full h-full py-4 text-start lg:text-center  ${
            !searchQuery.get('status') ? 'text-violet-500' : ''
          }`}
          data-name='status'
          value={'default'}
          onClick={deleteQueryString}
        >
          All
        </button>
        <div
          className={`absolute left-1/2 -translate-x-1/2 bottom-0 
           ${
             !searchQuery.get('status') ? 'w-full' : 'w-0'
           } h-[2px] bg-violet-500 transition-colors`}
        ></div>
      </div>
      {renderedFilters}
    </section>
  );
}
