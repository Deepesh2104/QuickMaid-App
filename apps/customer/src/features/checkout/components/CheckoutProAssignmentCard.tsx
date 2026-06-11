import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { DEMO_VISIT_COMPLETION_OTP } from '@/constants/app';
import type { PlacedOrder } from '../types/checkout.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface CheckoutProAssignmentCardProps {
  order: PlacedOrder;
}

export function CheckoutProAssignmentCard({ order }: CheckoutProAssignmentCardProps) {
  if (!order.maid) return null;

  return (
    <Animated.View entering={FadeInDown.delay(80).duration(320)} style={styles.wrap}>
      <LinearGradient
        colors={['#422006', '#78350F', '#B45309']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.glow} pointerEvents="none" />

        <View style={styles.head}>
          <Text style={styles.eyebrow}>PRO AUTO-ASSIGNED</Text>
          <View style={styles.badge}>
            <Ionicons name="flash" size={10} color="#FCD34D" />
            <Text style={styles.badgeText}>INSTANT</Text>
          </View>
        </View>

        <View style={styles.proRow}>
          <LinearGradient colors={['#FCD34D', '#F59E0B']} style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.initial}>{order.maid.charAt(0)}</Text>
            </View>
          </LinearGradient>
          <View style={styles.copy}>
            <Text style={styles.name}>{order.maid}</Text>
            <Text style={styles.meta}>
              {order.maidRating ? `${order.maidRating}★ · ` : ''}
              {order.maidJobs ? `${order.maidJobs.toLocaleString('en-IN')} jobs · ` : ''}
              Visit OTP {DEMO_VISIT_COMPLETION_OTP} ready
            </Text>
          </View>
        </View>

        <View style={styles.syncRow}>
          <Ionicons name="sync" size={12} color="#FCD34D" />
          <Text style={styles.syncText}>
            Partner accept hone par naam confirm hoga · bridge sync active
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.xxl,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadow.md,
  },
  card: {
    padding: spacing.md,
    gap: spacing.sm,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.25)',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(252,211,77,0.15)',
    top: -30,
    right: -10,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 1.2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.35)',
  },
  badgeText: {
    fontFamily: fonts.extraBold,
    fontSize: 9,
    color: '#FCD34D',
    letterSpacing: 0.6,
  },
  proRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatarRing: {
    padding: 3,
    borderRadius: 28,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  initial: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: colors.white,
  },
  copy: { flex: 1, gap: 3 },
  name: { fontFamily: fonts.bold, fontSize: 18, color: colors.white },
  meta: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  syncText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 14,
  },
});
