import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { type ReactNode, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLayoutMetrics } from '@/hooks/useLayoutMetrics';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export const PARTNER_SHEET_OVERLAP = 14;
export const PARTNER_SHEET_BG = '#EFF8F7';

export interface PartnerStackStat {
  value: string;
  label: string;
}

interface PartnerStackShellProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  headerColors?: readonly [string, string, ...string[]];
  stats?: PartnerStackStat[];
  headerExtra?: ReactNode;
  sheetBg?: string;
  footer?: ReactNode;
  keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';
  children: ReactNode;
  onBack?: () => void;
  rootStyle?: ViewStyle;
}

export function PartnerStackShell({
  eyebrow,
  title,
  subtitle,
  icon,
  headerColors = ['#032A28', '#084F4A', '#0B6E67'],
  stats,
  headerExtra,
  sheetBg = PARTNER_SHEET_BG,
  footer,
  keyboardShouldPersistTaps,
  children,
  onBack,
  rootStyle,
}: PartnerStackShellProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { tabScrollPad } = useLayoutMetrics();
  const [footerHeight, setFooterHeight] = useState(0);

  const scrollBottomPad =
    spacing.xl + (footer ? Math.max(footerHeight, 140) + spacing.sm : tabScrollPad);

  const goBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  return (
    <View style={[styles.root, rootStyle]}>
      <LinearGradient
        colors={headerColors}
        locations={[0, 0.5, 1]}
        style={[styles.header, { paddingTop: insets.top + spacing.xs }]}
      >
        <View style={styles.headerGlowA} />
        <View style={styles.headerGlowB} />

        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={goBack} accessibilityRole="button">
            <Ionicons name="arrow-back" size={20} color={colors.white} />
          </Pressable>
          {icon ? (
            <View style={styles.tabIcon}>
              <Ionicons name={icon} size={17} color={colors.partnerGold} />
            </View>
          ) : null}
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>{eyebrow}</Text>
            <Text style={styles.headerTitle}>{title}</Text>
            {subtitle ? <Text style={styles.headerSub}>{subtitle}</Text> : null}
          </View>
        </View>

        {headerExtra}

        {stats && stats.length > 0 ? (
          <View style={styles.statBar}>
            {stats.map((stat, idx) => (
              <View key={stat.label} style={styles.statWrap}>
                {idx > 0 ? <View style={styles.statDivider} /> : null}
                <View style={styles.statChip}>
                  <Text style={styles.statNum}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </LinearGradient>

      <View style={[styles.sheet, { backgroundColor: sheetBg }]}>
        <View style={styles.sheetHandle} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          contentContainerStyle={[styles.scroll, { paddingBottom: scrollBottomPad }]}
        >
          {children}
        </ScrollView>
      </View>

      {footer ? (
        <View
          style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}
          onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}
        >
          {footer}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primaryDark },
  header: {
    paddingHorizontal: layout.pad,
    paddingBottom: PARTNER_SHEET_OVERLAP + spacing.md,
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
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  tabIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(217,119,6,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  headerCopy: { flex: 1, gap: 1, minWidth: 0 },
  headerEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    lineHeight: 13,
    color: 'rgba(252,211,77,0.9)',
    letterSpacing: 1,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    lineHeight: 26,
    color: colors.white,
    letterSpacing: -0.4,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
  headerSub: {
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 16,
    color: 'rgba(255,255,255,0.65)',
    flexShrink: 1,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
  statBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(110,231,183,0.1)',
    borderRadius: radius.lg,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.22)',
  },
  statWrap: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  statChip: { flex: 1, alignItems: 'center', gap: 2, paddingHorizontal: 2 },
  statNum: {
    fontFamily: fonts.extraBold,
    fontSize: 13,
    lineHeight: 18,
    color: colors.white,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: 9,
    lineHeight: 13,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  sheet: {
    flex: 1,
    marginTop: -PARTNER_SHEET_OVERLAP,
    borderTopLeftRadius: radius.xxl + 6,
    borderTopRightRadius: radius.xxl + 6,
    overflow: 'hidden',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(11,110,103,0.22)',
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  scroll: { paddingHorizontal: layout.pad, gap: spacing.lg, paddingTop: spacing.xs },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
});
