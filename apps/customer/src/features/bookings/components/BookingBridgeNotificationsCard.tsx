import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import {
  bridgeEventFromNotificationId,
  bridgeEventLabel,
  filterBridgeNotifications,
  formatNotificationTime,
} from '@/features/notifications/lib/notifications.utils';
import type { AppNotification } from '@/features/notifications/types/notification.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface BookingBridgeNotificationsCardProps {
  notifications: AppNotification[];
  onOpenNotifications?: () => void;
}

export function BookingBridgeNotificationsCard({
  notifications,
  onOpenNotifications,
}: BookingBridgeNotificationsCardProps) {
  const router = useRouter();
  const bridgeItems = filterBridgeNotifications(notifications);
  const unread = bridgeItems.filter((n) => !n.read);
  const recent = bridgeItems.slice(0, 3);

  if (!recent.length) return null;

  const openNotification = (n: AppNotification) => {
    Haptics.selectionAsync();
    router.push(`/notifications/${n.id}` as Href);
  };

  return (
    <Animated.View entering={FadeInDown.duration(300)} style={styles.wrap}>
      <LinearGradient
        colors={['#010F0E', '#084F4A', '#0B6E67']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.glow} pointerEvents="none" />

        <View style={styles.head}>
          <View style={styles.icon}>
            <Ionicons name="notifications" size={18} color={colors.white} />
          </View>
          <View style={styles.copy}>
            <Text style={styles.eyebrow}>BRIDGE ALERTS</Text>
            <Text style={styles.title}>Partner sync notifications</Text>
          </View>
          {unread.length > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unread.length}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.list}>
          {recent.map((n) => {
            const event = bridgeEventFromNotificationId(n.id);
            return (
              <Pressable key={n.id} style={styles.row} onPress={() => openNotification(n)}>
                <View style={[styles.rowIcon, { backgroundColor: n.tone }]}>
                  <Ionicons name={n.icon} size={14} color={n.ink} />
                </View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {n.title}
                  </Text>
                  <Text style={styles.rowSub} numberOfLines={1}>
                    {bridgeEventLabel(event)} · {formatNotificationTime(n.createdAt)}
                  </Text>
                </View>
                {!n.read ? <View style={styles.unreadDot} /> : null}
                <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.45)" />
              </Pressable>
            );
          })}
        </View>

        <Pressable
          style={styles.footerBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            if (onOpenNotifications) onOpenNotifications();
            else router.push('/notifications' as Href);
          }}
        >
          <Text style={styles.footerText}>Open premium inbox</Text>
          <Ionicons name="arrow-forward" size={14} color="#6EE7B7" />
        </Pressable>
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
    borderColor: 'rgba(110,231,183,0.25)',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(18,165,152,0.2)',
    top: -30,
    right: -10,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.1,
  },
  title: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6EE7B7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontFamily: fonts.extraBold,
    fontSize: 11,
    color: '#084F4A',
  },
  list: { gap: spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCopy: { flex: 1, gap: 1 },
  rowTitle: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.white },
  rowSub: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#6EE7B7',
  },
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  footerText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: '#6EE7B7',
  },
});
