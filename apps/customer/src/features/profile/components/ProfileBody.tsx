import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { UserProfile } from '@/constants/app';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

import type { NotificationPrefs, ProfileAccountData } from '../types/profile.types';
import { ProfileActivitySection } from './ProfileActivitySection';
import { ProfileAddressesSection } from './ProfileAddressesSection';
import { ProfileCommunicationSection } from './ProfileCommunicationSection';
import { ProfileCompletenessStrip } from './ProfileCompletenessStrip';
import { ProfileCrmStatsStrip } from './ProfileCrmStatsStrip';
import { ProfileIdentityCard } from './ProfileIdentityCard';
import { ProfileMembershipBanner } from './ProfileMembershipBanner';
import { ProfilePermissionsSection } from './ProfilePermissionsSection';
import { ProfilePreferencesSection } from './ProfilePreferencesSection';
import { ProfileQuickActions } from './ProfileQuickActions';
import { ProfileReferralCard } from './ProfileReferralCard';
import { ProfileSecuritySection } from './ProfileSecuritySection';
import { ProfileServiceDetailsSection } from './ProfileServiceDetailsSection';
import { ProfileSupportSection } from './ProfileSupportSection';
import { ProfilePaymentHistorySection } from './ProfilePaymentHistorySection';
import { ProfileWalletSection } from './ProfileWalletSection';

interface ProfileBodyProps {
  profile: UserProfile | null;
  account: ProfileAccountData;
  completion: { percent: number; missing: string[] };
  onLogout: () => void;
  onEditProfile: () => void;
  onAddAddress: () => void;
  onEditAddress: (id: string) => void;
  onAddPayment: () => void;
  onEditPayment: (id: string) => void;
  onTopUpWallet: () => void;
  onEditLanguage: () => void;
  onEditBookingPrefs: () => void;
  onEditEmergency: () => void;
  onEditVisitAccess: () => void;
  onNotificationChange: (prefs: NotificationPrefs) => Promise<void>;
  onCommunicationChange: (next: ProfileAccountData['communication']) => Promise<void>;
  onPermissionsChange: (patch: Partial<ProfileAccountData['permissions']>) => Promise<void>;
}

export function ProfileBody({
  profile,
  account,
  completion,
  onLogout,
  onEditProfile,
  onAddAddress,
  onEditAddress,
  onAddPayment,
  onEditPayment,
  onTopUpWallet,
  onEditLanguage,
  onEditBookingPrefs,
  onEditEmergency,
  onEditVisitAccess,
  onNotificationChange,
  onCommunicationChange,
  onPermissionsChange,
}: ProfileBodyProps) {
  return (
    <View style={styles.block}>
      <ProfileIdentityCard profile={profile} percent={completion.percent} onEdit={onEditProfile} />

      <ProfileCompletenessStrip percent={completion.percent} missing={completion.missing} onComplete={onEditProfile} />

      <ProfileCrmStatsStrip
        referrals={account.referrals}
        csat={account.csat}
        supportTickets={account.supportTickets}
        planLabel={account.plan.label}
      />

      <ProfileMembershipBanner
        isPlusMember={account.isPlusMember}
        visitsLeft={account.plusVisitsLeft}
        renewDate={account.plusRenewDate}
      />

      <ProfileQuickActions
        addressCount={account.addresses.length}
        paymentCount={account.payments.length}
        onEditProfile={onEditProfile}
        onAddAddress={onAddAddress}
        onAddPayment={onAddPayment}
      />

      <ProfileServiceDetailsSection
        profile={profile}
        bookingPrefs={account.bookingPrefs}
        emergency={account.emergencyContact}
        visitAccess={account.visitAccess}
        onEditProfile={onEditProfile}
        onEditBooking={onEditBookingPrefs}
        onEditEmergency={onEditEmergency}
        onEditVisit={onEditVisitAccess}
      />

      <ProfileAddressesSection addresses={account.addresses} onAdd={onAddAddress} onEdit={onEditAddress} />

      <ProfileWalletSection
        balance={account.walletBalance}
        payments={account.payments}
        onTopUp={onTopUpWallet}
        onAdd={onAddPayment}
        onEdit={onEditPayment}
      />

      <ProfilePaymentHistorySection />

      <ProfileCommunicationSection communication={account.communication} onChange={onCommunicationChange} />

      <ProfilePreferencesSection
        prefs={account.notificationPrefs}
        language={account.language}
        onPrefChange={onNotificationChange}
        onEditLanguage={onEditLanguage}
      />

      <ProfilePermissionsSection permissions={account.permissions} onChange={onPermissionsChange} />

      <ProfileActivitySection />

      <ProfileSecuritySection />
      <ProfileReferralCard code={account.referralCode} />
      <ProfileSupportSection />

      <Pressable
        style={styles.logoutBtn}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onLogout();
        }}
        accessibilityRole="button"
        accessibilityLabel="Log out"
      >
        <LinearGradient colors={['#FEF3F2', '#FFFFFF']} style={StyleSheet.absoluteFill} />
        <Ionicons name="log-out-outline" size={18} color="#D92D20" />
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>

      <View style={styles.footer}>
        <Text style={styles.footerBrand}>QuickMaid Account</Text>
        <Text style={styles.footerSub}>v1.0.0 · Demo · Data contract: docs/CUSTOMER_DATA.md</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {},
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginHorizontal: layout.pad,
    borderRadius: radius.pill,
    paddingVertical: 14,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(217,45,32,0.15)',
  },
  logoutText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: '#D92D20',
  },
  footer: {
    alignItems: 'center',
    gap: 4,
    marginHorizontal: layout.pad,
    paddingBottom: spacing.xs,
  },
  footerBrand: {
    fontFamily: fonts.extraBold,
    fontSize: 14,
    color: colors.muted,
    letterSpacing: 0.4,
  },
  footerSub: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.mutedLight,
    textAlign: 'center',
  },
});
