import { Icons } from '@/enum/enum';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
type Props = {
  images: string[];
};
const ListImages: React.FC<Props> = ({ images }) => {
  const [indexImage, setIndexImage] = useState<number>(0);
  const handleIndex = (index: number) => {
    setIndexImage(index);
  };
  const handlePrev = useCallback(() => {
    setIndexImage((prevIndex) => {
      if (prevIndex === 0) return images.length - 1;
      return prevIndex - 1;
    });
  }, [images.length]);
  const handleNext = useCallback(() => {
    setIndexImage((prevIndex) => {
      if (prevIndex === images.length - 1) return 0;
      return prevIndex + 1;
    });
  }, [images.length, indexImage]);
  useEffect(() => {
    const infiniteSlider = setInterval(() => {
      handleNext();
    }, 5000);
    return clearInterval(infiniteSlider);
  }, []);
  const renderListImage = useMemo(
    () =>
      images.map((image, index) => {
        return (
          <Image
            width={520}
            height={630}
            key={index}
            className='w-full h-full object-cover'
            src={image}
            alt={`${image}`}
            style={{
              transform: `translateX(${-100 * indexImage}%)`,
              transition: 'all 0.3s ease-in-out',
            }}
          />
        );
      }),
    [images, indexImage]
  );
  const wrapImages = useMemo(
    () =>
      images.map((image, index) => {
        return (
          <div
            key={index}
            className='max-w-[76px] w-full min-h-[64px] p-1 rounded overflow-hidden'
            style={{
              border: `${indexImage === index ? '1px solid #ccc' : ''}`,
            }}
          >
            <Image
              key={index}
              className='object-cover w-full h-full cursor-pointer'
              width={70}
              height={84}
              src={image}
              alt={`${image}`}
              onClick={() => handleIndex(index)}
            />
          </div>
        );
      }),
    [images, indexImage]
  );
  return (
    <div className='w-full flex flex-col sm:flex-row gap-[20px]'>
      <div className='md:max-w-[94px] w-full py-2 flex flex-row sm:flex-col justify-between sm:justify-start sm:gap-[40px] overflow-x-auto overflow-y-hidden md:overflow-y-auto md:overflow-x-hidden'>
        {wrapImages}
      </div>
      <div className='relative w-full h-full max-h-[630px] overflow-hidden flex'>
        {renderListImage}
        {images.length > 1 && (
          <>
            <button
              className='absolute top-1/2 left-0 z-20 w-[40px] h-[40px] flex justify-center items-center text-white hover:bg-neutral-800 transition-all duration-200'
              onClick={handlePrev}
              aria-label='Previous'
              dangerouslySetInnerHTML={{ __html: Icons.left_icon }}
            ></button>
            <button
              className='absolute top-1/2 right-0 z-20 w-[40px] h-[40px] flex justify-center items-center text-white hover:bg-neutral-800 transition-all duration-200'
              onClick={handleNext}
              aria-label='Next'
              dangerouslySetInnerHTML={{ __html: Icons.right_icon }}
            ></button>
          </>
        )}
      </div>
    </div>
  );
};

export default ListImages;
