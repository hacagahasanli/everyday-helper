import { describe, it, expect, beforeEach } from 'vitest';

import { renderHook, act } from '@testing-library/react';

import { useUrlPagination } from '../../hooks/useUrlPagination';

function setUrl(path: string) {
  window.history.pushState({}, '', path);
}

describe('useUrlPagination', () => {
  beforeEach(() => {
    setUrl('/list');
  });

  it('should default to page 1 and pageSize 10 when the URL has no query params', () => {
    const { result } = renderHook(() => useUrlPagination());

    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(10);
  });

  it('should read the initial page and pageSize from the URL', () => {
    setUrl('/list?page=3&pageSize=25');

    const { result } = renderHook(() => useUrlPagination());

    expect(result.current.page).toBe(3);
    expect(result.current.pageSize).toBe(25);
  });

  it('should fall back to defaults when a query param is invalid', () => {
    setUrl('/list?page=not-a-number&pageSize=-5');

    const { result } = renderHook(() => useUrlPagination({ initialPage: 2, initialPageSize: 15 }));

    expect(result.current.page).toBe(2);
    expect(result.current.pageSize).toBe(15);
  });

  it('should write the page to the URL when setPage is called', () => {
    const { result } = renderHook(() => useUrlPagination());

    act(() => {
      result.current.setPage(4);
    });

    expect(result.current.page).toBe(4);
    expect(new URLSearchParams(window.location.search).get('page')).toBe('4');
  });

  it('should reset to page 1 when setPageSize is called', () => {
    setUrl('/list?page=5&pageSize=10');
    const { result } = renderHook(() => useUrlPagination());

    act(() => {
      result.current.setPageSize(50);
    });

    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(50);
    expect(new URLSearchParams(window.location.search).get('page')).toBe('1');
    expect(new URLSearchParams(window.location.search).get('pageSize')).toBe('50');
  });

  it('should support custom param names', () => {
    setUrl('/list?p=2&size=30');

    const { result } = renderHook(() =>
      useUrlPagination({ pageParam: 'p', pageSizeParam: 'size' }),
    );

    expect(result.current.page).toBe(2);
    expect(result.current.pageSize).toBe(30);

    act(() => {
      result.current.nextPage();
    });

    expect(new URLSearchParams(window.location.search).get('p')).toBe('3');
  });

  it('should not go below page 1 when prevPage is called on the first page', () => {
    const { result } = renderHook(() => useUrlPagination());

    act(() => {
      result.current.prevPage();
    });

    expect(result.current.page).toBe(1);
  });
});
