import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';

import { PREFERRED_SLOTS } from '@/constants/customer.zones';
import { useCheckout } from '@/context/CheckoutContext';
import { computeOrderSummary, getVisitDates } from '../lib/checkout.utils';
import { CheckoutShell } from './CheckoutShell';
import { CheckoutStickyFooter } from './CheckoutStickyFooter';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const DATES = getVisitDates(7);

export function CheckoutScheduleScreen() {
  const router = useRouter();
  const { draft, account, updateDraft } = useCheckout();
  const summary = account ? computeOrderSummary(draft, account) : null;

  useEffect(() => {
    if (!draft.visitDate && DATES[0]) {
      updateDraft({ visitDate: DATES[0].iso, visitDateLabel: DATES[0].label });
    }
  }, [draft.visitDate, updateDraft]);

  return (
    <CheckoutShell
      step="schedule"
      title="Schedule visit"
      footer={
        summary ? (
          <CheckoutStickyFooter
            amount={summary.payable}
            label="Continue to payment"
            sub={draft.visitDate && draft.slotLabel ? `${draft.visitDateLabel} · ${draft.slotLabel}` : 'Pick date & slot'}
            disabled={!draft.visitDate || !draft.slotId}
            onPress={() => router.push('/checkout/payment' as Href)}
          />
        ) : null
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Select date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
          {DATES.map((d) => {
            const on = draft.visitDate === d.iso;
            return (
              <Pressable
                key={d.iso}
                style={[styles.dateChip, on && styles.dateChipOn]}
                onPress={() => {
                  Haptics.selectionAsync();
                  updateDraft({ visitDate: d.iso, visitDateLabel: d.label });
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
            const on = draft.slotId === s.value;
            return (
              <Pressable
                key={s.value}
                style={[styles.slot, on && styles.slotOn]}
                onPress={() => {
                  Haptics.selectionAsync();
                  updateDraft({ slotId: s.value, slotLabel: s.label });
                }}
              >
                <Ionicons name="time-outline" size={18} color={on ? colors.primaryDark : colors.muted} />
                <Text style={[styles.slotText, on && styles.slotTextOn]}>{s.label}</Text>
                {on ? <Ionicons name="checkmark-circle" size={20} color={colors.primary} /> : null}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.note}>
          <Ionicons name="information-circle-outline" size={18} color={colors.primaryDark} />
          <Text style={styles.noteText}>
            Final slot confirmed 1 hr before visit. {account?.bookingPrefs.favoriteMaidName ? `We'll try to assign ${account.bookingPrefs.favoriteMaidName}.` : ''}
          </Text>
        </View>
      </ScrollView>
    </CheckoutShell>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: layout.pad, gap: spacing.lg, paddingBottom: 120 },
  sectionTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 15,
    color: colors.ink,
  },
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
  dateChipOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateDay: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.muted,
  },
  dateDayOn: { color: 'rgba(255,255,255,0.8)' },
  dateNum: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.ink,
  },
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
  slotOn: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  slotText: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.muted,
  },
  slotTextOn: {
    color: colors.primaryDark,
    fontFamily: fonts.bold,
  },
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
});
