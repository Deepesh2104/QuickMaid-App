import { Stack } from 'expo-router';

export default function BookingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="[id]" />
      <Stack.Screen name="reschedule/[id]" />
      <Stack.Screen name="cancel/[id]" />
      <Stack.Screen name="rate/[id]" />
      <Stack.Screen name="track/[id]" />
      <Stack.Screen name="invoice/[id]" />
      <Stack.Screen name="receipt/[id]" />
    </Stack>
  );
}
