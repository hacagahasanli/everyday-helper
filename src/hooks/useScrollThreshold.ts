import { useState, useEffect } from 'react';

export const useScrollThreshold = (threshold: number = 300): boolean => {
  const [isReached, setIsReached] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.scrollTop > threshold) {
        setIsReached(true);
      }
    };

    document.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    return () => document.removeEventListener('scroll', handleScroll, { capture: true });
  }, [threshold]);

  return isReached;
};