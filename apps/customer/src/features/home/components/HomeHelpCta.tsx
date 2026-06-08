import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useOpenSupport } from '@/features/help/hooks/useOpenSupport';
import { HomeSectionHeader } from './HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const CHANNELS = [
  {
    id: 'chat',
    icon: 'chatbubbles-outline' as const,
    label: 'Chat support',
    sub: 'Avg reply 2 min',
    tone: colors.primaryLight,
    ink: colors.primaryDark,
  },
  {
    id: 'call',
    icon: 'call-outline' as const,
    label: 'Call us',
    sub: '9 AM – 9 PM',
    tone: '#EEF6FF',
    ink: '#175CD3',
  },
];

export function HomeHelpCta() {
  const openSupport = useOpenSupport();

  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Need help?"
        title="We're here for you"
        subtitle="Real humans · Not bots"
        icon="headset-outline"
        compact
      />
      <View style={styles.row}>
        {CHANNELS.map((c) => (
          <Pressable
            key={c.id}
            style={styles.tile}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              if (c.id === 'chat') openSupport({ chat: true });
              else openSupport({ call: true });
            }}
            accessibilityRole="button"
            accessibilityLabel={c.label}
          >
            <View style={[styles.icon, { backgroundColor: c.tone }]}>
              <Ionicons name={c.icon} size={20} color={c.ink} />
            </View>
            <Text style={styles.label}>{c.label}</Text>
            <Text style={styles.sub}>{c.sub}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const GAP = spacing.md;
const TILE_W = (layout.screenWidth - layout.pad * 2 - GAP) / 2;

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  row: {
    flexDirection: 'row',
    gap: GAP,
    paddingHorizontal: layout.pad,
  },
  tile: {
    width: TILE_W,
    backgroundColor: colors.bg,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
  },
});
