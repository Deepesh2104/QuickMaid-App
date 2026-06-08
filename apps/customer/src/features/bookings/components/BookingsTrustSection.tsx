import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const TRUST = [
  { icon: 'shield-checkmark' as const, label: 'Verified pros', sub: 'Every visit' },
  { icon: 'wallet-outline' as const, label: 'Pay after', sub: 'Service done' },
  { icon: 'refresh-outline' as const, label: 'Free reschedule', sub: '2 hrs before' },
];

export function BookingsTrustSection() {
  return (
    <View style={styles.wrap}>
      <LinearGradient colors={['#E6F4F2', '#FFFFFF']} style={StyleSheet.absoluteFill} />

      <View style={styles.head}>
        <Ionicons name="ribbon" size={18} color={colors.primaryDark} />
        <Text style={styles.headTitle}>Every visit protected</Text>
      </View>

      <View style={styles.row}>
        {TRUST.map((t) => (
          <View key={t.label} style={styles.item}>
            <View style={styles.itemIcon}>
              <Ionicons name={t.icon} size={16} color={colors.primaryDark} />
            </View>
            <Text style={styles.itemLabel}>{t.label}</Text>
            <Text style={styles.itemSub}>{t.sub}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: layout.pad,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 15,
    color: colors.ink,
  },
  row: { flexDirection: 'row', gap: spacing.sm },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.bg,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.05)',
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  itemLabel: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.ink,
    textAlign: 'center',
  },
  itemSub: {
    fontFamily: fonts.regular,
    fontSize: 8,
    color: colors.muted,
    textAlign: 'center',
  },
});
