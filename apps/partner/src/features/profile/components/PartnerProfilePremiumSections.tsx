import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { type Href, useRouter } from 'expo-router';

import type { PartnerProfile, PartnerSavedAddress } from '@/constants/app';
import {
  experienceLabel,
  formatPhoneDisplay,
  genderLabel,
  initials,
  kycMeta,
  maritalLabel,
  normalizePhoneDigits,
  travelLabel,
} from '@/features/profile/lib/profile.utils';
import { resolveDateOfBirth } from '@/lib/quickmaid-ids';
import { resolvePreferredSlotIds, slotsSummaryLabel } from '@/features/slots/lib/slots.utils';
import { PARTNER_RATING, profilePremium } from '@/features/profile/constants/profile.premium';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

function SimpleRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

function SectionLabel({ title }: { title: string }) {
  return <Text style={styles.sectionLabel}>{title}</Text>;
}

/** Slim teal page hero — fixed top of Profile screen */
export function PartnerProfilePageHero({
  profile,
  paddingTop,
  onBack,
  onEdit,
  onCopyId,
}: {
  profile: PartnerProfile | null;
  paddingTop: number;
  onBack: () => void;
  onEdit: () => void;
  onCopyId: () => void;
}) {
  const router = useRouter();
  const name = profile?.name ?? 'Partner';
  const maidId = profile?.publicId ?? 'MD-—';
  const kyc = kycMeta(profile?.kycStatus);
  const subline = [profile?.zone ?? 'Raipur', `★ ${PARTNER_RATING}`, kyc.label].join(' · ');

  return (
    <LinearGradient
      colors={[...profilePremium.heroGradient]}
      locations={[0, 0.55, 1]}
      style={[styles.pageHero, { paddingTop: paddingTop + spacing.xs }]}
    >
      <View style={styles.pageHeroRow}>
        <Pressable style={styles.pageHeroBack} onPress={onBack} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color={colors.white} />
        </Pressable>

        <View style={styles.pageHeroMain}>
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              router.push('/profile/photo' as Href);
            }}
          >
            <View style={styles.pageHeroAvatar}>
              {profile?.photoUri ? (
                <Image source={{ uri: profile.photoUri }} style={styles.pageHeroAvatarImage} />
              ) : (
                <Text style={styles.pageHeroAvatarText}>{initials(name)}</Text>
              )}
            </View>
          </Pressable>
          <View style={styles.pageHeroCopy}>
            <View style={styles.pageHeroNameRow}>
              <Text style={styles.pageHeroName} numberOfLines={1}>{name}</Text>
              <Pressable onPress={() => { Haptics.selectionAsync(); onEdit(); }} hitSlop={6}>
                <Text style={styles.pageHeroEdit}>Edit</Text>
              </Pressable>
            </View>
            <Text style={styles.pageHeroMeta} numberOfLines={1}>{subline}</Text>
            <Pressable
              style={styles.pageHeroIdRow}
              onPress={() => { Haptics.selectionAsync(); onCopyId(); }}
              hitSlop={4}
            >
              <Text style={styles.pageHeroId} numberOfLines={1}>{maidId}</Text>
              <Ionicons name="copy-outline" size={12} color="rgba(255,255,255,0.65)" />
            </Pressable>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

/** @deprecated Use PartnerProfilePageHero — kept for hot-reload / cached bundles */
export function PartnerProfileUltraHero({
  profile,
  onEdit,
  onCopyId,
}: {
  profile: PartnerProfile | null;
  onEdit: () => void;
  onCopyId: () => void;
}) {
  return (
    <PartnerProfilePageHero
      profile={profile}
      paddingTop={0}
      onBack={onEdit}
      onEdit={onEdit}
      onCopyId={onCopyId}
    />
  );
}

