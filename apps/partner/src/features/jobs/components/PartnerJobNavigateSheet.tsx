import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Linking, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { PartnerJob } from '@/constants/demo';
import {
  NAVIGATE_ROUTE_STEPS,
  NAVIGATE_TIPS,
} from '@/features/jobs/constants/navigate.premium';
import {
  jobDisplayAddress,
  jobMapsQuery,
  jobTravelMins,
} from '@/features/jobs/lib/job-detail.utils';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, shadow, spacing } from '@/theme/spacing';

export function PartnerJobNavigateSheet({
  visible,
  job,
  onClose,
}: {
  visible: boolean;
  job: PartnerJob;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { primary, secondary } = jobDisplayAddress(job);
  const travel = jobTravelMins(job.distanceKm);
  const query = jobMapsQuery(job);

  const openGoogle = () => {
    Haptics.selectionAsync();
    void Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${query}&travelmode=driving`);
  };

  const openWaze = () => {
    Haptics.selectionAsync();
    void Linking.openURL(`https://waze.com/ul?q=${query}&navigate=yes`);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Animated.View entering={FadeIn.duration(200)} style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View
          entering={FadeInDown.duration(320).springify()}
          style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}
        >
          <View style={styles.handle} />
          <View style={styles.headRow}>
            <View style={styles.headIcon}>
              <Ionicons name="navigate" size={16} color={colors.partnerGold} />
            </View>
            <View style={styles.headCopy}>
              <Text style={styles.eyebrow}>NAVIGATE</Text>
              <Text style={styles.title}>{job.customerName}</Text>
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={18} color={colors.muted} />
            </Pressable>
          </View>
          <Text style={styles.address}>{primary}</Text>
          {secondary ? <Text style={styles.landmark}>{secondary}</Text> : null}

          <View style={styles.mapPreview}>
            <LinearGradient colors={['#D1E9FF', '#E6F4F2', '#FFFBEB']} style={StyleSheet.absoluteFill} />
            <View style={styles.routeLine} />
            {NAVIGATE_ROUTE_STEPS.map((step, i) => (
              <View key={step} style={styles.routeStep}>
                <View style={[styles.routeDot, i === NAVIGATE_ROUTE_STEPS.length - 1 && styles.routeDotEnd]} />
                <Text style={styles.routeLabel}>{step}</Text>
              </View>
            ))}
            <View style={styles.etaChip}>
              <Ionicons name="car-outline" size={14} color={colors.primaryDark} />
              <Text style={styles.etaText}>{travel ? `~${travel} min` : '~15 min'} · {job.zone}</Text>
            </View>
          </View>

          <View style={styles.tips}>
            {NAVIGATE_TIPS.map((tip) => (
              <View key={tip} style={styles.tipRow}>
                <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>{job.distanceKm?.toFixed(1) ?? '—'} km</Text>
              <Text style={styles.metaLabel}>Distance</Text>
            </View>
            <View style={styles.metaDiv} />
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>{job.slotLabel.split('·')[0]?.trim() ?? 'Today'}</Text>
              <Text style={styles.metaLabel}>Slot</Text>
            </View>
          </View>

          <Pressable style={styles.primaryBtn} onPress={openGoogle}>
            <LinearGradient colors={['#084F4A', '#0B6E67']} style={StyleSheet.absoluteFill} />
            <Ionicons name="navigate" size={18} color={colors.white} />
            <Text style={styles.primaryText}>Google Maps directions</Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn} onPress={openWaze}>
            <Ionicons name="map-outline" size={16} color={colors.primary} />
            <Text style={styles.secondaryText}>Open in Waze</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(1,15,14,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.sm,
    gap: spacing.sm,
    ...shadow.lg,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E4E7EC',
    marginBottom: spacing.xs,
  },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  headIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(217,119,6,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headCopy: { flex: 1, gap: 1 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F4F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: { fontFamily: fonts.bold, fontSize: 9, color: colors.primary, letterSpacing: 1 },
  title: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.ink },
  tips: { gap: 6 },
  tipRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tipText: { flex: 1, fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  address: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink },
  landmark: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  mapPreview: {
    height: 140,
    borderRadius: radius.xl,
    overflow: 'hidden',
    padding: spacing.md,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(21,112,239,0.12)',
  },
  routeLine: {
    position: 'absolute',
    left: 26,
    top: 28,
    bottom: 48,
    width: 2,
    backgroundColor: 'rgba(11,110,103,0.25)',
  },
  routeStep: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
  },
  routeDotEnd: { backgroundColor: colors.partnerGold },
  routeLabel: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink },
  etaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  etaText: { fontFamily: fonts.bold, fontSize: 11, color: colors.primaryDark },
  metaRow: {
    flexDirection: 'row',
    backgroundColor: '#F6F8F8',
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  metaItem: { flex: 1, alignItems: 'center', gap: 2 },
  metaDiv: { width: 1, backgroundColor: colors.divider },
  metaValue: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.ink },
  metaLabel: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    paddingVertical: 14,
    overflow: 'hidden',
  },
  primaryText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  secondaryText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.primary },
});
