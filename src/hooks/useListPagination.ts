import { useMemo, useState } from 'react';

export interface UseListPaginationOptions {
  initialPage?: number;
  pageSize?: number;
}

export interface UseListPaginationResult<T> {
  paginatedItems: T[];
  page: number;
  pageSize: number;
  pageCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

export function useListPagination<T>(
  items: T[],
  { initialPage = 1, pageSize: initialPageSize = 10 }: UseListPaginationOptions = {},
): UseListPaginationResult<T> {
  const [rawPage, setRawPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(Math.max(rawPage, 1), pageCount);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  function setPage(nextPage: number) {
    setRawPage(Math.min(Math.max(nextPage, 1), pageCount));
  }

  function setPageSize(nextPageSize: number) {
    setPageSizeState(Math.max(nextPageSize, 1));
    setRawPage(1);
  }

  return {
    paginatedItems,
    page,
    pageSize,
    pageCount,
    hasNextPage: page < pageCount,
    hasPrevPage: page > 1,
    setPage,
    setPageSize,
    nextPage: () => setPage(page + 1),
    prevPage: () => setPage(page - 1),
  };
}
