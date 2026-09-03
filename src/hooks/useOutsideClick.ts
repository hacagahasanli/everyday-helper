import { type RefObject, useCallback } from 'react';

import { safeDocument } from '../utils/browser';

import { useEventListener } from './useEventListener';

export function useOutsideClick(ref: RefObject<HTMLElement | null>, onClickOutside?: () => void) {
  const handler = useCallback(
    (event: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(event.target as Node)) {
        onClickOutside?.();
      }
    },
    [ref, onClickOutside],
  );

  useEventListener('mousedown', handler, safeDocument());
}
