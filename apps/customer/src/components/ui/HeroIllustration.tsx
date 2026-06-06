import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, shadow } from '../../theme/spacing';

export function HeroIllustration() {
  return (
    <View style={styles.scene}>
      <View style={styles.blob1} />
      <View style={styles.blob2} />
      <View style={styles.blob3} />

      <View style={styles.house}>
        <View style={styles.roof} />
        <View style={styles.houseBody}>
          <View style={styles.door} />
          <View style={styles.window} />
        </View>
      </View>

      <View style={styles.person}>
        <View style={styles.head} />
        <View style={styles.body} />
        <View style={styles.phone}>
          <Ionicons name="phone-portrait-outline" size={14} color={colors.primary} />
        </View>
      </View>

      <View style={styles.sparkle}>
        <Ionicons name="sparkles" size={18} color={colors.accent} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    width: 280,
    height: 220,
    alignSelf: 'center',
    position: 'relative',
  },
  blob1: {
    position: 'absolute',
    top: 20,
    left: 30,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primarySoft,
  },
  blob2: {
    position: 'absolute',
    top: 50,
    right: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,92,26,0.12)',
  },
  blob3: {
    position: 'absolute',
    bottom: 30,
    left: 60,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryMuted,
  },
  house: {
    position: 'absolute',
    left: 24,
    bottom: 28,
    alignItems: 'center',
  },
  roof: {
    width: 0,
    height: 0,
    borderLeftWidth: 42,
    borderRightWidth: 42,
    borderBottomWidth: 36,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.primary,
    marginBottom: -2,
  },
  houseBody: {
    width: 72,
    height: 56,
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: 8,
    paddingHorizontal: 10,
    ...shadow.sm,
  },
  door: {
    width: 18,
    height: 28,
    backgroundColor: colors.primaryDark,
    borderRadius: 4,
  },
  window: {
    width: 16,
    height: 16,
    backgroundColor: colors.primaryLight,
    borderRadius: 3,
    marginBottom: 10,
  },
  person: {
    position: 'absolute',
    right: 48,
    bottom: 24,
    alignItems: 'center',
  },
  head: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5D0A9',
    borderWidth: 2,
    borderColor: colors.ink2,
    marginBottom: 4,
  },
  body: {
    width: 36,
    height: 44,
    backgroundColor: colors.primary,
    borderRadius: 18,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  phone: {
    position: 'absolute',
    right: -18,
    top: 36,
    width: 32,
    height: 48,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border2,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.md,
  },
  sparkle: {
    position: 'absolute',
    top: 36,
    right: 100,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.sm,
  },
});
