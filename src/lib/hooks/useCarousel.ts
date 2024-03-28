import { useCallback, useEffect, useMemo, useState } from 'react';
export const useCarousel = (length: number) => {
  const [breakpoints, setBreakPoints] = useState<number>(4);
  const [indexCarousel, setIndexCarousel] = useState<number>(0);

  const handlePrev = useCallback(() => {
    setIndexCarousel((prevIndex) =>
      prevIndex - 1 < 0 ? length - breakpoints : prevIndex - 1
    );
  }, [length]);

  const handleNext = useCallback(() => {
    setIndexCarousel((prevIndex) =>
      prevIndex + 1 >= length - (breakpoints - 1) ? 0 : prevIndex + 1
    );
  }, [length]);

  const handleResize = useCallback(() => {
    let newBreakpoints;
    if (window.innerWidth > 1280) {
      newBreakpoints = 4;
    } else if (window.innerWidth > 780) {
      newBreakpoints = 3;
    } else if (window.innerWidth > 480) {
      newBreakpoints = 2;
    } else {
      newBreakpoints = 1;
    }
    setBreakPoints(newBreakpoints);
  }, [breakpoints]);

  useEffect(() => {
    const infinite = setInterval(() => {
      handleNext();
    }, 4000);
    window.addEventListener('resize', handleResize);

    return () => {
      window.clearInterval(infinite);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const width = useMemo(() => {
    return 100 / breakpoints;
  }, [breakpoints, handleResize]);
  return { breakpoints, width, indexCarousel, handlePrev, handleNext };
};
