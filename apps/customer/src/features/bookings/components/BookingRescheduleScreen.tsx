import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PREFERRED_SLOTS } from '@/constants/customer.zones';
import { FormScreenSkeleton } from '@/components/ui/Skeleton';
import type { DemoBooking } from '@/constants/demo';
import { getVisitDates } from '@/features/checkout/lib/checkout.utils';
import { rescheduleBookingById } from '@/features/checkout/lib/bookings.storage';
import { publishCustomerBookingStatus } from '@/lib/booking-status-bridge.storage';
import { getBookingById } from '../lib/booking.lookup';
import {
  buildReschedulePatch,
  hasRescheduleChanged,
  timeToSlotId,
  type RescheduleSelection,
} from '../lib/booking.reschedule';
import { BookingChangeBridgeCard } from './BookingChangeBridgeCard';
import { BookingRescheduleSuccessModal } from './BookingRescheduleSuccessModal';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const DATES = getVisitDates(7);

export function BookingRescheduleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<DemoBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [updatedBooking, setUpdatedBooking] = useState<DemoBooking | null>(null);

  const [visitDate, setVisitDate] = useState('');
  const [visitDateLabel, setVisitDateLabel] = useState('');
  const [slotId, setSlotId] = useState('');
  const [slotLabel, setSlotLabel] = useState('');

  const loadBooking = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const b = await getBookingById(id);
    setBooking(b ?? null);

    if (b && b.status === 'upcoming') {
      const initialSlotId = b.slotId ?? timeToSlotId(b.time);
      const slot = PREFERRED_SLOTS.find((s) => s.value === initialSlotId) ?? PREFERRED_SLOTS[0];
      const firstDate = DATES[0];

      setVisitDate(b.visitDate ?? firstDate.iso);
      setVisitDateLabel(b.date ?? firstDate.label);
      setSlotId(initialSlotId);
      setSlotLabel(b.slotLabel ?? slot.label);
    }

    setLoading(false);
  }, [id]);

  useEffect(() => {
    void loadBooking();
  }, [loadBooking]);

  const selection = useMemo<RescheduleSelection>(
    () => ({ visitDate, visitDateLabel, slotId, slotLabel }),
    [visitDate, visitDateLabel, slotId, slotLabel],
  );

  const canSave = useMemo(() => {
    if (!booking) return false;
    return Boolean(visitDate && slotId) && hasRescheduleChanged(booking, selection);
  }, [booking, visitDate, slotId, selection]);

  const confirm = async () => {
    if (!booking || !canSave || saving) return;
    setSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const patch = buildReschedulePatch(selection);
    const updated = await rescheduleBookingById(booking.id, patch);

    setSaving(false);
    if (!updated) return;

    if (updated.bookingRef) {
      await publishCustomerBookingStatus({
        bookingRef: updated.bookingRef,
        customerBookingId: updated.id,
        event: 'customer_rescheduled',
        visitDate: updated.visitDate,
        slotLabel: updated.slotLabel,
        time: updated.time,
      });
    }

    setUpdatedBooking(updated);
    setSuccessVisible(true);
  };

  if (loading) {
    return <FormScreenSkeleton />;
  }

  if (!booking) {
    return (
      <View style={[styles.empty, { paddingTop: insets.top }]}>
        <Ionicons name="calendar-outline" size={48} color={colors.muted} />
        <Text style={styles.emptyTitle}>Booking not found</Text>
        <Pressable style={styles.emptyBtn} onPress={() => router.back()}>
          <Text style={styles.emptyBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  if (booking.status !== 'upcoming') {
    return (
      <View style={[styles.empty, { paddingTop: insets.top }]}>
        <Ionicons name="lock-closed-outline" size={48} color={colors.muted} />
        <Text style={styles.emptyTitle}>Cannot reschedule</Text>
        <Text style={styles.emptySub}>Sirf upcoming visits ko reschedule kiya ja sakta hai</Text>
        <Pressable style={styles.emptyBtn} onPress={() => router.back()}>
          <Text style={styles.emptyBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#084F4A', '#0B6E67', '#12A598']} style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.headerGlow} />
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>Free reschedule</Text>
            <Text style={styles.headerTitle}>Change your slot</Text>
          </View>
          <View style={styles.backBtnSpacer} />
        </View>

        <View style={styles.currentCard}>
          <Text style={styles.currentEyebrow}>Current slot</Text>
          <Text style={styles.currentService}>{booking.service}</Text>
          <View style={styles.currentMeta}>
            <View style={styles.currentChip}>
              <Ionicons name="calendar-outline" size={12} color="rgba(255,255,255,0.85)" />
              <Text style={styles.currentChipText}>{booking.date}</Text>
            </View>
            <View style={styles.currentChip}>
              <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.85)" />
              <Text style={styles.currentChipText}>{booking.slotLabel ?? booking.time}</Text>
            </View>
          </View>
          <Text style={styles.currentPro}>{booking.maid} · same pro assigned</Text>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}
      >
        <BookingChangeBridgeCard
          booking={booking}
          variant="reschedule"
          previewDate={canSave ? visitDateLabel : undefined}
          previewSlot={canSave ? slotLabel : undefined}
        />

        <Text style={styles.sectionTitle}>Pick new date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
          {DATES.map((d) => {
            const on = visitDate === d.iso;
            return (
              <Pressable
                key={d.iso}
                style={[styles.dateChip, on && styles.dateChipOn]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setVisitDate(d.iso);
                  setVisitDateLabel(d.label);
                }}
              >
                <Text style={[styles.dateDay, on && styles.dateDayOn]}>{d.day}</Text>
                <Text style={[styles.dateNum, on && styles.dateNumOn]}>{d.label.split(', ')[1]?.split(' ')[0]}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionTitle}>Preferred time slot</Text>
        <View style={styles.slots}>
          {PREFERRED_SLOTS.map((s) => {
            const on = slotId === s.value;
            return (
              <Pressable
                key={s.value}
                style={[styles.slot, on && styles.slotOn]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSlotId(s.value);
                  setSlotLabel(s.label);
                }}
              >
                <Ionicons name="time-outline" size={18} color={on ? colors.primaryDark : colors.muted} />
                <Text style={[styles.slotText, on && styles.slotTextOn]}>{s.label}</Text>
                {on ? <Ionicons name="checkmark-circle" size={20} color={colors.primary} /> : null}
              </Pressable>
            );
          })}
        </View>

        {visitDateLabel && slotLabel ? (
          <View style={styles.preview}>
            <View style={styles.previewIcon}>
              <Ionicons name="swap-horizontal" size={18} color={colors.primaryDark} />
            </View>
            <View style={styles.previewCopy}>
              <Text style={styles.previewTitle}>New visit</Text>
              <Text style={styles.previewSub}>
                {visitDateLabel} · {slotLabel}
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.note}>
          <Ionicons name="information-circle-outline" size={18} color={colors.primaryDark} />
          <Text style={styles.noteText}>
            Free reschedule up to 2 hours before your slot. Final timing confirm 1 hr pehle hoti hai.
          </Text>
        </View>

        <View style={styles.policy}>
          {[
            { icon: 'flash-outline' as const, text: 'Same verified pro — auto-assigned' },
            { icon: 'shield-checkmark-outline' as const, text: 'No extra payment for slot change' },
            { icon: 'notifications-outline' as const, text: 'Pro ko naya slot SMS se milega' },
          ].map((p) => (
            <View key={p.text} style={styles.policyRow}>
              <Ionicons name={p.icon} size={16} color={colors.primary} />
              <Text style={styles.policyText}>{p.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <View style={styles.footerCopy}>
          <Text style={styles.footerLabel}>No extra charge</Text>
          <Text style={styles.footerSub}>
            {canSave ? `${visitDateLabel} · ${slotLabel}` : 'Select a different date or slot'}
          </Text>
        </View>
        <Pressable
          style={[styles.footerBtn, (!canSave || saving) && styles.footerBtnOff]}
          onPress={() => void confirm()}
          disabled={!canSave || saving}
          accessibilityRole="button"
        >
          <LinearGradient colors={['#0B6E67', '#084F4A']} style={StyleSheet.absoluteFill} />
          {saving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Text style={styles.footerBtnText}>Confirm slot</Text>
              <Ionicons name="checkmark" size={18} color={colors.white} />
            </>
          )}
        </Pressable>
      </View>

      <BookingRescheduleSuccessModal
        visible={successVisible}
        booking={updatedBooking}
        onClose={() => {
          setSuccessVisible(false);
          router.back();
        }}
        onViewBooking={() => {
          setSuccessVisible(false);
          router.replace({ pathname: '/booking/[id]', params: { id: booking.id } });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F6F8' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: layout.pad,
    backgroundColor: '#F4F6F8',
  },
  emptyTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink },
  emptySub: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted, textAlign: 'center' },
  emptyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  emptyBtnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  header: {
    paddingHorizontal: layout.pad,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
    overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute',
    right: -30,
    top: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(110,231,183,0.18)',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  backBtnSpacer: { width: 42 },
  headerCopy: { flex: 1, alignItems: 'center', gap: 2 },
  headerEyebrow: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  headerTitle: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.white, letterSpacing: -0.3 },
  currentCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  currentEyebrow: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  currentService: { fontFamily: fonts.extraBold, fontSize: 17, color: colors.white },
  currentMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  currentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  currentChipText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.white },
  currentPro: { fontFamily: fonts.medium, fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  scroll: { padding: layout.pad, gap: spacing.lg },
  sectionTitle: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.ink },
  dateRow: { gap: spacing.sm, paddingVertical: spacing.xs },
  dateChip: {
    width: 64,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: 'rgba(15,20,25,0.08)',
    gap: 2,
  },
  dateChipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  dateDay: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
  dateDayOn: { color: 'rgba(255,255,255,0.8)' },
  dateNum: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.ink },
  dateNumOn: { color: colors.white },
  slots: { gap: spacing.sm },
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  slotOn: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  slotText: { flex: 1, fontFamily: fonts.semiBold, fontSize: 14, color: colors.muted },
  slotTextOn: { color: colors.primaryDark, fontFamily: fonts.bold },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCopy: { flex: 1, gap: 2 },
  previewTitle: { fontFamily: fonts.bold, fontSize: 12, color: colors.muted },
  previewSub: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.primaryDark },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryLight,
  },
  noteText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.primaryDark,
    lineHeight: 18,
  },
  policy: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  policyRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  policyText: { flex: 1, fontFamily: fonts.medium, fontSize: 12, color: colors.muted, lineHeight: 17 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  footerCopy: { flex: 1, gap: 2 },
  footerLabel: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  footerSub: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
    borderRadius: radius.pill,
    overflow: 'hidden',
    minWidth: 148,
  },
  footerBtnOff: { opacity: 0.45 },
  footerBtnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
});
