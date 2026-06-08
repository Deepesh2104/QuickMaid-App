import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { premium } from '../constants/home.premium';
import { HomeSectionHeader } from './HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const POINTS = [
  { icon: 'checkmark-circle' as const, text: '100% satisfaction or free re-clean' },
  { icon: 'time-outline' as const, text: 'On-time arrival or ₹50 credit' },
  { icon: 'lock-closed-outline' as const, text: 'Pay only after service is done' },
];

export function HomeGuaranteeCard() {
  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Our promise"
        title="QuickMaid guarantee"
        subtitle="Every booking is protected"
        icon="ribbon-outline"
        compact
      />
      <View style={styles.card}>
        <LinearGradient colors={['#E6F4F2', '#FFFFFF']} style={styles.cardBg} />
        <View style={styles.shield}>
          <LinearGradient colors={['#0B6E67', '#084F4A']} style={styles.shieldGrad}>
            <Ionicons name="shield-checkmark" size={26} color={colors.white} />
          </LinearGradient>
        </View>
        <View style={styles.copy}>
          {POINTS.map((p) => (
            <View key={p.text} style={styles.point}>
              <View style={styles.pointIcon}>
                <Ionicons name={p.icon} size={14} color={colors.primary} />
              </View>
              <Text style={styles.pointText}>{p.text}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { ...premium.section },
  card: {
    marginHorizontal: layout.pad,
    padding: spacing.lg,
    flexDirection: 'row',
    gap: spacing.lg,
    overflow: 'hidden',
    ...premium.surface,
  },
  cardBg: { ...StyleSheet.absoluteFill, opacity: 0.7 },
  shield: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  shieldGrad: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: spacing.sm },
  point: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  pointIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.md,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  pointText: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.inkSecondary,
    lineHeight: 18,
    paddingTop: 4,
  },
});
