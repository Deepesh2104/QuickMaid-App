import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { DemoBooking } from '@/constants/demo';
import { getBookingById } from '@/features/bookings/lib/booking.lookup';
import { getDisputeByBookingId, submitBookingDispute } from '../lib/support.storage';
import { DISPUTE_REASONS } from '../lib/support.utils';
import type { DisputeReasonId } from '../types/support.types';
import { BookingDisputeSuccessModal } from './BookingDisputeSuccessModal';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function BookingDisputeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<DemoBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reasonId, setReasonId] = useState<DisputeReasonId | null>(null);
  const [description, setDescription] = useState('');
  const [refundRequested, setRefundRequested] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [alreadyFiled, setAlreadyFiled] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const b = await getBookingById(id);
    setBooking(b ?? null);
    if (b) {
      const existing = await getDisputeByBookingId(b.id);
      setAlreadyFiled(Boolean(existing));
      if (existing) setTicketId(existing.ticketId);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const reasonLabel = DISPUTE_REASONS.find((r) => r.id === reasonId)?.label ?? '';
  const canSubmit = Boolean(reasonId && description.trim().length >= 12 && !alreadyFiled);

  const submit = async () => {
    if (!booking || !reasonId || !canSubmit || saving) return;
    setSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const result = await submitBookingDispute({
      bookingId: booking.id,
      bookingRef: booking.bookingRef,
      service: booking.service,
      reasonId,
      reasonLabel,
      description: description.trim(),
      refundRequested,
    });
    setSaving(false);
    setTicketId(result.ticket.id);
    setSuccessVisible(true);
  };

  if (loading) {
    return (
      <View style={[styles.loader, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
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

  if (booking.status === 'upcoming') {
    return (
      <View style={[styles.empty, { paddingTop: insets.top }]}>
        <Ionicons name="time-outline" size={48} color={colors.muted} />
        <Text style={styles.emptyTitle}>Visit not completed yet</Text>
        <Text style={styles.emptySub}>Disputes open after your visit. Use chat for upcoming changes.</Text>
        <Pressable style={styles.emptyBtn} onPress={() => router.back()}>
          <Text style={styles.emptyBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#010F0E', '#084F4A', '#0B6E67', '#12A598']}
        locations={[0, 0.28, 0.62, 1]}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerRow}>
          <Pressable style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>BOOKING DISPUTE</Text>
            <Text style={styles.headerTitle} numberOfLines={1}>
              Report an issue
            </Text>
          </View>
        </View>

        <View style={styles.bookingCard}>
          <Text style={styles.bookingRef}>{booking.bookingRef ?? booking.id}</Text>
          <Text style={styles.bookingService}>{booking.service}</Text>
          <Text style={styles.bookingMeta}>
            {booking.date} · {booking.maid} · {booking.price}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          {alreadyFiled ? (
            <View style={styles.filedCard}>
              <Ionicons name="information-circle" size={22} color={colors.primary} />
              <View style={styles.filedCopy}>
                <Text style={styles.filedTitle}>Dispute already filed</Text>
                <Text style={styles.filedSub}>Case {ticketId} is being reviewed. Continue in support chat.</Text>
              </View>
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>What went wrong?</Text>
          <View style={styles.reasonGrid}>
            {DISPUTE_REASONS.map((r) => {
              const on = reasonId === r.id;
              return (
                <Pressable
                  key={r.id}
                  style={[styles.reasonCard, on && styles.reasonCardOn]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setReasonId(r.id);
                  }}
                  disabled={alreadyFiled}
                >
                  {on ? (
                    <LinearGradient colors={['#084F4A', '#0B6E67']} style={StyleSheet.absoluteFill} />
                  ) : null}
                  <Ionicons name={r.icon} size={18} color={on ? colors.white : colors.primaryDark} />
                  <Text style={[styles.reasonLabel, on && styles.reasonLabelOn]}>{r.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>Describe the issue</Text>
          <View style={styles.inputCard}>
            <TextInput
              style={styles.textArea}
              placeholder="Share what happened — areas missed, damage, timing, etc. (min 12 characters)"
              placeholderTextColor={colors.mutedLight}
              value={description}
              onChangeText={setDescription}
              multiline
              maxLength={600}
              editable={!alreadyFiled}
            />
            <Text style={styles.charCount}>{description.length}/600</Text>
          </View>

          <Pressable
            style={styles.refundRow}
            onPress={() => !alreadyFiled && setRefundRequested((v) => !v)}
            disabled={alreadyFiled}
          >
            <View style={[styles.check, refundRequested && styles.checkOn]}>
              {refundRequested ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}
            </View>
            <View style={styles.refundCopy}>
              <Text style={styles.refundTitle}>Request refund review</Text>
              <Text style={styles.refundSub}>Team will assess eligibility within 24–48 hours</Text>
            </View>
          </Pressable>

          <View style={styles.trustCard}>
            <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
            <Text style={styles.trustText}>
              Disputes are reviewed fairly. False claims may affect account standing. Photos can be shared in chat after filing.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        {alreadyFiled ? (
          <Pressable
            style={styles.footerPrimary}
            onPress={() =>
              router.push({
                pathname: '/support/chat',
                params: { ticketId },
              } as Href)
            }
          >
            <LinearGradient colors={['#084F4A', '#0B6E67', '#12A598']} style={styles.footerGrad}>
              <Ionicons name="chatbubbles" size={18} color={colors.white} />
              <Text style={styles.footerPrimaryText}>Continue in chat</Text>
            </LinearGradient>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.footerPrimary, !canSubmit && styles.footerDisabled]}
            onPress={() => void submit()}
            disabled={!canSubmit || saving}
          >
            <LinearGradient colors={['#084F4A', '#0B6E67', '#12A598']} style={styles.footerGrad}>
              {saving ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Ionicons name="document-text" size={18} color={colors.white} />
                  <Text style={styles.footerPrimaryText}>Submit dispute</Text>
                </>
              )}
            </LinearGradient>
          </Pressable>
        )}
      </View>

      <BookingDisputeSuccessModal
        visible={successVisible}
        ticketId={ticketId}
        onOpenChat={() => {
          setSuccessVisible(false);
          router.replace({
            pathname: '/support/chat',
            params: { ticketId },
          } as Href);
        }}
        onClose={() => {
          setSuccessVisible(false);
          router.replace(`/booking/${booking.id}` as Href);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F6F8' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: layout.pad },
  emptyTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink },
  emptySub: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, textAlign: 'center' },
  emptyBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radius.pill },
  emptyBtnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },

  header: { paddingBottom: spacing.lg },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.pad,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: { flex: 1, gap: 2 },
  headerEyebrow: { fontFamily: fonts.bold, fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: 1.1 },
  headerTitle: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.white, letterSpacing: -0.4 },

  bookingCard: {
    marginHorizontal: layout.pad,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.2)',
  },
  bookingRef: { fontFamily: fonts.bold, fontSize: 11, color: '#6EE7B7', letterSpacing: 0.5 },
  bookingService: { fontFamily: fonts.extraBold, fontSize: 17, color: colors.white },
  bookingMeta: { fontFamily: fonts.medium, fontSize: 12, color: 'rgba(255,255,255,0.65)' },

  sheet: {
    marginTop: -spacing.md,
    backgroundColor: '#F4F6F8',
    borderTopLeftRadius: radius.xxl + 4,
    borderTopRightRadius: radius.xxl + 4,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.divider,
    marginBottom: spacing.xs,
  },

  filedCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.15)',
  },
  filedCopy: { flex: 1, gap: 4 },
  filedTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.primaryDark },
  filedSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, lineHeight: 17 },

  sectionTitle: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.ink, letterSpacing: -0.2 },
  reasonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  reasonCard: {
    width: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.08)',
    minHeight: 56,
  },
  reasonCardOn: { borderWidth: 0 },
  reasonLabel: { flex: 1, fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink },
  reasonLabelOn: { color: colors.white },

  inputCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    gap: spacing.xs,
  },
  textArea: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.ink,
    minHeight: 120,
    textAlignVertical: 'top',
    lineHeight: 21,
  },
  charCount: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted, textAlign: 'right' },

  refundRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  refundCopy: { flex: 1, gap: 2 },
  refundTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  refundSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },

  trustCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  trustText: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.muted, lineHeight: 18 },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.sm,
    backgroundColor: 'rgba(244,246,248,0.96)',
  },
  footerPrimary: { borderRadius: radius.pill, overflow: 'hidden' },
  footerDisabled: { opacity: 0.45 },
  footerGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 16,
  },
  footerPrimaryText: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.white },
});
