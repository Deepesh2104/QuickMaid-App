import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QmButton } from '@/components/ui/QmButton';
import { usePartnerAlert } from '@/context/PartnerAlertContext';
import { usePartner } from '@/context/PartnerContext';
import { PartnerRequestsSectionHeader } from '@/features/jobs/components/PartnerRequestsSections';
import {
  PREFERRED_SLOTS,
  SLOT_PICKER_STATS,
  SLOT_PICKER_TIPS,
  type PreferredSlotId,
} from '@/features/slots/constants/slots.premium';
import { PartnerSlotToggleCard } from '@/features/slots/components/PartnerSlotToggleCard';
import {
  activeSlotCount,
  resolvePreferredSlotIds,
  slotsSummaryLabel,
  togglePreferredSlot,
} from '@/features/slots/lib/slots.utils';
import { useLayoutMetrics } from '@/hooks/useLayoutMetrics';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const SHEET_OVERLAP = 14;
const SHEET_BG = '#EFF8F7';

export function PartnerSlotsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { tabScrollPad } = useLayoutMetrics();
  const { profile, updateProfile } = usePartner();
  const { alert } = usePartnerAlert();

  const savedIds = useMemo(() => resolvePreferredSlotIds(profile), [profile]);
  const [draftIds, setDraftIds] = useState<PreferredSlotId[]>(savedIds);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraftIds(savedIds);
  }, [savedIds]);

  const dirty = useMemo(
    () => JSON.stringify([...draftIds].sort()) !== JSON.stringify([...savedIds].sort()),
    [draftIds, savedIds],
  );

  const toggle = (slotId: PreferredSlotId) => {
    Haptics.selectionAsync();
    setDraftIds((prev) => {
      const next = togglePreferredSlot(prev, slotId);
      if (next.length === prev.length && prev.includes(slotId)) {
        alert({
          title: 'At least one slot',
          message: 'Keep one time window on so we can match you to jobs.',
          variant: 'warning',
          icon: 'time-outline',
          buttons: [{ text: 'OK' }],
        });
      }
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    await updateProfile({ preferredSlotIds: [...draftIds] });
    setSaving(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#032A28', '#084F4A', '#0B6E67']}
        locations={[0, 0.5, 1]}
        style={[styles.header, { paddingTop: insets.top + spacing.xs }]}
      >
        <View style={styles.headerGlowA} />
        <View style={styles.headerGlowB} />

        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={20} color={colors.white} />
          </Pressable>
          <View style={styles.tabIcon}>
            <Ionicons name="time" size={17} color={colors.partnerGold} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>AVAILABILITY</Text>
            <Text style={styles.headerTitle}>Choose your slots</Text>
            <Text style={styles.headerSub}>{slotsSummaryLabel(draftIds)}</Text>
          </View>
        </View>

        <View style={styles.statBar}>
          {SLOT_PICKER_STATS.map((stat, idx) => (
            <View key={stat.label} style={styles.statWrap}>
              {idx > 0 ? <View style={styles.statDivider} /> : null}
              <View style={styles.statChip}>
                <Text style={styles.statNum}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scroll, { paddingBottom: tabScrollPad + spacing.xl }]}
        >
          <Animated.View entering={FadeInDown.duration(300)}>
            <View style={styles.summaryCard}>
              <Ionicons name="flash-outline" size={18} color={colors.partnerGold} />
              <View style={styles.summaryCopy}>
                <Text style={styles.summaryTitle}>
                  {activeSlotCount(draftIds)} of {PREFERRED_SLOTS.length} windows on
                </Text>
                <Text style={styles.summarySub}>
                  Job requests only arrive in slots you turn on. Stay online during those hours for best results.
                </Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(80).duration(300)} style={styles.block}>
            <PartnerRequestsSectionHeader
              eyebrow="Tap to toggle"
              title="Your time windows"
              subtitle="Mon–Sat morning & afternoon · Sunday morning"
              icon="calendar-outline"
              compact
            />
            <View style={styles.list}>
              {PREFERRED_SLOTS.map((slot) => (
                <PartnerSlotToggleCard
                  key={slot.id}
                  slotId={slot.id}
                  label={slot.label}
                  sub={slot.sub}
                  icon={slot.icon}
                  peak={slot.peak}
                  active={draftIds.includes(slot.id)}
                  interactive
                  onToggle={() => toggle(slot.id)}
                />
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(140).duration(300)} style={styles.block}>
            <PartnerRequestsSectionHeader
              eyebrow="Tips"
              title="How matching works"
              icon="bulb-outline"
              compact
            />
            <View style={styles.tips}>
              {SLOT_PICKER_TIPS.map((tip) => (
                <View key={tip} style={styles.tipRow}>
                  <View style={styles.tipDot} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(180).duration(300)}>
            <QmButton
              label={dirty ? 'Save slot preferences' : 'Slots saved'}
              icon="checkmark-circle"
              onPress={() => void save()}
              loading={saving}
              disabled={!dirty}
            />
          </Animated.View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primaryDark },
  header: {
    paddingHorizontal: layout.pad,
    paddingBottom: SHEET_OVERLAP + spacing.md,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  headerGlowA: {
    position: 'absolute',
    right: -20,
    top: -10,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(252,211,77,0.12)',
  },
  headerGlowB: {
    position: 'absolute',
    left: -30,
    bottom: -10,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(110,231,183,0.14)',
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  tabIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(217,119,6,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  headerCopy: { flex: 1, gap: 1, minWidth: 0 },
  headerEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(252,211,77,0.9)',
    letterSpacing: 1,
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.white,
    letterSpacing: -0.4,
  },
  headerSub: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.65)' },
  statBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(110,231,183,0.1)',
    borderRadius: radius.lg,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.22)',
  },
  statWrap: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  statChip: { flex: 1, alignItems: 'center', gap: 1 },
  statNum: { fontFamily: fonts.extraBold, fontSize: 13, color: colors.white },
  statLabel: { fontFamily: fonts.medium, fontSize: 9, color: 'rgba(255,255,255,0.6)' },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },

  sheet: {
    flex: 1,
    marginTop: -SHEET_OVERLAP,
    backgroundColor: SHEET_BG,
    borderTopLeftRadius: radius.xxl + 6,
    borderTopRightRadius: radius.xxl + 6,
    overflow: 'hidden',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(11,110,103,0.22)',
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  scroll: { paddingHorizontal: layout.pad, gap: spacing.lg, paddingTop: spacing.xs },

  summaryCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.2)',
  },
  summaryCopy: { flex: 1, gap: 4 },
  summaryTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  summarySub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },

  block: { gap: spacing.sm },
  list: { gap: spacing.sm },
  tips: { gap: spacing.sm },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
  tipText: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.inkSecondary, lineHeight: 17 },
});
