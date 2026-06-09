import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthFlowProvider } from '../src/context/AuthFlowContext';
import { CheckoutProvider } from '../src/context/CheckoutContext';
import { AppLockGate } from '../src/features/security/components/AppLockGate';
import { LanguageProvider } from '../src/i18n/LanguageProvider';
import { useAppFonts } from '../src/hooks/useAppFonts';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const { loaded: fontsLoaded } = useAppFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthFlowProvider>
        <LanguageProvider>
        <CheckoutProvider>
          <AppLockGate>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
            <Stack.Screen name="checkout" options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="catalogue" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="service" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="booking" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="notifications" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="payments" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="plus" options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="account" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="legal" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="support" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="pro" options={{ animation: 'slide_from_right' }} />
          </Stack>
          </AppLockGate>
        </CheckoutProvider>
        </LanguageProvider>
      </AuthFlowProvider>
    </SafeAreaProvider>
  );
}

export const unstable_settings = {
  initialRouteName: 'index',
};
