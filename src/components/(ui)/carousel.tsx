import { Icons } from '@/enum/enum';
import { useCarousel } from '@/lib/hooks/useCarousel';
import React from 'react';
type Props = {
  children: React.ReactNode;
};

const Carousel: React.FC<Props> = ({ children }) => {
  const { breakpoints, width, indexCarousel, handlePrev, handleNext } =
    useCarousel(React.Children.toArray(children).length);
  return (
    <div className='container relative mt-4'>
      <div className={`max-w-[${width * breakpoints}%] overflow-hidden`}>
        <div
          className='w-full flex justify-between items-stretch gap-[20px]'
          style={{
            transform: `translateX(calc(-${indexCarousel * width}% + 10px))`,
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          {children}
        </div>
      </div>
      {React.Children.toArray(children).length > breakpoints && (
        <div className='text-xl'>
          <button
            className='absolute z-50 top-1/2 -left-[5%] md:-left-[2%] cursor-pointer text-gray hover:text-semiBoldGray transition-colors'
            dangerouslySetInnerHTML={{ __html: Icons.left_icon }}
            aria-label='prev-btn'
            onClick={handlePrev}
          ></button>
          <button
            className='absolute z-50 top-1/2 -right-[5%] md:-right-[2%] cursor-pointer text-gray hover:text-semiBoldGray transition-colors'
            dangerouslySetInnerHTML={{ __html: Icons.right_icon }}
            aria-label='next-btn'
            onClick={handleNext}
          ></button>
        </div>
      )}
    </div>
  );
};

export default Carousel;
