import * as ImagePicker from 'expo-image-picker';
import { Linking, Platform } from 'react-native';

import { partnerAlert } from '@/lib/partner-alert';

import type { KycDocumentKind } from '@/features/kyc/types/kyc.types';

export type KycPickSource = 'camera' | 'gallery';

async function ensurePermission(
  source: KycPickSource,
  kind: KycDocumentKind,
): Promise<boolean> {
  const request =
    source === 'camera'
      ? ImagePicker.requestCameraPermissionsAsync
      : ImagePicker.requestMediaLibraryPermissionsAsync;

  const { status } = await request();
  if (status === 'granted') return true;

  const label = source === 'camera' ? 'Camera' : 'Photos';
  const selfie = kind === 'selfie';

  partnerAlert({
    title: `${label} access needed`,
    message: selfie
      ? `Allow ${label.toLowerCase()} access to capture your live selfie.`
      : `Allow ${label.toLowerCase()} access to upload KYC documents.`,
    variant: 'info',
    icon: source === 'camera' ? 'camera-outline' : 'images-outline',
    buttons: [
      {
        text: 'Open settings',
        onPress: () => {
          if (Platform.OS === 'ios') void Linking.openURL('app-settings:');
          else void Linking.openSettings();
        },
      },
      { text: 'Not now', style: 'cancel' },
    ],
  });
  return false;
}

function aspectForKind(kind: KycDocumentKind): [number, number] {
  if (kind === 'selfie') return [1, 1];
  return [4, 3];
}

export async function pickKycDocumentFromSource(
  kind: KycDocumentKind,
  source: KycPickSource,
): Promise<string | null> {
  const ok = await ensurePermission(source, kind);
  if (!ok) return null;

  const base: ImagePicker.ImagePickerOptions = {
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: aspectForKind(kind),
    quality: 0.85,
  };

  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync({
          ...base,
          cameraType: kind === 'selfie' ? ImagePicker.CameraType.front : ImagePicker.CameraType.back,
        })
      : await ImagePicker.launchImageLibraryAsync(base);

  if (result.canceled || !result.assets[0]?.uri) return null;
  return result.assets[0].uri;
}

/** @deprecated use pickKycDocumentFromSource */
export async function pickKycDocument(kind: KycDocumentKind): Promise<string | null> {
  return pickKycDocumentFromSource(kind, 'gallery');
}
