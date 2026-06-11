import type { ConfigContext, ExpoConfig } from 'expo/config';

type AppEnv = 'development' | 'test' | 'beta' | 'production';

function resolveEnv(): AppEnv {
  const raw = process.env.EXPO_PUBLIC_APP_ENV ?? 'development';
  if (raw === 'test' || raw === 'beta' || raw === 'production') return raw;
  return 'development';
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const appEnv = resolveEnv();
  const isStore = appEnv === 'production' || appEnv === 'beta';
  const suffix = isStore ? '' : appEnv === 'development' ? '.dev' : `.${appEnv}`;

  const names: Record<AppEnv, string> = {
    development: 'QM Partner Dev',
    test: 'QM Partner Test',
    beta: 'QuickMaid Partner Beta',
    production: 'QuickMaid Partner',
  };

  return {
    ...config,
    name: names[appEnv],
    slug: 'quickmaid-partner',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    scheme: 'quickmaid-partner',
    userInterfaceStyle: 'light',
    ios: {
      supportsTablet: false,
      bundleIdentifier: `in.quickmaid.partner${suffix}`,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#084F4A',
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundImage: './assets/android-icon-background.png',
        monochromeImage: './assets/android-icon-monochrome.png',
      },
      package: `in.quickmaid.partner${suffix}`,
      predictiveBackGestureEnabled: false,
    },
    plugins: [
      'expo-router',
      'expo-font',
      [
        'expo-splash-screen',
        {
          backgroundColor: '#000806',
          image: './assets/splash-icon.png',
          imageWidth: 180,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      appEnv,
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? '',
      router: {},
    },
  };
};
