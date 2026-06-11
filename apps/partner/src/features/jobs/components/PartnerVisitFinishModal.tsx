import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OtpInput } from '@/components/ui/OtpInput';
import type { PartnerJob } from '@/constants/demo';
import { completePartnerVisitWithOtp } from '@/features/jobs/lib/job.completion';
import { formatRs, netEarningPaise } from '@/features/home/lib/home.greeting';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, shadow, spacing } from '@/theme/spacing';

interface PartnerVisitFinishModalProps {
  visible: boolean;
  job: PartnerJob | null;
  onClose: () => void;
  onCompleted: (job: PartnerJob) => void;
}

export function PartnerVisitFinishModal({
  visible,
  job,
  onClose,
  onCompleted,
}: PartnerVisitFinishModalProps) {
  const insets = useSafeAreaInsets();
  const { height: screenH } = useWindowDimensions();
  const cardMaxH = Math.min(screenH * 0.78, 560);

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!visible) {
      setOtp('');
      setError('');
      setSubmitting(false);
    }
  }, [visible]);

  if (!job) return null;

  const net = netEarningPaise(job.amountPaise);
  const canSubmit = otp.length === 6 && !submitting;

  const close = () => {
    if (submitting) return;
    Haptics.selectionAsync();
    onClose();
  };

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');

    const result = await completePartnerVisitWithOtp(job.id, otp);
    setSubmitting(false);

    if (!result.ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(result.error);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onCompleted(result.job);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <Animated.View
        entering={FadeIn.duration(220)}
        style={[
          styles.backdrop,
          { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.sm },
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboard}
        >
          <Animated.View
            entering={FadeInDown.duration(320).springify()}
            style={[styles.card, { maxHeight: cardMaxH }]}
          >
            <LinearGradient colors={['#EEF6FF', '#FFFFFF', '#F8FDFC']} style={styles.cardBg} />
            <View style={styles.blueBar} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scroll}
            >
              <View style={styles.iconWrap}>
                <LinearGradient colors={['#175CD3', '#1570EF']} style={styles.iconGrad}>
                  <Ionicons name="key-outline" size={24} color={colors.white} />
                </LinearGradient>
              </View>

              <View style={styles.badge}>
                <View style={styles.liveDot} />
                <Text style={styles.badgeText}>VISIT LIVE</Text>
              </View>

              <Text style={styles.title}>Finish visit</Text>
              <Text style={styles.sub}>
                Customer se 6-digit completion OTP lein aur yahan daalein
              </Text>

              <View style={styles.summary}>
                <SummaryRow icon="person-outline" text={job.customerName} />
                <SummaryRow icon="receipt-outline" text={job.bookingRef} />
                <SummaryRow icon="wallet-outline" text={`You earn ${formatRs(net)}`} />
              </View>

              <View style={styles.otpCard}>
                <Text style={styles.otpLabel}>COMPLETION OTP</Text>
                <OtpInput
                  value={otp}
                  onChange={(v) => {
                    setOtp(v);
                    if (error) setError('');
                  }}
                  error={error}
                  autoFocus={visible}
                />
                <View style={styles.otpHint}>
                  <Ionicons name="information-circle-outline" size={14} color={colors.muted} />
                  <Text style={styles.otpHintText}>
                    Customer apni QuickMaid app mein OTP dekhta hai — tabhi share kare jab cleaning complete ho
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Pressable
                style={[styles.primary, !canSubmit && styles.primaryDisabled]}
                onPress={() => void submit()}
                disabled={!canSubmit}
                accessibilityRole="button"
              >
                <LinearGradient
                  colors={canSubmit ? ['#084F4A', '#0B6E67'] : ['#98A2B3', '#98A2B3']}
                  style={StyleSheet.absoluteFill}
                />
                {submitting ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <>
                    <Ionicons name="checkmark-done" size={16} color={colors.white} />
                    <Text style={styles.primaryText}>Verify & finish</Text>
                  </>
                )}
              </Pressable>
              <Pressable
                style={styles.secondary}
                onPress={close}
                disabled={submitting}
                accessibilityRole="button"
              >
                <Text style={styles.secondaryText}>Still working</Text>
              </Pressable>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}

function SummaryRow({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.summaryRow}>
      <Ionicons name={icon} size={13} color={colors.primaryDark} />
      <Text style={styles.summaryText} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(1,15,14,0.62)',
    justifyContent: 'center',
    paddingHorizontal: layout.pad,
  },
  keyboard: { width: '100%' },
  card: {
    borderRadius: radius.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(21,112,239,0.18)',
    ...shadow.lg,
  },
  cardBg: { ...StyleSheet.absoluteFill },
  blueBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#1570EF',
    zIndex: 1,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  iconWrap: { alignItems: 'center' },
  iconGrad: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    alignSelf: 'center',
    backgroundColor: '#EEF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(21,112,239,0.2)',
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#1570EF',
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: '#175CD3',
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.ink,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 17,
  },
  summary: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  summaryText: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.ink,
  },
  otpCard: {
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  otpLabel: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  otpHint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  otpHintText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    lineHeight: 15,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(15,20,25,0.06)',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    paddingVertical: 12,
    overflow: 'hidden',
    minHeight: 46,
  },
  primaryDisabled: { opacity: 0.7 },
  primaryText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  secondary: { alignItems: 'center', paddingVertical: 8 },
  secondaryText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.primaryDark },
});
