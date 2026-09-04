import { useCallback, useEffect, useState } from 'react';

import { isBrowser } from '../utils/browser';

export interface UseUrlPaginationOptions {
  pageParam?: string;
  pageSizeParam?: string;
  initialPage?: number;
  initialPageSize?: number;
}

export interface UseUrlPaginationResult {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

function readIntParam(searchParams: URLSearchParams, key: string, fallback: number): number {
  const raw = searchParams.get(key);
  const parsed = raw === null ? NaN : Number(raw);
  const value = Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
  return value;
}

export function useUrlPagination({
  pageParam = 'page',
  pageSizeParam = 'pageSize',
  initialPage = 1,
  initialPageSize = 10,
}: UseUrlPaginationOptions = {}): UseUrlPaginationResult {
  const readFromUrl = useCallback((): [number, number] => {
    if (!isBrowser()) return [initialPage, initialPageSize];
    const searchParams = new URLSearchParams(window.location.search);
    return [
      readIntParam(searchParams, pageParam, initialPage),
      readIntParam(searchParams, pageSizeParam, initialPageSize),
    ];
  }, [pageParam, pageSizeParam, initialPage, initialPageSize]);

  const [[page, pageSize], setPagination] = useState<[number, number]>(readFromUrl);

  useEffect(() => {
    if (!isBrowser()) return;
    const url = new URL(window.location.href);
    url.searchParams.set(pageParam, String(page));
    url.searchParams.set(pageSizeParam, String(pageSize));
    window.history.replaceState(window.history.state, '', url);
  }, [page, pageSize, pageParam, pageSizeParam]);

  const setPage = useCallback((nextPage: number) => {
    setPagination(([, currentPageSize]) => [Math.max(nextPage, 1), currentPageSize]);
  }, []);

  const setPageSize = useCallback((nextPageSize: number) => {
    setPagination(() => [1, Math.max(nextPageSize, 1)]);
  }, []);

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    nextPage: () => setPage(page + 1),
    prevPage: () => setPage(page - 1),
  };
}
