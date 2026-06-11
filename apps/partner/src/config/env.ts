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

export function isProductionEnv(): boolean {
  return getAppEnv() === 'production';
}
