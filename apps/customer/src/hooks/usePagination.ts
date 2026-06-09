import { useEffect, useMemo, useState } from 'react';

export function usePagination<T>(items: T[], pageSize: number, resetKey?: string | number) {
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [items.length, pageSize, resetKey]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [page, totalPages]);

  const start = safePage * pageSize;
  const end = Math.min(start + pageSize, items.length);

  const slice = useMemo(() => items.slice(start, end), [items, start, end]);

  return {
    page: safePage,
    setPage,
    totalPages,
    start,
    end,
    slice,
    total: items.length,
    canPrev: safePage > 0,
    canNext: safePage < totalPages - 1,
    hasPagination: items.length > pageSize,
  };
}
