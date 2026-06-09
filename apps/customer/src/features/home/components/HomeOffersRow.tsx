import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { type Href, useRouter } from 'expo-router';
import { HomeSectionHeader } from './HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const AnimatedPress = Animated.createAnimatedComponent(Pressable);

const OFFERS = [
  {
    id: 'refer',
    icon: 'gift-outline' as const,
    title: 'Refer & earn',
    sub: '₹100 per friend',
    colors: ['#ECFDF5', '#D1FAE5'] as const,
    ink: '#027A48',
  },
  {
    id: 'monthly',
    icon: 'calendar-outline' as const,
    title: 'Monthly plan',
    sub: '8 visits · Save 15%',
    colors: ['#EEF6FF', '#DBEAFE'] as const,
    ink: '#175CD3',
  },
];

function OfferTile({ offer }: { offer: (typeof OFFERS)[0] }) {
  const router = useRouter();
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPress
      style={[styles.tile, anim]}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 16, stiffness: 360 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 16, stiffness: 360 });
      }}
      onPress={() => {
        Haptics.selectionAsync();
        if (offer.id === 'refer') {
          router.push('/account/referrals' as Href);
        } else {
          router.push('/(tabs)/plans' as Href);
        }
      }}
      accessibilityRole="button"
      accessibilityLabel={offer.title}
    >
      <LinearGradient colors={[...offer.colors]} style={StyleSheet.absoluteFill} />
      <View style={[styles.icon, { backgroundColor: colors.white }]}>
        <Ionicons name={offer.icon} size={18} color={offer.ink} />
      </View>
      <Text style={styles.title} numberOfLines={1}>{offer.title}</Text>
      <Text style={[styles.sub, { color: offer.ink }]} numberOfLines={2}>{offer.sub}</Text>
      <Ionicons name="chevron-forward" size={14} color={offer.ink} style={styles.chev} />
    </AnimatedPress>
  );
}

export function HomeOffersRow() {
  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="More savings"
        title="Offers for you"
        subtitle="Share, subscribe & save more"
        icon="pricetags-outline"
        compact
      />
      <View style={styles.row}>
        {OFFERS.map((o) => (
          <OfferTile key={o.id} offer={o} />
        ))}
      </View>
    </View>
  );
}

const GAP = spacing.md;

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  row: {
    flexDirection: 'row',
    gap: GAP,
    paddingHorizontal: layout.pad,
  },
  tile: {
    flex: 1,
    minWidth: 0,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: 4,
    overflow: 'hidden',
    minHeight: 108,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.05)',
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  sub: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
  },
  chev: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
  },
});
