import { Stack } from 'expo-router';

export default function PlusLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }}>
      <Stack.Screen name="subscribe" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="manage" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="billing" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="success" options={{ animation: 'fade', gestureEnabled: false }} />
    </Stack>
  );
}
