'use client';
import { Icons } from '@/enum/enum';
import scrollElement from '@/lib/utils/scrollElement';
import { useEffect, useState } from 'react';
function Scroll() {
  const [btnFixed, setBtnFixed] = useState(false);
  useEffect(() => {
    const setFixed = () => {
      if (window.scrollY > 250) {
        setBtnFixed(true);
      } else {
        setBtnFixed(false);
      }
    };
    window.addEventListener('scroll', setFixed);
    return () => {
      window.removeEventListener('scroll', setFixed);
    };
  }, []);
  return (
    <button
      className='fixed bottom-[10%] right-[5%] w-[50px] h-[50px] bg-neutral-700 hover:bg-violet-500 text-gray-100 flex justify-center items-center rounded-full z-[999] transition-all duration-200'
      style={{ scale: `${btnFixed ? '1' : '0'}` }}
      onClick={scrollElement}
      aria-label='ScrollToTop'
      dangerouslySetInnerHTML={{ __html: Icons.arrow_top_icon }}
    ></button>
  );
}

export default Scroll;
