import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import type { UserProfile } from '@/constants/app';
import { RAIPUR_ZONES } from '@/constants/customer.zones';
import { HomePhoto } from '@/features/home/components/HomePhoto';
import { HOME_IMAGES } from '@/features/home/constants/unsplash.images';
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

const fill: ViewStyle = StyleSheet.absoluteFill;

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
  const firstName = profile?.name?.split(' ')[0];

  return (
    <View style={styles.wrap}>
      <HomePhoto uri={HOME_IMAGES.profileHero} style={styles.photo} overlay="none" />
      <LinearGradient
        colors={['rgba(8,79,74,0.42)', 'rgba(11,110,103,0.55)', 'rgba(15,20,25,0.92)', '#0F1419']}
        locations={[0, 0.32, 0.68, 1]}
        style={fill}
      />
      <View style={styles.glowA} pointerEvents="none" />
      <View style={styles.glowB} pointerEvents="none" />

      <View style={[styles.content, { paddingTop: paddingTop + spacing.sm }]}>
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

        <View style={styles.identity}>
          <ProfileAvatar
            name={profile?.name}
            uri={profile?.avatarUri}
            size="xl"
            showCamera
            complete={complete}
            percent={completionPercent}
            style={styles.avatar}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onChangePhoto();
            }}
          />

          <Text style={styles.name} numberOfLines={2}>
            {profile?.name ?? 'Your profile'}
          </Text>
          {firstName ? (
            <Text style={styles.greeting}>Welcome back, {firstName}</Text>
          ) : null}
          <Text style={styles.phone}>+91 {profile?.phone ?? '—'}</Text>
          <Text style={styles.zone}>{zone ?? profile?.city ?? 'Raipur'} · QuickMaid member</Text>

          <View style={styles.memberRow}>
            <View style={[styles.memberBadge, isPlusMember && styles.memberBadgePlus]}>
              <Ionicons
                name={isPlusMember ? 'diamond' : 'leaf'}
                size={11}
                color={isPlusMember ? '#FCD34D' : '#6EE7B7'}
              />
              <Text style={[styles.memberText, isPlusMember && styles.memberTextPlus]}>
                {isPlusMember ? 'Plus Member' : 'Free plan'}
              </Text>
            </View>
            <Text style={styles.since}>Since {memberSince}</Text>
          </View>
        </View>

        <View style={styles.stats} accessibilityRole="summary">
          {STATS.map((s, i) => (
            <View key={s.label} style={[styles.stat, i > 0 && styles.statSep]}>
              <View style={styles.statIcon}>
                <Ionicons name={s.icon} size={14} color="#6EE7B7" />
              </View>
              <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
                {s.value}
              </Text>
              <Text style={styles.statLabel} numberOfLines={1}>
                {s.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 318,
    overflow: 'hidden',
    backgroundColor: '#0F1419',
  },
  photo: { ...fill },
  glowA: {
    position: 'absolute',
    top: 48,
    right: -24,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(110,231,183,0.14)',
  },
  glowB: {
    position: 'absolute',
    bottom: 72,
    left: -36,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(252,211,77,0.08)',
  },
  content: {
    paddingHorizontal: layout.pad,
    paddingBottom: spacing.xxl + 8,
    gap: spacing.lg,
    zIndex: 2,
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
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.28)',
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
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  identity: {
    alignItems: 'center',
    gap: 4,
  },
  avatar: {
    alignSelf: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    fontFamily: fonts.extraBold,
    fontSize: 24,
    color: colors.white,
    letterSpacing: -0.6,
    lineHeight: 28,
    textAlign: 'center',
  },
  greeting: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.72)',
    textAlign: 'center',
  },
  phone: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  zone: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
    flexWrap: 'wrap',
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  memberBadgePlus: {
    backgroundColor: 'rgba(252,211,77,0.18)',
    borderColor: 'rgba(252,211,77,0.28)',
  },
  memberText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: '#6EE7B7',
    letterSpacing: 0.2,
  },
  memberTextPlus: { color: '#FCD34D' },
  since: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.48)',
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  stat: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 2,
  },
  statSep: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: 'rgba(255,255,255,0.14)',
  },
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(110,231,183,0.16)',
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
    color: 'rgba(255,255,255,0.58)',
  },
});
