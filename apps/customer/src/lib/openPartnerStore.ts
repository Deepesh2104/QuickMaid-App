import { Alert, Linking, Platform } from 'react-native';

import { PARTNER_APP } from '@/constants/links';

export async function openPartnerAppStore(): Promise<void> {
  if (Platform.OS === 'android') {
    try {
      const marketOk = await Linking.canOpenURL(PARTNER_APP.playStoreMarketUrl);
      if (marketOk) {
        await Linking.openURL(PARTNER_APP.playStoreMarketUrl);
        return;
      }
    } catch {
      /* fall through to https */
    }
  }

  const url = Platform.OS === 'ios' ? PARTNER_APP.appStoreUrl : PARTNER_APP.playStoreUrl;

  try {
    const ok = await Linking.canOpenURL(url);
    if (ok) {
      await Linking.openURL(url);
      return;
    }
  } catch {
    /* show fallback alert */
  }

  Alert.alert(
    'QuickMaid Partner',
    Platform.OS === 'ios'
      ? 'Get the QuickMaid Partner app from the App Store to start earning.'
      : 'Get the QuickMaid Partner app from Google Play Store to start earning.',
  );
}
