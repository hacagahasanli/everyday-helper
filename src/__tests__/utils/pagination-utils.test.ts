import { describe, it, expect } from 'vitest';

import { getRowNumber } from '../../utils/pagination-utils';

describe('getRowNumber', () => {
  it('numbers rows ascending from 1 without totalCount', () => {
    expect(getRowNumber({ index: 0, page: 1, size: 10 })).toBe(1);
    expect(getRowNumber({ index: 9, page: 1, size: 10 })).toBe(10);
    expect(getRowNumber({ index: 0, page: 2, size: 10 })).toBe(11);
  });

  it('numbers rows descending from totalCount', () => {
    expect(getRowNumber({ index: 0, page: 1, size: 10, totalCount: 23 })).toBe(23);
    expect(getRowNumber({ index: 9, page: 1, size: 10, totalCount: 23 })).toBe(14);
    expect(getRowNumber({ index: 0, page: 2, size: 10, totalCount: 23 })).toBe(13);
  });

  it('falls back to the first page for a missing or invalid page', () => {
    expect(getRowNumber({ index: 0, size: 10, totalCount: 3 })).toBe(3);
    expect(getRowNumber({ index: 2, page: 0, size: 10, totalCount: 3 })).toBe(1);
  });

  it('falls back to defaultSize for a missing or invalid size', () => {
    expect(getRowNumber({ index: 0, page: 2, totalCount: 30 })).toBe(20);
    expect(getRowNumber({ index: 0, page: 2, size: 0, totalCount: 30 })).toBe(20);
    expect(getRowNumber({ index: 0, page: 2, defaultSize: 25 })).toBe(26);
  });
});
