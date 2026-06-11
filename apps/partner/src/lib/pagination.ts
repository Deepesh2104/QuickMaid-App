export const REQUESTS_PAGE_SIZE = 3;
export const SCHEDULE_PAGE_SIZE = 3;
export const EARNINGS_PAGE_SIZE = 4;
export const HISTORY_PAGE_SIZE = 5;

export function paginateSlice<T>(items: T[], page: number, pageSize: number): T[] {
  const end = page * pageSize;
  return items.slice(0, end);
}

export function totalPages(count: number, pageSize: number): number {
  if (count === 0) return 1;
  return Math.ceil(count / pageSize);
}

export function showingLabel(visible: number, total: number): string {
  if (total === 0) return '0 of 0';
  return `${Math.min(visible, total)} of ${total}`;
}
