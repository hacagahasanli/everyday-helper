import { describe, it, expect } from 'vitest';

import { renderHook, act } from '@testing-library/react';

import { useListPagination } from '../../hooks/useListPagination';

describe('useListPagination', () => {
  it('should return the first page immediately when no options are given', () => {
    const items = Array.from({ length: 25 }, (_, index) => index);

    const { result } = renderHook(() => useListPagination(items));

    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.pageCount).toBe(3);
    expect(result.current.paginatedItems).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(result.current.hasPrevPage).toBe(false);
    expect(result.current.hasNextPage).toBe(true);
  });

  it('should slice the correct page when nextPage is called', () => {
    const items = Array.from({ length: 25 }, (_, index) => index);

    const { result } = renderHook(() => useListPagination(items, { pageSize: 10 }));

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.page).toBe(2);
    expect(result.current.paginatedItems).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
  });

  it('should clamp page to pageCount when setPage exceeds the last page', () => {
    const items = Array.from({ length: 5 }, (_, index) => index);

    const { result } = renderHook(() => useListPagination(items, { pageSize: 10 }));

    act(() => {
      result.current.setPage(99);
    });

    expect(result.current.page).toBe(1);
    expect(result.current.hasNextPage).toBe(false);
  });

  it('should not go below page 1 when prevPage is called on the first page', () => {
    const items = Array.from({ length: 5 }, (_, index) => index);

    const { result } = renderHook(() => useListPagination(items));

    act(() => {
      result.current.prevPage();
    });

    expect(result.current.page).toBe(1);
    expect(result.current.hasPrevPage).toBe(false);
  });

  it('should reset to page 1 when pageSize changes', () => {
    const items = Array.from({ length: 25 }, (_, index) => index);

    const { result } = renderHook(() => useListPagination(items, { pageSize: 10 }));

    act(() => {
      result.current.setPage(3);
    });
    expect(result.current.page).toBe(3);

    act(() => {
      result.current.setPageSize(5);
    });

    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(5);
    expect(result.current.pageCount).toBe(5);
  });

  it('should return at least one page when items is empty', () => {
    const { result } = renderHook(() => useListPagination<number>([]));

    expect(result.current.pageCount).toBe(1);
    expect(result.current.paginatedItems).toEqual([]);
    expect(result.current.hasNextPage).toBe(false);
  });
});
