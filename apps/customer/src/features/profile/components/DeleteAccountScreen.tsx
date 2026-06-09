import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { deleteUserAccount } from '../lib/account.delete';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

type Step = 'warn' | 'reason' | 'confirm' | 'done';

const REASONS = [
  { id: 'expensive', label: 'Too expensive', icon: 'cash-outline' as const },
  { id: 'moving', label: 'Moving cities', icon: 'airplane-outline' as const },
  { id: 'quality', label: 'Service quality', icon: 'star-half-outline' as const },
  { id: 'duplicate', label: 'Duplicate account', icon: 'copy-outline' as const },
  { id: 'privacy', label: 'Privacy concerns', icon: 'shield-outline' as const },
  { id: 'other', label: 'Other reason', icon: 'ellipsis-horizontal' as const },
];

const LOSS_ITEMS = [
  { icon: 'calendar-outline' as const, text: 'Booking history & upcoming visits' },
  { icon: 'wallet-outline' as const, text: 'Wallet balance & saved offers' },
  { icon: 'diamond-outline' as const, text: 'Plus membership & visit credits' },
  { icon: 'location-outline' as const, text: 'Saved addresses & preferences' },
  { icon: 'receipt-outline' as const, text: 'Invoices & payment records' },
];

const CONFIRM_WORD = 'DELETE';

