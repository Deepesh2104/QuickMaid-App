import { useEffect } from 'react';
import { ScrollView, StyleSheet, View, type DimensionValue, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = 14,
  borderRadius = radius.sm,
  style,
}: SkeletonProps) {
  const opacity = useSharedValue(0.42);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const anim = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.bone, { width, height, borderRadius }, anim, style]} />
  );
}

export function BookingCardSkeleton() {
  return (
    <View style={styles.bookingCard}>
      <View style={styles.bookingRow}>
        <Skeleton width={72} height={88} borderRadius={radius.lg} />
        <View style={styles.bookingMain}>
          <View style={styles.bookingHead}>
            <Skeleton width="62%" height={16} borderRadius={radius.sm} />
            <Skeleton width={56} height={16} borderRadius={radius.sm} />
          </View>
          <Skeleton width="78%" height={11} />
          <Skeleton width="55%" height={12} />
          <Skeleton width="90%" height={10} />
          <Skeleton width={120} height={22} borderRadius={radius.pill} />
        </View>
      </View>
      <Skeleton width="100%" height={48} borderRadius={radius.lg} />
      <View style={styles.quickRow}>
        <Skeleton width="31%" height={52} borderRadius={radius.lg} />
        <Skeleton width="31%" height={52} borderRadius={radius.lg} />
        <Skeleton width="31%" height={52} borderRadius={radius.lg} />
      </View>
    </View>
  );
}

export function BookingListSkeleton({ count = 2 }: { count?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }, (_, i) => (
        <BookingCardSkeleton key={i} />
      ))}
    </View>
  );
}

export function BookingDetailSkeleton() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.detailRoot}>
      <View style={[styles.detailHeader, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.detailHeaderRow}>
          <Skeleton width={42} height={42} borderRadius={21} />
          <View style={styles.detailHeaderCopy}>
            <Skeleton width={100} height={10} />
            <Skeleton width={180} height={18} borderRadius={radius.sm} />
          </View>
          <Skeleton width={42} height={42} borderRadius={21} />
        </View>
        <View style={styles.detailStats}>
          {Array.from({ length: 4 }, (_, i) => (
            <View key={i} style={styles.detailStat}>
              <Skeleton width={48} height={12} />
              <Skeleton width={36} height={9} />
            </View>
          ))}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
      >
        <View style={styles.detailSheet}>
          <Skeleton width={40} height={4} borderRadius={radius.pill} style={styles.handle} />
          <Skeleton width="100%" height={180} borderRadius={radius.xxl} />
          <View style={styles.summaryCard}>
            <Skeleton width={120} height={10} />
            <Skeleton width={160} height={22} borderRadius={radius.sm} />
            <Skeleton width="100%" height={1} style={{ marginVertical: spacing.sm }} />
            <Skeleton width={90} height={28} borderRadius={radius.sm} />
          </View>
          <View style={styles.proSkeleton}>
            <Skeleton width={56} height={56} borderRadius={28} />
            <View style={{ flex: 1, gap: spacing.sm }}>
              <Skeleton width={90} height={10} />
              <Skeleton width={140} height={16} />
              <Skeleton width="80%" height={12} />
            </View>
          </View>
          <View style={styles.actionsGrid}>
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} width="48%" height={96} borderRadius={radius.xl} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export function NotificationListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={styles.notifRow}>
          <Skeleton width={44} height={44} borderRadius={22} />
          <View style={styles.notifCopy}>
            <Skeleton width="70%" height={14} />
            <Skeleton width="92%" height={11} />
            <Skeleton width={64} height={9} />
          </View>
        </View>
      ))}
    </View>
  );
}

export function FormScreenSkeleton() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.formRoot, { paddingTop: insets.top + spacing.md }]}>
      <Skeleton width={42} height={42} borderRadius={21} />
      <Skeleton width={180} height={22} borderRadius={radius.sm} style={{ marginTop: spacing.lg }} />
      <Skeleton width="88%" height={12} style={{ marginTop: spacing.sm }} />
      <View style={styles.formCard}>
        <Skeleton width="100%" height={120} borderRadius={radius.xl} />
        <Skeleton width="100%" height={48} borderRadius={radius.lg} />
        <Skeleton width="100%" height={48} borderRadius={radius.lg} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bone: {
    backgroundColor: colors.borderLight,
  },
  list: {
    gap: spacing.md,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.sm,
  },
  bookingCard: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  bookingRow: { flexDirection: 'row', gap: spacing.md },
  bookingMain: { flex: 1, gap: spacing.sm },
  bookingHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  detailRoot: { flex: 1, backgroundColor: colors.bgSubtle },
  detailHeader: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: layout.pad,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  detailHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  detailHeaderCopy: { flex: 1, gap: spacing.sm },
  detailStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  detailStat: { flex: 1, alignItems: 'center', gap: 6 },
  detailSheet: {
    marginTop: -spacing.lg,
    backgroundColor: colors.bgSubtle,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    padding: layout.pad,
    gap: spacing.md,
  },
  handle: { alignSelf: 'center', marginBottom: spacing.xs },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  proSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  notifCopy: { flex: 1, gap: spacing.sm },
  formRoot: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: layout.pad,
  },
  formCard: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
});
