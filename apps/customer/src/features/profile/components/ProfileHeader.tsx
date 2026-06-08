import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { UserProfile } from '@/constants/app';
import { RAIPUR_ZONES } from '@/constants/customer.zones';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

import { ProfileAvatar } from './ProfileAvatar';

interface ProfileHeaderProps {
  paddingTop: number;
  profile: UserProfile | null;
  isPlusMember?: boolean;
  visits: number;
  rating: string;
  saved: string;
  memberSince: string;
  completionPercent: number;
  onEditProfile: () => void;
  onChangePhoto: () => void;
}

export function ProfileHeader({
  paddingTop,
  profile,
  isPlusMember,
  visits,
  rating,
  saved,
  memberSince,
  completionPercent,
  onEditProfile,
  onChangePhoto,
}: ProfileHeaderProps) {
  const STATS = [
    { icon: 'calendar' as const, value: String(visits), label: 'Visits' },
    { icon: 'star' as const, value: rating, label: 'Rating' },
    { icon: 'wallet' as const, value: saved, label: 'Saved' },
  ];

  const zone = RAIPUR_ZONES.find((z) => z.value === profile?.zone)?.label;
  const complete = completionPercent >= 100;

  return (
    <View style={styles.wrap}>
      <LinearGradient colors={['#084F4A', '#0B6E67', '#0F1419']} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />
      <View style={styles.orbA} pointerEvents="none" />
      <View style={styles.orbB} pointerEvents="none" />
      <View style={styles.orbC} pointerEvents="none" />

      <View style={[styles.content, { paddingTop: paddingTop + spacing.md }]}>
        <View style={styles.topRow}>
          <View style={styles.brandPill}>
            <Ionicons name="shield-checkmark" size={12} color="#6EE7B7" />
            <Text style={styles.brandText}>Verified account</Text>
          </View>
          <Pressable
            style={styles.gear}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onEditProfile();
            }}
            accessibilityLabel="Edit profile"
            accessibilityRole="button"
          >
            <Ionicons name="create-outline" size={18} color={colors.white} />
          </Pressable>
        </View>

        <View style={styles.heroRow}>
          <ProfileAvatar
            name={profile?.name}
            uri={profile?.avatarUri}
            size="xl"
            showCamera
            complete={complete}
            percent={completionPercent}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onChangePhoto();
            }}
          />

          <View style={styles.heroCopy}>
            <Text style={styles.name} numberOfLines={2}>{profile?.name ?? 'Your profile'}</Text>
            <Text style={styles.phone}>+91 {profile?.phone ?? '—'}</Text>
            <Text style={styles.zone}>{zone ?? profile?.city ?? 'Raipur'} · QuickMaid</Text>

            <View style={styles.memberRow}>
              <View style={[styles.memberBadge, isPlusMember && styles.memberBadgePlus]}>
                <Ionicons name={isPlusMember ? 'diamond' : 'leaf'} size={11} color={isPlusMember ? '#FCD34D' : '#6EE7B7'} />
                <Text style={[styles.memberText, isPlusMember && styles.memberTextPlus]}>
                  {isPlusMember ? 'Plus Member' : 'Free plan'}
                </Text>
              </View>
              <Text style={styles.since}>Since {memberSince}</Text>
            </View>
          </View>
        </View>

        <View style={styles.stats} accessibilityRole="summary">
          {STATS.map((s, i) => (
            <View key={s.label} style={[styles.stat, i > 0 && styles.statSep]}>
              <View style={styles.statIcon}>
                <Ionicons name={s.icon} size={14} color="#6EE7B7" />
              </View>
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
    minHeight: 268,
    overflow: 'hidden',
    backgroundColor: '#0F1419',
  },
  orbA: {
    position: 'absolute',
    top: -30,
    right: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(110,231,183,0.12)',
  },
  orbB: {
    position: 'absolute',
    bottom: 40,
    left: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  orbC: {
    position: 'absolute',
    top: 80,
    right: 60,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(252,211,77,0.1)',
  },
  content: {
    paddingHorizontal: layout.pad,
    paddingBottom: spacing.xxl + 6,
    gap: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.2)',
  },
  brandText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: '#6EE7B7',
  },
  gear: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  heroCopy: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: colors.white,
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  phone: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: 'rgba(255,255,255,0.88)',
  },
  zone: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  memberBadgePlus: {
    backgroundColor: 'rgba(252,211,77,0.15)',
  },
  memberText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: '#6EE7B7',
  },
  memberTextPlus: { color: '#FCD34D' },
  since: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.45)',
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  statSep: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: 'rgba(255,255,255,0.12)',
  },
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(110,231,183,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.white,
  },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
  },
});