export function DeleteAccountScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>('warn');
  const [reasonId, setReasonId] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const canConfirm = confirmText.trim().toUpperCase() === CONFIRM_WORD && reasonId;

  const goNext = () => {
    Haptics.selectionAsync();
    if (step === 'warn') setStep('reason');
    else if (step === 'reason' && reasonId) setStep('confirm');
  };

  const goBack = () => {
    Haptics.selectionAsync();
    if (step === 'reason') setStep('warn');
    else if (step === 'confirm') setStep('reason');
    else router.back();
  };

  const onDelete = async () => {
    if (!canConfirm || deleting) return;
    setDeleting(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await deleteUserAccount();
    setDeleting(false);
    setStep('done');
  };

  if (step === 'done') {
    return (
      <View style={[styles.doneRoot, { paddingTop: insets.top + spacing.xxxl }]}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.doneCard}>
          <LinearGradient colors={['#ECFDF5', '#FFFFFF']} style={StyleSheet.absoluteFill} />
          <View style={styles.doneIcon}>
            <Ionicons name="checkmark-circle" size={48} color={colors.success} />
          </View>
          <Text style={styles.doneTitle}>Account deleted</Text>
          <Text style={styles.doneSub}>
            Your local QuickMaid data has been removed from this device. You can sign up again anytime.
          </Text>
          <Pressable
            style={styles.doneBtn}
            onPress={() => router.replace('/(auth)/login')}
            accessibilityRole="button"
          >
            <LinearGradient colors={['#084F4A', '#0B6E67']} style={styles.doneBtnGrad}>
              <Text style={styles.doneBtnText}>Back to login</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  const stepIndex = step === 'warn' ? 0 : step === 'reason' ? 1 : 2;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#1A0A0A', '#3B1212', '#5C1A1A', '#0F1419']}
        locations={[0, 0.4, 0.75, 1]}
        style={[styles.hero, { paddingTop: insets.top + spacing.md }]}
      >
        <View style={styles.heroGlow} />
        <View style={styles.heroBar}>
          <Pressable style={styles.heroBtn} onPress={goBack} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <Text style={styles.heroTitle}>Delete account</Text>
          <View style={styles.heroBtnSpacer} />
        </View>

        <View style={styles.stepRow}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.stepDot, i <= stepIndex && styles.stepDotOn]} />
          ))}
        </View>

        <Animated.View entering={FadeInDown.duration(350)} style={styles.heroCopy}>
          <View style={styles.warnIcon}>
            <Ionicons name="warning" size={26} color="#FCA5A5" />
          </View>
          <Text style={styles.heroHeadline}>
            {step === 'warn' && 'This action is permanent'}
            {step === 'reason' && 'Help us improve'}
            {step === 'confirm' && 'Final confirmation'}
          </Text>
          <Text style={styles.heroSub}>
            {step === 'warn' && 'Once deleted, your profile and bookings on this device cannot be recovered.'}
            {step === 'reason' && 'Tell us why you are leaving — your feedback shapes QuickMaid.'}
            {step === 'confirm' && `Type ${CONFIRM_WORD} below to permanently remove your account.`}
          </Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        style={styles.body}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.sheetHandle} />

        {step === 'warn' ? (
          <Animated.View entering={FadeInDown.delay(60).duration(320)}>
            <Text style={styles.sectionLabel}>YOU WILL LOSE</Text>
            <View style={styles.lossList}>
              {LOSS_ITEMS.map((item, i) => (
                <View key={item.text} style={[styles.lossRow, i < LOSS_ITEMS.length - 1 && styles.lossBorder]}>
                  <View style={styles.lossIcon}>
                    <Ionicons name={item.icon} size={16} color="#D92D20" />
                  </View>
                  <Text style={styles.lossText}>{item.text}</Text>
                </View>
              ))}
            </View>

            <View style={styles.altCard}>
              <LinearGradient colors={['#EFF6FF', '#FFFFFF']} style={StyleSheet.absoluteFill} />
              <Ionicons name="bulb-outline" size={20} color="#175CD3" />
              <Text style={styles.altText}>
                Not sure? Try pausing Plus or logging out instead — your data stays safe.
              </Text>
            </View>
          </Animated.View>
        ) : null}

        {step === 'reason' ? (
          <Animated.View entering={FadeInDown.delay(60).duration(320)} style={styles.reasonGrid}>
            {REASONS.map((r) => {
              const on = reasonId === r.id;
              return (
                <Pressable
                  key={r.id}
                  style={[styles.reasonChip, on && styles.reasonChipOn]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setReasonId(r.id);
                  }}
                  accessibilityRole="button"
                >
                  {on ? (
                    <LinearGradient colors={['#7F1D1D', '#991B1B']} style={styles.reasonChipGrad}>
                      <Ionicons name={r.icon} size={14} color="#FCA5A5" />
                      <Text style={styles.reasonChipTextOn}>{r.label}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.reasonChipInner}>
                      <Ionicons name={r.icon} size={14} color={colors.muted} />
                      <Text style={styles.reasonChipText}>{r.label}</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </Animated.View>
        ) : null}

        {step === 'confirm' ? (
          <Animated.View entering={FadeInDown.delay(60).duration(320)} style={styles.confirmBlock}>
            <View style={styles.confirmCard}>
              <Text style={styles.confirmLabel}>Type {CONFIRM_WORD} to confirm</Text>
              <TextInput
                style={styles.confirmInput}
                value={confirmText}
                onChangeText={setConfirmText}
                placeholder={CONFIRM_WORD}
                placeholderTextColor={colors.mutedLight}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>
            <View style={styles.dangerNote}>
              <Ionicons name="alert-circle" size={18} color="#D92D20" />
              <Text style={styles.dangerNoteText}>
                This removes your profile, bookings, wallet & membership from this device immediately.
              </Text>
            </View>
          </Animated.View>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        {step !== 'confirm' ? (
          <Pressable
            style={[styles.nextBtn, step === 'reason' && !reasonId && styles.nextBtnOff]}
            onPress={goNext}
            disabled={step === 'reason' && !reasonId}
            accessibilityRole="button"
          >
            <LinearGradient
              colors={step === 'reason' && !reasonId ? ['#9CA3AF', '#9CA3AF'] : ['#991B1B', '#7F1D1D']}
              style={styles.nextBtnGrad}
            >
              <Text style={styles.nextBtnText}>{step === 'warn' ? 'Continue' : 'Next step'}</Text>
              <Ionicons name="arrow-forward" size={18} color={colors.white} />
            </LinearGradient>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.nextBtn, (!canConfirm || deleting) && styles.nextBtnOff]}
            onPress={() => void onDelete()}
            disabled={!canConfirm || deleting}
            accessibilityRole="button"
          >
            <LinearGradient
              colors={!canConfirm || deleting ? ['#9CA3AF', '#9CA3AF'] : ['#DC2626', '#991B1B']}
              style={styles.nextBtnGrad}
            >
              {deleting ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Ionicons name="trash-outline" size={18} color={colors.white} />
                  <Text style={styles.nextBtnText}>Delete my account</Text>
                </>
              )}
            </LinearGradient>
          </Pressable>
        )}

        <Pressable style={styles.cancelLink} onPress={() => router.back()} accessibilityRole="button">
          <Text style={styles.cancelLinkText}>Keep my account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  hero: { paddingBottom: spacing.xl, overflow: 'hidden' },
  heroGlow: {
    position: 'absolute',
    top: -30,
    right: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(252,165,165,0.15)',
  },
  heroBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.pad,
    marginBottom: spacing.md,
  },
  heroBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBtnSpacer: { width: 40 },
  heroTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: spacing.lg,
  },
  stepDot: {
    width: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  stepDotOn: { backgroundColor: '#FCA5A5' },
  heroCopy: {
    alignItems: 'center',
    paddingHorizontal: layout.pad + spacing.sm,
    gap: spacing.sm,
  },
  warnIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(252,165,165,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroHeadline: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  heroSub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 21,
  },
  body: {
    flex: 1,
    marginTop: -spacing.lg,
    backgroundColor: '#F4F6F8',
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.divider,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 1,
    marginHorizontal: layout.pad,
    marginBottom: spacing.sm,
  },
  lossList: {
    marginHorizontal: layout.pad,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(217,45,32,0.12)',
    marginBottom: spacing.lg,
  },
  lossRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  lossBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  lossIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.lg,
    backgroundColor: '#FEF3F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lossText: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.ink,
  },
  altCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginHorizontal: layout.pad,
    borderRadius: radius.xl,
    padding: spacing.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(23,92,211,0.12)',
  },
  altText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 17,
  },
  reasonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: layout.pad,
  },
  reasonChip: {
    borderRadius: radius.pill,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.08)',
    backgroundColor: colors.bg,
  },
  reasonChipOn: { borderColor: 'transparent' },
  reasonChipGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  reasonChipInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  reasonChipText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.inkSecondary,
  },
  reasonChipTextOn: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: '#FEE2E2',
  },
  confirmBlock: { paddingHorizontal: layout.pad, gap: spacing.lg },
  confirmCard: {
    backgroundColor: colors.bg,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(217,45,32,0.15)',
  },
  confirmLabel: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.ink,
  },
  confirmInput: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: '#991B1B',
    letterSpacing: 4,
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: '#FECACA',
  },
  dangerNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: '#FEF3F2',
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  dangerNoteText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 12,
    color: '#B42318',
    lineHeight: 17,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.md,
    backgroundColor: colors.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    gap: spacing.sm,
  },
  nextBtn: { borderRadius: radius.pill, overflow: 'hidden' },
  nextBtnOff: { opacity: 0.55 },
  nextBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 16,
  },
  nextBtnText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
  cancelLink: { alignItems: 'center', paddingVertical: spacing.sm },
  cancelLinkText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.primary,
  },
  doneRoot: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    paddingHorizontal: layout.pad,
    justifyContent: 'center',
  },
  doneCard: {
    borderRadius: radius.xxl,
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.md,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(2,122,72,0.12)',
  },
  doneIcon: { marginBottom: spacing.sm },
  doneTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 24,
    color: colors.ink,
    textAlign: 'center',
  },
  doneSub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 21,
  },
  doneBtn: {
    width: '100%',
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  doneBtnGrad: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  doneBtnText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
});
