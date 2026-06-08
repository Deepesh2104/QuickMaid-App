import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

import {
  AppSplashScreen,
  SPLASH_DELAY_MS,
  SPLASH_EXIT_MS,
} from '../src/components/splash/AppSplashScreen';
import { getInitialRoute } from '../src/lib/storage';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function SplashRoute() {
  const router = useRouter();
  const fadeOut = useRef(new Animated.Value(1)).current;
  const navigated = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });

      if (cancelled) return;

      await SplashScreen.hideAsync();

      const visibleAt = Date.now();
      const route = await getInitialRoute();

      const elapsed = Date.now() - visibleAt;
      const waitMore = Math.max(0, SPLASH_DELAY_MS - elapsed);
      await new Promise((r) => setTimeout(r, waitMore));

      if (cancelled || navigated.current) return;

      Animated.timing(fadeOut, {
        toValue: 0,
        duration: SPLASH_EXIT_MS,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished || navigated.current) return;
        navigated.current = true;
        router.replace(route);
      });
    };

    boot();

    return () => {
      cancelled = true;
    };
  }, [fadeOut, router]);

  return (
    <Animated.View style={{ flex: 1, opacity: fadeOut }}>
      <AppSplashScreen />
    </Animated.View>
  );
}
