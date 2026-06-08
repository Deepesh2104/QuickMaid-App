import { PLANS } from '@/constants/demo';

export type PlusPlanId = 'plus' | 'flex' | 'onetime';

export function getPlanById(id: string) {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

export function parsePlanPrice(price: string): number {
  return parseInt(price.replace(/\D/g, ''), 10) || 0;
}

export function getPlanVisits(planId: string): number {
  if (planId === 'plus') return 12;
  if (planId === 'flex') return 6;
  return 0;
}

export function isSubscriptionPlan(planId: string): boolean {
  return planId === 'plus' || planId === 'flex';
}
