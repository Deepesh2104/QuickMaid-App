import * as Linking from 'expo-linking';

export const CUSTOMER_APP_SCHEME = 'quickmaid';
export const CUSTOMER_PLAY_URL =
  'https://play.google.com/store/apps/details?id=in.quickmaid.customer';

export function customerAppBookUrl(phone?: string): string {
  const params = phone ? `?phone=${encodeURIComponent(phone)}` : '';
  return `${CUSTOMER_APP_SCHEME}://book${params}`;
}

export async function openCustomerAppForBooking(phone?: string): Promise<'opened' | 'store'> {
  const deeplink = customerAppBookUrl(phone);
  try {
    const canOpen = await Linking.canOpenURL(deeplink);
    if (canOpen) {
      await Linking.openURL(deeplink);
      return 'opened';
    }
  } catch {
    // fall through to Play Store
  }
  await Linking.openURL(CUSTOMER_PLAY_URL);
  return 'store';
}
