import { Stack } from 'expo-router';
import { useEffect } from 'react';

import { useCheckout } from '@/context/CheckoutContext';

export default function CheckoutLayout() {
  const { refreshAccount } = useCheckout();

  useEffect(() => {
    refreshAccount();
  }, [refreshAccount]);

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="address" />
      <Stack.Screen name="schedule" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="success" options={{ animation: 'fade', gestureEnabled: false }} />
    </Stack>
  );
}
