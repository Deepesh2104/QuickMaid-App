import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

import { FormScreenSkeleton } from '@/components/ui/Skeleton';
import type { DemoBooking } from '@/constants/demo';
import { submitBookingReview } from '@/features/checkout/lib/bookings.storage';
import { getBookingById } from '../lib/booking.lookup';
import {
  REVIEW_TAGS,
  canSubmitReview,
  ratingLabel,
  type ReviewTagId,
} from '../lib/booking.review';
import { BookingRateSuccessModal } from './BookingRateSuccessModal';
import { BookingReviewSubmittedCard } from './BookingReviewSubmittedCard';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function BookingRateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<DemoBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<ReviewTagId[]>([]);
  const [text, setText] = useState('');
  const [successVisible, setSuccessVisible] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<DemoBooking | null>(null);

  const loadBooking = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const b = await getBookingById(id);
    setBooking(b ?? null);
    if (b?.reviewRating) setRating(b.reviewRating);
    if (b?.reviewTags) setTags(b.reviewTags as ReviewTagId[]);
    if (b?.reviewText) setText(b.reviewText);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void loadBooking();
  }, [loadBooking]);

  const alreadyReviewed = Boolean(booking?.reviewedAt);
  const canSubmit = canSubmitReview(rating) && !alreadyReviewed;

  const toggleTag = (tagId: ReviewTagId) => {
    Haptics.selectionAsync();
    setTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId],
    );
  };

  const submit = async () => {
    if (!booking || !canSubmit || saving) return;
    setSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const updated = await submitBookingReview(booking.id, {
      rating,
      text,
      tags,
    });

    setSaving(false);
    if (!updated) return;

    setSubmittedBooking(updated);
    setBooking(updated);
    setSuccessVisible(true);
  };

  if (loading) {
    return <FormScreenSkeleton />;
  }

  if (!booking) {
    return (
      <View style={[styles.empty, { paddingTop: insets.top }]}>
        <Ionicons name="star-outline" size={48} color={colors.muted} />
        <Text style={styles.emptyTitle}>Booking not found</Text>
        <Pressable style={styles.emptyBtn} onPress={() => router.back()}>
          <Text style={styles.emptyBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  if (booking.status !== 'completed') {
    return (
      <View style={[styles.empty, { paddingTop: insets.top }]}>
        <Ionicons name="lock-closed-outline" size={48} color={colors.muted} />
        <Text style={styles.emptyTitle}>Not ready to rate</Text>
        <Text style={styles.emptySub}>Sirf completed visits ko rate kiya ja sakta hai</Text>
        <Pressable style={styles.emptyBtn} onPress={() => router.back()}>
          <Text style={styles.emptyBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#084F4A', '#0B6E67', '#12A598']}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerGlow} />
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>Rate & review</Text>
            <Text style={styles.headerTitle}>How was your visit?</Text>
          </View>
          <View style={styles.backBtnSpacer} />
        </View>

        <View style={styles.proCard}>
          <View style={styles.proAvatar}>
            <Text style={styles.proInitial}>{booking.maid.charAt(0)}</Text>
          </View>
          <View style={styles.proCopy}>
            <Text style={styles.proName}>{booking.maid}</Text>
            <Text style={styles.proMeta}>
              {booking.service}
              {booking.maidRating ? ` · ${booking.maidRating}★ pro` : ''}
            </Text>
            <Text style={styles.proVisit}>{booking.date} · {booking.time}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}
      >
        {alreadyReviewed ? (
          <>
            <BookingReviewSubmittedCard booking={booking} />
            <View style={styles.thanks}>
              <Ionicons name="heart" size={18} color={colors.primary} />
              <Text style={styles.thanksText}>Review submit ho chuki hai — thank you!</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.ratingBlock}>
              <Text style={styles.sectionTitle}>Overall rating</Text>
              <View style={styles.stars}>
                {Array.from({ length: 5 }, (_, i) => {
                  const value = i + 1;
                  const on = value <= rating;
                  return (
                    <Pressable
                      key={value}
                      style={styles.starBtn}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setRating(value);
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`${value} stars`}
                    >
                      <Ionicons name={on ? 'star' : 'star-outline'} size={40} color={colors.star} />
                    </Pressable>
                  );
                })}
              </View>
              <Text style={styles.ratingLabel}>
                {rating > 0 ? ratingLabel(rating) : 'Tap a star to rate'}
              </Text>
            </View>

            <Text style={styles.sectionTitle}>What went well?</Text>
            <View style={styles.tags}>
              {REVIEW_TAGS.map((tag) => {
                const on = tags.includes(tag.id);
                return (
                  <Pressable
                    key={tag.id}
                    style={[styles.tag, on && styles.tagOn]}
                    onPress={() => toggleTag(tag.id)}
                  >
                    <Ionicons name={tag.icon} size={14} color={on ? colors.primaryDark : colors.muted} />
                    <Text style={[styles.tagText, on && styles.tagTextOn]}>{tag.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.sectionTitle}>Share more (optional)</Text>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Kya accha laga? Koi suggestion?"
              placeholderTextColor={colors.placeholder}
              multiline
              maxLength={280}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{text.length}/280</Text>

            <View style={styles.note}>
              <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
              <Text style={styles.noteText}>
                Honest reviews se Raipur mein better service milti hai. Aapka naam public nahi dikhega.
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {!alreadyReviewed ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
          <View style={styles.footerCopy}>
            <Text style={styles.footerLabel}>Submit review</Text>
            <Text style={styles.footerSub}>
              {canSubmit ? ratingLabel(rating) : 'Select at least 1 star'}
            </Text>
          </View>
          <Pressable
            style={[styles.footerBtn, (!canSubmit || saving) && styles.footerBtnOff]}
            onPress={() => void submit()}
            disabled={!canSubmit || saving}
            accessibilityRole="button"
          >
            <LinearGradient colors={['#0B6E67', '#084F4A']} style={StyleSheet.absoluteFill} />
            {saving ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <Ionicons name="star" size={16} color={colors.white} />
                <Text style={styles.footerBtnText}>Submit</Text>
              </>
            )}
          </Pressable>
        </View>
      ) : null}

      <BookingRateSuccessModal
        visible={successVisible}
        booking={submittedBooking}
        rating={rating}
        onClose={() => {
          setSuccessVisible(false);
          router.replace({ pathname: '/booking/[id]', params: { id: booking.id } });
        }}
        onDone={() => {
          setSuccessVisible(false);
          router.replace('/(tabs)/bookings');
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
    backgroundColor: 'rgba(255,255,255,0.12)',
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
  proCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  proAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proInitial: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.primaryDark },
  proCopy: { flex: 1, gap: 2 },
  proName: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.white },
  proMeta: { fontFamily: fonts.medium, fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  proVisit: { fontFamily: fonts.regular, fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  scroll: { padding: layout.pad, gap: spacing.lg },
  sectionTitle: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.ink },
  ratingBlock: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  stars: { flexDirection: 'row', gap: spacing.sm },
  starBtn: { padding: spacing.xs },
  ratingLabel: { fontFamily: fonts.bold, fontSize: 14, color: colors.primaryDark },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  tagOn: { borderColor: 'rgba(11,110,103,0.35)', backgroundColor: colors.primaryLight },
  tagText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.muted },
  tagTextOn: { color: colors.primaryDark, fontFamily: fonts.bold },
  input: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    minHeight: 120,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.ink,
    borderWidth: 1.5,
    borderColor: 'rgba(15,20,25,0.08)',
    lineHeight: 20,
  },
  charCount: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.muted,
    textAlign: 'right',
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
    color: colors.inkSecondary,
    lineHeight: 18,
  },
  thanks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  thanksText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.primaryDark },
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
    minWidth: 128,
  },
  footerBtnOff: { opacity: 0.45 },
  footerBtnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
});
