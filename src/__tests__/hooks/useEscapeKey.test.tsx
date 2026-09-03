import { describe, it, expect, vi } from 'vitest';

import { render } from '@testing-library/react';

import { useEscapeKey } from '../../hooks/useEscapeKey';

function TestComponent({ onEscape, enabled }: { onEscape: () => void; enabled?: boolean }) {
  useEscapeKey({ onEscape, enabled });
  return <div>content</div>;
}

describe('useEscapeKey', () => {
  it('fires onEscape when Escape is pressed', () => {
    const onEscape = vi.fn();
    render(<TestComponent onEscape={onEscape} />);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it('does not fire for other keys', () => {
    const onEscape = vi.fn();
    render(<TestComponent onEscape={onEscape} />);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(onEscape).not.toHaveBeenCalled();
  });

  it('does not fire when disabled', () => {
    const onEscape = vi.fn();
    render(<TestComponent onEscape={onEscape} enabled={false} />);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(onEscape).not.toHaveBeenCalled();
  });

  it('stops listening after unmount', () => {
    const onEscape = vi.fn();
    const { unmount } = render(<TestComponent onEscape={onEscape} />);

    unmount();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(onEscape).not.toHaveBeenCalled();
  });
});
