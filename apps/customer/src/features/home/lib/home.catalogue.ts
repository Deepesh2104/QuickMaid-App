import { HOME_SERVICES, type ServiceItem } from '@/constants/services';

import type { HomeSortOption } from '../components/HomeServiceFilterSheet';

export interface CatalogueFilters {
  category: string;
  query: string;
  sort: HomeSortOption;
}

export interface CatalogueLinkOptions {
  category?: string;
  q?: string;
  sort?: HomeSortOption;
}

/** Deep link into full catalogue screen (search / filter lives there). */
export function buildCatalogueHref({
  category = 'all',
  q = '',
  sort = 'popular',
}: CatalogueLinkOptions = {}): string {
  const params = new URLSearchParams();
  params.set('category', category);
  if (q) params.set('q', q);
  params.set('sort', sort);
  return `/catalogue?${params.toString()}`;
}

export function filterAndSortServices({ category, query, sort }: CatalogueFilters): ServiceItem[] {
  let list = HOME_SERVICES;
  if (category !== 'all') list = list.filter((s) => s.category === category);
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.desc?.toLowerCase().includes(q) ?? false) ||
        s.category.includes(q),
    );
  }
  const priceNum = (p: string) => parseInt(p.replace(/\D/g, ''), 10) || 0;
  const sorted = [...list];
  if (sort === 'price_low') sorted.sort((a, b) => priceNum(a.price) - priceNum(b.price));
  else if (sort === 'price_high') sorted.sort((a, b) => priceNum(b.price) - priceNum(a.price));
  else if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
  return sorted;
}
