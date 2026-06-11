import { getSentryDsn } from '@/config/env';

let initialized = false;

/** Optional Sentry — set EXPO_PUBLIC_SENTRY_DSN + install @sentry/react-native to enable. */
export async function initObservability(): Promise<void> {
  if (initialized) return;
  initialized = true;
  if (!getSentryDsn()) return;
  if (__DEV__) {
    console.info('[observability] EXPO_PUBLIC_SENTRY_DSN set — add @sentry/react-native to activate');
  }
}

export function logError(scope: string, error: unknown): void {
  if (__DEV__) {
    console.error(`[${scope}]`, error);
  }
}
