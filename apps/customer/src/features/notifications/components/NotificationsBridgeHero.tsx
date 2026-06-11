import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import {
  bridgeEventLabel,
  bridgeEventFromNotificationId,
  filterBridgeNotifications,
} from '../lib/notifications.utils';
import type { AppNotification } from '../types/notification.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface NotificationsBridgeHeroProps {
  items: AppNotification[];
}

const PIPELINE = [
  { icon: 'briefcase-outline' as const, label: 'Partner acts' },
  { icon: 'swap-horizontal' as const, label: 'Bridge sync' },
  { icon: 'notifications' as const, label: 'You notified' },
];

export function NotificationsBridgeHero({ items }: NotificationsBridgeHeroProps) {
  const bridgeItems = filterBridgeNotifications(items);
  if (!bridgeItems.length) return null;

  const unread = bridgeItems.filter((n) => !n.read).length;
  const latestEvent = bridgeEventFromNotificationId(bridgeItems[0]?.id ?? '');

  return (
    <Animated.View entering={FadeInDown.duration(280)} style={styles.wrap}>
      <LinearGradient
        colors={['#0F172A', '#1E3A5F', '#1570EF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.glow} pointerEvents="none" />

        <View style={styles.head}>
          <Ionicons name="git-network-outline" size={20} color={colors.white} />
          <View style={styles.copy}>
            <Text style={styles.eyebrow}>PARTNER BRIDGE INBOX</Text>
            <Text style={styles.title}>
              {bridgeItems.length} cross-app alert{bridgeItems.length > 1 ? 's' : ''}
            </Text>
            <Text style={styles.sub}>
              Latest · {bridgeEventLabel(latestEvent)}
              {unread > 0 ? ` · ${unread} unread` : ''}
            </Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>SYNC</Text>
          </View>
        </View>

        <View style={styles.pipeline}>
          {PIPELINE.map((step) => (
            <View key={step.label} style={styles.step}>
              <View style={styles.stepIcon}>
                <Ionicons name={step.icon} size={11} color="#93C5FD" />
              </View>
              <Text style={styles.stepLabel}>{step.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    ...shadow.md,
  },
  card: {
    padding: spacing.md,
    gap: spacing.sm,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(147,197,253,0.25)',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(21,112,239,0.25)',
    top: -25,
    right: -10,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  copy: { flex: 1, gap: 2 },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.1,
  },
  title: { fontFamily: fonts.bold, fontSize: 15, color: colors.white },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(21,112,239,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(147,197,253,0.35)',
  },
  badgeText: {
    fontFamily: fonts.extraBold,
    fontSize: 9,
    color: colors.white,
    letterSpacing: 0.6,
  },
  pipeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  step: { flex: 1, alignItems: 'center', gap: 4 },
  stepIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
});
