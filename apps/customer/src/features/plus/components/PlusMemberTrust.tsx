import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const GUARANTEES = [
  { icon: 'shield-checkmark' as const, label: 'Verified partners', sub: 'Every visit' },
  { icon: 'close-circle-outline' as const, label: 'Cancel anytime', sub: 'No penalty' },
  { icon: 'pause-circle' as const, label: 'Pause membership', sub: 'When travelling' },
];

export function PlusMemberTrust() {
  return (
    <View style={styles.wrap}>
      <LinearGradient colors={['#E6F4F2', '#FFFFFF']} style={StyleSheet.absoluteFill} />

      <View style={styles.head}>
        <Ionicons name="ribbon" size={20} color={colors.primaryDark} />
        <Text style={styles.headTitle}>Member promise</Text>
      </View>

      <View style={styles.row}>
        {GUARANTEES.map((g) => (
          <View key={g.label} style={styles.item}>
            <View style={styles.itemIcon}>
              <Ionicons name={g.icon} size={16} color={colors.primaryDark} />
            </View>
            <Text style={styles.itemLabel}>{g.label}</Text>
            <Text style={styles.itemSub}>{g.sub}</Text>
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
    fontSize: 16,
    color: colors.ink,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
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
