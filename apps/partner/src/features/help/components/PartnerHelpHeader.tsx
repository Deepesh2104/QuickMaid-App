import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { SUPPORT_CONTACT } from '@/constants/demo';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface PartnerHelpHeaderProps {
  paddingTop: number;
}

const STATS = [
  { icon: 'time-outline' as const, value: '5 min', label: 'Avg reply' },
  { icon: 'chatbubbles-outline' as const, value: 'Live', label: 'Partner chat' },
  { icon: 'call-outline' as const, value: '9–9', label: 'Daily hours' },
];

export function PartnerHelpHeader({ paddingTop }: PartnerHelpHeaderProps) {
  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={['#084F4A', '#0B6E67', '#0F1419']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.content, { paddingTop: paddingTop + spacing.lg }]}>
        <View style={styles.badge}>
          <Ionicons name="headset" size={22} color="#6EE7B7" />
        </View>

        <View style={styles.copy}>
          <Text style={styles.eyebrow}>PARTNER SUPPORT</Text>
          <Text style={styles.title}>We&apos;ve got your back</Text>
          <Text style={styles.sub}>
            Payouts, jobs, safety — real ops team · {SUPPORT_CONTACT.hours.toLowerCase()}
          </Text>
        </View>

        <View style={styles.stats}>
          {STATS.map((s, i) => (
            <View key={s.label} style={[styles.stat, i > 0 && styles.statSep]}>
              <Ionicons name={s.icon} size={13} color="#6EE7B7" />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 280,
    paddingBottom: 28,
    overflow: 'hidden',
    backgroundColor: '#0F1419',
  },
  content: {
    flex: 1,
    paddingHorizontal: layout.pad,
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(110,231,183,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { gap: 6 },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 1.4,
    color: '#6EE7B7',
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 30,
    color: colors.white,
    letterSpacing: -0.8,
    lineHeight: 34,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 18,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    paddingVertical: spacing.md,
  },
  stat: { flex: 1, alignItems: 'center', gap: 3 },
  statSep: { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.12)' },
  statValue: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.white,
  },
  statLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.65)',
  },
});
