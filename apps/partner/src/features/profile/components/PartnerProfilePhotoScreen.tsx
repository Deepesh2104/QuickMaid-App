import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PartnerStackShell } from '@/components/ui/PartnerStackShell';
import { QmButton } from '@/components/ui/QmButton';
import { usePartner } from '@/context/PartnerContext';
import { PartnerRequestsSectionHeader } from '@/features/jobs/components/PartnerRequestsSections';
import { PHOTO_GUIDELINES, PHOTO_STATS } from '@/features/profile/constants/photo.premium';
import { initials } from '@/features/profile/lib/profile.utils';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export function PartnerProfilePhotoScreen() {
  const router = useRouter();
  const { profile, updateProfile } = usePartner();
  const [preview, setPreview] = useState(profile?.photoUri);
  const [saving, setSaving] = useState(false);

  const pick = async (source: 'camera' | 'gallery') => {
    const request =
      source === 'camera'
        ? ImagePicker.requestCameraPermissionsAsync
        : ImagePicker.requestMediaLibraryPermissionsAsync;
    const { status } = await request();
    if (status !== 'granted') return;

    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.85,
            cameraType: ImagePicker.CameraType.front,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.85,
          });

    if (!result.canceled && result.assets[0]?.uri) {
      Haptics.selectionAsync();
      setPreview(result.assets[0].uri);
    }
  };

  const save = async () => {
    setSaving(true);
    await updateProfile({ photoUri: preview });
    setSaving(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const remove = async () => {
    setPreview(undefined);
    await updateProfile({ photoUri: undefined });
    Haptics.selectionAsync();
  };

  const name = profile?.name ?? 'Partner';

  return (
    <PartnerStackShell
      eyebrow="PROFILE"
      title="Profile photo"
      subtitle="Customers ko verified partner dikhe — clear face photo best hai"
      icon="camera"
      stats={[...PHOTO_STATS]}
      footer={
        preview ? (
          <QmButton
            label="Photo save karo"
            icon="checkmark"
            onPress={() => void save()}
            loading={saving}
          />
        ) : undefined
      }
    >
      <Animated.View entering={FadeInDown.duration(280)} style={styles.previewBlock}>
        <View style={styles.previewWrap}>
          {preview ? (
            <Image source={{ uri: preview }} style={styles.previewImage} />
          ) : (
            <LinearGradient colors={['#6EE7B7', '#34D399']} style={styles.previewFallback}>
              <Text style={styles.previewInitials}>{initials(name)}</Text>
            </LinearGradient>
          )}
          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={12} color={colors.white} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        </View>
        <Text style={styles.previewName}>{name}</Text>
        <Text style={styles.previewHint}>
          {preview ? 'Save karo taaki customers ko dikhe' : 'Selfie lo ya gallery se chuno'}
        </Text>
      </Animated.View>

      <View style={styles.actions}>
        <QmButton label="Selfie lo" icon="camera-outline" onPress={() => void pick('camera')} />
        <QmButton
          label="Gallery se chuno"
          icon="images-outline"
          variant="secondary"
          onPress={() => void pick('gallery')}
        />
        {profile?.photoUri || preview ? (
          <Pressable style={styles.removeBtn} onPress={() => void remove()}>
            <Text style={styles.removeText}>Photo hatao</Text>
          </Pressable>
        ) : null}
      </View>

      <Animated.View entering={FadeInDown.delay(80).duration(300)} style={styles.block}>
        <PartnerRequestsSectionHeader
          eyebrow="Photo tips"
          title="Best practices"
          subtitle="Clear photo = zyada bookings"
          icon="bulb-outline"
          compact
        />
        <View style={styles.guidelines}>
          {PHOTO_GUIDELINES.map((tip) => (
            <View key={tip.title} style={styles.guidelineRow}>
              <View style={styles.guidelineIcon}>
                <Ionicons name={tip.icon} size={16} color={colors.primary} />
              </View>
              <View style={styles.guidelineCopy}>
                <Text style={styles.guidelineTitle}>{tip.title}</Text>
                <Text style={styles.guidelineSub}>{tip.sub}</Text>
              </View>
            </View>
          ))}
        </View>
      </Animated.View>
    </PartnerStackShell>
  );
}

const styles = StyleSheet.create({
  previewBlock: { alignItems: 'center', gap: spacing.sm },
  previewWrap: {
    width: 168,
    height: 168,
    borderRadius: 84,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: colors.white,
  },
  previewImage: { width: '100%', height: '100%' },
  previewFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  previewInitials: { fontFamily: fonts.extraBold, fontSize: 48, color: colors.primaryDark },
  verifiedBadge: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  verifiedText: { fontFamily: fonts.bold, fontSize: 10, color: colors.white },
  previewName: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.ink },
  previewHint: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted, textAlign: 'center' },
  actions: { gap: spacing.sm },
  removeBtn: { alignItems: 'center', paddingVertical: spacing.sm },
  removeText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.error },
  block: { gap: spacing.sm },
  guidelines: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  guidelineRow: { flexDirection: 'row', gap: spacing.sm },
  guidelineIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guidelineCopy: { flex: 1, gap: 2 },
  guidelineTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  guidelineSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 16 },
});
