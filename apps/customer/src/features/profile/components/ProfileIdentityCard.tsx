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

function homeLabel(homeType?: string) {
  if (!homeType) return null;
  const map: Record<string, string> = {
    '1bhk': '1 BHK',
    '2bhk': '2 BHK',
    '3bhk': '3 BHK+',
    villa: 'Villa',
  };
  return map[homeType] ?? homeType;
}

interface ProfileIdentityCardProps {
  profile: UserProfile | null;
  percent: number;
  onEdit: () => void;
}

export function ProfileIdentityCard({ profile, percent, onEdit }: ProfileIdentityCardProps) {
  const home = homeLabel(profile?.homeType);
  const zone = RAIPUR_ZONES.find((z) => z.value === profile?.zone)?.label;
  const complete = percent >= 100;

  return (
    <Pressable
      style={styles.wrap}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onEdit();
      }}
      accessibilityRole="button"
      accessibilityLabel="Edit profile"
    >
      <LinearGradient colors={['#FFFFFF', '#F8FAFB']} style={StyleSheet.absoluteFill} />
      <View style={styles.accent} pointerEvents="none" />

      <ProfileAvatar
        name={profile?.name}
        uri={profile?.avatarUri}
        size="md"
        complete={complete}
        percent={percent}
      />

      <View style={styles.copy}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{profile?.name ?? 'Guest'}</Text>
          <View style={styles.editPill}>
            <Ionicons name="create-outline" size={11} color={colors.primaryDark} />
            <Text style={styles.editPillText}>Edit</Text>
          </View>
        </View>
        {profile?.publicId ? (
          <Text style={styles.idText}>ID {profile.publicId}</Text>
        ) : null}
        {profile?.email ? <Text style={styles.meta}>{profile.email}</Text> : (
          <Text style={styles.metaHint}>Add email for receipts</Text>
        )}
        {profile?.locality ? <Text style={styles.meta}>{profile.locality}</Text> : (
          <Text style={styles.metaHint}>Add society / locality</Text>
        )}

        <View style={styles.badges}>
          <View style={styles.badge}>
            <Ionicons name="location" size={11} color={colors.primary} />
            <Text style={styles.badgeText}>{zone ?? profile?.city ?? 'Raipur'}</Text>
          </View>
          {home ? (
            <View style={styles.badge}>
              <Ionicons name="home-outline" size={11} color={colors.primary} />
              <Text style={styles.badgeText}>{home}</Text>
            </View>
          ) : null}
          {profile?.gender ? (
            <View style={styles.badge}>
              <Ionicons name="person-outline" size={11} color={colors.primary} />
              <Text style={styles.badgeText}>{profile.gender}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color={colors.mutedLight} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: layout.pad,
    marginTop: -spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    zIndex: 2,
  },
  accent: {
    position: 'absolute',
    top: -50,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(11,110,103,0.05)',
  },
  copy: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  name: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.ink,
    letterSpacing: -0.3,
    flex: 1,
  },
  editPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editPillText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.primaryDark,
  },
  idText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.primaryDark,
    letterSpacing: 0.3,
  },
  meta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.mutedLight,
  },
  metaHint: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.primary,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: colors.primaryDark,
  },
});
