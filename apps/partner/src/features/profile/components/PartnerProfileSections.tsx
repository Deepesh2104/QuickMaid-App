import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { PartnerProfile, PartnerSavedAddress } from '@/constants/app';
import { PartnerRequestsSectionHeader } from '@/features/jobs/components/PartnerRequestsSections';
import { getAddressLabelText } from '@/features/profile/lib/address.utils';
import {
  formatPhoneDisplay,
  initials,
  kycMeta,
  normalizePhoneDigits,
  type ProfileCompleteness,
  type ProfilePerformanceStats,
} from '@/features/profile/lib/profile.utils';
import {
  APP_VERSION,
  PARTNER_RATING,
  PROFILE_ACTIONS,
  PROFILE_LEGAL_LINKS,
  profilePremium,
} from '@/features/profile/constants/profile.premium';
import { PREFERRED_SLOTS } from '@/features/slots/constants/slots.premium';
import { PartnerSlotToggleCard } from '@/features/slots/components/PartnerSlotToggleCard';
import { resolvePreferredSlotIds, slotsSummaryLabel } from '@/features/slots/lib/slots.utils';
import { resolveDateOfBirth } from '@/lib/quickmaid-ids';
import { clearSession } from '@/lib/storage';
import { usePartnerAlert } from '@/context/PartnerAlertContext';
import { usePartner } from '@/context/PartnerContext';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

export function PartnerProfileCompletenessStrip({
  completeness,
  onPress,
}: {
  completeness: ProfileCompleteness;
  onPress: () => void;
}) {
  if (completeness.percent >= 100) return null;

  return (
    <Pressable style={styles.completeSimple} onPress={() => { Haptics.selectionAsync(); onPress(); }}>
      <View style={styles.completeSimpleTop}>
        <Text style={styles.completeSimpleTitle}>Profile {completeness.percent}% complete</Text>
        <Ionicons name="chevron-forward" size={14} color={colors.muted} />
      </View>
      <View style={styles.completeSimpleTrack}>
        <View style={[styles.completeSimpleFill, { width: `${completeness.percent}%` }]} />
      </View>
      {completeness.missing.length ? (
        <Text style={styles.completeSimpleSub} numberOfLines={1}>
          Add: {completeness.missing.slice(0, 2).join(', ')}
        </Text>
      ) : null}
    </Pressable>
  );
}

