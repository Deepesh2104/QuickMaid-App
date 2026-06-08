import { CATEGORIES, FEATURED_SERVICES, HOME_SERVICES, type ServiceItem } from '@/constants/services';

export function getServiceById(id: string): ServiceItem | undefined {
  return HOME_SERVICES.find((s) => s.id === id) ?? FEATURED_SERVICES.find((s) => s.id === id);
}

export function getCategoryLabel(categoryId: string): string {
  return CATEGORIES.find((c) => c.id === categoryId)?.label ?? 'Service';
}

export function getSimilarServices(service: ServiceItem, limit = 4): ServiceItem[] {
  return HOME_SERVICES.filter((s) => s.id !== service.id && s.category === service.category).slice(0, limit);
}

export function parseServicePrice(price: string): number {
  return parseInt(price.replace(/\D/g, ''), 10) || 0;
}

export function plusMemberPrice(priceNum: number): number {
  return Math.round(priceNum * 0.9);
}
