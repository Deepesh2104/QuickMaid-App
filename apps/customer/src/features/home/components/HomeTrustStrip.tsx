import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { premium } from '../constants/home.premium';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const STATS = [
  { icon: 'star' as const, value: '4.85', label: 'Avg rating', accent: '#FFFAEB', ink: '#B54708' },
  { icon: 'home' as const, value: '50k+', label: 'Homes cleaned', accent: '#E6F4F2', ink: colors.primaryDark },
  { icon: 'flash' as const, value: '98%', label: 'On-time', accent: '#EEF6FF', ink: '#175CD3' },
  { icon: 'shield-checkmark' as const, value: '100%', label: 'Verified', accent: '#ECFDF3', ink: '#027A48' },
];

export function HomeTrustStrip() {
  return (
    <View style={styles.wrap} accessibilityRole="summary">
      <LinearGradient
        colors={['#F8FAFB', '#FFFFFF']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {STATS.map((s, i) => (
        <View key={s.label} style={[styles.item, i < STATS.length - 1 && styles.itemSep]}>
          <View style={[styles.icon, { backgroundColor: s.accent }]}>
            <Ionicons name={s.icon} size={15} color={s.ink} />
          </View>
          <Text style={styles.value}>{s.value}</Text>
          <Text style={styles.label}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...premium.surface,
    flexDirection: 'row',
    marginHorizontal: layout.pad,
    marginBottom: spacing.section,
    paddingVertical: spacing.lg,
    overflow: 'hidden',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 4,
  },
  itemSep: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.divider,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontFamily: fonts.extraBold,
    fontSize: 15,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: 9,
    color: colors.muted,
    textAlign: 'center',
  },
});
