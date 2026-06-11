import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { PartnerProfile } from '@/constants/app';
import { PartnerNotificationBell } from '@/features/notifications/components/PartnerNotificationBell';
import { HOME_PREMIUM } from '@/features/home/constants/home.premium';
import { partnerGreeting } from '@/features/home/lib/home.greeting';
import { PARTNER_RATING } from '@/features/profile/constants/profile.premium';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const SHEET_OVERLAP = 14;

interface PartnerHomeHeaderProps {
  paddingTop: number;
  profile: PartnerProfile | null;
  unreadCount: number;
  workTitle: string;
  workLine: string;
  openCount: number;
  todayCount: number;
  earningsLabel: string;
  onNotificationsPress: () => void;
  onWorkAddressPress: () => void;
}

export function PartnerHomeHeader({
  paddingTop,
  profile,
  unreadCount,
  workTitle,
  workLine,
  openCount,
  todayCount,
  earningsLabel,
  onNotificationsPress,
  onWorkAddressPress,
}: PartnerHomeHeaderProps) {
  const router = useRouter();
  const firstName = profile?.name?.split(' ')[0];
  const title = partnerGreeting(firstName) || `Hello, ${firstName ?? 'Partner'}`;

  return (
    <LinearGradient
      colors={[...HOME_PREMIUM.heroGradient]}
      locations={[0, 0.5, 1]}
      style={[styles.wrap, { paddingTop: paddingTop + spacing.xs }]}
    >
      <View style={styles.glowGold} pointerEvents="none" />
      <View style={styles.glowTeal} pointerEvents="none" />

      <View style={styles.topBar}>
        <Pressable
          style={styles.locationBlock}
          onPress={() => {
            Haptics.selectionAsync();
            onWorkAddressPress();
          }}
          accessibilityRole="button"
          accessibilityLabel={`Work location, ${workTitle}`}
        >
          <Ionicons name="navigate" size={16} color={colors.white} />
          <View style={styles.locationText}>
            <View style={styles.locationTitleRow}>
              <Text style={styles.locationTitle} numberOfLines={1}>
                {workTitle}
              </Text>
              <Ionicons name="chevron-down" size={13} color="rgba(255,255,255,0.8)" />
            </View>
            <Text style={styles.locationSub} numberOfLines={1}>
              {workLine}
            </Text>
          </View>
        </Pressable>

        <View style={styles.topRight}>
          <PartnerNotificationBell count={unreadCount} onPress={onNotificationsPress} />
          <Pressable
            style={styles.avatarBtn}
            onPress={() => {
              Haptics.selectionAsync();
              router.push('/(tabs)/profile' as Href);
            }}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0.08)']}
              style={styles.avatarRing}
            >
              <Text style={styles.avatarText}>{(profile?.name ?? 'P').charAt(0).toUpperCase()}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      <View style={styles.headerRow}>
        <View style={styles.tabIcon}>
          <Ionicons name="briefcase" size={18} color={colors.partnerGold} />
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.headerEyebrow}>YOUR DAY</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.headerSub}>
            {profile?.zone ?? 'Your zone'} · {profile?.publicId ?? 'MD-—'}
          </Text>
        </View>
        <View style={styles.ratingPill}>
          <Ionicons name="star" size={11} color={colors.partnerGold} />
          <Text style={styles.ratingText}>{PARTNER_RATING}</Text>
        </View>
      </View>

      <View style={styles.statBar}>
        <View style={styles.statChip}>
          <Text style={styles.statNum}>{openCount}</Text>
          <Text style={styles.statLabel}>Open</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statChip}>
          <Text style={styles.statNum}>{todayCount}</Text>
          <Text style={styles.statLabel}>Today</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statChip}>
          <Text style={[styles.statNum, styles.statEarn]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
            {earningsLabel}
          </Text>
          <Text style={styles.statLabel}>Earned today</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: layout.pad,
    paddingBottom: SHEET_OVERLAP + spacing.md,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  glowGold: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(217,119,6,0.14)',
  },
  glowTeal: {
    position: 'absolute',
    bottom: 20,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(45,212,191,0.08)',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  locationBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minWidth: 0,
  },
  locationText: { flex: 1, minWidth: 0, gap: 2 },
  locationTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationTitle: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.white,
  },
  locationSub: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.72)',
  },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatarBtn: {},
  avatarRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  avatarText: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.white },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  tabIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(217,119,6,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  headerCopy: { flex: 1, gap: 1, minWidth: 0 },
  headerEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(252,211,77,0.9)',
    letterSpacing: 1,
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.white,
    letterSpacing: -0.3,
  },
  headerSub: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.pill,
    marginTop: 4,
  },
  ratingText: { fontFamily: fonts.bold, fontSize: 11, color: colors.white },
  statBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(110,231,183,0.1)',
    borderRadius: radius.lg,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.22)',
  },
  statChip: { flex: 1, alignItems: 'center', gap: 1, minWidth: 0, paddingHorizontal: 2 },
  statNum: {
    fontFamily: fonts.extraBold,
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
  },
  statEarn: { color: colors.partnerGold },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
    marginVertical: 2,
  },
});