export function PartnerProfileHeroCard({
  profile,
  onEdit,
  onCopyId,
}: {
  profile: PartnerProfile | null;
  onEdit: () => void;
  onCopyId: () => void;
}) {
  const name = profile?.name ?? 'Partner';
  const partnerId = profile?.publicId ?? 'MD-—';
  const dob = resolveDateOfBirth(profile?.dateOfBirth, profile?.publicId);

  return (
    <View style={styles.heroCard}>
      <LinearGradient colors={[...profilePremium.cardGradient]} style={StyleSheet.absoluteFill} />
      <View style={styles.heroTop}>
        <Pressable onPress={() => { Haptics.selectionAsync(); onEdit(); }}>
          <LinearGradient colors={['rgba(8,79,74,0.15)', 'rgba(11,110,103,0.08)']} style={styles.avatarRing}>
            <Text style={styles.avatarText}>{initials(name)}</Text>
            <View style={styles.avatarEdit}>
              <Ionicons name="pencil" size={10} color={colors.white} />
            </View>
          </LinearGradient>
        </Pressable>
        <View style={styles.heroCopy}>
          <Text style={styles.heroName} numberOfLines={1}>{name}</Text>
          <Pressable style={styles.idRow} onPress={() => { Haptics.selectionAsync(); onCopyId(); }}>
            <Text style={styles.heroMetaLabel}>Maid ID · </Text>
            <Text style={styles.heroMeta}>{partnerId}</Text>
            <Ionicons name="copy-outline" size={12} color={colors.muted} />
          </Pressable>
          {dob ? (
            <Text style={styles.heroDob}>DOB · {dob}</Text>
          ) : null}
          <Text style={styles.heroSince}>Member since {profile?.memberSince ?? '—'}</Text>
          <View style={styles.heroBadges}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={11} color={colors.partnerGold} />
              <Text style={styles.ratingText}>{PARTNER_RATING}</Text>
            </View>
            <Pressable style={styles.editBadge} onPress={() => { Haptics.selectionAsync(); onEdit(); }}>
              <Ionicons name="create-outline" size={11} color={colors.primary} />
              <Text style={styles.editBadgeText}>Edit</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

export function PartnerProfilePerformanceCard({ stats }: { stats: ProfilePerformanceStats }) {
  const router = useRouter();
  const items = [
    {
      label: 'Rating',
      value: stats.rating,
      icon: 'star-outline' as const,
      tint: colors.partnerGold,
      onPress: () => router.push('/profile/rating' as Href),
    },
    { label: 'On-time', value: stats.onTimeRate, icon: 'time-outline' as const, tint: colors.success },
    { label: 'Completed', value: String(stats.completedJobs), icon: 'checkmark-done-outline' as const, tint: colors.primary },
    { label: 'This week', value: String(stats.weekJobs), icon: 'briefcase-outline' as const, tint: colors.primaryDark },
  ];

  return (
    <View style={styles.perfStrip}>
      {items.map((item, i) => {
        const cell = (
          <>
            <Text style={styles.perfStripValue}>{item.value}</Text>
            <Text style={styles.perfStripLabel}>{item.label}</Text>
          </>
        );
        return (
          <View key={item.label} style={styles.perfStripItem}>
            {item.onPress ? (
              <Pressable
                style={styles.perfStripPress}
                onPress={() => {
                  Haptics.selectionAsync();
                  item.onPress?.();
                }}
              >
                {cell}
              </Pressable>
            ) : (
              cell
            )}
            {i < items.length - 1 ? <View style={styles.perfStripDiv} /> : null}
          </View>
        );
      })}
    </View>
  );
}

export function PartnerProfileAccountCard({
  profile,
  onEdit,
}: {
  profile: PartnerProfile | null;
  onEdit: () => void;
}) {
  const dob = resolveDateOfBirth(profile?.dateOfBirth, profile?.publicId);

  const rows = [
    {
      icon: 'call-outline' as const,
      label: 'Mobile',
      value: normalizePhoneDigits(profile?.phone).length === 10
        ? `+91 ${formatPhoneDisplay(profile?.phone)}`
        : 'Not linked',
    },
    {
      icon: 'calendar-outline' as const,
      label: 'Date of birth',
      value: dob ?? 'Not set',
    },
    { icon: 'location-outline' as const, label: 'City & zone', value: `${profile?.city ?? '—'} · ${profile?.zone ?? '—'}` },
    {
      icon: 'construct-outline' as const,
      label: 'Skills',
      value: profile?.skills?.length ? profile.skills.join(' · ') : 'Not set',
    },
    { icon: 'calendar-outline' as const, label: 'Member since', value: profile?.memberSince ?? '—' },
  ];

  return (
    <View style={styles.block}>
      <PartnerRequestsSectionHeader
        eyebrow="Account"
        title="Partner details"
        subtitle="Tap Edit to update all partner details"
        icon="person-circle-outline"
        actionLabel="Edit"
        onAction={onEdit}
        compact
      />
      <View style={styles.infoCard}>
        {rows.map((row, i) => (
          <View key={row.label} style={[styles.infoRow, i < rows.length - 1 && styles.infoRowBorder]}>
            <View style={styles.infoIcon}>
              <Ionicons name={row.icon} size={16} color={colors.primary} />
            </View>
            <View style={styles.infoCopy}>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue} numberOfLines={2}>{row.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export function PartnerProfileAvailabilityCard() {
  const router = useRouter();
  const { profile } = usePartner();
  const activeIds = resolvePreferredSlotIds(profile);

  return (
    <View style={styles.simpleCard}>
      <View style={styles.simpleCardHead}>
        <Text style={styles.simpleCardTitle}>Preferred slots</Text>
        <Text style={styles.simpleCardSub}>{slotsSummaryLabel(activeIds)}</Text>
      </View>
      <View style={styles.slotList}>
        {PREFERRED_SLOTS.map((slot) => (
          <PartnerSlotToggleCard
            key={slot.id}
            slotId={slot.id}
            label={slot.label}
            sub={slot.sub}
            icon={slot.icon}
            peak={slot.peak}
            active={activeIds.includes(slot.id)}
          />
        ))}
      </View>
      <Pressable
        style={styles.slotSupport}
        onPress={() => {
          Haptics.selectionAsync();
          router.push('/slots' as Href);
        }}
      >
        <Ionicons name="create-outline" size={14} color={colors.primary} />
        <Text style={styles.slotSupportText}>Choose or change your slots</Text>
        <Ionicons name="chevron-forward" size={14} color={colors.mutedLight} />
      </Pressable>
    </View>
  );
}

export function PartnerProfileWorkBaseCard({
  address,
  onPress,
}: {
  address: PartnerSavedAddress | null;
  onPress: () => void;
}) {
  return (
    <View style={styles.block}>
      <PartnerRequestsSectionHeader
        eyebrow="Dispatch"
        title="Work base"
        subtitle="Where you start visits — used for job matching"
        icon="navigate-outline"
        actionLabel="Manage"
        onAction={onPress}
        compact
      />
      <Pressable style={styles.workCard} onPress={() => { Haptics.selectionAsync(); onPress(); }}>
        <LinearGradient colors={[...profilePremium.cardGradient]} style={StyleSheet.absoluteFill} />
        <View style={styles.workIcon}>
          <Ionicons name="navigate" size={20} color={colors.primary} />
        </View>
        <View style={styles.workCopy}>
          {address ? (
            <>
              <Text style={styles.workTitle}>
                {getAddressLabelText(address)} · {address.zone}
              </Text>
              <Text style={styles.workLine} numberOfLines={2}>{address.line}</Text>
              {address.pincode ? <Text style={styles.workPin}>PIN {address.pincode}</Text> : null}
            </>
          ) : (
            <>
              <Text style={styles.workTitle}>Add your work base</Text>
              <Text style={styles.workLine}>Partners with a base location get better dispatch matches</Text>
            </>
          )}
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.mutedLight} />
      </Pressable>
    </View>
  );
}

export function PartnerProfilePayoutCard({
  upiId,
  kycVerified,
  onEdit,
}: {
  upiId?: string;
  kycVerified: boolean;
  onEdit: () => void;
}) {
  const router = useRouter();

  return (
    <View style={styles.simpleCard}>
      <Pressable
        style={styles.simpleRowPress}
        onPress={() => {
          Haptics.selectionAsync();
          onEdit();
        }}
      >
        <Text style={styles.simpleRowLabel}>Payout UPI</Text>
        <Text style={styles.simpleRowValue} numberOfLines={1}>{upiId ?? 'Add UPI'}</Text>
        <Ionicons name="chevron-forward" size={14} color={colors.mutedLight} />
      </Pressable>
      <Text style={styles.simpleHint}>
        {kycVerified ? 'Monday payout batch' : 'Complete KYC to unlock'}
      </Text>
      <Pressable
        style={styles.earningsLink}
        onPress={() => {
          Haptics.selectionAsync();
          router.push('/(tabs)/earnings' as Href);
        }}
      >
        <Ionicons name="trending-up-outline" size={16} color={colors.primary} />
        <Text style={styles.earningsLinkText}>View earnings & payout history</Text>
        <Ionicons name="chevron-forward" size={14} color={colors.mutedLight} />
      </Pressable>
    </View>
  );
}

export function PartnerProfileSettingsCard() {
  const router = useRouter();

  return (
    <Pressable
      style={styles.settingsCard}
      onPress={() => {
        Haptics.selectionAsync();
        router.push('/settings' as Href);
      }}
    >
      <LinearGradient colors={[...profilePremium.cardGradient]} style={styles.settingsGrad}>
        <View style={styles.settingsIcon}>
          <Ionicons name="settings-outline" size={20} color={colors.primary} />
        </View>
        <View style={styles.settingsCopy}>
          <Text style={styles.settingsTitle}>Settings</Text>
          <Text style={styles.settingsSub}>Photo, slots, legal & more</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} />
      </LinearGradient>
    </Pressable>
  );
}

export function PartnerProfileLogoutCard() {
  const router = useRouter();
  const { alert } = usePartnerAlert();

  const logout = () => {
    alert({
      title: 'Sign out?',
      message: 'You can sign back in anytime with your registered mobile number.',
      variant: 'warning',
      icon: 'log-out-outline',
      buttons: [
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              await clearSession();
              router.replace('/(auth)/login');
            })();
          },
        },
        { text: 'Stay signed in', style: 'cancel' },
      ],
    });
  };

  return (
    <Pressable
      style={styles.logoutCard}
      onPress={() => {
        Haptics.selectionAsync();
        logout();
      }}
    >
      <View style={styles.logoutIcon}>
        <Ionicons name="log-out-outline" size={18} color={colors.error} />
      </View>
      <View style={styles.logoutCopy}>
        <Text style={styles.logoutTitle}>Sign out</Text>
        <Text style={styles.logoutSub}>Sign back in with your mobile number</Text>
      </View>
    </Pressable>
  );
}

export function PartnerProfileVerificationCard({ profile }: { profile: PartnerProfile | null }) {
  const meta = kycMeta(profile?.kycStatus);
  const router = useRouter();

  const onPress = () => {
    Haptics.selectionAsync();
    router.push('/kyc' as Href);
  };

  return (
    <View style={styles.simpleCard}>
      <Pressable style={styles.simpleRowPress} onPress={onPress}>
        <Ionicons name={meta.icon} size={16} color={meta.color} />
        <View style={styles.simpleRowMid}>
          <Text style={styles.simpleCardTitle}>KYC · {meta.label}</Text>
          <Text style={styles.simpleHint} numberOfLines={1}>{meta.hint}</Text>
        </View>
        <Ionicons name="chevron-forward" size={14} color={colors.mutedLight} />
      </Pressable>
    </View>
  );
}

export function PartnerProfileLegalSection() {
  const router = useRouter();

  return (
    <View style={styles.simpleCard}>
      <Text style={[styles.simpleCardTitle, { marginBottom: spacing.xs }]}>Policies</Text>
      <View style={styles.actionList}>
        {PROFILE_LEGAL_LINKS.map((link, i) => (
          <Pressable
            key={link.id}
            style={[styles.actionRow, i === PROFILE_LEGAL_LINKS.length - 1 && styles.actionRowLast]}
            onPress={() => {
              Haptics.selectionAsync();
              router.push(link.route as Href);
            }}
          >
            <View style={styles.actionIcon}>
              <Ionicons name={link.icon} size={18} color={colors.primary} />
            </View>
            <View style={styles.actionCopy}>
              <Text style={styles.actionTitle}>{link.label}</Text>
              <Text style={styles.actionSub}>{link.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function PartnerProfileActions({
  onSignOut,
  onDeleteAccount,
}: {
  onSignOut: () => void;
  onDeleteAccount: () => void;
}) {
  const router = useRouter();

  return (
    <View style={styles.block}>
      <PartnerRequestsSectionHeader
        eyebrow="More"
        title="Account actions"
        icon="ellipsis-horizontal-circle-outline"
        compact
      />
      <View style={styles.actionList}>
        {PROFILE_ACTIONS.map((action) => (
          <Pressable
            key={action.id}
            style={styles.actionRow}
            onPress={() => {
              Haptics.selectionAsync();
              router.push(action.route as Href);
            }}
          >
            <View style={styles.actionIcon}>
              <Ionicons name={action.icon} size={18} color={colors.primary} />
            </View>
            <View style={styles.actionCopy}>
              <Text style={styles.actionTitle}>{action.label}</Text>
              <Text style={styles.actionSub}>{action.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} />
          </Pressable>
        ))}

        <Pressable style={styles.actionRow} onPress={() => { Haptics.selectionAsync(); onSignOut(); }}>
          <View style={[styles.actionIcon, styles.signOutIcon]}>
            <Ionicons name="log-out-outline" size={18} color={colors.error} />
          </View>
          <View style={styles.actionCopy}>
            <Text style={styles.signOutTitle}>Sign out</Text>
            <Text style={styles.actionSub}>Sign back in with your mobile number</Text>
          </View>
        </Pressable>

        <Pressable
          style={[styles.actionRow, styles.actionRowLast]}
          onPress={() => { Haptics.selectionAsync(); onDeleteAccount(); }}
        >
          <View style={[styles.actionIcon, styles.deleteIcon]}>
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </View>
          <View style={styles.actionCopy}>
            <Text style={styles.signOutTitle}>Delete account</Text>
            <Text style={styles.actionSub}>Permanently remove partner profile</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

export function PartnerProfileFooter() {
  return (
    <View style={styles.footer}>
      <View style={styles.footerLine} />
      <Text style={styles.footerBrand}>QuickMaid Partner</Text>
      <Text style={styles.footerSub}>Raipur pilot · v{APP_VERSION}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: spacing.sm },
  simpleCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  simpleCardHead: { gap: 2, marginBottom: spacing.xs },
  simpleCardTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  simpleCardSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  simpleRowPress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 4,
  },
  simpleRowMid: { flex: 1, gap: 2, minWidth: 0 },
  simpleRowLabel: { flex: 1, fontFamily: fonts.medium, fontSize: 13, color: colors.muted },
  simpleRowValue: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.ink, maxWidth: '50%' },
  simpleHint: { fontFamily: fonts.regular, fontSize: 11, color: colors.mutedLight },

  completeSimple: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  completeSimpleTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  completeSimpleTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  completeSimpleTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.bgMuted,
    overflow: 'hidden',
  },
  completeSimpleFill: { height: '100%', borderRadius: 2, backgroundColor: colors.primary },
  completeSimpleSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },

  heroCard: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.14)',
    ...shadow.sm,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatarRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(11,110,103,0.2)',
  },
  avatarText: { fontFamily: fonts.extraBold, fontSize: 22, color: colors.primaryDark },
  avatarEdit: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  heroCopy: { flex: 1, gap: 3, minWidth: 0 },
  heroName: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.ink, letterSpacing: -0.3 },
  idRow: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', flexWrap: 'wrap' },
  heroMetaLabel: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.mutedLight },
  heroMeta: { fontFamily: fonts.bold, fontSize: 11, color: colors.muted, letterSpacing: 0.3 },
  heroDob: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.muted },
  heroSince: { fontFamily: fonts.regular, fontSize: 11, color: colors.mutedLight },
  heroBadges: { flexDirection: 'row', gap: spacing.sm, marginTop: 4 },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(217,119,6,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  ratingText: { fontFamily: fonts.bold, fontSize: 11, color: colors.partnerGold },
  editBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  editBadgeText: { fontFamily: fonts.semiBold, fontSize: 10, color: colors.primary },

  perfStrip: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
  },
  perfStripItem: { flex: 1, alignItems: 'center', gap: 2, position: 'relative' },
  perfStripPress: { alignItems: 'center', gap: 2 },
  perfStripValue: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.ink },
  perfStripLabel: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted },
  perfStripDiv: {
    position: 'absolute',
    right: 0,
    top: 4,
    bottom: 4,
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
  },

  infoCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    overflow: 'hidden',
    ...shadow.sm,
  },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, padding: spacing.md },
  infoRowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.divider },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCopy: { flex: 1, gap: 2, minWidth: 0 },
  infoLabel: { fontFamily: fonts.bold, fontSize: 9, color: colors.muted, letterSpacing: 0.6, textTransform: 'uppercase' },
  infoValue: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink, lineHeight: 19 },

  slotList: { gap: spacing.sm },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.md,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.12)',
    ...shadow.sm,
  },
  slotIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotCopy: { flex: 1, gap: 2 },
  slotLabel: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  slotSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  slotOn: {
    backgroundColor: 'rgba(16,185,129,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  slotOnText: { fontFamily: fonts.bold, fontSize: 9, color: colors.success, letterSpacing: 0.3 },
  slotSupport: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs },
  slotSupportText: { flex: 1, fontFamily: fonts.semiBold, fontSize: 11, color: colors.primary },

  workCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.14)',
    ...shadow.sm,
  },
  workIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  workCopy: { flex: 1, gap: 3, minWidth: 0 },
  workTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  workLine: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, lineHeight: 17 },
  workPin: { fontFamily: fonts.medium, fontSize: 11, color: colors.primary },

  payoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    ...shadow.sm,
  },
  payoutIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(217,119,6,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payoutCopy: { flex: 1, gap: 2, minWidth: 0 },
  payoutLabel: { fontFamily: fonts.bold, fontSize: 9, color: colors.muted, letterSpacing: 0.5, textTransform: 'uppercase' },
  payoutValue: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.ink },
  payoutHint: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  editPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  editPillText: { fontFamily: fonts.bold, fontSize: 11, color: colors.primary },
  earningsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  earningsLinkText: { flex: 1, fontFamily: fonts.semiBold, fontSize: 12, color: colors.primary },

  kycCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.05)',
  },
  kycIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.sm,
  },
  kycCopy: { flex: 1, gap: 2 },
  kycTitle: { fontFamily: fonts.extraBold, fontSize: 14 },
  kycSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },

  settingsCard: { borderRadius: radius.xl, overflow: 'hidden' },
  settingsGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.12)',
    borderRadius: radius.xl,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsCopy: { flex: 1, gap: 2 },
  settingsTitle: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.ink },
  settingsSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },

  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.12)',
  },
  logoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(239,68,68,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutCopy: { flex: 1, gap: 2 },
  logoutTitle: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.error },
  logoutSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },

  actionList: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    ...shadow.sm,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  actionRowLast: { borderBottomWidth: 0 },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCopy: { flex: 1, gap: 2, minWidth: 0 },
  actionTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  actionSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  signOutIcon: { backgroundColor: 'rgba(239,68,68,0.1)' },
  deleteIcon: { backgroundColor: 'rgba(239,68,68,0.08)' },
  signOutTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.error },

  footer: { alignItems: 'center', gap: 4, paddingTop: spacing.md },
  footerLine: { width: 40, height: 3, borderRadius: 2, backgroundColor: colors.bgMuted, marginBottom: spacing.xs },
  footerBrand: { fontFamily: fonts.extraBold, fontSize: 13, color: colors.muted },
  footerSub: { fontFamily: fonts.medium, fontSize: 11, color: colors.mutedLight },
});
