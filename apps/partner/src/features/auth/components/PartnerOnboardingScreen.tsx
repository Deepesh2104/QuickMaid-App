import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QmButton } from '@/components/ui/QmButton';
import { QmLogo } from '@/components/ui/QmLogo';
import { PARTNER_ONBOARDING } from '@/constants/onboarding';
import { AUTH_PREMIUM, ONBOARDING_STATS } from '@/features/auth/constants/auth.premium';
import { setOnboardingDone } from '@/lib/storage';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function PartnerOnboardingScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  const slide = PARTNER_ONBOARDING[index];
  const isLast = index === PARTNER_ONBOARDING.length - 1;
  const slideWidth = width - layout.pad * 2;

  const stats = useMemo(
    () => [
      { value: `${index + 1}/${PARTNER_ONBOARDING.length}`, label: 'Step' },
      { value: ONBOARDING_STATS[1].value, label: ONBOARDING_STATS[1].label },
      { value: ONBOARDING_STATS[2].value, label: ONBOARDING_STATS[2].label },
    ],
    [index],
  );

  const finish = async () => {
    await setOnboardingDone();
    router.replace('/(auth)/login');
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / slideWidth);
    if (i !== index) setIndex(i);
  };

  const next = () => {
    if (!isLast) {
      Haptics.selectionAsync();
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
      return;
    }
    void finish();
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[...AUTH_PREMIUM.heroGradient]}
        locations={[0, 0.5, 1]}
        style={[styles.header, { paddingTop: insets.top + spacing.xs }]}
      >
        <View style={styles.headerGlowA} />
        <View style={styles.headerGlowB} />

        <QmLogo size="md" light />

        <View style={styles.headerRow}>
          <View style={styles.tabIcon}>
            <Ionicons name={slide.icon} size={17} color={colors.partnerGold} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>WELCOME PARTNER</Text>
            <Text style={styles.headerTitle}>{slide.title}</Text>
            <Text style={styles.headerSub} numberOfLines={2}>
              {slide.body}
            </Text>
          </View>
        </View>

        <View style={styles.statBar}>
          {stats.map((stat, statIndex) => (
            <View key={stat.label} style={styles.statGroup}>
              {statIndex > 0 ? <View style={styles.statDivider} /> : null}
              <View style={styles.statChip}>
                <Text style={styles.statNum}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.sheet}>
        <LinearGradient
          colors={['rgba(230,244,242,0.95)', AUTH_PREMIUM.sheetBg]}
          style={styles.sheetTopFade}
          pointerEvents="none"
        />
        <View style={styles.sheetHandle} />

        <Animated.View entering={FadeInDown.duration(320)} style={styles.carouselWrap}>
          <FlatList
            ref={listRef}
            data={PARTNER_ONBOARDING}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            getItemLayout={(_, i) => ({ length: slideWidth, offset: slideWidth * i, index: i })}
            onScrollToIndexFailed={(info) => {
              listRef.current?.scrollToOffset({
                offset: info.averageItemLength * info.index,
                animated: true,
              });
            }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.slide, { width: slideWidth }]}>
                <LinearGradient colors={['#084F4A', '#0B6E67']} style={styles.slideCard}>
                  <View style={styles.slideGlow} />
                  <View style={styles.slideIconWrap}>
                    <Ionicons name={item.icon} size={34} color={colors.partnerGold} />
                  </View>
                  <Text style={styles.slideTitle}>{item.title}</Text>
                  <Text style={styles.slideBody}>{item.body}</Text>
                </LinearGradient>
              </View>
            )}
          />
        </Animated.View>

        <View style={styles.dots}>
          {PARTNER_ONBOARDING.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotOn]} />
          ))}
        </View>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <QmButton
            label={isLast ? 'Get started' : 'Next'}
            icon={isLast ? 'arrow-forward' : 'chevron-forward'}
            onPress={next}
          />
          {!isLast ? (
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                void finish();
              }}
              style={styles.skipBtn}
            >
              <Text style={styles.skip}>Skip intro</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primaryDark },
  header: {
    paddingHorizontal: layout.pad,
    paddingBottom: AUTH_PREMIUM.sheetOverlap + spacing.md,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  headerGlowA: {
    position: 'absolute',
    right: -20,
    top: -10,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(252,211,77,0.12)',
  },
  headerGlowB: {
    position: 'absolute',
    left: -30,
    bottom: -10,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(110,231,183,0.14)',
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginTop: spacing.xs },
  tabIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(217,119,6,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  headerCopy: { flex: 1, gap: 2, minWidth: 0 },
  headerEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(252,211,77,0.9)',
    letterSpacing: 1,
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.white,
    letterSpacing: -0.3,
  },
  headerSub: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 17,
  },
  statBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(110,231,183,0.1)',
    borderRadius: radius.lg,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.22)',
  },
  statGroup: { flex: 1, flexDirection: 'row', alignItems: 'stretch', minWidth: 0 },
  statChip: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 1 },
  statNum: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.white },
  statLabel: { fontFamily: fonts.medium, fontSize: 8, color: 'rgba(255,255,255,0.6)' },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
    marginVertical: 2,
  },
  sheet: {
    flex: 1,
    marginTop: -AUTH_PREMIUM.sheetOverlap,
    backgroundColor: AUTH_PREMIUM.sheetBg,
    borderTopLeftRadius: radius.xxl + 6,
    borderTopRightRadius: radius.xxl + 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: 'rgba(11,110,103,0.18)',
    overflow: 'hidden',
  },
  sheetTopFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 28,
    zIndex: 0,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(11,110,103,0.22)',
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    zIndex: 1,
  },
  carouselWrap: { flex: 1, paddingHorizontal: layout.pad },
  slide: { justifyContent: 'center' },
  slideCard: {
    borderRadius: radius.xxl,
    padding: spacing.xl,
    gap: spacing.md,
    overflow: 'hidden',
    minHeight: 220,
    justifyContent: 'center',
  },
  slideGlow: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(252,211,77,0.15)',
  },
  slideIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  slideTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: colors.white,
    letterSpacing: -0.3,
  },
  slideBody: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 21,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(11,110,103,0.2)',
  },
  dotOn: {
    width: 24,
    backgroundColor: colors.primary,
  },
  footer: {
    paddingHorizontal: layout.pad,
    paddingTop: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(15,20,25,0.08)',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  skipBtn: { alignItems: 'center', paddingVertical: spacing.xs },
  skip: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.primaryDark },
});
