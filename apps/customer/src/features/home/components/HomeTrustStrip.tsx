import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const STATS = [
  { icon: 'shield-checkmark' as const, value: '4.85★', label: 'Avg rating' },
  { icon: 'home' as const, value: '50k+', label: 'Homes cleaned' },
  { icon: 'flash' as const, value: '98%', label: 'On-time' },
];

export function HomeTrustStrip() {
  return (
    <View style={styles.wrap} accessibilityRole="summary">
      {STATS.map((s, i) => (
        <View key={s.label} style={[styles.item, i > 0 && styles.sep]}>
          <Ionicons name={s.icon} size={15} color={colors.primary} />
          <Text style={styles.value}>{s.value}</Text>
          <Text style={styles.label}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    marginHorizontal: layout.pad,
    marginBottom: spacing.xl,
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  item: { flex: 1, alignItems: 'center', gap: 3 },
  sep: { borderLeftWidth: 1, borderLeftColor: colors.divider },
  value: {
    fontFamily: fonts.extraBold,
    fontSize: 14,
    color: colors.ink,
  },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: 9,
    color: colors.muted,
    textAlign: 'center',
  },
});