export function PartnerProfileMaidDossier({
  profile,
  defaultAddress,
  onEdit,
  onAddressPress,
}: {
  profile: PartnerProfile | null;
  defaultAddress: PartnerSavedAddress | null;
  onEdit: () => void;
  onAddressPress?: () => void;
}) {
  const phone = normalizePhoneDigits(profile?.phone);
  const alt = normalizePhoneDigits(profile?.alternatePhone);
  const emergency = profile?.emergencyContact;
  const skills = profile?.skills?.join(', ') || '—';
  const languages = profile?.languages?.join(', ') || '—';
  const dob = resolveDateOfBirth(profile?.dateOfBirth, profile?.publicId);
  const kyc = kycMeta(profile?.kycStatus);
  const slotIds = resolvePreferredSlotIds(profile);

  return (
    <View style={styles.dossierCard}>
      <View style={styles.dossierHead}>
        <Text style={styles.dossierTitle}>Your details</Text>
        <Pressable onPress={() => { Haptics.selectionAsync(); onEdit(); }} hitSlop={8}>
          <Text style={styles.dossierEdit}>Edit</Text>
        </Pressable>
      </View>

      <SectionLabel title="Identity" />
      <SimpleRow label="Maid ID" value={profile?.publicId ?? '—'} />
      <SimpleRow label="Date of birth" value={dob ?? '—'} />
      <SimpleRow label="Gender" value={genderLabel(profile?.gender)} />
      <SimpleRow label="Marital" value={maritalLabel(profile?.maritalStatus)} />
      <SimpleRow label="Member since" value={profile?.memberSince ?? '—'} last />

      <SectionLabel title="Contact" />
      <SimpleRow label="Mobile" value={phone.length === 10 ? `+91 ${formatPhoneDisplay(phone)}` : 'Not linked'} />
      <SimpleRow label="Alternate" value={alt.length === 10 ? `+91 ${formatPhoneDisplay(alt)}` : '—'} />
      <SimpleRow label="Email" value={profile?.email ?? '—'} last />

      <SectionLabel title="Emergency" />
      <SimpleRow label="Name" value={emergency?.name ?? 'Not set'} />
      <SimpleRow label="Relation" value={emergency?.relation ?? '—'} />
      <SimpleRow
        label="Phone"
        value={
          emergency?.phone && normalizePhoneDigits(emergency.phone).length === 10
            ? `+91 ${formatPhoneDisplay(emergency.phone)}`
            : '—'
        }
        last
      />

      <SectionLabel title="Home" />
      <Pressable
        onPress={onAddressPress ? () => { Haptics.selectionAsync(); onAddressPress(); } : undefined}
        disabled={!onAddressPress}
      >
        <SimpleRow label="Address" value={defaultAddress?.line ?? '—'} />
        <SimpleRow label="Landmark" value={defaultAddress?.landmark ?? '—'} />
        <SimpleRow label="Pincode" value={defaultAddress?.pincode ?? '—'} />
        <SimpleRow
          label="Zone"
          value={`${profile?.city ?? 'Raipur'} · ${profile?.zone ?? '—'}`}
          last
        />
      </Pressable>

      <SectionLabel title="Work" />
      <SimpleRow label="Skills" value={skills} />
      <SimpleRow label="Languages" value={languages} />
      <SimpleRow label="Experience" value={experienceLabel(profile?.experienceYears)} />
      <SimpleRow label="Travel" value={travelLabel(profile?.travelMode)} />
      <SimpleRow
        label="Radius"
        value={profile?.workRadiusKm ? `${profile.workRadiusKm} km` : '—'}
      />
      <SimpleRow label="Slots" value={slotsSummaryLabel(slotIds)} last />

      <SectionLabel title="Payout & KYC" />
      <SimpleRow label="UPI ID" value={profile?.upiId ?? '—'} />
      <SimpleRow label="KYC status" value={kyc.label} last />

      {profile?.bio ? (
        <>
          <SectionLabel title="Bio" />
          <Text style={styles.bioText}>{profile.bio}</Text>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pageHero: {
    paddingHorizontal: layout.pad,
    paddingBottom: spacing.md,
  },
  pageHeroRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs },
  pageHeroBack: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  pageHeroMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, minWidth: 0 },
  pageHeroAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    overflow: 'hidden',
  },
  pageHeroAvatarText: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.white },
  pageHeroAvatarImage: { width: '100%', height: '100%' },
  pageHeroCopy: { flex: 1, gap: 2, minWidth: 0 },
  pageHeroNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  pageHeroName: {
    flex: 1,
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.white,
    letterSpacing: -0.2,
  },
  pageHeroEdit: { fontFamily: fonts.bold, fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  pageHeroMeta: { fontFamily: fonts.regular, fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  pageHeroIdRow: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  pageHeroId: { fontFamily: fonts.semiBold, fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.3 },

  dossierCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  dossierHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  dossierTitle: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.ink },
  dossierEdit: { fontFamily: fonts.bold, fontSize: 13, color: colors.primary },
  sectionLabel: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: 10,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  rowLabel: {
    width: 88,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
  },
  rowValue: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.ink,
    textAlign: 'right',
    lineHeight: 18,
  },
  bioText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.ink,
    lineHeight: 19,
    paddingBottom: spacing.sm,
  },
});
