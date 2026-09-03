import { useEffect } from 'react';

import { safeWindow } from '../utils/browser';

export function useEventListener<K extends keyof WindowEventMap>(
  event: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: Window | Document,
) {
  useEffect(() => {
    const target = element ?? safeWindow();
    if (!target) return;

    target.addEventListener(event, handler as EventListener);
    return () => target.removeEventListener(event, handler as EventListener);
  }, [event, handler, element]);
}
