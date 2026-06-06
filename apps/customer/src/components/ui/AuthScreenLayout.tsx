import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QmLogo } from './QmLogo';
import { colors } from '../../theme/colors';
import { layout, radius, shadow, spacing } from '../../theme/spacing';
import { type } from '../../theme/typography';

export const AUTH_HERO_BG = '#0B6E67';
export const AUTH_SHEET_OVERLAP = 28;
export const AUTH_PAD = layout.pad;

const { height: SCREEN_H } = Dimensions.get('window');

interface AuthScreenLayoutProps {
  step?: number;
  totalSteps?: number;
  heroTitle: string;
  heroSub: string;
  heroBadge?: ReactNode;
  formTitle: string;
  formSubtitle?: string;
  children: ReactNode;
  footer: ReactNode;
  footerNote?: ReactNode;
  compactHero?: boolean;
  showLogo?: boolean;
}

export function AuthScreenLayout({
  step,
  totalSteps = 4,
  heroTitle,
  heroSub,
  heroBadge,
  formTitle,
  formSubtitle,
  children,
  footer,
  footerNote,
  compactHero = false,
  showLogo = true,
}: AuthScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const ratio = compactHero ? 0.28 : 0.34;
  const heroMinH = Math.min(Math.max(SCREEN_H * ratio, compactHero ? 220 : 248), 300) + insets.top;

  return (
    <View style={styles.root}>
      <View style={[styles.heroWrap, { minHeight: heroMinH }]}>
        <LinearGradient
          colors={['#084F4A', '#0B6E67', '#0D8A82']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.heroDecor} pointerEvents="none">
          <View style={[styles.decorCircle, styles.decor1]} />
          <View style={[styles.decorCircle, styles.decor2]} />
        </View>

        <View
          pointerEvents="none"
          style={[
            styles.heroContent,
            {
              paddingTop: insets.top + 17,
              paddingBottom: AUTH_SHEET_OVERLAP + spacing.xl,
            },
          ]}
        >
          <View style={styles.heroTopRow}>
            {showLogo ? <QmLogo size="md" light /> : <View />}
            {step != null && (
              <View style={styles.stepPill}>
                <Text style={styles.stepText}>
                  Step {step} of {totalSteps}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.heroTextBlock}>
            <Text style={styles.heroTitle}>{heroTitle}</Text>
            <Text style={styles.heroSub}>{heroSub}</Text>
            {heroBadge}
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={[styles.sheetWrap, { marginTop: -AUTH_SHEET_OVERLAP }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
            bounces
          >
            <Text style={styles.formTitle}>{formTitle}</Text>
            {formSubtitle ? <Text style={styles.formSub}>{formSubtitle}</Text> : null}
            {children}
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            {footer}
            {footerNote}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export function AuthGlassPill({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[authStyles.glassPill, style]}>{children}</View>;
}

export function AuthDemoPill({ text }: { text: string }) {
  return (
    <View style={authStyles.demoPill}>
      <Text style={authStyles.demoText}>{text}</Text>
    </View>
  );
}

const authStyles = StyleSheet.create({
  glassPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: spacing.md,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  demoPill: {
    marginTop: spacing.lg,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  demoText: {
    ...type.caption,
    color: colors.primaryDark,
    fontWeight: '500',
  },
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AUTH_HERO_BG,
  },
  heroWrap: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    pointerEvents: 'box-none',
  },
  heroContent: {
    flex: 1,
    paddingHorizontal: AUTH_PAD,
    justifyContent: 'space-between',
    pointerEvents: 'box-none',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTextBlock: {
    gap: spacing.sm,
    paddingRight: spacing.xxl,
  },
  stepPill: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  stepText: {
    ...type.caption,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  heroTitle: {
    ...type.hero,
    color: colors.white,
  },
  heroSub: {
    ...type.bodySm,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 22,
  },
  heroDecor: {
    position: 'absolute',
    right: 0,
    bottom: AUTH_SHEET_OVERLAP,
    width: 140,
    height: 120,
    zIndex: 0,
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  decor1: { width: 120, height: 120, right: 10, bottom: 10 },
  decor2: { width: 80, height: 80, right: 70, bottom: 50 },
  sheetWrap: {
    flex: 1,
    width: '100%',
    backgroundColor: AUTH_HERO_BG,
    zIndex: 10,
    elevation: 10,
  },
  sheet: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    overflow: 'hidden',
    ...shadow.lg,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: AUTH_PAD,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  formTitle: {
    ...type.h1,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  formSub: {
    ...type.body,
    color: colors.muted,
    lineHeight: 24,
    marginBottom: spacing.xxl,
  },
  footer: {
    paddingHorizontal: AUTH_PAD,
    paddingTop: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.bg,
  },
});
