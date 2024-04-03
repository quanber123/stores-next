import React, { useCallback } from 'react';
import { PaginationItemType, usePagination } from '@nextui-org/react';
import useQueryString from '@/lib/hooks/useQueryString';
import { useSearchParams } from 'next/navigation';
import scrollElement from '@/lib/utils/scrollElement';
type Props = {
  totalPage: number;
  isScroll?: boolean;
};
const CustomPagination: React.FC<Props> = ({ totalPage, isScroll }) => {
  const [createQueryString] = useQueryString();
  const searchQuery = useSearchParams();
  const curPage = searchQuery.get('page') || 1;
  const { activePage, range, setPage, onNext, onPrevious } = usePagination({
    total: totalPage,
    showControls: true,
    siblings: 6,
    boundaries: 10,
  });

  const handleNext = useCallback(
    (page: string) => {
      const currPage = Number(curPage);
      if (page === 'next') {
        onNext();
        setPage(activePage + 1);
        const nextPage = currPage >= totalPage ? totalPage : currPage + 1;
        createQueryString('page', nextPage.toString());
        isScroll && scrollElement();
      }
    },
    [
      createQueryString,
      activePage,
      onNext,
      searchQuery,
      setPage,
      totalPage,
      scrollElement,
      isScroll,
    ]
  );

  const handlePrevious = useCallback(
    (page: string) => {
      const currPage = Number(curPage);
      if (page === 'prev') {
        onPrevious();
        setPage(activePage - 1);
        const prev = currPage <= 1 ? 1 : currPage - 1;
        createQueryString('page', prev.toString());
        isScroll && scrollElement();
      }
    },
    [
      createQueryString,
      activePage,
      onPrevious,
      setPage,
      searchQuery,
      scrollElement,
      isScroll,
    ]
  );
  const handleSetPage = useCallback(
    (page: number) => {
      setPage(page);
      createQueryString('page', page.toString());
      isScroll && scrollElement();
    },
    [createQueryString, setPage, scrollElement, isScroll]
  );
  return (
    <div className='flex flex-col gap-2'>
      <ul className='flex gap-2 items-center'>
        {range.map((page) => {
          if (page === PaginationItemType.NEXT) {
            return (
              <li key={page}>
                <button
                  className={`w-max h-full px-2 py-1 rounded border border-gray-200 text-gray-500 ${
                    Number(curPage) >= totalPage && 'cursor-not-allowed'
                  }`}
                  onClick={() => handleNext(page)}
                  disabled={Number(curPage) >= totalPage}
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
                  className={`w-max h-full px-2 py-1 rounded border border-gray-200 text-gray-500 ${
                    Number(curPage) <= 1 && 'cursor-not-allowed'
                  }`}
                  onClick={() => handlePrevious(page)}
                  disabled={Number(curPage) <= 1}
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
                 ${Number(curPage) === page && 'bg-secondary text-gray-100'}`}
                onClick={() => handleSetPage(page)}
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
