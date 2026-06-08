import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { AppNotification } from '../types/notification.types';
import { formatNotificationTime } from '../lib/notifications.utils';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface NotificationCardProps {
  notification: AppNotification;
  onPress: () => void;
}

export function NotificationCard({ notification, onPress }: NotificationCardProps) {
  return (
    <Pressable
      style={[styles.card, !notification.read && styles.cardUnread]}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={notification.title}
    >
      <View style={[styles.icon, { backgroundColor: notification.tone }]}>
        <Ionicons name={notification.icon} size={18} color={notification.ink} />
      </View>

      <View style={styles.copy}>
        <View style={styles.head}>
          <Text style={[styles.title, !notification.read && styles.titleUnread]} numberOfLines={1}>
            {notification.title}
          </Text>
          <Text style={styles.time}>{formatNotificationTime(notification.createdAt)}</Text>
        </View>
        <Text style={styles.body} numberOfLines={2}>
          {notification.body}
        </Text>
      </View>

      {!notification.read ? <View style={styles.dot} /> : null}
      <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  cardUnread: {
    backgroundColor: '#FAFDFC',
    borderColor: 'rgba(11,110,103,0.15)',
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 4 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  title: { flex: 1, fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink },
  titleUnread: { fontFamily: fonts.bold },
  time: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted },
  body: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, lineHeight: 17 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
