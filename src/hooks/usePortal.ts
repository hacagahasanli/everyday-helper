import { useEffect, useRef } from 'react';

interface UsePortalOptions {
  id?: string;
}

const usePortal = ({ id }: UsePortalOptions = {}) => {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let parentElement: HTMLElement | null = null;

    if (id) parentElement = document.getElementById(id);

    const container = document.createElement('div');
    rootRef.current = container;

    /* if target exists, append there, otherwise to body */
    if (parentElement) {
      parentElement.appendChild(container);
    } else {
      document.body.appendChild(container);
    }

    return () => {
      container.remove();
    };
  }, [id]);

  return rootRef;
};

export default usePortal;
