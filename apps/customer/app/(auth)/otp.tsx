import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../../src/theme/fonts';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OtpInput } from '../../src/components/ui/OtpInput';
import { QmButton } from '../../src/components/ui/QmButton';
import { QmLogo } from '../../src/components/ui/QmLogo';
import { DEMO_OTP } from '../../src/constants/app';
import { useAuthFlow } from '../../src/context/AuthFlowContext';
import { isReturningUser, signInExistingUser } from '../../src/lib/storage';
import { colors } from '../../src/theme/colors';
import { layout, radius, shadow, spacing } from '../../src/theme/spacing';
import { type } from '../../src/theme/typography';

const HERO_BG = '#0B6E67';
const SHEET_OVERLAP = 28;
const PAD = layout.pad;
const { height: SCREEN_H } = Dimensions.get('window');

const TRUST = [
  { icon: 'shield-checkmark-outline' as const, text: 'End-to-end secure' },
  { icon: 'time-outline' as const, text: 'Valid for 10 min' },
];

export default function OtpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { phone } = useAuthFlow();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const heroMinH = Math.min(Math.max(SCREEN_H * 0.34, 248), 300) + insets.top;

  const formatted = phone
    ? `+91 ${phone.replace(/(\d{5})(\d{5})/, '$1 $2')}`
    : '+91 —';

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const verify = async () => {
    if (otp.length !== 6) {
      setError('Enter the complete 6-digit code');
      return;
    }
    if (otp !== DEMO_OTP) {
      setError(`Incorrect code. Demo OTP is ${DEMO_OTP}`);
      return;
    }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    const returning = await isReturningUser(phone);
    if (returning) {
      await signInExistingUser(phone);
      setLoading(false);
      router.replace('/(tabs)');
      return;
    }

    setLoading(false);
    router.push('/(auth)/signup');
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
              <Text style={styles.stepText}>Step 3 of 4</Text>
            </View>
          </View>

          <View style={styles.heroTextBlock}>
            <Text style={styles.heroTitle}>Verify OTP</Text>
            <Text style={styles.heroSub}>Enter the code sent to your phone</Text>
            <View style={styles.phonePill}>
              <Ionicons name="call-outline" size={14} color={colors.white} />
              <Text style={styles.phonePillText}>{formatted}</Text>
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
            <Text style={styles.title}>Enter 6-digit code</Text>
            <Text style={styles.subtitle}>
              Type or paste the OTP from your SMS.{' '}
              <Text style={styles.changeLink} onPress={() => router.back()}>
                Change number
              </Text>
            </Text>

            <OtpInput
              value={otp}
              onChange={(v) => {
                setOtp(v);
                if (error) setError('');
              }}
              error={error}
            />

            <View style={styles.resendRow}>
              {timer > 0 ? (
                <Text style={styles.resendMuted}>
                  Resend OTP in 0:{timer.toString().padStart(2, '0')}
                </Text>
              ) : (
                <Pressable
                  onPress={() => {
                    setTimer(30);
                    setOtp('');
                    setError('');
                  }}
                >
                  <Text style={styles.resendLink}>Resend OTP</Text>
                </Pressable>
              )}
            </View>

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
              <Text style={styles.demoText}>
                Demo mode — use OTP <Text style={styles.demoCode}>{DEMO_OTP}</Text>
              </Text>
            </View>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            <QmButton
              label="Verify & continue"
              icon="shield-checkmark"
              onPress={verify}
              loading={loading}
              disabled={otp.length !== 6}
            />
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
    fontFamily: fonts.semiBold,
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
  phonePill: {
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
  phonePillText: {
    ...type.bodySm,
    color: colors.white,
    fontFamily: fonts.semiBold,
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
  changeLink: {
    color: colors.primary,
    fontFamily: fonts.semiBold,
  },
  resendRow: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  resendMuted: {
    ...type.bodySm,
    color: colors.muted,
  },
  resendLink: {
    ...type.bodySm,
    color: colors.primary,
    fontFamily: fonts.semiBold,
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
    fontFamily: fonts.medium,
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
    fontFamily: fonts.medium,
    flex: 1,
  },
  demoCode: {
    fontFamily: fonts.bold,
    letterSpacing: 0.5,
  },
  footer: {
    paddingHorizontal: PAD,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.bg,
  },
});
