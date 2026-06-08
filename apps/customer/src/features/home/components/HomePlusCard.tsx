import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HOME_IMAGES } from '../constants/unsplash.images';
import { HomePhoto } from './HomePhoto';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function HomePlusCard() {
  return (
    <Pressable
      style={styles.wrap}
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      accessibilityRole="button"
      accessibilityLabel="QuickMaid Plus membership"
    >
      <HomePhoto
        uri={HOME_IMAGES.plus}
        style={styles.photo}
        overlay="dark"
        borderRadius={radius.xl}
        tint={colors.primaryLight}
      />
      <View style={styles.content}>
        <View style={styles.icon}>
          <Ionicons name="diamond" size={22} color={colors.primary} />
        </View>
        <View style={styles.text}>
          <Text style={styles.title}>QuickMaid Plus</Text>
          <Text style={styles.sub}>10% off · Priority support · Free reschedules</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>Explore</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: layout.pad,
    marginBottom: spacing.md,
    borderRadius: radius.xl,
    overflow: 'hidden',
    minHeight: 88,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  photo: {
    ...StyleSheet.absoluteFill,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.93)',
    margin: spacing.sm,
    borderRadius: radius.lg,
  },
  icon: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, minWidth: 0 },
  title: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  sub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, marginTop: 3, lineHeight: 15 },
  pill: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  pillText: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.white },
});
