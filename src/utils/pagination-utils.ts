export interface GetRowNumberParams {
  index: number;
  page?: number;
  size?: number;
  totalCount?: number;
  defaultSize?: number;
}

/**
 * Returns the display number of a table row on a paginated list (pages start at 1).
 * With `totalCount`, rows are numbered in descending order (newest = highest number);
 * without it, they are numbered ascending from 1.
 * A missing/invalid `page` falls back to 1, a missing/invalid `size` to `defaultSize`.
 *
 * @param params - Row `index` on the current page, `page`, `size`, optional `totalCount`
 *   and `defaultSize` (default: 10)
 * @returns Row number
 *
 * @example
 * getRowNumber({ index: 0, page: 2, size: 10 }); // 11
 * getRowNumber({ index: 0, page: 2, size: 10, totalCount: 23 }); // 13
 */
export const getRowNumber = ({
  index,
  page,
  size,
  totalCount,
  defaultSize = 10,
}: GetRowNumberParams): number => {
  const currentPage = page && page > 0 ? page : 1;
  const pageSize = size && size > 0 ? size : defaultSize;
  const positionFromStart = (currentPage - 1) * pageSize + index;

  if (totalCount === undefined) return positionFromStart + 1;

  return totalCount - positionFromStart;
};
