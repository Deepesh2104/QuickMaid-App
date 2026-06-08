import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const STATS = [
  { icon: 'calendar' as const, value: '3', label: 'Visits', sub: 'This month', tone: '#E6F4F2', ink: colors.primaryDark },
  { icon: 'wallet' as const, value: '₹647', label: 'Spent', sub: 'Jun 2026', tone: '#EEF6FF', ink: '#175CD3' },
  { icon: 'trending-down' as const, value: '₹120', label: 'Save', sub: 'With Plus', tone: '#FFF8EE', ink: '#B54708' },
];

export function BookingsInsightsStrip() {
  return (
    <View style={styles.wrap}>
      <LinearGradient colors={['#0F1419', '#1A2332']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <View style={styles.glow} />

      <View style={styles.head}>
        <Text style={styles.eyebrow}>Your snapshot</Text>
        <View style={styles.badge}>
          <Ionicons name="analytics" size={12} color="#6EE7B7" />
          <Text style={styles.badgeText}>June 2026</Text>
        </View>
      </View>

      <View style={styles.row}>
        {STATS.map((s) => (
          <View key={s.label} style={styles.stat}>
            <View style={[styles.statIcon, { backgroundColor: s.tone }]}>
              <Ionicons name={s.icon} size={14} color={s.ink} />
            </View>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
            <Text style={styles.statSub}>{s.sub}</Text>
          </View>
        ))}
      </View>

      <View style={styles.tip}>
        <Ionicons name="diamond-outline" size={13} color="#FCD34D" />
        <Text style={styles.tipText}>Switch to Plus — save ₹120 more next month</Text>
      </View>
    </View>
  );
}

const GAP = spacing.sm;
const STAT_W = (layout.screenWidth - layout.pad * 2 - spacing.lg * 2 - GAP * 2) / 3;

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: layout.pad,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    overflow: 'hidden',
    marginBottom: spacing.section,
  },
  glow: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(110,231,183,0.12)',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: '#6EE7B7',
  },
  row: { flexDirection: 'row', gap: GAP },
  stat: {
    width: STAT_W,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.xl,
    padding: spacing.sm + 2,
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  statValue: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.white,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
  },
  statSub: {
    fontFamily: fonts.regular,
    fontSize: 9,
    color: 'rgba(255,255,255,0.45)',
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(252,211,77,0.12)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  tipText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: '#FCD34D',
  },
});
