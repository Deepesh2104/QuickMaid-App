import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import {
  bridgeEventFromNotificationId,
  bridgeEventLabel,
  isBridgeNotification,
} from '../lib/notifications.utils';
import type { AppNotification } from '../types/notification.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface NotificationBridgeDetailCardProps {
  notification: AppNotification;
}

export function NotificationBridgeDetailCard({ notification }: NotificationBridgeDetailCardProps) {
  if (!isBridgeNotification(notification.id)) return null;

  const event = bridgeEventFromNotificationId(notification.id);

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={['#010F0E', '#084F4A', '#0B6E67']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.head}>
          <Ionicons name="git-network-outline" size={16} color="#6EE7B7" />
          <Text style={styles.eyebrow}>PARTNER BRIDGE SYNC</Text>
        </View>
        <Text style={styles.title}>{bridgeEventLabel(event)}</Text>
        <Text style={styles.sub}>
          Demo cross-app event — partner app action synced via AsyncStorage bridge
        </Text>
        <View style={styles.chips}>
          <View style={styles.chip}>
            <Ionicons name="sync" size={11} color="#6EE7B7" />
            <Text style={styles.chipText}>Real-time demo</Text>
          </View>
          <View style={styles.chip}>
            <Ionicons name="shield-checkmark" size={11} color="#6EE7B7" />
            <Text style={styles.chipText}>Verified alert</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  card: {
    padding: spacing.md,
    gap: spacing.xs,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.25)',
    overflow: 'hidden',
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.1,
  },
  title: { fontFamily: fonts.bold, fontSize: 16, color: colors.white },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 17,
  },
  chips: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  chipText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: '#6EE7B7',
  },
});
