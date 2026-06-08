import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

function Bone({ style }: { style: object }) {
  const o = useSharedValue(0.4);
  useEffect(() => {
    o.value = withRepeat(withTiming(0.85, { duration: 850 }), -1, true);
  }, [o]);
  const anim = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View style={[styles.bone, style, anim]} />;
}

export function HomeSkeleton() {
  return (
    <View style={styles.root} accessibilityLabel="Loading home">
      <Bone style={styles.hero} />
      <Bone style={styles.searchCard} />
      <View style={styles.grid}>
        <Bone style={styles.tile} />
        <Bone style={styles.tile} />
        <Bone style={styles.tile} />
        <Bone style={styles.tile} />
      </View>
      <Bone style={styles.banner} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  bone: { backgroundColor: colors.bgMuted, borderRadius: radius.lg },
  hero: { height: 210, borderRadius: 0 },
  searchCard: {
    height: 118,
    marginHorizontal: layout.pad,
    marginTop: -24,
    marginBottom: spacing.xxl,
    borderRadius: radius.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: layout.cardGap,
    paddingHorizontal: layout.pad,
    marginBottom: spacing.xl,
  },
  tile: {
    width: (layout.screenWidth - layout.pad * 2 - layout.cardGap) / 2,
    height: 204,
    borderRadius: radius.xxl,
  },
  banner: { height: 130, marginHorizontal: layout.pad },
});
