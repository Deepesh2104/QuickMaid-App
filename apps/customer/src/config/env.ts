import Constants from 'expo-constants';

export type AppEnv = 'development' | 'test' | 'beta' | 'production';

export function getAppEnv(): AppEnv {
  const raw = Constants.expoConfig?.extra?.appEnv as string | undefined;
  if (raw === 'test' || raw === 'beta' || raw === 'production') return raw;
  return 'development';
}

export function getApiBaseUrl(): string {
  return (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ?? '';
}

export function getRazorpayKeyId(): string {
  return (Constants.expoConfig?.extra?.razorpayKeyId as string | undefined) ?? 'rzp_test_QuickMaid';
}

export function getGooglePlacesKey(): string {
  return (Constants.expoConfig?.extra?.googlePlacesKey as string | undefined) ?? '';
}

export function getSentryDsn(): string {
  return (Constants.expoConfig?.extra?.sentryDsn as string | undefined) ?? '';
}

export function isProductionEnv(): boolean {
  return getAppEnv() === 'production';
}
