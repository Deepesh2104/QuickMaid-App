import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AuthScreenLayout } from '../../src/components/ui/AuthScreenLayout';
import { QmButton } from '../../src/components/ui/QmButton';
import { useAuthFlow } from '../../src/context/AuthFlowContext';
import { completeRegistration } from '../../src/lib/storage';
import { colors } from '../../src/theme/colors';
import { radius, spacing } from '../../src/theme/spacing';
import { type } from '../../src/theme/typography';

const ITEMS = [
  {
    icon: 'location-outline' as const,
    title: 'Location',
    desc: 'Find nearby slots and track your maid live',
  },
  {
    icon: 'notifications-outline' as const,
    title: 'Notifications',
    desc: 'Booking updates, reminders and offers',
  },
  {
    icon: 'shield-outline' as const,
    title: 'Privacy',
    desc: 'Your data is encrypted and never sold',
  },
];

export default function PermissionsScreen() {
  const router = useRouter();
  const { city, phone, name, email, gender, homeType, locality } = useAuthFlow();
  const [loading, setLoading] = useState(false);

  const finish = async (requestLocation: boolean) => {
    setLoading(true);
    if (requestLocation) {
      await Location.requestForegroundPermissionsAsync();
    }
    await completeRegistration({
      name: name.trim(),
      phone,
      city,
      email: email.trim() || undefined,
      gender: gender && gender !== 'skip' ? gender : undefined,
      homeType: homeType || undefined,
      locality: locality.trim() || undefined,
    });
    setLoading(false);
    router.replace('/(tabs)');
  };

  return (
    <AuthScreenLayout
      showLogo={false}
      heroTitle="Almost done"
      heroSub="Enable permissions for the best QuickMaid experience"
      heroBadge={
        <View style={styles.readyPill}>
          <Ionicons name="checkmark-circle" size={14} color={colors.white} />
          <Text style={styles.readyText}>Profile ready · {name.trim() || 'Guest'}</Text>
        </View>
      }
      formTitle="App permissions"
      formSubtitle="You can change these anytime in Account settings."
      footer={
        <View style={styles.footerBtns}>
          <QmButton label="Allow & continue" onPress={() => finish(true)} loading={loading} />
          <QmButton
            label="Skip for now"
            variant="ghost"
            onPress={() => finish(false)}
            disabled={loading}
          />
        </View>
      }
    >
      {ITEMS.map((item) => (
        <View key={item.title} style={styles.permCard}>
          <View style={styles.permIcon}>
            <Ionicons name={item.icon} size={20} color={colors.primary} />
          </View>
          <View style={styles.permText}>
            <Text style={styles.permTitle}>{item.title}</Text>
            <Text style={styles.permDesc}>{item.desc}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.mutedLight} />
        </View>
      ))}
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  readyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: spacing.md,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  readyText: {
    ...type.bodySm,
    color: colors.white,
    fontWeight: '600',
  },
  permCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  permIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permText: { flex: 1 },
  permTitle: {
    ...type.bodySm,
    fontWeight: '600',
    color: colors.ink,
  },
  permDesc: {
    ...type.caption,
    color: colors.muted,
    marginTop: 2,
    lineHeight: 16,
  },
  footerBtns: {
    gap: spacing.xs,
  },
});
