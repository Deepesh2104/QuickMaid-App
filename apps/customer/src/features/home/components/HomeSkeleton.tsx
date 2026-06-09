import { useEffect } from 'react';

import { StyleSheet, View } from 'react-native';

import { useLayoutMetrics } from '@/hooks/useLayoutMetrics';

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
  const { twoColW } = useLayoutMetrics();

  return (

    <View style={styles.root} accessibilityLabel="Loading home">

      <Bone style={styles.hero} />

      <Bone style={styles.search} />

      <Bone style={styles.heroTile} />

      <View style={styles.split}>

        <Bone style={[styles.halfTile, { width: twoColW }]} />

        <Bone style={[styles.halfTile, { width: twoColW }]} />

      </View>

      <Bone style={styles.wideTile} />

      <Bone style={styles.banner} />

    </View>

  );

}



const styles = StyleSheet.create({

  root: { flex: 1, backgroundColor: colors.bgSubtle },

  bone: { backgroundColor: colors.bgMuted, borderRadius: radius.lg },

  hero: { height: 296, borderRadius: 0 },

  search: {

    height: 52,

    marginHorizontal: layout.pad,

    marginTop: -20,

    marginBottom: spacing.lg,

    borderRadius: radius.pill,

  },

  heroTile: {

    height: 188,

    marginHorizontal: layout.pad,

    marginBottom: layout.cardGap,

    borderRadius: radius.xxl,

  },

  split: {

    flexDirection: 'row',

    gap: layout.cardGap,

    paddingHorizontal: layout.pad,

    marginBottom: layout.cardGap,

  },

  halfTile: {

    height: 168,

    borderRadius: radius.xxl,

  },

  wideTile: {

    height: 112,

    marginHorizontal: layout.pad,

    marginBottom: spacing.xl,

    borderRadius: radius.xl,

  },

  banner: {

    height: 168,

    marginHorizontal: layout.pad,

    borderRadius: radius.xxl,

  },

});


