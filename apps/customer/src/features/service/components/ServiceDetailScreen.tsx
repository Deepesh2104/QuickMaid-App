import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStartBooking } from '@/features/checkout/hooks/useStartBooking';
import { HomePhoto } from '@/features/home/components/HomePhoto';
import { getServiceImages } from '@/features/home/constants/unsplash.images';
import {
  DEMO_SERVICE_REVIEWS,
  getServiceFaqs,
  getServiceHighlights,
  SERVICE_STEPS,
} from '../constants/service.detail';
import {
  getCategoryLabel,
  getServiceById,
  getSimilarServices,
  parseServicePrice,
  plusMemberPrice,
} from '../lib/service.utils';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const HERO_H = 368;
const SHEET_OVERLAP = spacing.lg;

export function ServiceDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bookService } = useStartBooking();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const service = useMemo(() => (id ? getServiceById(id) : undefined), [id]);
  const similar = useMemo(() => (service ? getSimilarServices(service) : []), [service]);
  const priceNum = service ? parseServicePrice(service.price) : 0;
  const plusPrice = plusMemberPrice(priceNum);
  const faqs = service ? getServiceFaqs(service) : [];
  const highlights = service ? getServiceHighlights(service) : [];

  if (!service) {
    return (
      <View style={[styles.empty, { paddingTop: insets.top }]}>
        <Ionicons name="search-outline" size={48} color={colors.muted} />
        <Text style={styles.emptyTitle}>Service not found</Text>
        <Pressable style={styles.emptyBtn} onPress={() => router.back()}>
          <Text style={styles.emptyBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const share = async () => {
    try {
      await Share.share({
        message: `Check out ${service.name} on QuickMaid — ${service.price} · ${service.rating}★`,
      });
    } catch {
      // user dismissed
    }
  };

  const book = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    bookService(service);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        <View style={styles.hero}>
          <HomePhoto uri={getServiceImages(service.id)} style={styles.heroImg} overlay="none" tint={service.tint} />
          <LinearGradient
            colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.45)', 'rgba(0,0,0,0.88)']}
            locations={[0, 0.45, 1]}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={['#084F4A88', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { height: 120 }]}
          />

          <View style={[styles.heroTop, { paddingTop: insets.top + spacing.sm }]}>
            <Pressable style={styles.floatBtn} onPress={() => router.back()} accessibilityLabel="Go back">
              <Ionicons name="arrow-back" size={22} color={colors.white} />
            </Pressable>
            <Pressable style={styles.floatBtn} onPress={share} accessibilityLabel="Share service">
              <Ionicons name="share-outline" size={20} color={colors.white} />
            </Pressable>
          </View>

          <View style={styles.heroBottom}>
            {service.badge ? (
              <View style={styles.heroBadge}>
                <Ionicons name="sparkles" size={11} color="#F59E0B" />
                <Text style={styles.heroBadgeText}>{service.badge}</Text>
              </View>
            ) : null}
            <Text style={styles.heroCategory}>{getCategoryLabel(service.category)} · {service.location ?? 'Raipur'}</Text>
            <Text style={styles.heroName}>{service.name}</Text>
            <View style={styles.heroMeta}>
              <View style={styles.heroMetaChip}>
                <Ionicons name="star" size={12} color={colors.star} />
                <Text style={styles.heroMetaText}>{service.rating}</Text>
                <Text style={styles.heroMetaMuted}>({service.reviews})</Text>
              </View>
              <View style={styles.heroMetaChip}>
                <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.9)" />
                <Text style={styles.heroMetaText}>{service.duration}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sheet}>
          <View style={styles.priceCard}>
            <LinearGradient colors={['#F8FDFC', '#FFFFFF']} style={StyleSheet.absoluteFill} />
            <View style={styles.priceLeft}>
              <Text style={styles.priceLabel}>Starts at</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>{service.price}</Text>
                <Text style={styles.priceNote}>all-inclusive</Text>
              </View>
              <View style={styles.plusRow}>
                <Ionicons name="diamond" size={12} color="#F59E0B" />
                <Text style={styles.plusText}>Plus members pay ₹{plusPrice}</Text>
              </View>
            </View>
            <View style={styles.priceRight}>
              <View style={styles.guarantee}>
                <Ionicons name="shield-checkmark" size={16} color="#059669" />
                <Text style={styles.guaranteeText}>100% satisfaction</Text>
              </View>
            </View>
          </View>

          <Text style={styles.desc}>{service.desc ?? 'Professional home service by verified QuickMaid pros.'}</Text>

          <View style={styles.trustRow}>
            {[
              { icon: 'checkmark-done' as const, label: 'Verified pros' },
              { icon: 'leaf' as const, label: 'Eco supplies' },
              { icon: 'lock-closed' as const, label: 'Secure pay' },
            ].map((t) => (
              <View key={t.label} style={styles.trustChip}>
                <Ionicons name={t.icon} size={13} color={colors.primaryDark} />
                <Text style={styles.trustText}>{t.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What&apos;s included</Text>
            <View style={styles.perksCard}>
              {(service.perks ?? ['Full service', 'Quality check', 'Post-visit support']).map((perk, i) => (
                <View key={perk} style={[styles.perkRow, i > 0 && styles.perkBorder]}>
                  <View style={styles.perkIcon}>
                    <Ionicons name="checkmark" size={14} color={colors.primary} />
                  </View>
                  <Text style={styles.perkText}>{perk}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Highlights</Text>
            <View style={styles.highlightRow}>
              {highlights.map((h) => (
                <View key={h.title} style={[styles.highlight, { backgroundColor: h.tone }]}>
                  <Ionicons name={h.icon} size={18} color={h.ink} />
                  <Text style={[styles.highlightTitle, { color: h.ink }]}>{h.title}</Text>
                  <Text style={styles.highlightSub}>{h.sub}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How it works</Text>
            <View style={styles.stepsCard}>
              {SERVICE_STEPS.map((step, i) => (
                <View key={step.title} style={styles.step}>
                  <View style={styles.stepLeft}>
                    <View style={styles.stepIcon}>
                      <Ionicons name={step.icon} size={16} color={colors.primaryDark} />
                    </View>
                    {i < SERVICE_STEPS.length - 1 ? <View style={styles.stepLine} /> : null}
                  </View>
                  <View style={styles.stepCopy}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepSub}>{step.sub}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Customer reviews</Text>
              <View style={styles.ratingPill}>
                <Ionicons name="star" size={12} color={colors.star} />
                <Text style={styles.ratingPillText}>{service.rating}</Text>
              </View>
            </View>
            {DEMO_SERVICE_REVIEWS.map((r) => (
              <View key={r.id} style={styles.review}>
                <View style={styles.reviewHead}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{r.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.reviewCopy}>
                    <Text style={styles.reviewName}>{r.name}</Text>
                    <Text style={styles.reviewMeta}>{r.area} · {r.when}</Text>
                  </View>
                  <View style={styles.stars}>
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Ionicons key={i} name="star" size={10} color={colors.star} />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewText}>{r.text}</Text>
              </View>
            ))}
          </View>

          {similar.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Similar services</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.similarRow}>
                {similar.map((s) => (
                  <Pressable
                    key={s.id}
                    style={styles.similarCard}
                    onPress={() => router.push({ pathname: '/service/[id]', params: { id: s.id } } as never)}
                  >
                    <HomePhoto uri={getServiceImages(s.id)} style={styles.similarImg} overlay="bottom" tint={s.tint} />
                    <Text style={styles.similarName} numberOfLines={1}>{s.name}</Text>
                    <Text style={styles.similarPrice}>{s.price}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>FAQs</Text>
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <Pressable
                  key={f.q}
                  style={[styles.faq, open && styles.faqOpen]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setOpenFaq(open ? null : i);
                  }}
                >
                  <View style={styles.faqHead}>
                    <Text style={styles.faqQ}>{f.q}</Text>
                    <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.muted} />
                  </View>
                  {open ? <Text style={styles.faqA}>{f.a}</Text> : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <LinearGradient colors={['transparent', 'rgba(244,246,248,0.9)', '#F4F6F8']} style={styles.footerFade} pointerEvents="none" />
        <View style={styles.footerInner}>
          <View style={styles.footerPrice}>
            <Text style={styles.footerPriceLabel}>Total from</Text>
            <Text style={styles.footerPriceVal}>{service.price}</Text>
          </View>
          <Pressable style={styles.bookBtn} onPress={book} accessibilityRole="button" accessibilityLabel={`Book ${service.name}`}>
            <LinearGradient colors={['#0B6E67', '#084F4A']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
            <Text style={styles.bookText}>Book now</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.white} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  hero: { height: HERO_H, backgroundColor: colors.ink },
  heroImg: { ...StyleSheet.absoluteFill },
  heroTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: layout.pad,
    zIndex: 2,
  },
  floatBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(15,20,25,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  heroBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: layout.pad,
    paddingTop: layout.pad,
    paddingBottom: layout.pad + SHEET_OVERLAP + spacing.md,
    gap: spacing.sm,
    zIndex: 2,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  heroBadgeText: { fontFamily: fonts.bold, fontSize: 11, color: '#B45309' },
  heroCategory: { fontFamily: fonts.medium, fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  heroName: { fontFamily: fonts.extraBold, fontSize: 28, color: colors.white, letterSpacing: -0.8 },
  heroMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
    alignItems: 'center',
  },
  heroMetaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  heroMetaText: { fontFamily: fonts.bold, fontSize: 13, color: colors.white, lineHeight: 18 },
  heroMetaMuted: { fontFamily: fonts.medium, fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 18 },
  sheet: {
    marginTop: -SHEET_OVERLAP,
    backgroundColor: '#F4F6F8',
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.xl,
    gap: spacing.lg,
    zIndex: 3,
  },
  priceCard: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  priceLeft: { flex: 1, gap: 4 },
  priceLabel: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  price: { fontFamily: fonts.extraBold, fontSize: 32, color: colors.primaryDark, letterSpacing: -1 },
  priceNote: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
  plusRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  plusText: { fontFamily: fonts.semiBold, fontSize: 12, color: '#B45309' },
  priceRight: { justifyContent: 'center' },
  guarantee: { alignItems: 'center', gap: 4, backgroundColor: '#ECFDF3', padding: spacing.md, borderRadius: radius.xl },
  guaranteeText: { fontFamily: fonts.bold, fontSize: 10, color: '#059669', textAlign: 'center' },
  desc: { fontFamily: fonts.regular, fontSize: 15, color: colors.inkSecondary, lineHeight: 22 },
  trustRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  trustChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  trustText: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.ink },
  section: { gap: spacing.md },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.ink, letterSpacing: -0.3 },
  perksCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  perkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  perkBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.divider },
  perkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkText: { flex: 1, fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink },
  highlightRow: { flexDirection: 'row', gap: spacing.sm },
  highlight: { flex: 1, borderRadius: radius.xl, padding: spacing.md, gap: 4, alignItems: 'flex-start' },
  highlightTitle: { fontFamily: fonts.bold, fontSize: 12 },
  highlightSub: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted },
  stepsCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  step: { flexDirection: 'row', gap: spacing.md },
  stepLeft: { alignItems: 'center' },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLine: { width: 2, flex: 1, minHeight: 16, backgroundColor: colors.divider, marginVertical: 4 },
  stepCopy: { flex: 1, gap: 2, paddingBottom: spacing.xs },
  stepTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  stepSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  ratingPillText: { fontFamily: fonts.bold, fontSize: 12, color: '#B45309' },
  review: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  reviewHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.bold, fontSize: 14, color: colors.primaryDark },
  reviewCopy: { flex: 1, gap: 2 },
  reviewName: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  reviewMeta: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  stars: { flexDirection: 'row', gap: 1 },
  reviewText: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkSecondary, lineHeight: 19 },
  similarRow: { gap: spacing.md, paddingRight: layout.pad },
  similarCard: {
    width: 140,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  similarImg: { width: '100%', height: 90 },
  similarName: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink, padding: spacing.sm, paddingBottom: 0 },
  similarPrice: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.primaryDark, padding: spacing.sm },
  faq: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  faqOpen: { borderColor: 'rgba(11,110,103,0.25)', backgroundColor: '#F8FDFC' },
  faqHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  faqQ: { flex: 1, fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  faqA: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, lineHeight: 19, marginTop: spacing.sm },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.md,
  },
  footerFade: { ...StyleSheet.absoluteFill, top: -40 },
  footerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    padding: spacing.sm,
    paddingLeft: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.08)',
    shadowColor: '#0F1419',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  footerPrice: { gap: 0 },
  footerPriceLabel: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted },
  footerPriceVal: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.primaryDark },
  bookBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    paddingVertical: 16,
    overflow: 'hidden',
  },
  bookText: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.white },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: layout.pad },
  emptyTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink },
  emptyBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radius.pill },
  emptyBtnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
});
