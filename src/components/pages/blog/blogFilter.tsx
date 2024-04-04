'use client';
import { useMemo, useState } from 'react';
import { Category, Tag } from '@/types/types';
import useQueryString from '@/lib/hooks/useQueryString';
import { Icons } from '@/enum/enum';
import { useSearchParams } from 'next/navigation';
type Props = {
  categories: Category[];
  tags: Tag[];
};
const BlogFilter: React.FC<Props> = ({ categories, tags }) => {
  const [createQueryString, deleteQueryString] = useQueryString();
  const searchQuery = useSearchParams();
  const [mouseHover, setMouseHover] = useState<string | null>(null);
  const [dropdownCategory, setDropdownCategory] = useState(false);
  const renderedCategory = useMemo(() => {
    const type = 'category';
    return (
      categories.length > 0 &&
      categories.map((c) => {
        return (
          <button
            key={c._id}
            className={`relative flex justify-start py-4 capitalize hover:text-violet-500 transition-colors ${
              c.name === searchQuery.get('category') ? 'text-violet-500' : ''
            }`}
            onClick={() => createQueryString(type, c.name)}
            onMouseEnter={() => setMouseHover(c.name)}
            onMouseLeave={() => setMouseHover(null)}
          >
            <span>{c.name}</span>
            <span className='absolute left-0 bottom-0 w-full h-[2px] z-10 bg-gray-300'></span>
            <span
              className={`absolute left-0 bottom-0 ${
                mouseHover === c.name || c.name === searchQuery.get('category')
                  ? 'w-full'
                  : 'w-0'
              } h-[2px] z-20 bg-violet-500 transition-all duration-200`}
            ></span>
          </button>
        );
      })
    );
  }, [categories, createQueryString, mouseHover]);
  const renderedTags = useMemo(() => {
    const type = 'tag';
    return (
      tags.length > 0 &&
      tags.map((t) => {
        return (
          <button
            key={t._id}
            className={`border ${
              t.name === searchQuery.get('tag')
                ? 'text-violet-500 border-violet-500'
                : ''
            } hover:border-violet-500 hover:text-violet-500 transition-colors duration-200 text-sm px-4 py-[4px] rounded-2xl capitalize`}
            onClick={() => createQueryString(type, t.name)}
          >
            {t.name}
          </button>
        );
      })
    );
  }, [tags, createQueryString]);
  const handleDropdown = () => {
    setDropdownCategory((prevState) => !prevState);
  };
  return (
    <div className='w-full lg:w-1/3 flex flex-col gap-[20px] md:gap-[40px]'>
      <div className='flex flex-col gap-[20px]'>
        <div className='flex justify-between items-center'>
          <h4 className='text-lg text-gray-700 font-bold'>Categories</h4>
          <button
            className='block lg:hidden text-lg hover:text-violet-500 cursor-pointer'
            onClick={handleDropdown}
            dangerouslySetInnerHTML={{ __html: Icons.wide_down_icon }}
            aria-label='wide-down-btn'
          ></button>
        </div>
        <div
          className={`${
            dropdownCategory ? 'active' : ''
          } flex flex-col gap-[10px] justify-start overflow-hidden`}
        >
          <button
            className={`relative flex justify-start py-4 capitalize ${
              !searchQuery.get('category') ? 'text-violet-500' : ''
            }`}
            data-name='category'
            value={'default'}
            onClick={deleteQueryString}
            onMouseEnter={() => setMouseHover('default')}
            onMouseLeave={() => setMouseHover(null)}
          >
            <span>All Category</span>
            <span className='absolute left-0 bottom-0 w-full h-[2px] z-10 bg-gray-300'></span>
            <span
              className={`absolute left-0 bottom-0 ${
                mouseHover === 'default' || !searchQuery.get('category')
                  ? 'w-full'
                  : 'w-0'
              } h-[2px] z-20 bg-violet-500 transition-all duration-200`}
            ></span>
          </button>
          {renderedCategory}
        </div>
      </div>
      <div className='flex flex-col gap-[20px]'>
        <h3 className='text-lg text-gray-700 font-bold'>Tags</h3>
        <ul className='flex flex-wrap gap-[5px]'>{renderedTags}</ul>
      </div>
    </div>
  );
};

export default BlogFilter;
