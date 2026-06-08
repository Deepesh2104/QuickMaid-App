import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useStartBooking } from '@/features/checkout/hooks/useStartBooking';
import { resolveServiceIdFromSpecialty } from '@/features/bookings/utils/bookings.utils';
import { premium } from '../constants/home.premium';
import { HomeSectionHeader } from './HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const AnimatedPress = Animated.createAnimatedComponent(Pressable);

const PROS = [
  { id: 'p1', name: 'Sunita Devi', jobs: '1.2k', rating: '4.9', specialty: 'Deep clean', initial: 'S', tone: ['#E6F4F2', '#FFFFFF'] as const },
  { id: 'p2', name: 'Kamla Bai', jobs: '980', rating: '4.9', specialty: 'Regular', initial: 'K', tone: ['#EEF6FF', '#FFFFFF'] as const },
  { id: 'p3', name: 'Rekha Sahu', jobs: '860', rating: '4.8', specialty: 'Kitchen', initial: 'R', tone: ['#FFF8EE', '#FFFFFF'] as const },
  { id: 'p4', name: 'Meena T.', jobs: '740', rating: '4.8', specialty: 'Bathroom', initial: 'M', tone: ['#F3EEFF', '#FFFFFF'] as const },
];

function ProCard({ pro }: { pro: (typeof PROS)[0] }) {
  const { bookById, bookDefault } = useStartBooking();
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPress
      style={[styles.card, anim]}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 14, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 320 });
      }}
      onPress={() => {
        Haptics.selectionAsync();
        const id = resolveServiceIdFromSpecialty(pro.specialty);
        if (id) bookById(id);
        else bookDefault();
      }}
      accessibilityRole="button"
      accessibilityLabel={`${pro.name}, ${pro.rating} stars`}
    >
      <LinearGradient colors={[...pro.tone]} style={styles.cardBg} />
      <View style={styles.avatar}>
        <Text style={styles.initial}>{pro.initial}</Text>
        <View style={styles.verified}>
          <Ionicons name="shield-checkmark" size={10} color={colors.white} />
        </View>
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {pro.name}
      </Text>
      <View style={styles.specialty}>
        <Text style={styles.specialtyText}>{pro.specialty}</Text>
      </View>
      <View style={styles.meta}>
        <Ionicons name="star" size={10} color={colors.star} />
        <Text style={styles.rating}>{pro.rating}</Text>
        <Text style={styles.dot}>·</Text>
        <Text style={styles.jobs}>{pro.jobs}</Text>
      </View>
    </AnimatedPress>
  );
}

export function HomeTopPros() {
  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Verified team"
        title="Top-rated pros"
        subtitle="Background-checked · Trained for Raipur homes"
        icon="people-outline"
        compact
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {PROS.map((p) => (
          <ProCard key={p.id} pro={p} />
        ))}
      </ScrollView>
    </View>
  );
}

const CARD_W = 132;

const styles = StyleSheet.create({
  block: { ...premium.section },
  row: {
    paddingHorizontal: layout.pad,
    gap: spacing.md,
    paddingRight: layout.pad + spacing.md,
  },
  card: {
    width: CARD_W,
    padding: spacing.md,
    alignItems: 'center',
    gap: 5,
    overflow: 'hidden',
    ...premium.surface,
    borderRadius: radius.xl,
  },
  cardBg: { ...StyleSheet.absoluteFill, opacity: 0.65 },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    position: 'relative',
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  initial: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.primaryDark,
  },
  verified: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.bg,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.ink,
    textAlign: 'center',
  },
  specialty: {
    backgroundColor: colors.bg,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  specialtyText: {
    fontFamily: fonts.semiBold,
    fontSize: 9,
    color: colors.primaryDark,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  rating: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.ink,
  },
  dot: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.mutedLight,
  },
  jobs: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.muted,
  },
});
