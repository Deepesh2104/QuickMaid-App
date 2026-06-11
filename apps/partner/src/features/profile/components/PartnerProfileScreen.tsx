import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePartnerAlert } from '@/context/PartnerAlertContext';
import { usePartner } from '@/context/PartnerContext';
import { PartnerEditProfileModal } from '@/features/profile/components/PartnerEditProfileModal';
import {
  PartnerProfileMaidDossier,
  PartnerProfilePageHero,
} from '@/features/profile/components/PartnerProfilePremiumSections';
import {
  PartnerProfileAvailabilityCard,
  PartnerProfileCompletenessStrip,
  PartnerProfileFooter,
  PartnerProfilePayoutCard,
  PartnerProfilePerformanceCard,
  PartnerProfileLogoutCard,
  PartnerProfileSettingsCard,
  PartnerProfileVerificationCard,
} from '@/features/profile/components/PartnerProfileSections';
import { PartnerWorkAddressSheet } from '@/features/profile/components/PartnerWorkAddressSheet';
import { usePartnerWorkAddress } from '@/features/profile/hooks/usePartnerWorkAddress';
import {
  profileCompleteness,
  profilePerformanceStats,
  type PartnerProfileEditPatch,
} from '@/features/profile/lib/profile.utils';
import { usePartnerJobs } from '@/features/jobs/hooks/usePartnerJobs';
import { useLayoutMetrics } from '@/hooks/useLayoutMetrics';
import { syncMaidId } from '@/lib/quickmaid-ids';
import { colors } from '@/theme/colors';
import { layout, spacing } from '@/theme/spacing';

const SHEET_BG = '#F6F8F8';

export function PartnerProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { tabScrollPad } = useLayoutMetrics();
  const { profile, state, loading, refresh, updateProfile } = usePartner();
  const { alert } = usePartnerAlert();
  const { completed } = usePartnerJobs();
  const {
    addresses,
    defaultAddress,
    selectAddress,
    saveAddress,
  } = usePartnerWorkAddress();

  const [addressOpen, setAddressOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const kycVerified = profile?.kycStatus === 'verified';

  const completeness = useMemo(
    () => profileCompleteness(profile, Boolean(defaultAddress)),
    [profile, defaultAddress],
  );

  const performance = useMemo(
    () => profilePerformanceStats(state.weekJobs, completed.length),
    [state.weekJobs, completed.length],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const goBack = () => {
    Haptics.selectionAsync();
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  };

  const openEdit = () => {
    Haptics.selectionAsync();
    setEditOpen(true);
  };

  const copyPartnerId = () => {
    Haptics.selectionAsync();
    alert({
      title: 'Maid ID',
      message: profile?.publicId ?? 'MD-—',
      variant: 'teal',
      icon: 'id-card-outline',
      hint: 'Share this ID with partner support when you need help',
      buttons: [{ text: 'Got it' }],
    });
  };

  const saveProfile = async (patch: PartnerProfileEditPatch) => {
    let addresses = profile?.addresses;
    if (patch.zone && addresses?.length) {
      addresses = addresses.map((addr) =>
        addr.isDefault ? { ...addr, zone: patch.zone } : addr,
      );
    }
    const publicId = syncMaidId(
      profile?.publicId,
      patch.firstName,
      patch.lastName,
      patch.dateOfBirth,
    );
    await updateProfile({ ...patch, publicId, addresses });
  };

  return (
    <View style={styles.root}>
      <PartnerProfilePageHero
        profile={profile}
        paddingTop={insets.top}
        onBack={goBack}
        onEdit={openEdit}
        onCopyId={copyPartnerId}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || loading}
            onRefresh={() => void onRefresh()}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={[styles.scroll, { paddingBottom: tabScrollPad }]}
      >
        <PartnerProfileCompletenessStrip completeness={completeness} onPress={openEdit} />
        <PartnerProfilePerformanceCard stats={performance} />
        <PartnerProfileMaidDossier
          profile={profile}
          defaultAddress={defaultAddress}
          onEdit={openEdit}
          onAddressPress={() => setAddressOpen(true)}
        />
        <PartnerProfileAvailabilityCard />
        <PartnerProfilePayoutCard upiId={profile?.upiId} kycVerified={kycVerified} onEdit={openEdit} />
        <PartnerProfileVerificationCard profile={profile} />
        <PartnerProfileSettingsCard />
        <PartnerProfileLogoutCard />
        <PartnerProfileFooter />
      </ScrollView>

      <PartnerWorkAddressSheet
        visible={addressOpen}
        addresses={addresses}
        activeId={defaultAddress?.id}
        onClose={() => setAddressOpen(false)}
        onSelect={(addr) => void selectAddress(addr)}
        onSave={(addr) => void saveAddress(addr)}
      />

      <PartnerEditProfileModal
        visible={editOpen}
        profile={profile}
        onClose={() => setEditOpen(false)}
        onSave={(patch) => void saveProfile(patch)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SHEET_BG },
  scrollView: { flex: 1 },
  scroll: {
    paddingHorizontal: layout.pad,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
});
