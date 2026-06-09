import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../../src/theme/fonts';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QmButton } from '../../src/components/ui/QmButton';
import { QmLogo } from '../../src/components/ui/QmLogo';
import { ONBOARDING_SLIDES } from '../../src/constants/onboarding';
import { setOnboardingDone } from '../../src/lib/storage';
import { colors } from '../../src/theme/colors';
import { layout, radius, shadow, spacing } from '../../src/theme/spacing';
import { type } from '../../src/theme/typography';

const TINTS = [colors.primaryLight, '#EEF6FF', '#FFF8EE'];

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  const slide = ONBOARDING_SLIDES[index];
  const isLast = index === ONBOARDING_SLIDES.length - 1;

  const finish = async () => {
    await setOnboardingDone();
    router.replace('/(auth)/city');
  };

  const goNext = async () => {
    if (!isLast) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
      return;
    }
    await finish();
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
        <QmLogo size="sm" />
        <Pressable onPress={finish} hitSlop={12}>
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={ONBOARDING_SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
          setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        scrollEventThrottle={16}
        onViewableItemsChanged={({ viewableItems }: { viewableItems: ViewToken[] }) => {
          if (viewableItems[0]?.index != null) setIndex(viewableItems[0].index);
        }}
        renderItem={({ item, index: i }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.visual, { backgroundColor: TINTS[i] }]}>
              <View style={styles.iconCircle}>
                <Ionicons name={item.icon} size={40} color={colors.primary} />
              </View>
              {item.stat && (
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{item.stat.value}</Text>
                  <Text style={styles.statLabel}>{item.stat.label}</Text>
                </View>
              )}
            </View>
          </View>
        )}
        style={styles.list}
      />

      <View style={styles.content}>
        <View style={styles.dots}>
          {ONBOARDING_SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotOn]} />
          ))}
        </View>
        <Text style={styles.step}>Step {index + 1} of {ONBOARDING_SLIDES.length}</Text>
        <Text style={styles.title}>
          {slide.title}{' '}
          <Text style={styles.highlight}>{slide.highlight}</Text>
        </Text>
        <Text style={styles.desc}>{slide.description}</Text>
      </View>

      <View style={styles.footer}>
        <QmButton label={isLast ? 'Get started' : 'Continue'} onPress={goNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.pad,
    marginBottom: spacing.lg,
  },
  skip: { ...type.bodySm, color: colors.muted, fontFamily: fonts.semiBold },
  list: { flexGrow: 0 },
  slide: { paddingHorizontal: layout.pad },
  visual: {
    height: 260,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.md,
  },
  stat: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    ...shadow.sm,
  },
  statValue: { ...type.h3, color: colors.primary },
  statLabel: { ...type.caption, color: colors.muted },
  content: { paddingHorizontal: layout.pad, paddingTop: spacing.xxl, flex: 1 },
  dots: { flexDirection: 'row', gap: 6, marginBottom: spacing.md },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotOn: { width: 24, backgroundColor: colors.primary },
  step: { ...type.overline, color: colors.muted, marginBottom: spacing.sm },
  title: { ...type.h1, color: colors.ink, marginBottom: spacing.md },
  highlight: { color: colors.primary },
  desc: { ...type.body, color: colors.muted, lineHeight: 24 },
  footer: { paddingHorizontal: layout.pad, paddingTop: spacing.lg },
});
