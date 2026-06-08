import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { SUPPORT_CONTACT } from '@/constants/demo';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const METRICS = [
  { icon: 'flash-outline' as const, value: '<5 min', label: 'Avg reply', tone: '#E6F4F2', ink: colors.primaryDark },
  { icon: 'checkmark-done-outline' as const, value: '98%', label: 'Resolved', tone: '#ECFDF5', ink: '#027A48' },
  { icon: 'star' as const, value: '4.9', label: 'Rating', tone: '#FFF8EE', ink: '#B54708' },
];

export function HelpTrustBoard() {
  return (
    <View style={styles.wrap}>
      <LinearGradient colors={['#FAFBFC', '#FFFFFF']} style={StyleSheet.absoluteFill} />

      <View style={styles.head}>
        <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
        <Text style={styles.headText}>QuickMaid Support · {SUPPORT_CONTACT.hours}</Text>
      </View>

      <View style={styles.row}>
        {METRICS.map((m) => (
          <View key={m.label} style={styles.metric}>
            <View style={[styles.metricIcon, { backgroundColor: m.tone }]}>
              <Ionicons name={m.icon} size={14} color={m.ink} />
            </View>
            <Text style={styles.metricValue}>{m.value}</Text>
            <Text style={styles.metricLabel}>{m.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const GAP = spacing.sm;
const METRIC_W = (layout.screenWidth - layout.pad * 2 - spacing.lg * 2 - GAP * 2) / 3;

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: layout.pad,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.muted,
  },
  row: { flexDirection: 'row', gap: GAP },
  metric: {
    width: METRIC_W,
    alignItems: 'center',
    gap: 2,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  metricValue: {
    fontFamily: fonts.extraBold,
    fontSize: 15,
    color: colors.ink,
  },
  metricLabel: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.muted,
  },
});
