import { useCallback, useEffect, useMemo, useState } from 'react';

import { paginateSlice, showingLabel, totalPages } from '@/lib/pagination';

export function useListPagination<T>(items: T[], pageSize: number, resetKey?: string | number) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [resetKey, items.length]);

  const visibleItems = useMemo(() => paginateSlice(items, page, pageSize), [items, page, pageSize]);
  const pages = useMemo(() => totalPages(items.length, pageSize), [items.length, pageSize]);
  const hasMore = visibleItems.length < items.length;
  const showing = showingLabel(visibleItems.length, items.length);

  const loadMore = useCallback(() => {
    setPage((p) => Math.min(pages, p + 1));
  }, [pages]);

  const reset = useCallback(() => setPage(1), []);

  return { visibleItems, page, pages, hasMore, loadMore, reset, showing, total: items.length };
}
