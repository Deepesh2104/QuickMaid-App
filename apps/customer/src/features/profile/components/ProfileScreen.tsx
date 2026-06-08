import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { clearSession } from '@/lib/storage';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

import { useProfileAccount } from '../hooks/useProfileAccount';
import { pickProfilePhoto } from '../lib/profile.photo';
import type { ProfileSheet } from '../types/profile.types';
import { ProfileBody } from './ProfileBody';
import { ProfileEditAddressModal } from './ProfileEditAddressModal';
import { ProfileEditBookingPrefsModal } from './ProfileEditBookingPrefsModal';
import { ProfileEditEmergencyModal } from './ProfileEditEmergencyModal';
import { ProfileEditPaymentModal } from './ProfileEditPaymentModal';
import { ProfileEditProfileModal } from './ProfileEditProfileModal';
import { ProfileEditVisitAccessModal } from './ProfileEditVisitAccessModal';
import { ProfileHeader } from './ProfileHeader';
import { ProfileLanguageModal } from './ProfileLanguageModal';
import { ProfileWalletTopUpModal } from './ProfileWalletTopUpModal';

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const state = useProfileAccount();
  const [sheet, setSheet] = useState<ProfileSheet | null>(null);

  const {
    profile,
    account,
    completion,
    updateProfile,
    upsertAddress,
    deleteAddress,
    upsertPayment,
    deletePayment,
    topUpWallet,
    setNotificationPrefs,
    setLanguage,
    setBookingPrefs,
    setEmergencyContact,
    setVisitAccess,
    setCommunication,
    setPermissions,
  } = state;

  const closeSheet = () => setSheet(null);
  const openSheet = (s: ProfileSheet) => setSheet(s);

  const changePhoto = useCallback(async () => {
    const uri = await pickProfilePhoto();
    if (uri) await updateProfile({ avatarUri: uri });
  }, [updateProfile]);

  const logout = useCallback(() => {
    Alert.alert('Log out?', 'Sign back in anytime with your mobile number.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await clearSession();
          router.replace('/(auth)/login');
        },
      },
    ]);
  }, [router]);

  if (!account) return <View style={styles.root} />;

  const editingAddress = sheet?.type === 'address' && sheet.id
    ? account.addresses.find((a) => a.id === sheet.id)
    : undefined;

  const editingPayment = sheet?.type === 'payment' && sheet.id
    ? account.payments.find((p) => p.id === sheet.id)
    : undefined;

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.md }]}
      >
        <ProfileHeader
          paddingTop={insets.top}
          profile={profile}
          isPlusMember={account.isPlusMember}
          visits={account.visits}
          rating={account.rating}
          saved={account.saved}
          memberSince={account.memberSince}
          completionPercent={completion.percent}
          onEditProfile={() => openSheet({ type: 'profile' })}
          onChangePhoto={changePhoto}
        />

        <View style={styles.canvas}>
          <View style={styles.sheetBridge} pointerEvents="none" />
          <View style={[styles.lowerSheet, { paddingBottom: insets.bottom + spacing.md }]}>
            <View style={styles.sheetHandle} />
            <ProfileBody
              profile={profile}
              account={account}
              completion={completion}
              onLogout={logout}
              onEditProfile={() => openSheet({ type: 'profile' })}
              onAddAddress={() => openSheet({ type: 'address' })}
              onEditAddress={(id) => openSheet({ type: 'address', id })}
              onAddPayment={() => openSheet({ type: 'payment' })}
              onEditPayment={(id) => openSheet({ type: 'payment', id })}
              onTopUpWallet={() => openSheet({ type: 'wallet' })}
              onEditLanguage={() => openSheet({ type: 'language' })}
              onEditBookingPrefs={() => openSheet({ type: 'bookingPrefs' })}
              onEditEmergency={() => openSheet({ type: 'emergency' })}
              onEditVisitAccess={() => openSheet({ type: 'visitAccess' })}
              onNotificationChange={setNotificationPrefs}
              onCommunicationChange={setCommunication}
              onPermissionsChange={setPermissions}
            />
          </View>
        </View>
      </ScrollView>

      <ProfileEditProfileModal
        visible={sheet?.type === 'profile'}
        profile={profile}
        completionPercent={completion.percent}
        onClose={closeSheet}
        onSave={updateProfile}
      />
      <ProfileEditAddressModal visible={sheet?.type === 'address'} address={editingAddress} onClose={closeSheet} onSave={upsertAddress} onDelete={deleteAddress} />
      <ProfileEditPaymentModal visible={sheet?.type === 'payment'} payment={editingPayment} onClose={closeSheet} onSave={upsertPayment} onDelete={deletePayment} />
      <ProfileWalletTopUpModal visible={sheet?.type === 'wallet'} balance={account.walletBalance} onClose={closeSheet} onTopUp={topUpWallet} />
      <ProfileLanguageModal visible={sheet?.type === 'language'} value={account.language} onClose={closeSheet} onSave={setLanguage} />
      <ProfileEditBookingPrefsModal visible={sheet?.type === 'bookingPrefs'} prefs={account.bookingPrefs} onClose={closeSheet} onSave={setBookingPrefs} />
      <ProfileEditEmergencyModal visible={sheet?.type === 'emergency'} contact={account.emergencyContact} onClose={closeSheet} onSave={setEmergencyContact} />
      <ProfileEditVisitAccessModal visible={sheet?.type === 'visitAccess'} access={account.visitAccess} onClose={closeSheet} onSave={setVisitAccess} />
    </View>
  );
}

const SHEET_OVERLAP = 18;
const HEADER_TAIL = '#0F1419';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingBottom: 0 },
  canvas: {
    backgroundColor: colors.bg,
    marginTop: -SHEET_OVERLAP,
    paddingTop: SHEET_OVERLAP,
  },
  sheetBridge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SHEET_OVERLAP + radius.xxl + 8,
    backgroundColor: HEADER_TAIL,
    zIndex: 0,
  },
  lowerSheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.xxl + 4,
    borderTopRightRadius: radius.xxl + 4,
    marginTop: 0,
    paddingTop: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: 'rgba(15,20,25,0.05)',
    zIndex: 1,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.bgMuted,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
});
