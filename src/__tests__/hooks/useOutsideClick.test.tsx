import { describe, it, expect, vi } from 'vitest';

import { useRef } from 'react';
import { render } from '@testing-library/react';

import { useOutsideClick } from '../../hooks/useOutsideClick';

function TestComponent({ onClickOutside }: { onClickOutside: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, onClickOutside);
  return (
    <div>
      <div data-testid="inside" ref={ref}>
        inside
      </div>
      <div data-testid="outside">outside</div>
    </div>
  );
}

describe('useOutsideClick', () => {
  it('does not fire when clicking inside the ref', () => {
    const onClickOutside = vi.fn();
    const { getByTestId } = render(<TestComponent onClickOutside={onClickOutside} />);

    getByTestId('inside').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(onClickOutside).not.toHaveBeenCalled();
  });

  it('fires when clicking outside the ref', () => {
    const onClickOutside = vi.fn();
    const { getByTestId } = render(<TestComponent onClickOutside={onClickOutside} />);

    getByTestId('outside').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(onClickOutside).toHaveBeenCalledTimes(1);
  });

  it('stops listening after unmount', () => {
    const onClickOutside = vi.fn();
    const { getByTestId, unmount } = render(<TestComponent onClickOutside={onClickOutside} />);
    const outside = getByTestId('outside');

    unmount();
    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(onClickOutside).not.toHaveBeenCalled();
  });
});
