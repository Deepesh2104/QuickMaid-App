import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { PartnerJob } from '@/constants/demo';
import { formatRs, netEarningPaise } from '@/features/home/lib/home.greeting';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface PartnerActiveJobBannerProps {
  job: PartnerJob;
}

export function PartnerActiveJobBanner({ job }: PartnerActiveJobBannerProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push(`/job/${job.id}` as Href);
      }}
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
    >
      <LinearGradient colors={['#084F4A', '#0D8A82']} style={styles.card}>
        <View style={styles.liveRow}>
          <View style={styles.liveDot} />
          <Text style={styles.liveLabel}>ACTIVE VISIT</Text>
        </View>
        <Text style={styles.service}>{job.service}</Text>
        <Text style={styles.customer}>{job.customerName} · {job.visitDate}</Text>
        <Text style={styles.addr} numberOfLines={1}>{job.address}</Text>
        <View style={styles.footer}>
          <Text style={styles.earn}>{formatRs(netEarningPaise(job.amountPaise))}</Text>
          <View style={styles.cta}>
            <Text style={styles.ctaText}>Open job</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.white} />
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: spacing.lg, ...shadow.md },
  pressed: { opacity: 0.95 },
  card: { borderRadius: radius.xl, padding: spacing.lg, gap: 6 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FBBF24' },
  liveLabel: { fontFamily: fonts.bold, fontSize: 10, color: 'rgba(255,255,255,0.75)', letterSpacing: 1 },
  service: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.white, marginTop: 4 },
  customer: { fontFamily: fonts.semiBold, fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  addr: { fontFamily: fonts.regular, fontSize: 12, color: 'rgba(255,255,255,0.65)' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  earn: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.partnerGold },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  ctaText: { fontFamily: fonts.bold, fontSize: 12, color: colors.white },
});
