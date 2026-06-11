import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  formatNotificationTime,
  kindMeta,
} from '@/features/notifications/lib/notifications.utils';
import type { AppNotification } from '@/features/notifications/types/notification.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface PartnerNotificationCardProps {
  notification: AppNotification;
  onPress: () => void;
}

export function PartnerNotificationCard({ notification, onPress }: PartnerNotificationCardProps) {
  const meta = kindMeta(notification.kind);
  const unread = !notification.read;

  return (
    <Pressable
      style={[styles.card, unread && styles.cardUnread]}
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
          unread
            ? ['rgba(110,231,183,0.12)', 'rgba(255,255,255,0.98)']
            : ['#FFFFFF', '#FFFFFF']
        }
        style={styles.cardInner}
      >
        <View style={styles.topRow}>
          <View style={[styles.iconWrap, { backgroundColor: meta.tone }]}>
            <Ionicons name={meta.icon} size={17} color={meta.ink} />
          </View>
          <View style={[styles.kindChip, { borderColor: `${meta.accent}30` }]}>
            <Text style={[styles.kindText, { color: meta.accent }]}>{meta.label}</Text>
          </View>
          {unread ? <View style={[styles.unreadDot, { backgroundColor: meta.accent }]} /> : null}
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
            <Text style={[styles.openText, { color: meta.accent }]}>Open</Text>
            <Ionicons name="chevron-forward" size={14} color={meta.accent} />
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
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
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
    padding: spacing.md,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kindChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
  },
  kindText: {
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
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.ink,
    lineHeight: 19,
  },
  titleUnread: {
    fontFamily: fonts.extraBold,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 17,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
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
  },
});
