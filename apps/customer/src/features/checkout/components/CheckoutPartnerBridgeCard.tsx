import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import type { PlacedOrder } from '../types/checkout.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface CheckoutPartnerBridgeCardProps {
  order: PlacedOrder;
}

export function CheckoutPartnerBridgeCard({ order }: CheckoutPartnerBridgeCardProps) {
  return (
    <Animated.View entering={FadeInDown.delay(120).duration(320)} style={styles.wrap}>
      <LinearGradient
        colors={['#010F0E', '#084F4A', '#0B6E67']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.glow} pointerEvents="none" />

        <View style={styles.head}>
          <View style={styles.icon}>
            <Ionicons name="git-network-outline" size={18} color={colors.white} />
          </View>
          <View style={styles.copy}>
            <Text style={styles.eyebrow}>PARTNER BRIDGE</Text>
            <Text style={styles.title}>Order queued for pro app</Text>
            <Text style={styles.sub}>
              Ref {order.bookingRef} · deep link + AsyncStorage sync
            </Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>SENT</Text>
          </View>
        </View>

        {order.maid ? (
          <View style={styles.maidRow}>
            <Ionicons name="person" size={14} color="#6EE7B7" />
            <Text style={styles.maidText}>
              Pro <Text style={styles.maidName}>{order.maid}</Text> bundled in bridge payload
            </Text>
          </View>
        ) : null}

        <View style={styles.pipeline}>
          <BridgeStep done icon="cart" label="Order placed" />
          <BridgeStep done icon="person" label="Pro assigned" />
          <BridgeStep done icon="swap-horizontal" label="Bridge push" />
          <BridgeStep active icon="briefcase" label="Partner accept" />
        </View>

        <View style={styles.trust}>
          <Ionicons name="shield-checkmark" size={12} color="#6EE7B7" />
          <Text style={styles.trustText}>
            Partner refresh ya Settings sync se job dikhega · same device demo
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

function BridgeStep({
  done,
  active,
  icon,
  label,
}: {
  done?: boolean;
  active?: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.step}>
      <View
        style={[
          styles.stepDot,
          done && styles.stepDotDone,
          active && styles.stepDotActive,
        ]}
      >
        <Ionicons
          name={icon}
          size={11}
          color={active || done ? colors.white : 'rgba(255,255,255,0.4)'}
        />
      </View>
      <Text style={[styles.stepLabel, (done || active) && styles.stepLabelOn]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.xxl,
    overflow: 'hidden',
    ...shadow.md,
  },
  card: {
    padding: spacing.md,
    gap: spacing.md,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(18,165,152,0.2)',
    top: -40,
    right: -20,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  copy: { flex: 1, gap: 2 },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.1,
  },
  title: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.65)',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(18,165,152,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.4)',
  },
  badgeText: {
    fontFamily: fonts.extraBold,
    fontSize: 9,
    color: colors.white,
    letterSpacing: 0.6,
  },
  maidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.2)',
  },
  maidText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
  },
  maidName: { fontFamily: fonts.bold, color: '#6EE7B7' },
  pipeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  step: { flex: 1, alignItems: 'center', gap: 6 },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  stepDotDone: {
    backgroundColor: 'rgba(18,165,152,0.3)',
    borderColor: 'rgba(110,231,183,0.35)',
  },
  stepDotActive: {
    backgroundColor: '#12A598',
    borderColor: '#6EE7B7',
    borderWidth: 2,
  },
  stepLabel: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
  },
  stepLabelOn: { color: 'rgba(255,255,255,0.9)', fontFamily: fonts.semiBold },
  trust: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 14,
  },
});
