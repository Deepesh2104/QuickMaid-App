import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import type { ServiceBadge, ServiceItem } from '@/constants/services';
import { useStartBooking } from '@/features/checkout/hooks/useStartBooking';
import { useSavedServices } from '@/features/saved-services/hooks/useSavedServices';
import { useOpenServiceDetail } from '@/features/service/hooks/useOpenServiceDetail';
import { premium } from '../constants/home.premium';
import { getServiceImages } from '../constants/unsplash.images';
import { HomePhoto } from './HomePhoto';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

const AnimatedPress = Animated.createAnimatedComponent(Pressable);

const BADGE_STYLES: Record<ServiceBadge, { bg: string; ink: string }> = {
  Popular: { bg: '#FFF4ED', ink: '#C4320A' },
  'Best value': { bg: '#ECFDF3', ink: '#027A48' },
  New: { bg: '#EFF6FF', ink: '#175CD3' },
  'Top rated': { bg: '#FFFAEB', ink: '#B54708' },
};

interface HomeServiceCardProps {
  service: ServiceItem;
  index: number;
}

export function HomeServiceCard({ service, index }: HomeServiceCardProps) {
  const { bookService } = useStartBooking();
  const openDetail = useOpenServiceDetail();
  const { isSaved, toggle } = useSavedServices();
  const saved = isSaved(service.id);
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const badgeStyle = service.badge ? BADGE_STYLES[service.badge] : null;

  return (
    <AnimatedPress
      entering={FadeIn.duration(220).delay(index * 40)}
      exiting={FadeOut.duration(160)}
      style={[styles.card, anim]}
      onPressIn={() => {
        scale.value = withSpring(0.98, { damping: 16, stiffness: 360 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 16, stiffness: 360 });
      }}
      onPress={() => openDetail(service.id)}
      accessibilityRole="button"
      accessibilityLabel={`${service.name}, ${service.price}`}
    >
      <View style={styles.visual}>
        <HomePhoto uri={getServiceImages(service.id)} style={styles.photo} overlay="none" tint={service.tint} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.62)']}
          locations={[0.3, 0.6, 1]}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.indexTag}>{String(index + 1).padStart(2, '0')}</Text>
        {badgeStyle ? (
          <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
            <Text style={[styles.badgeText, { color: badgeStyle.ink }]}>{service.badge}</Text>
          </View>
        ) : null}
        <Pressable
          style={[styles.saveBtn, saved && styles.saveBtnOn]}
          onPress={(e) => {
            e.stopPropagation?.();
            Haptics.selectionAsync();
            void toggle(service.id);
          }}
          accessibilityRole="button"
          accessibilityLabel={saved ? 'Remove from saved' : 'Save service'}
        >
          <Ionicons name={saved ? 'heart' : 'heart-outline'} size={16} color={saved ? '#FBBF24' : colors.white} />
        </Pressable>
        <View style={styles.visualMeta}>
          <View style={styles.iconChip}>
            <Ionicons name={service.icon} size={14} color={colors.primaryDark} />
          </View>
          <View style={styles.ratingChip}>
            <Ionicons name="star" size={10} color={colors.star} />
            <Text style={styles.ratingText}>{service.rating}</Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.headRow}>
          <View style={styles.titleCol}>
            <Text style={styles.name}>{service.name}</Text>
            <Text style={styles.desc} numberOfLines={2}>
              {service.desc}
            </Text>
          </View>
          <View style={styles.priceCol}>
            <Text style={styles.price}>{service.price}</Text>
            <Text style={styles.onwards}>onwards</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaPill}>
            <Ionicons name="time-outline" size={11} color={colors.primary} />
            <Text style={styles.metaPillText}>{service.duration}</Text>
          </View>
          <View style={styles.metaPill}>
            <Ionicons name="people-outline" size={11} color={colors.primary} />
            <Text style={styles.metaPillText}>{service.reviews} booked</Text>
          </View>
        </View>

        {service.perks && service.perks.length > 0 ? (
          <View style={styles.perks}>
            {service.perks.slice(0, 3).map((perk) => (
              <View key={perk} style={styles.perk}>
                <Ionicons name="checkmark-circle" size={11} color={colors.primary} />
                <Text style={styles.perkText}>{perk}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.actionRow}>
          <Pressable
            style={styles.detailsBtn}
            onPress={() => openDetail(service.id)}
            accessibilityRole="button"
            accessibilityLabel={`View details for ${service.name}`}
          >
            <Ionicons name="information-circle-outline" size={15} color={colors.inkSecondary} />
            <Text style={styles.detailsText}>Details</Text>
          </Pressable>
          <Pressable
            style={styles.bookBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              bookService(service);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Book ${service.name}`}
          >
            <LinearGradient
              colors={['#0B6E67', '#084F4A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bookGradient}
            >
              <Text style={styles.bookText}>Book now</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.white} />
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </AnimatedPress>
  );
}

export function HomeServiceEmpty({ query }: { query?: string }) {
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIcon}>
        <Ionicons name="search-outline" size={30} color={colors.mutedLight} />
      </View>
      <Text style={styles.emptyTitle}>No services found</Text>
      <Text style={styles.emptySub}>
        Try a different search{query ? ` for "${query}"` : ''} or pick another category.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...premium.surface,
    overflow: 'hidden',
  },
  visual: {
    height: 140,
    position: 'relative',
  },
  photo: { width: '100%', height: '100%' },
  indexTag: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    fontFamily: fonts.extraBold,
    fontSize: 36,
    color: 'rgba(255,255,255,0.12)',
    letterSpacing: -1,
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 0.2,
  },
  saveBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(15,20,25,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  saveBtnOn: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderColor: 'rgba(251,191,36,0.4)',
  },
  visualMeta: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    gap: 6,
  },
  iconChip: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  ratingText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.ink,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  titleCol: { flex: 1, gap: 4 },
  name: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  desc: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
  },
  priceCol: { alignItems: 'flex-end' },
  price: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: colors.primary,
    letterSpacing: -0.5,
  },
  onwards: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.muted,
    marginTop: 1,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metaPillText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.primaryDark,
  },
  perks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  perk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  perkText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: colors.inkSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  detailsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderRadius: radius.pill,
    paddingVertical: 13,
    backgroundColor: colors.bgSubtle,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  detailsText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.inkSecondary,
  },
  bookBtn: {
    flex: 1.45,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  bookGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
  },
  bookText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.white,
  },
  emptyWrap: {
    alignItems: 'center',
    ...premium.surface,
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.ink,
  },
  emptySub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
