import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthFlowProvider } from '../src/context/AuthFlowContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthFlowProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        </Stack>
      </AuthFlowProvider>
    </SafeAreaProvider>
  );
}

export const unstable_settings = {
  initialRouteName: 'index',
};
