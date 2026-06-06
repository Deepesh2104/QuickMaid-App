import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PhoneInput } from '../../src/components/ui/PhoneInput';
import { QmButton } from '../../src/components/ui/QmButton';
import { QmLogo } from '../../src/components/ui/QmLogo';
import { useAuthFlow } from '../../src/context/AuthFlowContext';
import { colors } from '../../src/theme/colors';
import { layout, radius, shadow, spacing } from '../../src/theme/spacing';
import { type } from '../../src/theme/typography';

const HERO_BG = '#0B6E67';
const SHEET_OVERLAP = 28;
const PAD = layout.pad;
const { height: SCREEN_H } = Dimensions.get('window');

const TRUST = [
  { icon: 'shield-checkmark-outline' as const, text: 'End-to-end secure' },
  { icon: 'lock-closed-outline' as const, text: 'Never shared' },
];

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { city, setPhone } = useAuthFlow();
  const [phone, setPhoneLocal] = useState('');
  const [error, setError] = useState('');

  const isValid = phone.length === 10;
  const heroMinH = Math.min(Math.max(SCREEN_H * 0.34, 248), 300) + insets.top;

  const handleContinue = () => {
    if (!isValid) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setPhone(phone);
    router.push('/(auth)/otp');
  };

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
              paddingBottom: SHEET_OVERLAP + spacing.xl,
            },
          ]}
        >
          <View style={styles.heroTopRow}>
            <QmLogo size="md" light />
            <View style={styles.stepPill}>
              <Text style={styles.stepText}>Step 2 of 4</Text>
            </View>
          </View>

          <View style={styles.heroTextBlock}>
            <Text style={styles.heroTitle}>Welcome back</Text>
            <Text style={styles.heroSub}>Sign in to book trusted home cleaning</Text>
            <View style={styles.cityPill}>
              <Ionicons name="location" size={14} color={colors.white} />
              <Text style={styles.cityText}>{city}</Text>
            </View>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={[styles.sheetWrap, { marginTop: -SHEET_OVERLAP }]}
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
            <Text style={styles.title}>Enter mobile number</Text>
            <Text style={styles.subtitle}>
              We'll send a 6-digit OTP to verify your account. Standard SMS rates may apply.
            </Text>

            <PhoneInput
              onChangeText={(v) => {
                setPhoneLocal(v);
                if (error) setError('');
              }}
              error={error}
            />

            <View style={styles.trustRow}>
              {TRUST.map((t) => (
                <View key={t.text} style={styles.trustItem}>
                  <Ionicons name={t.icon} size={16} color={colors.primary} />
                  <Text style={styles.trustText}>{t.text}</Text>
                </View>
              ))}
            </View>

            <View style={styles.demoPill}>
              <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
              <Text style={styles.demoText}>Demo mode — any 10-digit number works</Text>
            </View>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            <QmButton
              label="Continue"
              icon="arrow-forward"
              onPress={handleContinue}
              disabled={!isValid}
            />
            <Text style={styles.legal}>
              By continuing, you agree to our{' '}
              <Text style={styles.legalLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.legalLink}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: HERO_BG,
  },
  heroWrap: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    flex: 1,
    paddingHorizontal: PAD,
    justifyContent: 'space-between',
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
  cityPill: {
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
  cityText: {
    ...type.bodySm,
    color: colors.white,
    fontWeight: '600',
  },
  heroDecor: {
    position: 'absolute',
    right: 0,
    bottom: SHEET_OVERLAP,
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
    backgroundColor: HERO_BG,
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
    paddingHorizontal: PAD,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  title: {
    ...type.h1,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...type.body,
    color: colors.muted,
    lineHeight: 24,
    marginBottom: spacing.xxl,
  },
  trustRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    ...type.caption,
    color: colors.inkSecondary,
    fontWeight: '500',
  },
  demoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
    flex: 1,
  },
  footer: {
    paddingHorizontal: PAD,
    paddingTop: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.bg,
  },
  legal: {
    ...type.caption,
    color: colors.mutedLight,
    textAlign: 'center',
    lineHeight: 18,
  },
  legalLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});
