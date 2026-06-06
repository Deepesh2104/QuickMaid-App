import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QmLogo } from '../src/components/ui/QmLogo';
import { getInitialRoute } from '../src/lib/storage';
import { colors } from '../src/theme/colors';
import { layout, spacing } from '../src/theme/spacing';
import { type } from '../src/theme/typography';

SplashScreen.preventAutoHideAsync();

export default function SplashRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();

    const boot = async () => {
      await new Promise((r) => setTimeout(r, 2000));
      const route = await getInitialRoute();
      await SplashScreen.hideAsync();
      router.replace(route);
    };
    boot();
  }, [opacity, slide, router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Animated.View style={[styles.center, { opacity, transform: [{ translateY: slide }] }]}>
        <QmLogo size="lg" />
        <Text style={styles.tagline}>Trusted cleaning for Raipur homes</Text>
      </Animated.View>
      <Text style={styles.footer}>v1.0 · Demo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: layout.pad,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  tagline: {
    ...type.body,
    color: colors.muted,
    textAlign: 'center',
    maxWidth: 240,
    lineHeight: 24,
  },
  footer: {
    ...type.caption,
    color: colors.mutedLight,
    textAlign: 'center',
    paddingBottom: spacing.xxxl,
  },
});
