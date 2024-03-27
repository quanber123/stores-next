import React, { useEffect } from 'react';
import { PaginationItemType, usePagination } from '@nextui-org/react';
import useQueryString from '@/lib/hooks/useQueryString';
const CustomPagination = ({ totalPage }: { totalPage: number }) => {
  const [createQueryString] = useQueryString();
  const { activePage, range, setPage, onNext, onPrevious } = usePagination({
    total: totalPage,
    showControls: true,
    siblings: 10,
    boundaries: 10,
  });
  useEffect(() => {
    if (activePage) {
      createQueryString('page', activePage.toString());
    }
  }, [activePage]);
  return (
    <div className='flex flex-col gap-2'>
      <ul className='flex gap-2 items-center'>
        {range.map((page) => {
          if (page === PaginationItemType.NEXT) {
            return (
              <li key={page}>
                <button
                  className='w-max h-full px-2 py-1 rounded border border-gray-200 text-gray-500'
                  onClick={onNext}
                >
                  Next
                </button>
              </li>
            );
          }

          if (page === PaginationItemType.PREV) {
            return (
              <li key={page}>
                <button
                  className='w-max h-full px-2 py-1 rounded border border-gray-200 text-gray-500'
                  onClick={onPrevious}
                >
                  Prev
                </button>
              </li>
            );
          }

          if (page === PaginationItemType.DOTS) {
            return <li key={page}>...</li>;
          }

          return (
            <li key={page}>
              <button
                className={`w-[32px] h-full px-2 py-1 border border-gray-200 rounded
                 ${activePage === page && 'bg-secondary text-gray-100'}`}
                onClick={() => setPage(page)}
              >
                {page}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CustomPagination;
