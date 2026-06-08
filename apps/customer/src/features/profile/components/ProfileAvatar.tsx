import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/spacing';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZES: Record<AvatarSize, { box: number; font: number; ring: number; cam: number }> = {
  sm: { box: 48, font: 16, ring: 2, cam: 22 },
  md: { box: 60, font: 20, ring: 2, cam: 26 },
  lg: { box: 80, font: 26, ring: 3, cam: 30 },
  xl: { box: 104, font: 34, ring: 3, cam: 36 },
};

function initialsFrom(name?: string) {
  if (!name?.trim()) return 'QM';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

interface ProfileAvatarProps {
  name?: string;
  uri?: string;
  size?: AvatarSize;
  showCamera?: boolean;
  complete?: boolean;
  percent?: number;
  onPress?: () => void;
  style?: ViewStyle;
}

export function ProfileAvatar({
  name,
  uri,
  size = 'md',
  showCamera = false,
  complete,
  percent,
  onPress,
  style,
}: ProfileAvatarProps) {
  const s = SIZES[size];
  const initials = initialsFrom(name);
  const ringColor = complete ? colors.success : '#FCD34D';

  const body = (
    <View style={[styles.wrap, style]}>
      <View
        style={[
          styles.ring,
          {
            padding: s.ring,
            borderRadius: s.box / 2 + s.ring + 4,
            borderColor: ringColor,
          },
        ]}
      >
        {uri ? (
          <Image source={{ uri }} style={{ width: s.box, height: s.box, borderRadius: s.box / 2 }} contentFit="cover" />
        ) : (
          <LinearGradient colors={['#0B6E67', '#084F4A']} style={{ width: s.box, height: s.box, borderRadius: s.box / 2, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: fonts.extraBold, fontSize: s.font, color: colors.white }}>{initials}</Text>
          </LinearGradient>
        )}
      </View>

      {showCamera ? (
        <View style={[styles.cam, { width: s.cam, height: s.cam, borderRadius: s.cam / 2 }]}>
          <Ionicons name="camera" size={s.cam * 0.42} color={colors.white} />
        </View>
      ) : null}

      {!showCamera && percent !== undefined && percent < 100 ? (
        <View style={styles.percentBadge}>
          <Text style={styles.percentText}>{percent}%</Text>
        </View>
      ) : null}

      {!showCamera && complete ? (
        <View style={styles.verified}>
          <Ionicons name="checkmark-circle" size={size === 'xl' ? 22 : 18} color={colors.success} />
        </View>
      ) : null}
    </View>
  );

  if (!onPress) return body;

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel="Change profile photo">
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative', alignSelf: 'flex-start' },
  ring: {
    borderWidth: 2,
    backgroundColor: colors.white,
  },
  cam: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: colors.white,
  },
  percentBadge: {
    position: 'absolute',
    bottom: -2,
    right: -6,
    backgroundColor: '#FCD34D',
    borderRadius: radius.pill,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: colors.white,
  },
  percentText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: '#0F1419',
  },
  verified: {
    position: 'absolute',
    bottom: -2,
    right: -4,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
});
