import { useCallback } from 'react';

import { safeDocument } from '../utils/browser';

import EventTypes from '../constants/EventTypes';

import { useEventListener } from './useEventListener';

interface UseEscapeKeyProps {
  enabled?: boolean;
  onEscape: () => void;
  preventDefault?: boolean;
}

export const useEscapeKey = ({
  onEscape,
  enabled = true,
  preventDefault = false,
}: UseEscapeKeyProps) => {
  const handler = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      if (event.key === EventTypes.ESCAPE) {
        if (preventDefault) {
          event.preventDefault();
          event.stopPropagation();
        }
        onEscape();
      }
    },
    [enabled, onEscape, preventDefault],
  );

  useEventListener('keydown', handler, safeDocument());
};
