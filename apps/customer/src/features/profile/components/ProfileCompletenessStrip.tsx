import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface ProfileCompletenessStripProps {
  percent: number;
  missing: string[];
  onComplete: () => void;
}

export function ProfileCompletenessStrip({ percent, missing, onComplete }: ProfileCompletenessStripProps) {
  if (percent >= 100) return null;

  return (
    <Pressable
      style={styles.wrap}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onComplete();
      }}
      accessibilityRole="button"
    >
      <LinearGradient colors={['#0F1419', '#1A2332']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
      <View style={styles.ring}>
        <Text style={styles.ringText}>{percent}%</Text>
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>Complete your profile</Text>
        <Text style={styles.sub} numberOfLines={2}>
          Add: {missing.slice(0, 3).join(' · ')}{missing.length > 3 ? '…' : ''}
        </Text>
        <View style={styles.bar}>
          <View style={[styles.barFill, { width: `${percent}%` }]} />
        </View>
      </View>
      <View style={styles.cta}>
        <Ionicons name="arrow-forward" size={16} color="#0F1419" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: layout.pad,
    marginBottom: spacing.md,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    overflow: 'hidden',
  },
  ring: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    borderColor: '#6EE7B7',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(110,231,183,0.1)',
  },
  ringText: {
    fontFamily: fonts.extraBold,
    fontSize: 13,
    color: '#6EE7B7',
  },
  copy: { flex: 1, gap: 4 },
  title: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 15,
  },
  bar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
    marginTop: 2,
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#6EE7B7',
  },
  cta: {
    width: 32,
    height: 32,
    borderRadius: radius.lg,
    backgroundColor: '#6EE7B7',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
