'use client';
import useQueryString from '@/lib/hooks/useQueryString';
import { useSearchParams } from 'next/navigation';
import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Icons } from '@/enum/enum';
import { FetchDataContext } from '@/context/FetchDataProvider';
export default function Filter() {
  const { categories, tags } = useContext(FetchDataContext);
  const searchQuery = useSearchParams();
  const [createQueryString, deleteQueryString] = useQueryString();
  const [dropdown, setDropdown] = useState('');
  const [inputValue, setInputValue] = useState('');
  const searchRef = useRef(null);
  const renderedCategories = useMemo(() => {
    return categories?.map((c) => {
      return (
        <li key={c._id} className='relative py-2 font-medium'>
          <button
            className={`capitalize ${
              searchQuery.get('category') === c.name && 'text-violet-500'
            }`}
            onClick={() => {
              createQueryString('category', c.name);
            }}
          >
            {c.name}
          </button>
          <span
            style={{ transition: 'width 0.3s ease' }}
            className={`absolute left-1/2 bottom-0 -translate-x-1/2 ${
              searchQuery.get('category') === c.name ? 'w-full' : 'w-0'
            } h-[2px] bg-violet-500`}
          ></span>
        </li>
      );
    });
  }, [categories, searchQuery, createQueryString]);
  const renderedTags = useMemo(() => {
    return tags?.map((t) => {
      return (
        <li className='w-full' key={t._id}>
          <button
            className={`w-full border rounded-2xl px-2 py-1 ${
              searchQuery.get('tag') === t.name
                ? 'border-violet-500 text-violet-500'
                : 'border-gray-400'
            } capitalize`}
            onClick={() => {
              createQueryString('tag', t.name);
            }}
          >
            {t.name}
          </button>
        </li>
      );
    });
  }, [searchQuery, tags, createQueryString]);
  const renderedSortBtn = useMemo(() => {
    const sortButtons = [
      {
        name: 'Newness',
        value: 'date',
        type: 'sort',
      },
      {
        name: 'Oldness',
        value: '-date',
        type: 'sort',
      },
      {
        name: 'Price: Low to High',
        value: '-price',
        type: 'sort',
      },
      {
        name: 'Price: High to Low',
        value: 'price',
        type: 'sort',
      },
    ];
    return sortButtons?.map((b) => {
      return (
        <li className='w-max' key={b.value}>
          <button
            className={`capitalize ${
              searchQuery.get('sort') === b.value && 'text-violet-500'
            }`}
            onClick={() => {
              createQueryString('sort', b?.value);
            }}
          >
            {b.name}
          </button>
        </li>
      );
    });
  }, [searchQuery, createQueryString]);
  const handleDropdown = useCallback((dropdown: string) => {
    setDropdown((prevState) => {
      if (prevState === dropdown) return '';
      return dropdown;
    });
  }, []);
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    },
    []
  );
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        inputValue && createQueryString('search', inputValue);
        inputValue === '' && deleteQueryString();
      }
    },
    [inputValue, createQueryString, deleteQueryString]
  );
  return (
    <section className='container px-4 md:px-0 text-gray-500 flex flex-col'>
      <div className='flex flex-col md:flex-row justify-between items-center gap-[20px] md:gap-0'>
        <ul className='py-4 w-full flex justify-start items-center gap-[24px] overflow-y-auto'>
          <li className='relative py-2 font-medium'>
            <button
              className={`${
                searchQuery.get('category') === null && 'text-violet-500'
              } w-max`}
              onClick={deleteQueryString}
            >
              All Products
            </button>
            <span
              style={{ transition: 'width 0.3s ease' }}
              className={`absolute left-1/2 bottom-0 -translate-x-1/2 ${
                searchQuery.get('category') === null ? 'w-full' : 'w-0'
              } h-[2px] bg-violet-500`}
            ></span>
          </li>
          {renderedCategories}
        </ul>
        <div className='flex items-center gap-4'>
          <button
            style={{ transition: 'all 0.2s ease' }}
            className='flex items-center gap-2 border border-gray-200 rounded px-8 py-3 hover:text-violet-500 hover:border-violet-500 text-sm'
            onClick={() => handleDropdown('filterDropdown')}
          >
            <span
              dangerouslySetInnerHTML={{ __html: Icons.bars_down_icon }}
            ></span>
            <p>Filter</p>
          </button>
          <button
            style={{ transition: 'all 0.2s ease' }}
            className='flex items-center gap-2 border border-gray-200 rounded px-8 py-3 hover:text-violet-500 hover:border-violet-500 text-sm'
            onClick={() => handleDropdown('searchDropdown')}
          >
            <span
              dangerouslySetInnerHTML={{ __html: Icons.search_icon }}
            ></span>
            <p>Search</p>
          </button>
        </div>
      </div>
      <div
        style={{ transition: 'all 0.2s linear' }}
        className={`w-full my-4 ${
          dropdown === 'filterDropdown' ? 'h-[218px]' : 'h-0'
        } bg-neutral-200 rounded overflow-y-auto flex flex-col sm:flex-row justify-between`}
      >
        <div className='p-6 flex flex-col gap-2'>
          <p className='font-bold text-lg text-gray-700'>Sort By</p>
          <ul className='flex flex-col gap-1'>
            <li>
              <button
                className={`capitalize ${
                  searchQuery.get('sort') === null && 'text-violet-500'
                } ?`}
                onClick={deleteQueryString}
              >
                Default
              </button>
            </li>
            {renderedSortBtn}
          </ul>
        </div>
        <div className='p-6 flex flex-col gap-2'>
          <p className='font-bold text-lg text-gray-700'>Tags</p>
          <ul className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3'>
            {renderedTags}
          </ul>
        </div>
      </div>
      <div
        ref={searchRef}
        style={{ transition: 'height 0.3s ease' }}
        className={`relative my-4 ${
          dropdown === 'searchDropdown'
            ? 'h-[64px] border border-gray-300'
            : 'h-0'
        } rounded overflow-hidden`}
      >
        <button
          className='absolute top-1/2 -translate-y-1/2 left-[24px] z-10 text-md hover:text-purple cursor-pointer'
          dangerouslySetInnerHTML={{ __html: Icons.search_icon }}
          aria-label='search-btn'
          onClick={() => createQueryString('search', inputValue)}
        />
        <input
          className='px-16 h-full w-full'
          type='text'
          placeholder='Search...'
          aria-label='search-product'
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </section>
  );
}
