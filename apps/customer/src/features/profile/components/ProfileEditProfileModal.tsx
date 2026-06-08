import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChoiceChips } from '@/components/ui/ChoiceChips';
import { QmInput } from '@/components/ui/QmInput';
import { RAIPUR_ZONES } from '@/constants/customer.zones';
import type { UserProfile } from '@/constants/app';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

import { pickProfilePhoto } from '../lib/profile.photo';
import { ProfileAvatar } from './ProfileAvatar';
import {
  premiumFormStyles,
  ProfilePremiumSaveBtn,
  ProfileSectionCard,
  ProfileTrustNote,
} from './ProfilePremiumParts';

const GENDER_OPTS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' },
  { value: 'skip', label: 'Prefer not to say' },
];

const HOME_OPTS = [
  { value: '1bhk', label: '1 BHK' },
  { value: '2bhk', label: '2 BHK' },
  { value: '3bhk', label: '3 BHK+' },
  { value: 'villa', label: 'Villa' },
];

const ZONE_OPTS = RAIPUR_ZONES.map((z) => ({ value: z.value, label: z.label }));

interface ProfileEditProfileModalProps {
  visible: boolean;
  profile: UserProfile | null;
  completionPercent?: number;
  onClose: () => void;
  onSave: (patch: Partial<UserProfile>) => Promise<void>;
}

export function ProfileEditProfileModal({ visible, profile, completionPercent = 0, onClose, onSave }: ProfileEditProfileModalProps) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [locality, setLocality] = useState('');
  const [zone, setZone] = useState('');
  const [gender, setGender] = useState('');
  const [homeType, setHomeType] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible && profile) {
      setName(profile.name ?? '');
      setEmail(profile.email ?? '');
      setLocality(profile.locality ?? '');
      setZone(profile.zone ?? 'shankar-nagar');
      setGender(profile.gender ?? '');
      setHomeType(profile.homeType ?? '');
      setAvatarUri(profile.avatarUri);
    }
  }, [visible, profile]);

  const close = () => {
    Haptics.selectionAsync();
    onClose();
  };

  const changePhoto = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const uri = await pickProfilePhoto();
    if (uri) setAvatarUri(uri);
  };

  const removePhoto = () => {
    Alert.alert('Remove photo?', 'Your initials will show instead.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setAvatarUri(undefined) },
    ]);
  };

  const save = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await onSave({
      name: name.trim(),
      email: email.trim() || undefined,
      locality: locality.trim() || undefined,
      zone: zone || undefined,
      gender: gender && gender !== 'skip' ? gender : undefined,
      homeType: homeType || undefined,
      avatarUri,
    });
    setSaving(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={close}>
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        >
          <LinearGradient colors={['#084F4A', '#0B6E67', '#0F1419']} locations={[0, 0.5, 1]} style={styles.hero}>
            <View style={[styles.heroTop, { paddingTop: insets.top + spacing.sm }]}>
              <Pressable style={styles.closeBtn} onPress={close} accessibilityRole="button" accessibilityLabel="Close">
                <Ionicons name="close" size={20} color={colors.white} />
              </Pressable>
              <View style={styles.progressPill}>
                <Ionicons name="sparkles" size={12} color="#FCD34D" />
                <Text style={styles.progressText}>{completionPercent}% complete</Text>
              </View>
            </View>

            <View style={styles.photoBlock}>
              <ProfileAvatar
                name={name || profile?.name}
                uri={avatarUri}
                size="xl"
                showCamera
                onPress={changePhoto}
              />
              <Text style={styles.heroTitle}>Edit profile</Text>
              <Text style={styles.heroSub}>Make your account feel truly yours</Text>

              <View style={styles.photoActions}>
                <Pressable style={styles.photoBtn} onPress={changePhoto}>
                  <Ionicons name="images-outline" size={16} color={colors.white} />
                  <Text style={styles.photoBtnText}>{avatarUri ? 'Change photo' : 'Add photo'}</Text>
                </Pressable>
                {avatarUri ? (
                  <Pressable style={styles.photoBtnGhost} onPress={removePhoto}>
                    <Text style={styles.photoBtnGhostText}>Remove</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>

            <View style={styles.heroFade} pointerEvents="none" />
            <View style={styles.orbA} pointerEvents="none" />
            <View style={styles.orbB} pointerEvents="none" />
          </LinearGradient>

          <View style={premiumFormStyles.form}>
            <ProfileSectionCard icon="person-outline" title="Who you are" hint="Shown to your assigned pro">
              <QmInput label="Full name *" value={name} onChangeText={setName} placeholder="e.g. Priya Sharma" autoCapitalize="words" />
              <QmInput label="Mobile" value={profile?.phone ? `+91 ${profile.phone}` : ''} editable={false} hint="Changed via OTP login only" />
              <QmInput label="Email" value={email} onChangeText={setEmail} placeholder="you@email.com" keyboardType="email-address" autoCapitalize="none" hint="Receipts & booking updates" />
              <ChoiceChips label="Gender" options={GENDER_OPTS} value={gender} onChange={setGender} optional />
            </ProfileSectionCard>

            <ProfileSectionCard icon="location-outline" title="Where you live" hint="For dispatch & zone matching">
              <QmInput label="Society / locality" value={locality} onChangeText={setLocality} placeholder="Shankar Nagar, Civil Lines" />
              <QmInput label="City" value={profile?.city ?? 'Raipur'} editable={false} />
              <ChoiceChips label="Service zone" options={ZONE_OPTS} value={zone} onChange={setZone} hint="Raipur zones we serve today" />
            </ProfileSectionCard>

            <ProfileSectionCard icon="home-outline" title="Your home" hint="Helps us quote the right visit">
              <ChoiceChips label="Home type" options={HOME_OPTS} value={homeType} onChange={setHomeType} hint="Pricing depends on home size" />
            </ProfileSectionCard>

            <ProfileTrustNote text="Your details are stored securely and only shared with pros assigned to your bookings." />
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <ProfilePremiumSaveBtn
            label="Save changes"
            onPress={save}
            loading={saving}
            disabled={!name.trim()}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: {
    paddingBottom: spacing.xxl,
    overflow: 'hidden',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.pad,
    marginBottom: spacing.lg,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.25)',
  },
  progressText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: '#FCD34D',
  },
  photoBlock: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: layout.pad,
  },
  heroTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 26,
    color: colors.white,
    letterSpacing: -0.6,
    marginTop: spacing.sm,
  },
  heroSub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.72)',
  },
  photoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  photoBtnText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.white,
  },
  photoBtnGhost: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  photoBtnGhostText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
  },
  heroFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
  },
  orbA: {
    position: 'absolute',
    top: -20,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(110,231,183,0.1)',
  },
  orbB: {
    position: 'absolute',
    bottom: 60,
    left: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.md,
    backgroundColor: colors.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
});
