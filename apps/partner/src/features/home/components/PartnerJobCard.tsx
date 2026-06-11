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

interface PartnerJobCardProps {
  job: PartnerJob;
  variant?: 'pending' | 'active';
}

function serviceIcon(service: string): keyof typeof Ionicons.glyphMap {
  if (service.toLowerCase().includes('deep')) return 'sparkles';
  if (service.toLowerCase().includes('kitchen')) return 'restaurant-outline';
  return 'home-outline';
}

export function PartnerJobCard({ job, variant = 'pending' }: PartnerJobCardProps) {
  const router = useRouter();
  const isActive = variant === 'active';
  const net = netEarningPaise(job.amountPaise);

  const open = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/job/${job.id}` as Href);
  };

  return (
    <Pressable
      onPress={open}
      style={({ pressed }) => [styles.card, isActive && styles.cardActive, pressed && styles.pressed]}
    >
      <View style={[styles.accent, isActive && styles.accentActive]} />

      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={styles.serviceIcon}>
            <Ionicons name={serviceIcon(job.service)} size={18} color={isActive ? colors.primary : colors.partnerGold} />
          </View>
          <View style={styles.headCopy}>
            <View style={styles.titleRow}>
              <Text style={styles.service} numberOfLines={1}>{job.service}</Text>
              {!isActive ? (
                <View style={styles.newBadge}>
                  <Text style={styles.newText}>NEW</Text>
                </View>
              ) : (
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>ACTIVE</Text>
                </View>
              )}
            </View>
            <Text style={styles.ref}>{job.bookingRef}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.mutedLight} />
        </View>

        <View style={styles.customerRow}>
          <Ionicons name="person-circle-outline" size={16} color={colors.muted} />
          <Text style={styles.customer}>{job.customerName}</Text>
        </View>

        <View style={styles.addrRow}>
          <Ionicons name="location-outline" size={15} color={colors.primary} />
          <Text style={styles.addr} numberOfLines={2}>{job.address}</Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Ionicons name="calendar-outline" size={12} color={colors.muted} />
            <Text style={styles.metaText}>{job.visitDate}</Text>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="time-outline" size={12} color={colors.muted} />
            <Text style={styles.metaText} numberOfLines={1}>{job.slotLabel}</Text>
          </View>
          {job.distanceKm ? (
            <View style={[styles.metaChip, styles.distChip]}>
              <Ionicons name="navigate-outline" size={12} color={colors.primaryDark} />
              <Text style={styles.distText}>{job.distanceKm} km</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.earnLabel}>You earn</Text>
            <Text style={styles.earnValue}>{formatRs(net)}</Text>
          </View>
          {!isActive ? (
            <LinearGradient colors={['#084F4A', '#0B6E67']} style={styles.cta}>
              <Text style={styles.ctaText}>View & accept</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.white} />
            </LinearGradient>
          ) : (
            <View style={styles.trackCta}>
              <Text style={styles.trackText}>Open job</Text>
              <Ionicons name="map-outline" size={14} color={colors.primaryDark} />
            </View>
          )}
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
    borderColor: colors.border,
    ...shadow.card,
  },
  cardActive: {
    borderColor: 'rgba(11,110,103,0.35)',
    backgroundColor: '#F8FDFC',
  },
  pressed: { opacity: 0.94, transform: [{ scale: 0.995 }] },
  accent: {
    width: 4,
    backgroundColor: colors.partnerGold,
  },
  accentActive: { backgroundColor: colors.primary },
  body: { flex: 1, padding: spacing.lg, gap: spacing.sm },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.partnerGoldBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headCopy: { flex: 1, minWidth: 0, gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  service: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink, flex: 1 },
  newBadge: {
    backgroundColor: colors.partnerGoldBg,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(217,119,6,0.25)',
  },
  newText: { fontFamily: fonts.bold, fontSize: 9, color: colors.partnerGold, letterSpacing: 0.6 },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary },
  liveText: { fontFamily: fonts.bold, fontSize: 9, color: colors.primaryDark, letterSpacing: 0.5 },
  ref: { fontFamily: fonts.medium, fontSize: 11, color: colors.mutedLight, letterSpacing: 0.3 },
  customerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  customer: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.inkSecondary },
  addrRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  addr: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.muted, lineHeight: 17 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: 2 },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.bgSubtle,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  metaText: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted, maxWidth: 110 },
  distChip: { backgroundColor: colors.primaryLight },
  distText: { fontFamily: fonts.bold, fontSize: 10, color: colors.primaryDark },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  earnLabel: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.4 },
  earnValue: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.partnerGold, marginTop: 2 },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  ctaText: { fontFamily: fonts.bold, fontSize: 12, color: colors.white },
  trackCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.2)',
  },
  trackText: { fontFamily: fonts.bold, fontSize: 12, color: colors.primaryDark },
});
