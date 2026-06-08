import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HOME_IMAGES } from '../constants/unsplash.images';
import { HomePhoto } from './HomePhoto';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function HomeRebookCard() {
  return (
    <Pressable
      style={styles.wrap}
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
      accessibilityRole="button"
      accessibilityLabel="Rebook Regular Cleaning for 149 rupees"
    >
      <HomePhoto
        uri={HOME_IMAGES.rebook}
        style={styles.photo}
        overlay="dark"
        borderRadius={radius.xl}
        tint={colors.primaryLight}
      />
      <View style={styles.content}>
        <View style={styles.left}>
          <View style={styles.icon}>
            <Ionicons name="refresh-circle" size={22} color={colors.primary} />
          </View>
          <View style={styles.text}>
            <Text style={styles.kicker}>BOOK AGAIN</Text>
            <Text style={styles.title}>Regular Cleaning</Text>
            <Text style={styles.sub}>Last visit 5 days ago · ₹149</Text>
          </View>
        </View>
        <View style={styles.cta}>
          <Text style={styles.ctaText}>Book</Text>
          <Ionicons name="arrow-forward" size={14} color={colors.white} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: layout.pad,
    marginBottom: spacing.xl,
    borderRadius: radius.xl,
    overflow: 'hidden',
    minHeight: 88,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  photo: {
    ...StyleSheet.absoluteFill,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.92)',
    margin: spacing.sm,
    borderRadius: radius.lg,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, minWidth: 0 },
  kicker: {
    fontFamily: fonts.semiBold,
    fontSize: 9,
    letterSpacing: 0.8,
    color: colors.primary,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.ink,
    marginTop: 2,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  ctaText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.white,
  },
});
