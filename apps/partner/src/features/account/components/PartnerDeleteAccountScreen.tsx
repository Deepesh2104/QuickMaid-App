import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PartnerStackShell } from '@/components/ui/PartnerStackShell';
import { QmButton } from '@/components/ui/QmButton';
import { usePartner } from '@/context/PartnerContext';
import { usePartnerAlert } from '@/context/PartnerAlertContext';
import { DELETE_STATS, DELETE_WARNINGS } from '@/features/account/constants/account.premium';
import { PartnerRequestsSectionHeader } from '@/features/jobs/components/PartnerRequestsSections';
import { deletePartnerAccount } from '@/lib/storage';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

const DELETE_WORD = 'DELETE';

export function PartnerDeleteAccountScreen() {
  const router = useRouter();
  const { profile } = usePartner();
  const { alert } = usePartnerAlert();
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const canDelete = confirmText.trim().toUpperCase() === DELETE_WORD && Boolean(profile?.phone);

  const performDelete = async () => {
    if (!profile?.phone || !canDelete) return;
    setDeleting(true);
    await deletePartnerAccount(profile.phone);
    setDeleting(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/(auth)/login');
  };

  const onDeletePress = () => {
    alert({
      title: 'Last chance',
      message: 'Account permanently delete ho jayega. Ye action undo nahi hota.',
      variant: 'danger',
      icon: 'trash-outline',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete forever', style: 'destructive', onPress: () => void performDelete() },
      ],
    });
  };

  return (
    <PartnerStackShell
      eyebrow="ACCOUNT"
      title="Delete partner account"
      subtitle="Self-serve deletion — saara partner data remove hoga"
      icon="trash-outline"
      headerColors={['#3F1212', '#7F1D1D', '#991B1B']}
      stats={[...DELETE_STATS]}
      sheetBg="#F8F4F4"
      keyboardShouldPersistTaps="handled"
      footer={
        <>
          <QmButton
            label="Permanently delete account"
            icon="trash-outline"
            variant="dark"
            onPress={onDeletePress}
            loading={deleting}
            disabled={!canDelete}
          />
          <QmButton label="Keep my account" variant="secondary" onPress={() => router.back()} />
        </>
      }
    >
      <Animated.View entering={FadeInDown.duration(280)} style={styles.warnCard}>
        <Ionicons name="warning-outline" size={22} color={colors.error} />
        <Text style={styles.warnTitle}>Ye sab delete hoga</Text>
        {DELETE_WARNINGS.map((line) => (
          <View key={line} style={styles.warnRow}>
            <View style={styles.warnDot} />
            <Text style={styles.warnText}>{line}</Text>
          </View>
        ))}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(60).duration(280)} style={styles.block}>
        <PartnerRequestsSectionHeader eyebrow="Confirm" title="Verify identity" icon="shield-outline" compact />
        <View style={styles.fieldCard}>
          <Text style={styles.fieldLabel}>Registered mobile</Text>
          <Text style={styles.phoneValue}>+91 {profile?.phone ?? '—'}</Text>
        </View>
        <View style={styles.fieldCard}>
          <Text style={styles.fieldLabel}>Type {DELETE_WORD} to confirm</Text>
          <TextInput
            style={styles.input}
            value={confirmText}
            onChangeText={setConfirmText}
            autoCapitalize="characters"
            placeholder={DELETE_WORD}
            placeholderTextColor={colors.placeholder}
          />
        </View>
      </Animated.View>

      <View style={styles.helpNote}>
        <Ionicons name="chatbubbles-outline" size={14} color={colors.muted} />
        <Text style={styles.helpText}>
          Delete karne se pehle Help tab se support se baat kar sakte ho — payout ya KYC issue ho to.
        </Text>
      </View>
    </PartnerStackShell>
  );
}

const styles = StyleSheet.create({
  warnCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
  },
  warnTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 20,
    color: colors.error,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
  warnRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  warnDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.error,
    marginTop: 7,
  },
  warnText: {
    flex: 1,
    flexShrink: 1,
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.inkSecondary,
    lineHeight: 20,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
  block: { gap: spacing.sm },
  fieldCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  fieldLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    lineHeight: 17,
    color: colors.ink,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
  phoneValue: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink },
  input: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.error,
    letterSpacing: 2,
    paddingVertical: spacing.sm,
  },
  helpNote: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  helpText: {
    flex: 1,
    flexShrink: 1,
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    lineHeight: 18,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
});
