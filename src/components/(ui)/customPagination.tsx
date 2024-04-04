import React, { useCallback } from 'react';
import {
  Pagination,
  PaginationItemRenderProps,
  PaginationItemType,
} from '@nextui-org/react';
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
  const curPage = Number(searchQuery.get('page')) || 1;
  const handleNext = useCallback(
    (page: string) => {
      if (page === 'next') {
        const nextPage = curPage >= totalPage ? totalPage : curPage + 1;
        createQueryString('page', nextPage.toString());
        isScroll && scrollElement();
      }
    },
    [createQueryString, searchQuery, totalPage, scrollElement, isScroll]
  );

  const handlePrevious = useCallback(
    (page: string) => {
      if (page === 'prev') {
        const prev = curPage <= 1 ? 1 : curPage - 1;
        createQueryString('page', prev.toString());
        isScroll && scrollElement();
      }
    },
    [createQueryString, searchQuery, scrollElement, isScroll]
  );
  const handleSetPage = useCallback(
    (page: number) => {
      createQueryString('page', page.toString());
      isScroll && scrollElement();
    },
    [createQueryString, scrollElement, isScroll]
  );

  const renderItems = ({ key, value }: PaginationItemRenderProps) => {
    if (value === PaginationItemType.NEXT) {
      return (
        <button
          key={key}
          className={`w-max h-full px-2 py-1 rounded border border-gray-200 text-gray-500 ${
            curPage >= totalPage && 'cursor-not-allowed'
          }`}
          onClick={() => handleNext(value)}
          disabled={curPage >= totalPage}
        >
          Next
        </button>
      );
    }

    if (value === PaginationItemType.PREV) {
      return (
        <button
          key={key}
          className={`w-max h-full px-2 py-1 rounded border border-gray-200 text-gray-500 ${
            curPage <= 1 && 'cursor-not-allowed'
          }`}
          onClick={() => handlePrevious(value)}
          disabled={curPage <= 1}
        >
          Prev
        </button>
      );
    }

    if (value === PaginationItemType.DOTS) {
      return (
        <button key={key} className='rounded-md px-2 py-1'>
          ...
        </button>
      );
    }

    return (
      <button
        key={key}
        className={`w-[32px] h-full px-2 py-1 border border-gray-200 rounded
          ${curPage === value && 'bg-secondary text-gray-100'}`}
        onClick={() => handleSetPage(value)}
      >
        {value}
      </button>
    );
  };

  return (
    <Pagination
      showControls
      color='secondary'
      page={curPage}
      total={totalPage}
      siblings={1}
      boundaries={1}
      renderItem={renderItems}
    />
  );
};

export default CustomPagination;
