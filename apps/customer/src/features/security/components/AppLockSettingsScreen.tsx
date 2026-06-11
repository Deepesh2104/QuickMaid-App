import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as LocalAuthentication from 'expo-local-authentication';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfilePremiumToggle } from '@/features/profile/components/ProfilePremiumParts';
import { PIN_LENGTH, biometricLabel, hashPin, verifyPin } from '../lib/appLock.utils';
import { getAppLockSettings, saveAppLockSettings } from '../lib/appLock.storage';
import type { AppLockSettings } from '../types/appLock.types';
import { PinKeypad } from './PinKeypad';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

type PinStep = 'idle' | 'create' | 'confirm' | 'verify_disable' | 'change_old' | 'change_new' | 'change_confirm';

export function AppLockSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<AppLockSettings | null>(null);
  const [pinStep, setPinStep] = useState<PinStep>('idle');
  const [pin, setPin] = useState('');
  const [draftPin, setDraftPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [bioReady, setBioReady] = useState(false);
  const [bioLabel, setBioLabel] = useState('Biometric');

  const load = useCallback(async () => {
    setSettings(await getAppLockSettings());
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  useEffect(() => {
    void (async () => {
      const [hardware, enrolled, types] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
        LocalAuthentication.supportedAuthenticationTypesAsync(),
      ]);
      setBioReady(hardware && enrolled);
      setBioLabel(biometricLabel(types));
    })();
  }, []);

  const resetPinFlow = () => {
    setPinStep('idle');
    setPin('');
    setDraftPin('');
    setPinError('');
  };

  const persist = async (next: AppLockSettings) => {
    await saveAppLockSettings(next);
    setSettings(next);
  };

  const onToggleEnabled = async (enabled: boolean) => {
    if (!settings) return;
    if (enabled) {
      if (!settings.pinHash) {
        setPinStep('create');
        return;
      }
      await persist({ ...settings, enabled: true });
      return;
    }
    if (!settings.pinHash) {
      await persist({ ...settings, enabled: false, biometricEnabled: false });
      return;
    }
    setPinStep('verify_disable');
  };

  const onToggleBiometric = async (enabled: boolean) => {
    if (!settings?.enabled || !settings.pinHash) return;
    if (enabled && bioReady) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Enable ${bioLabel}`,
        fallbackLabel: 'Cancel',
        disableDeviceFallback: true,
      });
      if (!result.success) return;
    }
    await persist({ ...settings, biometricEnabled: enabled && bioReady });
  };

  useEffect(() => {
    if (pin.length < PIN_LENGTH) return;

    if (pinStep === 'create') {
      setDraftPin(pin);
      setPin('');
      setPinError('');
      setPinStep('confirm');
      return;
    }

    if (pinStep === 'confirm') {
      if (pin !== draftPin) {
        setPinError('PINs do not match. Try again.');
        setPin('');
        setDraftPin('');
        setPinStep('create');
        return;
      }
      void (async () => {
        await persist({
          enabled: true,
          pinHash: await hashPin(pin),
          biometricEnabled: settings?.biometricEnabled ?? false,
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        resetPinFlow();
      })();
      return;
    }

    if (pinStep === 'verify_disable') {
      void (async () => {
        if (!(await verifyPin(pin, settings?.pinHash))) {
          setPinError('Incorrect PIN.');
          setPin('');
          return;
        }
        await persist({ enabled: false, pinHash: undefined, biometricEnabled: false });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        resetPinFlow();
      })();
      return;
    }

    if (pinStep === 'change_old') {
      void (async () => {
        if (!(await verifyPin(pin, settings?.pinHash))) {
          setPinError('Incorrect PIN.');
          setPin('');
          return;
        }
        setPin('');
        setPinError('');
        setPinStep('change_new');
      })();
      return;
    }

    if (pinStep === 'change_new') {
      setDraftPin(pin);
      setPin('');
      setPinError('');
      setPinStep('change_confirm');
      return;
    }

    if (pinStep === 'change_confirm') {
      if (pin !== draftPin) {
        setPinError('PINs do not match. Try again.');
        setPin('');
        setDraftPin('');
        setPinStep('change_new');
        return;
      }
      void (async () => {
        await persist({
          ...settings!,
          pinHash: await hashPin(pin),
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('PIN updated', 'Your new app lock PIN is active.');
        resetPinFlow();
      })();
    }
  }, [draftPin, persist, pin, pinStep, settings]);

  const pinTitles: Record<PinStep, { title: string; subtitle: string }> = {
    idle: { title: '', subtitle: '' },
    create: { title: 'Create a 4-digit PIN', subtitle: 'You will use this to unlock QuickMaid' },
    confirm: { title: 'Confirm your PIN', subtitle: 'Enter the same PIN again' },
    verify_disable: { title: 'Enter PIN to disable', subtitle: 'Confirm you want to turn off app lock' },
    change_old: { title: 'Enter current PIN', subtitle: 'Verify your identity first' },
    change_new: { title: 'Enter new PIN', subtitle: 'Choose a new 4-digit PIN' },
    change_confirm: { title: 'Confirm new PIN', subtitle: 'Enter the same PIN again' },
  };

  const showPinSheet = pinStep !== 'idle';
  const copy = pinTitles[pinStep];

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#010F0E', '#053D3A', '#084F4A', '#0B6E67']}
        locations={[0, 0.3, 0.7, 1]}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>SECURITY</Text>
            <Text style={styles.headerTitle}>App lock</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <LinearGradient colors={['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.04)']} style={StyleSheet.absoluteFill} />
          <View style={styles.heroIcon}>
            <Ionicons name="finger-print" size={28} color="#6EE7B7" />
          </View>
          <Text style={styles.heroTitle}>
            {settings?.enabled ? 'App lock is on' : 'Protect your account'}
          </Text>
          <Text style={styles.heroSub}>
            {settings?.enabled
              ? 'QuickMaid locks when you leave the app and opens with PIN or biometrics.'
              : 'Require PIN or Face ID when returning to the app on this phone.'}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.card}>
            <ProfilePremiumToggle
              label="Enable app lock"
              sub="Lock when app goes to background"
              value={settings?.enabled ?? false}
              onChange={(v) => void onToggleEnabled(v)}
            />
            <View style={styles.divider} />
            <ProfilePremiumToggle
              label={`Unlock with ${bioLabel}`}
              sub={bioReady ? 'Faster unlock on this device' : 'Not available on this device'}
              value={Boolean(settings?.biometricEnabled && bioReady)}
              onChange={(v) => void onToggleBiometric(v)}
            />
          </View>

          {settings?.enabled && settings.pinHash ? (
            <Pressable
              style={styles.changeBtn}
              onPress={() => {
                Haptics.selectionAsync();
                setPinStep('change_old');
              }}
            >
              <Ionicons name="key-outline" size={18} color={colors.primaryDark} />
              <Text style={styles.changeText}>Change PIN</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} />
            </Pressable>
          ) : null}

          <View style={styles.tips}>
            <Text style={styles.tipsTitle}>How it works</Text>
            {[
              'Locks automatically when you switch apps or lock your phone',
              'Bookings, wallet balance and profile stay hidden until unlocked',
              'Forgot PIN? Log out and sign in again, then set a new PIN',
            ].map((tip) => (
              <View key={tip} style={styles.tipRow}>
                <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {showPinSheet ? (
        <View style={[styles.pinOverlay, { paddingBottom: insets.bottom + spacing.md }]}>
          <Pressable style={styles.pinClose} onPress={resetPinFlow}>
            <Ionicons name="close" size={22} color={colors.ink} />
          </Pressable>
          <PinKeypad
            value={pin}
            onChange={(next) => {
              setPinError('');
              setPin(next);
            }}
            error={pinError}
            title={copy.title}
            subtitle={copy.subtitle}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  header: {
    paddingHorizontal: layout.pad,
    paddingBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: { flex: 1 },
  headerEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.55)',
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 24,
    color: colors.white,
    letterSpacing: -0.5,
  },
  heroCard: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(110,231,183,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.white,
    letterSpacing: -0.3,
  },
  heroSub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 19,
  },
  sheet: {
    marginTop: -spacing.lg,
    backgroundColor: '#F4F6F8',
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingTop: spacing.md,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.divider,
    marginBottom: spacing.md,
  },
  card: {
    marginHorizontal: layout.pad,
    backgroundColor: colors.bg,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  changeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: layout.pad,
    padding: spacing.lg,
    backgroundColor: colors.bg,
    borderRadius: radius.xl,
    marginBottom: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  changeText: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  tips: {
    marginHorizontal: layout.pad,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryLight,
    gap: spacing.sm,
  },
  tipsTitle: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.primaryDark,
    marginBottom: spacing.xs,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  tipText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.primaryDark,
    lineHeight: 17,
  },
  pinOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(244,246,248,0.98)',
    justifyContent: 'center',
    paddingHorizontal: layout.pad,
    paddingTop: spacing.xl,
  },
  pinClose: {
    position: 'absolute',
    top: spacing.xl,
    right: layout.pad,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
});
