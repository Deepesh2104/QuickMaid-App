import { Stack } from 'expo-router';

export default function AccountLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="delete" />
      <Stack.Screen name="referrals" />
      <Stack.Screen name="address-picker" />
      <Stack.Screen name="saved-services" />
      <Stack.Screen name="wallet-transactions" />
      <Stack.Screen name="coupon-wallet" />
      <Stack.Screen name="app-lock" />
    </Stack>
  );
}
