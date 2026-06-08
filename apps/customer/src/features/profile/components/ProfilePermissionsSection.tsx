import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

import type { AppPermissions } from '../types/profile.types';

interface ProfilePermissionsSectionProps {
  permissions: AppPermissions;
  onChange: (patch: Partial<AppPermissions>) => Promise<void>;
}

export function ProfilePermissionsSection({ permissions, onChange }: ProfilePermissionsSectionProps) {
  const requestLocation = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { status } = await Location.requestForegroundPermissionsAsync();
    await onChange({ locationGranted: status === 'granted' });
  };

  const requestNotifications = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const Notifications = await import('expo-notifications');
      const { status } = await Notifications.requestPermissionsAsync();
      await onChange({ notificationsGranted: status === 'granted' });
    } catch {
      Alert.alert(
        'Demo mode',
        'Push notifications need a dev build in Expo Go. Enabled locally for preview.',
      );
      await onChange({ notificationsGranted: true });
    }
  };

  const items = [
    {
      icon: 'location-outline' as const,
      title: 'Location',
      desc: 'Live pro tracking & nearby slots',
      granted: permissions.locationGranted,
      onEnable: requestLocation,
    },
    {
      icon: 'notifications-outline' as const,
      title: 'Notifications',
      desc: 'Booking updates & reminders',
      granted: permissions.notificationsGranted,
      onEnable: requestNotifications,
    },
  ];

  return (
    <View style={styles.block}>
      <HomeSectionHeader eyebrow="App access" title="Permissions" subtitle="Change anytime in device settings" icon="shield-outline" compact />

      <View style={styles.list}>
        {items.map((item) => (
          <View key={item.title} style={styles.row}>
            <View style={styles.icon}>
              <Ionicons name={item.icon} size={18} color={colors.primaryDark} />
            </View>
            <View style={styles.copy}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
            </View>
            {item.granted ? (
              <View style={styles.onBadge}>
                <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                <Text style={styles.onText}>On</Text>
              </View>
            ) : (
              <Pressable style={styles.enableBtn} onPress={item.onEnable} accessibilityRole="button">
                <Text style={styles.enableText}>Enable</Text>
              </Pressable>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  list: {
    marginHorizontal: layout.pad,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  title: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  desc: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  onBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  onText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.success },
  enableBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  enableText: { fontFamily: fonts.bold, fontSize: 11, color: colors.white },
});
