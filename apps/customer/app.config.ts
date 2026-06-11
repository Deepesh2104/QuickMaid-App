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
    development: 'QuickMaid',
    test: 'QuickMaid',
    beta: 'QuickMaid',
    production: 'QuickMaid',
  };

  return {
    ...config,
    name: names[appEnv],
    slug: 'quickmaid-customer',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    scheme: 'quickmaid',
    userInterfaceStyle: 'light',
    ios: {
      supportsTablet: false,
      bundleIdentifier: `in.quickmaid.customer${suffix}`,
      infoPlist: {
        LSApplicationQueriesSchemes: [
          'upi',
          'tez',
          'gpay',
          'googlepay',
          'phonepe',
          'paytmmp',
          'paytm',
          'bhim',
          'amazonpay',
          'amazonpayin',
          'credpay',
          'cred',
          'mobikwik',
          'navipay',
          'navi',
          'jupiter',
          'jupitermoney',
          'supermoney',
        ],
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#0D9488',
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundImage: './assets/android-icon-background.png',
        monochromeImage: './assets/android-icon-monochrome.png',
      },
      package: `in.quickmaid.customer${suffix}`,
      predictiveBackGestureEnabled: false,
      // UPI intent queries — Expo types omit `queries` on Android
      queries: [
        { intent: { action: 'android.intent.action.VIEW', data: { scheme: 'upi' } } },
        { package: 'com.google.android.apps.nbu.paisa.user' },
        { package: 'com.phonepe.app' },
        { package: 'net.one97.paytm' },
        { package: 'in.org.npci.upiapp' },
        { package: 'in.amazon.mShop.android.shopping' },
        { package: 'com.dreamplug.androidapp' },
        { package: 'com.mobikwik_new' },
        { package: 'com.naviapp' },
        { package: 'money.jupiter' },
        { package: 'com.supermoney' },
      ],
    } as ExpoConfig['android'],
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
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
      'expo-image',
      'expo-sharing',
      'expo-local-authentication',
      'expo-secure-store',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      appEnv,
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? '',
      razorpayKeyId: process.env.EXPO_PUBLIC_RAZORPAY_KEY ?? 'rzp_test_QuickMaid',
      googlePlacesKey: process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY ?? '',
      sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN ?? '',
      router: {},
      eas: {
        projectId: 'ec741f3c-2a08-4ceb-863d-268107b6b9bf',
      },
    },
  };
};
