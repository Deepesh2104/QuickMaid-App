import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import type { PartnerJob } from '@/constants/demo';
import { formatRs, netEarningPaise } from '@/features/home/lib/home.greeting';
import { jobMapsQuery } from '@/features/jobs/lib/job-detail.utils';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

function serviceIcon(service: string): keyof typeof Ionicons.glyphMap {
  if (service.toLowerCase().includes('deep')) return 'sparkles';
  if (service.toLowerCase().includes('kitchen') || service.toLowerCase().includes('cook')) return 'restaurant-outline';
  return 'home-outline';
}

interface PartnerScheduleVisitCardProps {
  job: PartnerJob;
  compact?: boolean;
}

export function PartnerScheduleVisitCard({ job, compact }: PartnerScheduleVisitCardProps) {
  const router = useRouter();
  const net = netEarningPaise(job.amountPaise);
  const isLive = job.status === 'in_progress';
  const isAccepted = job.status === 'accepted';

  const openDetail = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/job/${job.id}` as Href);
  };

  const openMaps = () => {
    Haptics.selectionAsync();
    void Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${jobMapsQuery(job)}`);
  };

  return (
    <Pressable
      onPress={openDetail}
      style={({ pressed }) => [styles.card, isLive && styles.cardLive, pressed && styles.pressed]}
    >
      <View style={[styles.accent, isLive && styles.accentLive]} />

      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={[styles.serviceIcon, isLive && styles.serviceIconLive]}>
            <Ionicons
              name={serviceIcon(job.service)}
              size={compact ? 16 : 18}
              color={isLive ? colors.white : colors.primary}
            />
          </View>
          <View style={styles.headCopy}>
            <View style={styles.titleRow}>
              <Text style={styles.service} numberOfLines={1}>{job.service}</Text>
              {isLive ? (
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              ) : (
                <View style={styles.acceptedBadge}>
                  <Ionicons name="checkmark-circle" size={10} color={colors.success} />
                  <Text style={styles.acceptedText}>CONFIRMED</Text>
                </View>
              )}
            </View>
            <Text style={styles.ref}>{job.bookingRef}</Text>
          </View>
          <Text style={styles.earn}>{formatRs(net)}</Text>
        </View>

        <View style={styles.customerRow}>
          <Ionicons name="person-circle-outline" size={15} color={colors.muted} />
          <Text style={styles.customer} numberOfLines={1}>{job.customerName}</Text>
          <Text style={styles.zone}>{job.zone}</Text>
        </View>

        <View style={styles.addrRow}>
          <Ionicons name="location-outline" size={14} color={colors.primary} />
          <Text style={styles.addr} numberOfLines={compact ? 1 : 2}>{job.address}</Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Ionicons name="calendar-outline" size={11} color={colors.muted} />
            <Text style={styles.metaText}>{job.visitDate}</Text>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="time-outline" size={11} color={colors.muted} />
            <Text style={styles.metaText} numberOfLines={1}>{job.slotLabel}</Text>
          </View>
          {job.distanceKm ? (
            <View style={styles.metaChip}>
              <Ionicons name="navigate-outline" size={11} color={colors.primaryDark} />
              <Text style={styles.distText}>{job.distanceKm} km</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.mapsBtn} onPress={openMaps}>
            <Ionicons name="navigate" size={13} color={colors.primaryDark} />
            <Text style={styles.mapsText}>Maps</Text>
          </Pressable>
          <Pressable style={styles.detailBtn} onPress={openDetail}>
            <LinearGradient colors={['#084F4A', '#0B6E67']} style={styles.detailGrad}>
              {isAccepted ? (
                <Ionicons name="play-circle-outline" size={14} color={colors.white} />
              ) : null}
              <Text style={styles.detailText}>
                {isLive ? 'Open job' : isAccepted ? 'Start visit' : 'View job'}
              </Text>
              <Ionicons name={isAccepted ? 'chevron-forward' : 'arrow-forward'} size={13} color={colors.white} />
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
    ...shadow.sm,
  },
  cardLive: { borderColor: 'rgba(21,112,239,0.2)' },
  pressed: { opacity: 0.92 },
  accent: { width: 4, backgroundColor: colors.primary },
  accentLive: { backgroundColor: '#1570EF' },
  body: { flex: 1, padding: spacing.md, gap: spacing.sm },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  serviceIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  serviceIconLive: { backgroundColor: '#1570EF' },
  headCopy: { flex: 1, gap: 2, minWidth: 0 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  service: { flex: 1, fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF6FF',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#1570EF' },
  liveText: { fontFamily: fonts.bold, fontSize: 8, color: '#1570EF', letterSpacing: 0.4 },
  acceptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.successBg,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  acceptedText: { fontFamily: fonts.bold, fontSize: 8, color: colors.success, letterSpacing: 0.3 },
  ref: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted },
  earn: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.partnerGold, flexShrink: 0 },
  customerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  customer: { flex: 1, fontFamily: fonts.semiBold, fontSize: 12, color: colors.inkSecondary },
  zone: { fontFamily: fonts.bold, fontSize: 10, color: colors.primaryDark },
  addrRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs },
  addr: { flex: 1, fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.bgMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  metaText: { fontFamily: fonts.semiBold, fontSize: 10, color: colors.muted },
  distText: { fontFamily: fonts.bold, fontSize: 10, color: colors.primaryDark },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: 2 },
  mapsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  mapsText: { fontFamily: fonts.bold, fontSize: 12, color: colors.primaryDark },
  detailBtn: { flex: 1.4, borderRadius: radius.pill, overflow: 'hidden' },
  detailGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 36,
    paddingHorizontal: spacing.sm,
  },
  detailText: { fontFamily: fonts.bold, fontSize: 12, color: colors.white },
});
