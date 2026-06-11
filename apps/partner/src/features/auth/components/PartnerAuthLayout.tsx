import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QmLogo } from '@/components/ui/QmLogo';
import { AUTH_PREMIUM } from '@/features/auth/constants/auth.premium';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface AuthStat {
  value: string;
  label: string;
}

interface PartnerAuthLayoutProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  stats: readonly AuthStat[];
  showLogo?: boolean;
  onBack?: () => void;
  footer: React.ReactNode;
  children: React.ReactNode;
}

export function PartnerAuthLayout({
  eyebrow,
  title,
  subtitle,
  stats,
  showLogo = true,
  onBack,
  footer,
  children,
}: PartnerAuthLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[...AUTH_PREMIUM.heroGradient]}
        locations={[0, 0.5, 1]}
        style={[styles.header, { paddingTop: insets.top + spacing.xs }]}
      >
        <View style={styles.headerGlowA} />
        <View style={styles.headerGlowB} />

        {onBack ? (
          <Pressable
            style={styles.backBtn}
            onPress={() => {
              Haptics.selectionAsync();
              onBack();
            }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={20} color={colors.white} />
          </Pressable>
        ) : null}

        {showLogo ? (
          <View style={[styles.logoWrap, onBack && styles.logoWrapWithBack]}>
            <QmLogo size="md" light />
          </View>
        ) : null}

        <View style={styles.headerRow}>
          <View style={styles.tabIcon}>
            <Ionicons name="key-outline" size={17} color={colors.partnerGold} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>{eyebrow}</Text>
            <Text style={styles.headerTitle}>{title}</Text>
            {subtitle ? <Text style={styles.headerSub}>{subtitle}</Text> : null}
          </View>
        </View>

        <View style={styles.statBar}>
          {stats.map((stat, index) => (
            <View key={stat.label} style={styles.statGroup}>
              {index > 0 ? <View style={styles.statDivider} /> : null}
              <View style={styles.statChip}>
                <Text
                  style={styles.statNum}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.65}
                >
                  {stat.value}
                </Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </View>
          ))}
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheet}>
          <LinearGradient
            colors={['rgba(230,244,242,0.95)', AUTH_PREMIUM.sheetBg]}
            style={styles.sheetTopFade}
            pointerEvents="none"
          />
          <View style={styles.sheetHandle} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scroll}
          >
            <Animated.View entering={FadeInDown.duration(320)}>{children}</Animated.View>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
            {footer}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primaryDark },
  flex: { flex: 1 },
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
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  logoWrap: { marginBottom: spacing.xs },
  logoWrapWithBack: { marginTop: spacing.sm },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
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
    fontSize: 22,
    color: colors.white,
    letterSpacing: -0.4,
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
  statChip: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 1, minWidth: 0, paddingHorizontal: 2 },
  statNum: {
    fontFamily: fonts.extraBold,
    fontSize: 13,
    color: colors.white,
    textAlign: 'center',
  },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: 8,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
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
  scroll: {
    paddingHorizontal: layout.pad,
    paddingBottom: spacing.lg,
    flexGrow: 1,
  },
  footer: {
    paddingHorizontal: layout.pad,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(15,20,25,0.08)',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});
