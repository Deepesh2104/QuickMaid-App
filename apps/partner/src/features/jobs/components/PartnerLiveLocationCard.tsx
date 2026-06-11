import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { QmButton } from '@/components/ui/QmButton';
import { useVisitLiveLocation } from '@/features/jobs/hooks/useVisitLiveLocation';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

function formatElapsed(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function PartnerLiveLocationCard({ active }: { active: boolean }) {
  const live = useVisitLiveLocation(active);

  if (!active) return null;

  return (
    <Animated.View entering={FadeInDown.duration(300)} style={styles.wrap}>
      <LinearGradient colors={['#EFF8FF', '#FFFFFF']} style={styles.card}>
        <View style={styles.head}>
          <View style={styles.iconWrap}>
            {live.sharing ? (
              <View style={styles.pulseRing}>
                <View style={styles.pulseDot} />
              </View>
            ) : (
              <Ionicons name="navigate-circle-outline" size={20} color="#1570EF" />
            )}
          </View>
          <View style={styles.headCopy}>
            <Text style={styles.title}>Live location share</Text>
            <Text style={styles.sub}>
              Sirf active visit ke dauran · customer ko ETA dikhata hai
            </Text>
          </View>
        </View>

        {live.sharing ? (
          <View style={styles.liveBox}>
            <View style={styles.liveRow}>
              <Ionicons name="radio" size={14} color="#1570EF" />
              <Text style={styles.liveLabel}>Sharing · {formatElapsed(live.elapsedSec)}</Text>
            </View>
            <Text style={styles.coords}>{live.coordsLabel ?? '—'}</Text>
            <Text style={styles.updated}>Updated {live.lastUpdated ?? '—'}</Text>
            <Pressable
              style={styles.stopBtn}
              onPress={() => {
                Haptics.selectionAsync();
                live.stop();
              }}
            >
              <Text style={styles.stopText}>Stop sharing</Text>
            </Pressable>
          </View>
        ) : (
          <QmButton
            label="Start live share"
            icon="navigate"
            onPress={() => void live.start()}
            loading={live.loading}
          />
        )}

        {live.error ? <Text style={styles.error}>{live.error}</Text> : null}
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.sm },
  card: {
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(21,112,239,0.18)',
    overflow: 'hidden',
  },
  head: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  iconWrap: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  pulseRing: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(21,112,239,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1570EF' },
  headCopy: { flex: 1, gap: 2 },
  title: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  sub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },
  liveBox: {
    backgroundColor: 'rgba(21,112,239,0.06)',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 4,
  },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveLabel: { fontFamily: fonts.bold, fontSize: 12, color: '#1570EF' },
  coords: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.ink },
  updated: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted },
  stopBtn: { alignSelf: 'flex-start', marginTop: spacing.xs },
  stopText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.error },
  error: { fontFamily: fonts.medium, fontSize: 11, color: colors.error },
});
