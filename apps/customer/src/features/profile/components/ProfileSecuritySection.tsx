import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert, Pressable, Share, StyleSheet, Text, View } from 'react-native';

import { useOpenLegal } from '@/features/legal/hooks/useOpenLegal';

import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const ITEMS = [
  { id: 'privacy', icon: 'shield-checkmark-outline' as const, label: 'Privacy & security', sub: 'Data, permissions, account' },
  { id: 'applock', icon: 'finger-print-outline' as const, label: 'App lock', sub: 'Face ID · PIN (coming soon)' },
  { id: 'export', icon: 'document-lock-outline' as const, label: 'Download my data', sub: 'Export bookings & invoices' },
];

export function ProfileSecuritySection() {
  const openLegal = useOpenLegal();

  const onItem = (id: string) => {
    Haptics.selectionAsync();
    if (id === 'privacy') openLegal('privacy');
    else if (id === 'applock') Alert.alert('App lock', 'Face ID & PIN lock will be available in the next update.');
    else if (id === 'export') {
      void Share.share({
        message: [
          'QuickMaid data export (demo)',
          'Profile, bookings, payments and invoices can be exported from the app.',
          'Contact privacy@quickmaid.demo for a full GDPR export in production.',
        ].join('\n'),
      });
    }
  };

  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Security"
        title="Privacy & data"
        subtitle="Your info stays protected"
        icon="lock-closed-outline"
        compact
      />

      <View style={styles.list}>
        {ITEMS.map((item, i) => (
          <Pressable
            key={item.label}
            style={[styles.row, i < ITEMS.length - 1 && styles.rowBorder]}
            onPress={() => onItem(item.id)}
            accessibilityRole="button"
          >
            <View style={styles.rowIcon}>
              <Ionicons name={item.icon} size={18} color={colors.primaryDark} />
            </View>
            <View style={styles.rowCopy}>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Text style={styles.rowSub}>{item.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.mutedLight} />
          </Pressable>
        ))}
      </View>

      <View style={styles.trustBanner}>
        <LinearGradient colors={['#ECFDF5', '#FFFFFF']} style={StyleSheet.absoluteFill} />
        <Ionicons name="shield-checkmark" size={20} color={colors.success} />
        <Text style={styles.trustText}>
          Aadhaar-verified pros · Encrypted payments · No data sold to third parties
        </Text>
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
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCopy: { flex: 1, gap: 2 },
  rowLabel: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  rowSub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
  },
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginHorizontal: layout.pad,
    borderRadius: radius.xl,
    padding: spacing.md,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(2,122,72,0.12)',
  },
  trustText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 17,
  },
});
