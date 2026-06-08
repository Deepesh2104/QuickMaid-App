import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { HOME_IMAGES } from '../constants/unsplash.images';
import { HomePhoto } from './HomePhoto';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface HomeHeaderProps {
  paddingTop: number;
  firstName?: string;
  city: string;
  locality?: string;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function HomeHeader({ paddingTop, firstName, city, locality }: HomeHeaderProps) {
  const line = firstName ? `${getGreeting()}, ${firstName}` : getGreeting();
  const address = locality ? `${locality}, ${city}` : city;

  return (
    <View style={styles.wrap}>
      <HomePhoto uri={HOME_IMAGES.hero} style={styles.photo} overlay="hero" />

      <View style={[styles.content, { paddingTop: paddingTop + 8 }]}>
        <View style={styles.topRow}>
          <Pressable
            style={styles.locBtn}
            onPress={() => Haptics.selectionAsync()}
            accessibilityRole="button"
            accessibilityLabel={`Location ${address}`}
          >
            <View style={styles.locIcon}>
              <Ionicons name="location" size={16} color={colors.white} />
            </View>
            <View style={styles.locText}>
              <Text style={styles.locLabel}>DELIVER TO</Text>
              <View style={styles.cityRow}>
                <Text style={styles.city}>{city}</Text>
                <Ionicons name="chevron-down" size={13} color="rgba(255,255,255,0.9)" />
              </View>
            </View>
          </Pressable>

          <Pressable
            style={styles.bell}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            accessibilityLabel="Notifications"
            accessibilityRole="button"
          >
            <Ionicons name="notifications-outline" size={20} color={colors.white} />
            <View style={styles.dot} />
          </Pressable>
        </View>

        <View style={styles.copy}>
          <Text style={styles.greeting}>{line}</Text>
          <Text style={styles.headline}>Sparkling home, one tap away</Text>
        </View>
      </View>
    </View>
  );
}

const fill: ViewStyle = StyleSheet.absoluteFill;

const styles = StyleSheet.create({
  wrap: {
    minHeight: 220,
    paddingBottom: 48,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  photo: {
    ...fill,
  },
  content: {
    paddingHorizontal: layout.pad,
    zIndex: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  locBtn: { flex: 1, flexDirection: 'row', gap: spacing.sm, minWidth: 0 },
  locIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locText: { flex: 1, minWidth: 0 },
  locLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 9,
    letterSpacing: 0.8,
    color: 'rgba(255,255,255,0.7)',
  },
  cityRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  city: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
  },
  bell: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FBBF24',
    borderWidth: 1.5,
    borderColor: '#0B6E67',
  },
  copy: { gap: spacing.sm },
  greeting: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.88)',
  },
  headline: {
    fontFamily: fonts.extraBold,
    fontSize: 26,
    color: colors.white,
    letterSpacing: -0.6,
    lineHeight: 32,
  },
});
