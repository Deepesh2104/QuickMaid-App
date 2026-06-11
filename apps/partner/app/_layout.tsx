import 'react-native-gesture-handler';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthFlowProvider } from '@/context/AuthFlowContext';
import { PartnerAlertProvider } from '@/context/PartnerAlertContext';
import { PartnerProvider } from '@/context/PartnerContext';
import { PartnerJobsProvider } from '@/features/jobs/context/PartnerJobsContext';
import { useAppFonts } from '@/hooks/useAppFonts';
import { initObservability } from '@/lib/observability';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const { loaded: fontsLoaded, error: fontsError } = useAppFonts();

  if (!fontsLoaded && !fontsError) return null;

  void initObservability();

  return (
    <SafeAreaProvider>
      <AuthFlowProvider>
        <PartnerProvider>
          <PartnerJobsProvider>
          <PartnerAlertProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
            <Stack.Screen name="job" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="support" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="notifications" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="requests" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="kyc" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="payout" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="slots" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="book-home" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="account" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="legal" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="referral" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="profile" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
          </Stack>
          </PartnerAlertProvider>
          </PartnerJobsProvider>
        </PartnerProvider>
      </AuthFlowProvider>
    </SafeAreaProvider>
  );
}
