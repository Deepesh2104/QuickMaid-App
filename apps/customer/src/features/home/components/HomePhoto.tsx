import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, type ViewStyle } from 'react-native';

import type { ImagePair } from '../constants/unsplash.images';
import { colors } from '@/theme/colors';

interface HomePhotoProps {
  /** Single URL or primary+fallback pair */
  uri: string | ImagePair;
  style?: ViewStyle;
  overlay?: 'dark' | 'bottom' | 'hero' | 'none';
  borderRadius?: number;
  tint?: string;
}

const OVERLAYS = {
  dark: ['rgba(0,0,0,0.12)', 'rgba(0,0,0,0.48)'] as const,
  bottom: ['transparent', 'rgba(0,0,0,0.42)'] as const,
  hero: [
    'rgba(2,26,24,0.55)',
    'rgba(6,63,59,0.72)',
    'rgba(11,110,103,0.5)',
    'rgba(255,255,255,0.35)',
    'rgba(255,255,255,0.98)',
  ] as const,
  none: null,
};

function resolvePair(uri: string | ImagePair): ImagePair {
  if (typeof uri === 'string') {
    return { primary: uri, fallback: uri };
  }
  return uri;
}

export function HomePhoto({
  uri,
  style,
  overlay = 'none',
  borderRadius = 0,
  tint = colors.primaryLight,
}: HomePhotoProps) {
  const pair = resolvePair(uri);
  const [src, setSrc] = useState(pair.primary);
  const [loading, setLoading] = useState(true);
  const gradient = OVERLAYS[overlay];

  useEffect(() => {
    setSrc(pair.primary);
    setLoading(true);
    const timer = setTimeout(() => {
      setSrc((current) => {
        if (current === pair.primary) return pair.fallback;
        return current;
      });
    }, 6000);
    return () => clearTimeout(timer);
  }, [pair.primary, pair.fallback]);

  return (
    <View style={[styles.wrap, { borderRadius, backgroundColor: tint }, style]}>
      {loading ? (
        <View style={[styles.loader, { borderRadius }]}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : null}

      <Image
        source={{ uri: src }}
        style={[StyleSheet.absoluteFill, { borderRadius }]}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={320}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          if (src !== pair.fallback) {
            setSrc(pair.fallback);
            setLoading(true);
          } else {
            setLoading(false);
          }
        }}
        accessibilityIgnoresInvertColors
      />

      {gradient ? (
        <LinearGradient
          colors={[...gradient]}
          locations={overlay === 'hero' ? [0, 0.28, 0.55, 0.78, 1] : undefined}
          style={[StyleSheet.absoluteFill, { borderRadius }]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
  },
  loader: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(232,237,239,0.6)',
    zIndex: 1,
  },
});
