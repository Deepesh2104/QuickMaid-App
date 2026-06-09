import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as LocalAuthentication from 'expo-local-authentication';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PIN_LENGTH, biometricLabel, verifyPin } from '../lib/appLock.utils';
import type { AppLockSettings } from '../types/appLock.types';
import { PinKeypad } from './PinKeypad';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface AppLockOverlayProps {
  visible: boolean;
  settings: AppLockSettings;
  onUnlock: () => void;
}

export function AppLockOverlay({ visible, settings, onUnlock }: AppLockOverlayProps) {
  const insets = useSafeAreaInsets();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [bioLabel, setBioLabel] = useState('Biometric');
  const [bioReady, setBioReady] = useState(false);

  useEffect(() => {
    if (!visible) {
      setPin('');
      setError('');
    }
  }, [visible]);

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

  const tryBiometric = useCallback(async () => {
    if (!settings.biometricEnabled || !bioReady) return;
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock QuickMaid',
      fallbackLabel: 'Use PIN',
      disableDeviceFallback: true,
    });
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onUnlock();
    }
  }, [bioReady, onUnlock, settings.biometricEnabled]);

  useEffect(() => {
    if (!visible || !settings.biometricEnabled) return;
    const t = setTimeout(() => {
      void tryBiometric();
    }, 350);
    return () => clearTimeout(t);
  }, [visible, settings.biometricEnabled, tryBiometric]);

  useEffect(() => {
    if (pin.length < PIN_LENGTH) return;
    if (verifyPin(pin, settings.pinHash)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setPin('');
      setError('');
      onUnlock();
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    setError('Incorrect PIN. Try again.');
    setPin('');
  }, [onUnlock, pin, settings.pinHash]);

  const showBio = settings.biometricEnabled && bioReady;

  return (
    <Modal visible={visible} animationType="fade" transparent={false} statusBarTranslucent>
      <LinearGradient
        colors={['#010F0E', '#053D3A', '#084F4A', '#0B6E67']}
        locations={[0, 0.25, 0.6, 1]}
        style={[styles.root, { paddingTop: insets.top + spacing.xl }]}
      >
        <View style={styles.glow} pointerEvents="none" />
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Ionicons name="sparkles" size={28} color="#6EE7B7" />
          </View>
          <Text style={styles.brandName}>QuickMaid</Text>
          <Text style={styles.brandSub}>Your account is protected</Text>
        </View>

        <View style={styles.card}>
          <LinearGradient colors={['#FFFFFF', '#F8FDFC']} style={StyleSheet.absoluteFill} />
          <View style={styles.lockIcon}>
            <Ionicons name="lock-closed" size={22} color={colors.primaryDark} />
          </View>

          <PinKeypad
            value={pin}
            onChange={(next) => {
              setError('');
              setPin(next);
            }}
            error={error}
            title="Enter your PIN"
            subtitle="Unlock to view bookings, wallet and profile"
          />

          {showBio ? (
            <Pressable style={styles.bioBtn} onPress={() => void tryBiometric()} accessibilityRole="button">
              <Ionicons name="finger-print" size={20} color={colors.primaryDark} />
              <Text style={styles.bioText}>Unlock with {bioLabel}</Text>
            </Pressable>
          ) : null}
        </View>

        <Text style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
          App lock keeps your bookings and payment info private on shared phones.
        </Text>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: layout.pad,
    justifyContent: 'space-between',
  },
  glow: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(110,231,183,0.1)',
  },
  brand: { alignItems: 'center', gap: spacing.sm, marginTop: spacing.xl },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.25)',
  },
  brandName: {
    fontFamily: fonts.extraBold,
    fontSize: 28,
    color: colors.white,
    letterSpacing: -0.6,
  },
  brandSub: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  card: {
    borderRadius: radius.xxl,
    padding: spacing.xl,
    paddingBottom: spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
    gap: spacing.md,
  },
  lockIcon: {
    alignSelf: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    marginTop: spacing.sm,
  },
  bioText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.primaryDark,
  },
  footer: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    lineHeight: 17,
    paddingHorizontal: spacing.md,
  },
});
