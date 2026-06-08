import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ServiceItem } from '@/constants/services';
import { getServiceImages } from '../constants/unsplash.images';
import { HomePhoto } from './HomePhoto';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface HomeServiceFeedProps {
  services: ServiceItem[];
  query: string;
}

export function HomeServiceFeed({ services, query }: HomeServiceFeedProps) {
  if (services.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="search-outline" size={36} color={colors.mutedLight} />
        <Text style={styles.emptyTitle}>No services found</Text>
        <Text style={styles.emptySub}>
          Try a different search{query ? ` for "${query}"` : ''} or pick another category.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {services.map((s) => (
        <Pressable
          key={s.id}
          style={styles.card}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          accessibilityRole="button"
          accessibilityLabel={`${s.name}, ${s.price}, rating ${s.rating}`}
        >
          <View style={styles.thumb}>
            <HomePhoto
              uri={getServiceImages(s.id)}
              style={styles.photo}
              borderRadius={radius.md}
              tint={s.tint}
            />
          </View>
          <View style={styles.body}>
            <Text style={styles.name}>{s.name}</Text>
            <Text style={styles.desc} numberOfLines={1}>
              {s.desc}
            </Text>
            <View style={styles.meta}>
              <Ionicons name="star" size={11} color={colors.star} />
              <Text style={styles.rating}>
                {s.rating} ({s.reviews})
              </Text>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.dur}>{s.duration}</Text>
            </View>
          </View>
          <View style={styles.priceCol}>
            <Text style={styles.price}>{s.price}</Text>
            <Text style={styles.onwards}>onwards</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} style={styles.chev} />
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadow.sm,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  photo: { width: '100%', height: '100%' },
  body: { flex: 1, minWidth: 0, gap: 2 },
  name: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  desc: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  rating: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.inkSecondary },
  dot: { color: colors.mutedLight, fontSize: 11 },
  dur: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  priceCol: { alignItems: 'flex-end', minWidth: 62 },
  price: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.ink },
  onwards: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted },
  chev: { marginTop: 6 },
  empty: { alignItems: 'center', paddingVertical: spacing.xxxl, gap: spacing.sm },
  emptyTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.ink,
    marginTop: spacing.sm,
  },
  emptySub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.xl,
  },
});
