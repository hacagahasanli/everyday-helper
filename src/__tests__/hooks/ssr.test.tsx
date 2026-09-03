// @vitest-environment node
import { describe, it, expect } from 'vitest';

import React, { useRef } from 'react';
import { renderToString } from 'react-dom/server';

import { useOutsideClick } from '../../hooks/useOutsideClick';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { useEventListener } from '../../hooks/useEventListener';

// This file runs with no DOM globals at all (Node environment, not happy-dom),
// so it reproduces exactly what a Next.js / Remix server render sees.
describe('SSR safety', () => {
  it('useOutsideClick does not throw when rendered on the server', () => {
    function Comp() {
      const ref = useRef<HTMLDivElement>(null);
      useOutsideClick(ref, () => {});
      return React.createElement('div', { ref }, 'content');
    }

    expect(() => renderToString(React.createElement(Comp))).not.toThrow();
  });

  it('useEscapeKey does not throw when rendered on the server', () => {
    function Comp() {
      useEscapeKey({ onEscape: () => {} });
      return React.createElement('div', null, 'content');
    }

    expect(() => renderToString(React.createElement(Comp))).not.toThrow();
  });

  it('useEventListener does not throw with the default window target', () => {
    function Comp() {
      useEventListener('resize', () => {});
      return React.createElement('div', null, 'content');
    }

    expect(() => renderToString(React.createElement(Comp))).not.toThrow();
  });
});
