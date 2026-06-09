import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/app';

import { COUPON_CATALOG, findCouponDefinition } from './coupon.catalog';
import { definitionToSaved } from './coupon.utils';
import type { SavedCoupon } from '../types/coupon.types';

async function readCoupons(): Promise<SavedCoupon[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.couponWallet);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SavedCoupon[];
  } catch {
    return [];
  }
}

async function writeCoupons(rows: SavedCoupon[]) {
  await AsyncStorage.setItem(STORAGE_KEYS.couponWallet, JSON.stringify(rows.slice(0, 40)));
}

function refreshStatuses(rows: SavedCoupon[]): SavedCoupon[] {
  const now = Date.now();
  return rows.map((c) => {
    if (c.status === 'used') return c;
    if (new Date(c.expiresAt).getTime() < now) return { ...c, status: 'expired' as const };
    return c;
  });
}

async function seedCoupons() {
  const now = Date.now();
  const seedCodes = ['FIRST20', 'QM50', 'CLEAN15'];
  const seed = seedCodes
    .map((code) => definitionToSaved(findCouponDefinition(code), now - 86400000))
    .filter((c): c is SavedCoupon => Boolean(c));
  await writeCoupons(seed);
  return seed;
}

export async function listCouponWallet(): Promise<SavedCoupon[]> {
  const rows = refreshStatuses(await readCoupons());
  if (rows.length) {
    await writeCoupons(rows);
    return rows;
  }
  return seedCoupons();
}

export async function redeemCouponCode(code: string): Promise<{ ok: true; coupon: SavedCoupon } | { ok: false; error: string }> {
  const def = findCouponDefinition(code);
  if (!def) return { ok: false, error: 'Invalid coupon code.' };

  const rows = refreshStatuses(await readCoupons());
  const existing = rows.find((c) => c.code === def.code);
  if (existing?.status === 'active') {
    return { ok: false, error: 'Coupon already in your wallet.' };
  }

  const coupon = definitionToSaved(def);
  if (!coupon) return { ok: false, error: 'Could not save coupon.' };

  const next = [coupon, ...rows.filter((c) => c.code !== def.code)];
  await writeCoupons(next);
  return { ok: true, coupon };
}

export async function markCouponUsed(code: string) {
  const rows = refreshStatuses(await readCoupons());
  const idx = rows.findIndex((c) => c.code === code);
  if (idx < 0) return;
  rows[idx] = { ...rows[idx], status: 'used', usedAt: new Date().toISOString() };
  await writeCoupons(rows);
}

export async function setPendingCheckoutCoupon(code?: string) {
  if (!code) {
    await AsyncStorage.removeItem(STORAGE_KEYS.pendingCoupon);
    return;
  }
  await AsyncStorage.setItem(STORAGE_KEYS.pendingCoupon, code.toUpperCase());
}

export async function consumePendingCheckoutCoupon(): Promise<string | null> {
  const code = await AsyncStorage.getItem(STORAGE_KEYS.pendingCoupon);
  if (!code) return null;
  await AsyncStorage.removeItem(STORAGE_KEYS.pendingCoupon);
  return code;
}

export function listPublicOffers() {
  return COUPON_CATALOG;
}
