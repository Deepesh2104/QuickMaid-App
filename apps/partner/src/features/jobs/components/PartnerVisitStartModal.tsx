import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { PartnerJob } from '@/constants/demo';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, shadow, spacing } from '@/theme/spacing';

interface PartnerVisitStartModalProps {
  visible: boolean;
  job: PartnerJob | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function PartnerVisitStartModal({
  visible,
  job,
  loading = false,
  onClose,
  onConfirm,
}: PartnerVisitStartModalProps) {
  const insets = useSafeAreaInsets();

  if (!job) return null;

  const close = () => {
    if (loading) return;
    Haptics.selectionAsync();
    onClose();
  };

  const confirm = () => {
    if (loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onConfirm();
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
          <LinearGradient colors={['#E6F4F2', '#FFFFFF', '#F8FDFC']} style={styles.cardBg} />
          <View style={styles.tealBar} />

          <View style={styles.body}>
            <LinearGradient colors={['#084F4A', '#0B6E67']} style={styles.iconGrad}>
              <Ionicons name="play-circle" size={26} color={colors.white} />
            </LinearGradient>

            <Text style={styles.title}>Start visit?</Text>
            <Text style={styles.sub}>
              Confirm you have arrived and started work at {job.customerName}&apos;s address.
            </Text>

            <View style={styles.bridgeCard}>
              <LinearGradient colors={['#010F0E', '#084F4A']} style={styles.bridgeGrad}>
                <View style={styles.bridgeRow}>
                  <Ionicons name="git-network-outline" size={14} color="#6EE7B7" />
                  <Text style={styles.bridgeTitle}>Customer bridge sync</Text>
                </View>
                <Text style={styles.bridgeSub}>
                  Visit live mark hoga · GPS auto-share · customer track screen update
                </Text>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable
              style={[styles.primary, loading && styles.primaryDisabled]}
              onPress={confirm}
              disabled={loading}
              accessibilityRole="button"
            >
              <LinearGradient colors={['#084F4A', '#0B6E67']} style={StyleSheet.absoluteFill} />
              {loading ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <>
                  <Ionicons name="play-circle" size={16} color={colors.white} />
                  <Text style={styles.primaryText}>Start visit</Text>
                </>
              )}
            </Pressable>
            <Pressable style={styles.secondary} onPress={close} disabled={loading} accessibilityRole="button">
              <Text style={styles.secondaryText}>Not yet</Text>
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
    borderColor: 'rgba(11,110,103,0.18)',
    ...shadow.lg,
  },
  cardBg: { ...StyleSheet.absoluteFill },
  tealBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.primary,
    zIndex: 1,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
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
  bridgeCard: {
    width: '100%',
    marginTop: spacing.xs,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.25)',
  },
  bridgeGrad: { padding: spacing.md, gap: 6 },
  bridgeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  bridgeTitle: { fontFamily: fonts.bold, fontSize: 11, color: '#6EE7B7' },
  bridgeSub: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.78)',
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
  primaryDisabled: { opacity: 0.85 },
  primaryText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  secondary: { alignItems: 'center', paddingVertical: 8 },
  secondaryText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.primaryDark },
});
