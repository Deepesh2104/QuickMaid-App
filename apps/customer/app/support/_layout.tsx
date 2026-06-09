import { Stack } from 'expo-router';

export default function SupportLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="chat" />
      <Stack.Screen name="tickets" />
    </Stack>
  );
}
