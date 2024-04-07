import scrollElement from '@/lib/utils/scrollElement';
import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';
type Props = {
  pathname?: string;
  name?: string;
};
const Breadcrumbs: React.FC<Props> = ({ pathname, name }) => {
  const router = useRouter();
  const formatArr = pathname?.split('/').filter((b) => b);
  const handleRedirect = useCallback(
    (r: string | undefined) => {
      if (r !== name) {
        router.push(`/${r}`);
        scrollElement();
      }
    },
    [name, router]
  );
  const renderedBreadcrumbs = useMemo(() => {
    return formatArr?.map((b, index) => {
      return (
        <React.Fragment key={index}>
          <li className='text-md font-bold'>&gt;</li>
          <li>
            <button
              className={`max-w-[150px] md:max-w-full capitalize text-ellipsis whitespace-nowrap overflow-hidden ${
                index === formatArr.length - 1 && 'text-violet-500'
              }`}
              title={index === formatArr.length - 1 ? name : b}
              onClick={() =>
                handleRedirect(index === formatArr.length - 1 ? name : b)
              }
            >
              {index === formatArr.length - 1 ? name : b}
            </button>
          </li>
        </React.Fragment>
      );
    });
  }, [name, formatArr, handleRedirect]);
  return (
    <section className='container text-sm md:text-base'>
      <ul className='flex items-center gap-2 text-md font-bold'>
        <li>
          <button onClick={() => handleRedirect('')}>Home</button>
        </li>
        {renderedBreadcrumbs}
      </ul>
    </section>
  );
};

export default Breadcrumbs;
