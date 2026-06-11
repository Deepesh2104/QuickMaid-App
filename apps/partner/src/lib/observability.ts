import Constants from 'expo-constants';

let initialized = false;

function getSentryDsn(): string {
  return (Constants.expoConfig?.extra?.sentryDsn as string | undefined) ?? '';
}

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
