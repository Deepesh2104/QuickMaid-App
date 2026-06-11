import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { PartnerJob } from '@/constants/demo';
import { PartnerOfflineEmpty, PartnerWaitingEmpty } from '@/features/home/components/PartnerHomeSections';
import { PartnerRequestCard } from '@/features/jobs/components/PartnerRequestCard';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

const PREVIEW_LIMIT = 2;

interface PartnerRequestsPreviewProps {
  pending: PartnerJob[];
  isOnline: boolean;
  zone?: string;
}

export function PartnerRequestsPreview({ pending, isOnline, zone }: PartnerRequestsPreviewProps) {
  const router = useRouter();
  const preview = pending.slice(0, PREVIEW_LIMIT);

  const openAll = () => {
    Haptics.selectionAsync();
    router.push('/(tabs)/requests' as Href);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>New requests</Text>
          {pending.length > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pending.length}</Text>
            </View>
          ) : null}
        </View>
        {pending.length > 0 ? (
          <Pressable onPress={openAll} hitSlop={8} accessibilityRole="button">
            <Text style={styles.viewAll}>View all</Text>
          </Pressable>
        ) : null}
      </View>

      {!isOnline && pending.length === 0 ? (
        <PartnerOfflineEmpty />
      ) : pending.length === 0 ? (
        <PartnerWaitingEmpty zone={zone} />
      ) : (
        <View style={styles.list}>
          {preview.map((job) => (
            <PartnerRequestCard key={job.id} job={job} compact />
          ))}
          <Pressable style={styles.moreLink} onPress={openAll} accessibilityRole="button">
            <Text style={styles.moreText}>
              {pending.length > PREVIEW_LIMIT
                ? `See all ${pending.length} requests`
                : 'Open requests inbox'}
            </Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: spacing.lg },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.ink,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.partnerGold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: { fontFamily: fonts.bold, fontSize: 10, color: colors.white },
  viewAll: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.primary,
  },
  list: { gap: spacing.sm },
  moreLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: spacing.sm,
  },
  moreText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.primary,
  },
});
