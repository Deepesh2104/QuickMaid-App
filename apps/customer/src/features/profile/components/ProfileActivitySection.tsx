import { Ionicons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PROFILE_ACTIVITY } from '../constants/profile.demo';
import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const ROUTES: Record<string, Href> = {
  act1: '/(tabs)/bookings',
  act2: '/plus/billing',
  act3: '/(tabs)/bookings',
};

export function ProfileActivitySection() {
  const router = useRouter();

  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Recent"
        title="Your activity"
        subtitle="Bookings · Payments · Plan"
        icon="time-outline"
        compact
      />

      <View style={styles.list}>
        {PROFILE_ACTIVITY.map((item, i) => (
          <Pressable
            key={item.id}
            style={styles.row}
            onPress={() => {
              Haptics.selectionAsync();
              const route = ROUTES[item.id];
              if (route) router.push(route);
            }}
            accessibilityRole="button"
          >
            <View style={styles.timeline}>
              <View style={[styles.dot, { backgroundColor: item.tone }]}>
                <Ionicons name={item.icon} size={14} color={colors.primaryDark} />
              </View>
              {i < PROFILE_ACTIVITY.length - 1 ? <View style={styles.line} /> : null}
            </View>
            <View style={styles.copy}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.sub}>{item.sub}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  list: {
    marginHorizontal: layout.pad,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  row: { flexDirection: 'row', gap: spacing.md },
  timeline: { alignItems: 'center', width: 36 },
  dot: {
    width: 32,
    height: 32,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 16,
    backgroundColor: colors.divider,
    marginTop: 4,
  },
  copy: { flex: 1, gap: 2, paddingBottom: spacing.xs },
  title: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.ink,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  time: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.mutedLight,
    marginTop: 2,
  },
});
