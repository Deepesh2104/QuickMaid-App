import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const LABELS = ['Poor', 'Okay', 'Good', 'Great', 'Amazing'];

export function HelpFeedbackCard() {
  const [rating, setRating] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const rate = (n: number) => {
    Haptics.selectionAsync();
    setRating(n);
    setTimeout(() => setSubmitted(true), 400);
  };

  if (submitted && rating) {
    return (
      <View style={styles.wrap}>
        <LinearGradient colors={['#ECFDF5', '#FFFFFF']} style={StyleSheet.absoluteFill} />
        <Ionicons name="checkmark-circle" size={28} color={colors.success} />
        <Text style={styles.thanksTitle}>Thanks for your feedback!</Text>
        <Text style={styles.thanksSub}>You rated us {LABELS[rating - 1]} — we read every response.</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <LinearGradient colors={['#EEF6FF', '#FFFFFF']} style={StyleSheet.absoluteFill} />

      <Text style={styles.title}>How was your support experience?</Text>
      <Text style={styles.sub}>Tap a star — takes 2 seconds</Text>

      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable
            key={n}
            style={styles.starBtn}
            onPress={() => rate(n)}
            accessibilityRole="button"
            accessibilityLabel={`Rate ${n} stars`}
          >
            <Ionicons
              name={rating && n <= rating ? 'star' : 'star-outline'}
              size={28}
              color={rating && n <= rating ? '#F59E0B' : colors.mutedLight}
            />
          </Pressable>
        ))}
      </View>

      {rating ? (
        <Text style={styles.hint}>{LABELS[rating - 1]}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: layout.pad,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    overflow: 'hidden',
    marginBottom: spacing.section,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.ink,
    textAlign: 'center',
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
  },
  stars: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  starBtn: {
    padding: 4,
  },
  hint: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: '#B54708',
  },
  thanksTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.ink,
    textAlign: 'center',
  },
  thanksSub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 17,
  },
});
