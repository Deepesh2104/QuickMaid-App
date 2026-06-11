import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  bridgeEventFromNotificationId,
  bridgeEventLabel,
  CATEGORY_META,
  formatNotificationTime,
  isBridgeNotification,
} from '../lib/notifications.utils';
import type { AppNotification } from '../types/notification.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface NotificationCardProps {
  notification: AppNotification;
  onPress: () => void;
}

export function NotificationCard({ notification, onPress }: NotificationCardProps) {
  const meta = CATEGORY_META[notification.category];
  const unread = !notification.read;
  const fromBridge = isBridgeNotification(notification.id);
  const bridgeEvent = bridgeEventFromNotificationId(notification.id);

  return (
    <Pressable
      style={[styles.card, unread && styles.cardUnread, fromBridge && styles.cardBridge]}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={notification.title}
    >
      {unread ? <View style={[styles.accentBar, { backgroundColor: meta.accent }]} /> : null}

      <LinearGradient
        colors={
          fromBridge
            ? unread
              ? ['rgba(21,112,239,0.12)', 'rgba(255,255,255,0.98)']
              : ['#F8FAFC', '#FFFFFF']
            : unread
              ? ['rgba(110,231,183,0.14)', 'rgba(255,255,255,0.02)']
              : ['#FFFFFF', '#FFFFFF']
        }
        style={styles.cardInner}
      >
        {fromBridge ? (
          <View style={styles.bridgeStrip}>
            <Ionicons name="git-network-outline" size={10} color="#1570EF" />
            <Text style={styles.bridgeStripText}>
              BRIDGE · {bridgeEventLabel(bridgeEvent)}
            </Text>
          </View>
        ) : null}

        <View style={styles.topRow}>
          <View style={[styles.iconWrap, { backgroundColor: notification.tone }]}>
            <Ionicons name={notification.icon} size={18} color={notification.ink} />
          </View>
          <View style={[styles.categoryChip, { borderColor: `${meta.accent}30` }]}>
            <Text style={[styles.categoryText, { color: meta.accent }]}>{meta.label}</Text>
          </View>
          {unread ? <View style={[styles.unreadDot, fromBridge && styles.unreadDotBridge]} /> : null}
        </View>

        <Text style={[styles.title, unread && styles.titleUnread]} numberOfLines={2}>
          {notification.title}
        </Text>
        <Text style={styles.body} numberOfLines={2}>
          {notification.body}
        </Text>

        <View style={styles.footer}>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={11} color={colors.mutedLight} />
            <Text style={styles.time}>{formatNotificationTime(notification.createdAt)}</Text>
          </View>
          <View style={styles.openRow}>
            <Text style={styles.openText}>Open</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
    backgroundColor: colors.white,
  },
  cardUnread: {
    borderColor: 'rgba(11,110,103,0.2)',
    shadowColor: '#0B6E67',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardBridge: {
    borderColor: 'rgba(21,112,239,0.2)',
    shadowColor: '#1570EF',
  },
  bridgeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: '#EFF8FF',
    borderWidth: 1,
    borderColor: 'rgba(21,112,239,0.2)',
    marginBottom: 2,
  },
  bridgeStripText: {
    fontFamily: fonts.bold,
    fontSize: 8,
    color: '#1570EF',
    letterSpacing: 0.5,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    zIndex: 1,
  },
  cardInner: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
  },
  categoryText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  unreadDot: {
    marginLeft: 'auto',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  unreadDotBridge: { backgroundColor: '#1570EF' },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.ink,
    lineHeight: 20,
  },
  titleUnread: {
    fontFamily: fonts.extraBold,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 18,
  },
  footer: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.mutedLight,
  },
  openRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  openText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.primary,
  },
});
