import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function PlusValueBanner() {
  return (
    <View style={styles.wrap}>
      <LinearGradient colors={['#FFF8EE', '#FFFBF5', '#FFFFFF']} style={StyleSheet.absoluteFill} />
      <View style={styles.glow} />

      <View style={styles.top}>
        <View style={styles.badge}>
          <Ionicons name="diamond" size={14} color="#B54708" />
          <Text style={styles.badgeText}>Member savings</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>2,400+</Text>
          <Text style={styles.statLabel}>homes in Raipur</Text>
        </View>
      </View>

      <Text style={styles.headline}>
        Save <Text style={styles.headlineAccent}>20%</Text> on every clean
      </Text>
      <Text style={styles.sub}>
        Plus members pay just <Text style={styles.subBold}>₹100/visit</Text> vs ₹149 pay-as-you-go
      </Text>

      <View style={styles.pills}>
        <View style={styles.pill}>
          <Ionicons name="trending-down" size={12} color={colors.primaryDark} />
          <Text style={styles.pillText}>₹588 saved/mo</Text>
        </View>
        <View style={styles.pill}>
          <Ionicons name="shield-checkmark" size={12} color={colors.primaryDark} />
          <Text style={styles.pillText}>Cancel anytime</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: layout.pad,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    overflow: 'hidden',
    marginBottom: spacing.section,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(181,71,8,0.12)',
  },
  glow: {
    position: 'absolute',
    right: -30,
    top: -40,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(251,191,36,0.15)',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFAEB',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(181,71,8,0.15)',
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: '#B54708',
    letterSpacing: 0.3,
  },
  stat: { alignItems: 'flex-end' },
  statValue: {
    fontFamily: fonts.extraBold,
    fontSize: 14,
    color: colors.ink,
  },
  statLabel: {
    fontFamily: fonts.regular,
    fontSize: 9,
    color: colors.muted,
  },
  headline: {
    fontFamily: fonts.extraBold,
    fontSize: 24,
    color: colors.ink,
    letterSpacing: -0.5,
    lineHeight: 28,
    marginTop: spacing.xs,
  },
  headlineAccent: { color: '#B54708' },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
  },
  subBold: {
    fontFamily: fonts.bold,
    color: colors.primaryDark,
  },
  pills: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.primaryDark,
  },
});
