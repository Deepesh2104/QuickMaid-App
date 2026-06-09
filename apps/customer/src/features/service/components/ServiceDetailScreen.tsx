import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { type ReactNode, useMemo, useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';

import { useLayoutMetrics } from '@/hooks/useLayoutMetrics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStartBooking } from '@/features/checkout/hooks/useStartBooking';
import { useSavedServices } from '@/features/saved-services/hooks/useSavedServices';
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

const VISUAL_H = 220;

function SectionBlock({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      {eyebrow ? (
        <View style={styles.eyebrowRow}>
          <View style={styles.eyebrowDot} />
          <Text style={styles.eyebrow}>{eyebrow}</Text>
        </View>
      ) : null}
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function ServiceDetailScreen() {
  const { railCardW58 } = useLayoutMetrics();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bookService } = useStartBooking();
  const { isSaved, toggle } = useSavedServices();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const service = useMemo(() => (id ? getServiceById(id) : undefined), [id]);
  const similar = useMemo(() => (service ? getSimilarServices(service) : []), [service]);
  const priceNum = service ? parseServicePrice(service.price) : 0;
  const plusPrice = plusMemberPrice(priceNum);
  const plusSave = priceNum - plusPrice;
  const faqs = service ? getServiceFaqs(service) : [];
  const highlights = service ? getServiceHighlights(service) : [];
  const perks = service?.perks ?? ['Full service', 'Quality check', 'Post-visit support'];

  if (!service) {
    return (
      <View style={[styles.empty, { paddingTop: insets.top }]}>
        <View style={styles.emptyIcon}>
          <Ionicons name="search-outline" size={32} color={colors.muted} />
        </View>
        <Text style={styles.emptyTitle}>Service not found</Text>
        <Text style={styles.emptySub}>This listing may have moved or been removed.</Text>
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

  const openSimilar = (serviceId: string) => {
    Haptics.selectionAsync();
    router.push(`/service/${serviceId}` as Href);
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#010F0E', '#084F4A', '#0B6E67', '#12A598']}
        locations={[0, 0.3, 0.65, 1]}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerRow}>
          <Pressable style={styles.headerBtn} onPress={() => router.back()} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>SERVICE DETAIL</Text>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {service.name}
            </Text>
          </View>
          <Pressable
            style={styles.headerBtn}
            onPress={() => {
              Haptics.selectionAsync();
              void toggle(service.id);
            }}
            accessibilityLabel={isSaved(service.id) ? 'Remove from saved' : 'Save service'}
          >
            <Ionicons
              name={isSaved(service.id) ? 'heart' : 'heart-outline'}
              size={20}
              color={isSaved(service.id) ? '#FBBF24' : colors.white}
            />
          </Pressable>
          <Pressable style={styles.headerBtn} onPress={share} accessibilityLabel="Share service">
            <Ionicons name="share-outline" size={20} color={colors.white} />
          </Pressable>
        </View>

        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Ionicons name="star" size={13} color={colors.star} />
            <Text style={styles.headerStatVal}>{service.rating}</Text>
            <Text style={styles.headerStatLbl}>Rating</Text>
          </View>
          <View style={styles.headerDivider} />
          <View style={styles.headerStat}>
            <Ionicons name="people-outline" size={13} color="rgba(255,255,255,0.85)" />
            <Text style={styles.headerStatVal}>{service.reviews}</Text>
            <Text style={styles.headerStatLbl}>Booked</Text>
          </View>
          <View style={styles.headerDivider} />
          <View style={styles.headerStat}>
            <Ionicons name="time-outline" size={13} color="rgba(255,255,255,0.85)" />
            <Text style={styles.headerStatVal}>{service.duration ?? '—'}</Text>
            <Text style={styles.headerStatLbl}>Duration</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 128 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.visualCard}>
            <HomePhoto
              uri={getServiceImages(service.id)}
              style={styles.visualImg}
              overlay="none"
              tint={service.tint}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.78)']}
              locations={[0.35, 0.65, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.visualTop}>
              {service.badge ? (
                <View style={styles.visualBadge}>
                  <Ionicons name="sparkles" size={11} color="#B45309" />
                  <Text style={styles.visualBadgeText}>{service.badge}</Text>
                </View>
              ) : null}
              <View style={styles.categoryPill}>
                <Ionicons name={service.icon} size={12} color={colors.primaryDark} />
                <Text style={styles.categoryPillText}>{getCategoryLabel(service.category)}</Text>
              </View>
            </View>
            <View style={styles.visualBottom}>
              <Text style={styles.visualName}>{service.name}</Text>
              <Text style={styles.visualLoc}>
                {service.location ?? 'Raipur'} · Verified QuickMaid pro
              </Text>
            </View>
          </View>

          <View style={styles.pricePanel}>
            <LinearGradient colors={['#F0FDF9', '#FFFFFF', '#FFFFFF']} style={StyleSheet.absoluteFill} />
            <View style={styles.priceMain}>
              <Text style={styles.priceEyebrow}>All-inclusive pricing</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceVal}>{service.price}</Text>
                <View style={styles.priceTag}>
                  <Text style={styles.priceTagText}>No hidden fees</Text>
                </View>
              </View>
              <View style={styles.plusStrip}>
                <LinearGradient colors={['#FFFBEB', '#FFF7ED']} style={StyleSheet.absoluteFill} />
                <Ionicons name="diamond" size={14} color="#B45309" />
                <Text style={styles.plusStripText}>
                  Plus ₹{plusPrice}
                  {plusSave > 0 ? ` · save ₹${plusSave}` : ''}
                </Text>
              </View>
            </View>
            <View style={styles.guaranteeBox}>
              <View style={styles.guaranteeIcon}>
                <Ionicons name="shield-checkmark" size={18} color="#059669" />
              </View>
              <Text style={styles.guaranteeTitle}>100%</Text>
              <Text style={styles.guaranteeSub}>Satisfaction</Text>
            </View>
          </View>

          <Text style={styles.desc}>
            {service.desc ?? 'Professional home service by verified QuickMaid pros.'}
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trustRow}
          >
            {[
              { icon: 'checkmark-done' as const, label: 'Verified pros' },
              { icon: 'leaf' as const, label: 'Eco supplies' },
              { icon: 'lock-closed' as const, label: 'Secure pay' },
              { icon: 'refresh' as const, label: 'Free reschedule' },
            ].map((t) => (
              <View key={t.label} style={styles.trustChip}>
                <Ionicons name={t.icon} size={13} color={colors.primaryDark} />
                <Text style={styles.trustText}>{t.label}</Text>
              </View>
            ))}
          </ScrollView>

          <SectionBlock eyebrow="INCLUDED" title="What's in your visit">
            <View style={styles.perksCard}>
              {perks.map((perk, i) => (
                <View key={perk} style={[styles.perkRow, i > 0 && styles.perkBorder]}>
                  <View style={styles.perkNum}>
                    <Text style={styles.perkNumText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.perkText}>{perk}</Text>
                  <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                </View>
              ))}
            </View>
          </SectionBlock>

          <SectionBlock eyebrow="WHY BOOK" title="Service highlights">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.highlightRow}
            >
              {highlights.map((h) => (
                <View key={h.title} style={[styles.highlight, { backgroundColor: h.tone }]}>
                  <View style={[styles.highlightIcon, { backgroundColor: colors.white }]}>
                    <Ionicons name={h.icon} size={16} color={h.ink} />
                  </View>
                  <Text style={[styles.highlightTitle, { color: h.ink }]}>{h.title}</Text>
                  <Text style={styles.highlightSub}>{h.sub}</Text>
                </View>
              ))}
            </ScrollView>
          </SectionBlock>

          <SectionBlock eyebrow="PROCESS" title="How it works">
            <View style={styles.stepsCard}>
              {SERVICE_STEPS.map((step, i) => (
                <View key={step.title} style={styles.step}>
                  <View style={styles.stepRail}>
                    <LinearGradient colors={['#0B6E67', '#084F4A']} style={styles.stepDot}>
                      <Text style={styles.stepDotText}>{i + 1}</Text>
                    </LinearGradient>
                    {i < SERVICE_STEPS.length - 1 ? <View style={styles.stepLine} /> : null}
                  </View>
                  <View style={styles.stepCopy}>
                    <View style={styles.stepTitleRow}>
                      <Ionicons name={step.icon} size={14} color={colors.primaryDark} />
                      <Text style={styles.stepTitle}>{step.title}</Text>
                    </View>
                    <Text style={styles.stepSub}>{step.sub}</Text>
                  </View>
                </View>
              ))}
            </View>
          </SectionBlock>

          <SectionBlock eyebrow="SOCIAL PROOF" title="What customers say">
            <View style={styles.reviewSummary}>
              <View style={styles.reviewScore}>
                <Text style={styles.reviewScoreVal}>{service.rating}</Text>
                <View style={styles.reviewStars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Ionicons key={i} name="star" size={12} color={colors.star} />
                  ))}
                </View>
                <Text style={styles.reviewScoreSub}>{service.reviews} bookings</Text>
              </View>
              <View style={styles.reviewQuote}>
                <Text style={styles.reviewQuoteMark}>"</Text>
                <Text style={styles.reviewQuoteText} numberOfLines={3}>
                  {DEMO_SERVICE_REVIEWS[0]?.text}
                </Text>
              </View>
            </View>
            {DEMO_SERVICE_REVIEWS.map((r) => (
              <View key={r.id} style={styles.review}>
                <View style={styles.reviewHead}>
                  <LinearGradient colors={['#E6F4F2', '#FFFFFF']} style={styles.avatar}>
                    <Text style={styles.avatarText}>{r.name.charAt(0)}</Text>
                  </LinearGradient>
                  <View style={styles.reviewCopy}>
                    <Text style={styles.reviewName}>{r.name}</Text>
                    <Text style={styles.reviewMeta}>
                      {r.area} · {r.when}
                    </Text>
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
          </SectionBlock>

          {similar.length > 0 ? (
            <SectionBlock eyebrow="MORE OPTIONS" title="Similar in this category">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.similarRow}
              >
                {similar.map((s) => (
                  <Pressable
                    key={s.id}
                    style={[styles.similarCard, { width: railCardW58 }]}
                    onPress={() => openSimilar(s.id)}
                    accessibilityRole="button"
                  >
                    <HomePhoto
                      uri={getServiceImages(s.id)}
                      style={styles.similarImg}
                      overlay="bottom"
                      tint={s.tint}
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.75)']}
                      style={styles.similarGrad}
                    />
                    <View style={styles.similarBody}>
                      <Text style={styles.similarName} numberOfLines={2}>
                        {s.name}
                      </Text>
                      <View style={styles.similarMeta}>
                        <Text style={styles.similarPrice}>{s.price}</Text>
                        <View style={styles.similarRating}>
                          <Ionicons name="star" size={10} color={colors.star} />
                          <Text style={styles.similarRatingText}>{s.rating}</Text>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </SectionBlock>
          ) : null}

          <SectionBlock eyebrow="HELP" title="Common questions">
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
                    <View style={[styles.faqChevron, open && styles.faqChevronOpen]}>
                      <Ionicons
                        name={open ? 'chevron-up' : 'chevron-down'}
                        size={16}
                        color={open ? colors.primaryDark : colors.muted}
                      />
                    </View>
                  </View>
                  {open ? <Text style={styles.faqA}>{f.a}</Text> : null}
                </Pressable>
              );
            })}
          </SectionBlock>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <LinearGradient
          colors={['transparent', 'rgba(244,246,248,0.92)', '#F4F6F8']}
          style={styles.footerFade}
          pointerEvents="none"
        />
        <View style={styles.footerCard}>
          <View style={styles.footerPrice}>
            <Text style={styles.footerPriceLabel}>From</Text>
            <Text style={styles.footerPriceVal}>{service.price}</Text>
            <Text style={styles.footerPriceNote}>Pay after service</Text>
          </View>
          <Pressable
            style={styles.bookBtn}
            onPress={book}
            accessibilityRole="button"
            accessibilityLabel={`Book ${service.name}`}
          >
            <LinearGradient
              colors={['#0B6E67', '#084F4A']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
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

  header: {
    paddingBottom: spacing.lg,
    overflow: 'hidden',
  },
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
  headerEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.1,
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.white,
    letterSpacing: -0.4,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: layout.pad,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  headerStat: { flex: 1, alignItems: 'center', gap: 3 },
  headerStatVal: {
    fontFamily: fonts.extraBold,
    fontSize: 14,
    color: colors.white,
  },
  headerStatLbl: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  headerDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  sheet: {
    marginTop: -spacing.md,
    backgroundColor: '#F4F6F8',
    borderTopLeftRadius: radius.xxl + 4,
    borderTopRightRadius: radius.xxl + 4,
    paddingTop: spacing.sm,
    paddingHorizontal: layout.pad,
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

  visualCard: {
    height: VISUAL_H,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    backgroundColor: colors.ink,
  },
  visualImg: { ...StyleSheet.absoluteFill },
  visualTop: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  visualBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.94)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  visualBadgeText: { fontFamily: fonts.bold, fontSize: 10, color: '#B45309' },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  categoryPillText: { fontFamily: fonts.bold, fontSize: 10, color: colors.primaryDark },
  visualBottom: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    gap: 4,
  },
  visualName: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: colors.white,
    letterSpacing: -0.5,
  },
  visualLoc: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.82)',
  },

  pricePanel: {
    flexDirection: 'row',
    borderRadius: radius.xxl,
    padding: spacing.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.14)',
    gap: spacing.md,
  },
  priceMain: { flex: 1, gap: 6 },
  priceEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  priceVal: {
    fontFamily: fonts.extraBold,
    fontSize: 34,
    color: colors.primaryDark,
    letterSpacing: -1.2,
  },
  priceTag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  priceTagText: { fontFamily: fonts.bold, fontSize: 10, color: colors.primaryDark },
  plusStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.lg,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  plusStripText: { fontFamily: fonts.semiBold, fontSize: 11, color: '#B45309' },
  guaranteeBox: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    backgroundColor: '#ECFDF3',
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 72,
  },
  guaranteeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guaranteeTitle: { fontFamily: fonts.extraBold, fontSize: 14, color: '#059669' },
  guaranteeSub: { fontFamily: fonts.bold, fontSize: 9, color: '#059669' },

  desc: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.inkSecondary,
    lineHeight: 23,
  },
  trustRow: { gap: spacing.sm, paddingRight: layout.pad },
  trustChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.07)',
  },
  trustText: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.ink },

  section: { gap: spacing.md },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  eyebrowDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.primary,
  },
  sectionTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.ink,
    letterSpacing: -0.4,
    marginTop: -spacing.xs,
  },

  perksCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  perkBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  perkNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkNumText: { fontFamily: fonts.bold, fontSize: 12, color: colors.primaryDark },
  perkText: { flex: 1, fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink },

  highlightRow: { gap: spacing.sm, paddingRight: spacing.sm },
  highlight: {
    width: 132,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: 6,
  },
  highlightIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightTitle: { fontFamily: fonts.bold, fontSize: 12 },
  highlightSub: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted, lineHeight: 14 },

  stepsCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  step: { flexDirection: 'row', gap: spacing.md },
  stepRail: { alignItems: 'center', width: 32 },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotText: { fontFamily: fonts.bold, fontSize: 13, color: colors.white },
  stepLine: {
    width: 2,
    flex: 1,
    minHeight: 20,
    backgroundColor: colors.divider,
    marginVertical: 4,
  },
  stepCopy: { flex: 1, gap: 4, paddingBottom: spacing.xs },
  stepTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stepTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  stepSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },

  reviewSummary: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  reviewScore: { alignItems: 'center', gap: 4, minWidth: 88 },
  reviewScoreVal: {
    fontFamily: fonts.extraBold,
    fontSize: 32,
    color: colors.primaryDark,
    letterSpacing: -1,
  },
  reviewStars: { flexDirection: 'row', gap: 2 },
  reviewScoreSub: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted },
  reviewQuote: { flex: 1, gap: 4 },
  reviewQuoteMark: {
    fontFamily: fonts.extraBold,
    fontSize: 28,
    color: colors.primaryLight,
    lineHeight: 24,
    marginTop: -4,
  },
  reviewQuoteText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.inkSecondary,
    lineHeight: 19,
    fontStyle: 'italic',
  },
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
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.bold, fontSize: 15, color: colors.primaryDark },
  reviewCopy: { flex: 1, gap: 2 },
  reviewName: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  reviewMeta: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  stars: { flexDirection: 'row', gap: 1 },
  reviewText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.inkSecondary,
    lineHeight: 20,
  },

  similarRow: { gap: spacing.md, paddingRight: spacing.sm },
  similarCard: {
    height: 168,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    backgroundColor: colors.bgSubtle,
  },
  similarImg: { ...StyleSheet.absoluteFill },
  similarGrad: {
    ...StyleSheet.absoluteFill,
    top: '40%',
  },
  similarBody: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    gap: 6,
  },
  similarName: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    lineHeight: 18,
  },
  similarMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  similarPrice: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.white,
  },
  similarRating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  similarRatingText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
  },

  faq: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    marginBottom: spacing.sm,
  },
  faqOpen: {
    borderColor: 'rgba(11,110,103,0.22)',
    backgroundColor: '#F8FDFC',
  },
  faqHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  faqQ: { flex: 1, fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  faqChevron: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.bgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqChevronOpen: { backgroundColor: colors.primaryLight },
  faqA: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 20,
    marginTop: spacing.sm,
  },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.md,
  },
  footerFade: { ...StyleSheet.absoluteFill, top: -48 },
  footerCard: {
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
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 10,
  },
  footerPrice: { gap: 0, minWidth: 72 },
  footerPriceLabel: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted },
  footerPriceVal: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: colors.primaryDark,
    letterSpacing: -0.5,
  },
  footerPriceNote: { fontFamily: fonts.medium, fontSize: 9, color: colors.muted },
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

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: layout.pad,
    backgroundColor: '#F4F6F8',
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink },
  emptySub: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, textAlign: 'center' },
  emptyBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  emptyBtnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
});
