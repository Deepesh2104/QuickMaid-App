import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

import { PAYMENT_GATEWAY, UPI_APPS_CATALOG, type UpiAppDef } from '../constants/gateway';

export interface UpiPayParams {
  amount: number;
  receipt: string;
  vpa?: string;
}

export async function detectInstalledUpiApps(): Promise<UpiAppDef[]> {
  const installed: UpiAppDef[] = [];

  await Promise.all(
    UPI_APPS_CATALOG.map(async (app) => {
      for (const scheme of app.schemes) {
        try {
          const can = await Linking.canOpenURL(scheme);
          if (can) {
            installed.push(app);
            return;
          }
        } catch {
          // Scheme not declared or not available in this runtime
        }
      }
    }),
  );

  return installed;
}

export async function canOpenGenericUpi(): Promise<boolean> {
  try {
    return await Linking.canOpenURL('upi://pay');
  } catch {
    return false;
  }
}

export function buildUpiPayUrl(params: UpiPayParams, app?: UpiAppDef): string {
  const pa = params.vpa?.includes('@') ? params.vpa : PAYMENT_GATEWAY.merchantVpa;
  const query = [
    `pa=${encodeURIComponent(pa)}`,
    `pn=${encodeURIComponent(PAYMENT_GATEWAY.merchant)}`,
    `am=${params.amount.toFixed(2)}`,
    'cu=INR',
    `tn=${encodeURIComponent(params.receipt)}`,
    `tr=${encodeURIComponent(params.receipt)}`,
  ].join('&');

  if (Platform.OS === 'android' && app?.androidPackage) {
    return `intent://pay?${query}#Intent;scheme=upi;package=${app.androidPackage};end`;
  }

  return `upi://pay?${query}`;
}

export async function openUpiApp(params: UpiPayParams, app?: UpiAppDef): Promise<boolean> {
  const url = buildUpiPayUrl(params, app);
  try {
    const supported = await Linking.canOpenURL(url.split('#')[0] ?? url);
    if (!supported && Platform.OS !== 'android') return false;
    await Linking.openURL(url);
    return true;
  } catch {
    if (!app) return false;
    try {
      await Linking.openURL(buildUpiPayUrl(params));
      return true;
    } catch {
      return false;
    }
  }
}

/** Opens Android/iOS system UPI picker with every installed UPI app */
export async function openUpiAppChooser(params: UpiPayParams): Promise<boolean> {
  return openUpiApp(params);
}
