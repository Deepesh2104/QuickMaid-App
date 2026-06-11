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

export function JobCardSkeleton() {
  return (
    <View style={styles.jobCard}>
      <View style={styles.jobHead}>
        <Skeleton width={40} height={40} borderRadius={radius.lg} />
        <View style={styles.jobCopy}>
          <Skeleton width="72%" height={15} />
          <Skeleton width="48%" height={11} />
        </View>
        <Skeleton width={64} height={24} borderRadius={radius.pill} />
      </View>
      <Skeleton width="100%" height={12} />
      <Skeleton width="85%" height={12} />
      <View style={styles.jobFoot}>
        <Skeleton width={90} height={28} borderRadius={radius.pill} />
        <Skeleton width={110} height={36} borderRadius={radius.pill} />
      </View>
    </View>
  );
}

export function JobListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }, (_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </View>
  );
}

export function JobDetailSkeleton() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.detailRoot}>
      <View style={[styles.detailHeader, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.detailHeaderRow}>
          <Skeleton width={42} height={42} borderRadius={21} />
          <View style={styles.detailHeaderCopy}>
            <Skeleton width={90} height={10} />
            <Skeleton width={200} height={18} borderRadius={radius.sm} />
          </View>
        </View>
        <Skeleton width={100} height={26} borderRadius={radius.pill} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        <View style={styles.detailBody}>
          <Skeleton width="100%" height={120} borderRadius={radius.xxl} />
          <View style={styles.infoCard}>
            {Array.from({ length: 5 }, (_, i) => (
              <View key={i} style={styles.infoRow}>
                <Skeleton width={20} height={20} borderRadius={10} />
                <Skeleton width="75%" height={13} />
              </View>
            ))}
          </View>
          <Skeleton width="100%" height={88} borderRadius={radius.xl} />
          <View style={styles.actionsRow}>
            <Skeleton width="48%" height={48} borderRadius={radius.pill} />
            <Skeleton width="48%" height={48} borderRadius={radius.pill} />
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
      <Skeleton width={200} height={22} borderRadius={radius.sm} style={{ marginTop: spacing.lg }} />
      <View style={styles.formCard}>
        <Skeleton width="100%" height={140} borderRadius={radius.xl} />
        <Skeleton width="100%" height={52} borderRadius={radius.pill} />
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
  jobCard: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  jobHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  jobCopy: { flex: 1, gap: spacing.sm },
  jobFoot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
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
  detailBody: {
    padding: layout.pad,
    gap: spacing.md,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  formRoot: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: layout.pad,
  },
  formCard: {
    marginTop: spacing.xl,
    gap: spacing.md,
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
});
