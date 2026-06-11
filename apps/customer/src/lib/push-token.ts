import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@qm/push_device_token_v1';

export async function getStoredPushToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/** Register Expo push token locally (server upload deferred to Phase 4 API). */
export async function registerPushTokenIfPermitted(): Promise<string | null> {
  try {
    const Notifications = await import('expo-notifications');
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') return null;

    const token = await Notifications.getExpoPushTokenAsync();
    const value = token.data;
    await AsyncStorage.setItem(KEY, value);
    return value;
  } catch {
    return null;
  }
}
