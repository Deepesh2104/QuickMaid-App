import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  DECLINE_REASONS,
  type DeclineReasonId,
} from '@/features/jobs/constants/decline.premium';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, shadow, spacing } from '@/theme/spacing';

interface PartnerJobDeclineModalProps {
  visible: boolean;
  bookingRef: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (reasonId: DeclineReasonId) => void;
}

export function PartnerJobDeclineModal({
  visible,
  bookingRef,
  loading = false,
  onClose,
  onConfirm,
}: PartnerJobDeclineModalProps) {
  const insets = useSafeAreaInsets();
  const [reasonId, setReasonId] = useState<DeclineReasonId | null>(null);

  useEffect(() => {
    if (!visible) setReasonId(null);
  }, [visible]);

  const close = () => {
    if (loading) return;
    Haptics.selectionAsync();
    onClose();
  };

  const confirm = () => {
    if (loading || !reasonId) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onConfirm(reasonId);
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
        <Animated.View entering={FadeInDown.duration(320).springify()} style={styles.card}>
          <LinearGradient colors={['#FFF5F5', '#FFFFFF', '#F8FDFC']} style={styles.cardBg} />
          <View style={styles.redBar} />

          <View style={styles.body}>
            <LinearGradient colors={['#B42318', '#D92D20']} style={styles.iconGrad}>
              <Ionicons name="close-circle" size={26} color={colors.white} />
            </LinearGradient>

            <Text style={styles.title}>Decline request?</Text>
            <Text style={styles.sub}>
              {bookingRef} dispatch pool mein wapas jayega. Reason select karo:
            </Text>

            <ScrollView style={styles.reasonList} showsVerticalScrollIndicator={false}>
              {DECLINE_REASONS.map((reason) => {
                const selected = reasonId === reason.id;
                return (
                  <Pressable
                    key={reason.id}
                    style={[styles.reasonRow, selected && styles.reasonRowOn]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setReasonId(reason.id);
                    }}
                  >
                    <View style={[styles.reasonIcon, selected && styles.reasonIconOn]}>
                      <Ionicons
                        name={reason.icon}
                        size={16}
                        color={selected ? colors.white : colors.error}
                      />
                    </View>
                    <View style={styles.reasonCopy}>
                      <Text style={[styles.reasonLabel, selected && styles.reasonLabelOn]}>
                        {reason.label}
                      </Text>
                      <Text style={styles.reasonSub}>{reason.sub}</Text>
                    </View>
                    {selected ? (
                      <Ionicons name="checkmark-circle" size={18} color={colors.error} />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.hint}>
              <Ionicons name="information-circle-outline" size={14} color={colors.warning} />
              <Text style={styles.hintText}>Frequent declines may lower your priority score</Text>
            </View>

            <View style={styles.bridgeStrip}>
              <LinearGradient colors={['#1E1B4B', '#4338CA']} style={StyleSheet.absoluteFill} />
              <Ionicons name="sync" size={13} color="#C7D2FE" />
              <Text style={styles.bridgeText}>
                Customer app ko reassignment notify · partner_declined bridge event
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable
              style={[styles.primary, (loading || !reasonId) && styles.primaryDisabled]}
              onPress={confirm}
              disabled={loading || !reasonId}
              accessibilityRole="button"
            >
              <LinearGradient colors={['#B42318', '#D92D20']} style={StyleSheet.absoluteFill} />
              {loading ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <>
                  <Ionicons name="close" size={16} color={colors.white} />
                  <Text style={styles.primaryText}>Decline with reason</Text>
                </>
              )}
            </Pressable>
            <Pressable style={styles.secondary} onPress={close} disabled={loading} accessibilityRole="button">
              <Text style={styles.secondaryText}>Keep in inbox</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(1,15,14,0.62)',
    justifyContent: 'center',
    paddingHorizontal: layout.pad,
  },
  card: {
    borderRadius: radius.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(217,45,32,0.16)',
    maxHeight: '88%',
    ...shadow.lg,
  },
  cardBg: { ...StyleSheet.absoluteFill },
  redBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#F04438',
    zIndex: 1,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconGrad: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
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
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 18,
  },
  reasonList: { width: '100%', maxHeight: 280 },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.lg,
    marginBottom: spacing.xs,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  reasonRowOn: {
    borderColor: 'rgba(217,45,32,0.35)',
    backgroundColor: '#FFF5F5',
  },
  reasonIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(239,68,68,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reasonIconOn: { backgroundColor: colors.error },
  reasonCopy: { flex: 1, gap: 2 },
  reasonLabel: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  reasonLabelOn: { color: '#B42318' },
  reasonSub: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.warningBg,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    width: '100%',
  },
  hintText: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.warning,
    lineHeight: 15,
  },
  bridgeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(165,180,252,0.3)',
  },
  bridgeText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
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
  primaryDisabled: { opacity: 0.5 },
  primaryText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  secondary: { alignItems: 'center', paddingVertical: 8 },
  secondaryText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.primaryDark },
});
