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
      r !== name && router.push(`/${r}`);
    },
    [pathname, name, router]
  );
  const renderedBreadcrumbs = useMemo(() => {
    return formatArr?.map((b, index) => {
      return (
        <React.Fragment key={index}>
          <li className='text-md font-bold'>&gt;</li>
          <li>
            <button
              className={`capitalize ${
                index === formatArr.length - 1 && 'text-violet-500'
              }`}
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
  }, [pathname, name, formatArr, handleRedirect]);
  return (
    <section className='container'>
      <ul className='flex items-center gap-2 text-md font-bold'>
        <li>
          <button>Home</button>
        </li>
        {renderedBreadcrumbs}
      </ul>
    </section>
  );
};

export default Breadcrumbs;
