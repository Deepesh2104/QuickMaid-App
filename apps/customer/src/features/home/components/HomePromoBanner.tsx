import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HOME_IMAGES } from '../constants/unsplash.images';
import { HomePhoto } from './HomePhoto';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function HomePromoBanner() {
  return (
    <Pressable
      style={styles.wrap}
      onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
      accessibilityRole="button"
      accessibilityLabel="20 percent off first booking, code FIRST20"
    >
      <HomePhoto uri={HOME_IMAGES.promo} style={styles.photo} overlay="dark" tint={colors.primaryLight} />
      <LinearGradient
        colors={['rgba(6,63,59,0.75)', 'rgba(11,110,103,0.85)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <View style={styles.badge}>
          <Ionicons name="pricetag" size={13} color={colors.primaryDark} />
          <Text style={styles.badgeText}>FIRST BOOKING OFFER</Text>
        </View>
        <Text style={styles.title}>Flat 20% off</Text>
        <Text style={styles.sub}>Limited slots in Raipur · Book before midnight</Text>
        <View style={styles.codeRow}>
          <Text style={styles.code}>FIRST20</Text>
          <Ionicons name="copy-outline" size={15} color="rgba(255,255,255,0.9)" />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: layout.pad,
    marginBottom: spacing.xxl,
    borderRadius: radius.xl,
    overflow: 'hidden',
    minHeight: 152,
  },
  photo: {
    ...StyleSheet.absoluteFill,
  },
  content: {
    padding: spacing.xl,
    gap: 6,
    zIndex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 4,
  },
  badgeText: {
    fontFamily: fonts.semiBold,
    fontSize: 9,
    letterSpacing: 0.6,
    color: colors.primaryDark,
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 26,
    color: colors.white,
    letterSpacing: -0.6,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 18,
    maxWidth: 250,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  code: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    letterSpacing: 1.4,
  },
});
