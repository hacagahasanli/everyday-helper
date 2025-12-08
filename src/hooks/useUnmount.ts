import { useEffect, useRef } from 'react';

export function useUnmount(fn: () => void): void {
  const fnRef = useRef(fn);

  fnRef.current = fn;

  useEffect(
    () => () => {
      fnRef.current();
    },
    [],
  );
}
