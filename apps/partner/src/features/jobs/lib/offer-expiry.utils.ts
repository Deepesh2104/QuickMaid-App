import { MANUAL_ACCEPT_DECLINE_TEST_IDS } from '@/constants/demo';
/** Demo: 3 min window (prod FSD: 15 min). Test cards: 90 sec. */
export const DEMO_OFFER_EXPIRY_MS = 3 * 60 * 1000;
export const TEST_OFFER_EXPIRY_MS = 90 * 1000;

function baseJobId(jobId: string): string {
  return jobId.replace(/_r\d+$/, '');
}

export function offerWindowMsForJob(jobId: string): number {
  const base = baseJobId(jobId);
  if (MANUAL_ACCEPT_DECLINE_TEST_IDS.includes(base as (typeof MANUAL_ACCEPT_DECLINE_TEST_IDS)[number])) {
    return TEST_OFFER_EXPIRY_MS;
  }
  return DEMO_OFFER_EXPIRY_MS;
}

/** UI copy for demo countdown (actual timer uses DEMO_OFFER_EXPIRY_MS). */
export const OFFER_WINDOW_LABEL_MINUTES = DEMO_OFFER_EXPIRY_MS / 60_000;

export function offerDeadlineMs(jobId: string, listedAtMs: number): number {
  return listedAtMs + offerWindowMsForJob(jobId);
}

export function offerSecondsLeft(jobId: string, listedAtMs: number, now = Date.now()): number {
  return Math.max(0, Math.ceil((offerDeadlineMs(jobId, listedAtMs) - now) / 1000));
}

export function isOfferExpired(jobId: string, listedAtMs: number, now = Date.now()): boolean {
  return now >= offerDeadlineMs(jobId, listedAtMs);
}

export function formatOfferCountdown(secondsLeft: number): string {
  if (secondsLeft <= 0) return '0:00';
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
