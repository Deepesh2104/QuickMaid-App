import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingDetailSkeleton } from '@/components/ui/Skeleton';
import type { DemoBooking } from '@/constants/demo';
import { getBookingById } from '../lib/booking.lookup';
import {
  buildBookingDocument,
  canViewDocument,
  documentToShareText,
  type BookingDocument,
  type DocumentType,
} from '../lib/booking.document';
import { downloadBookingDocumentPdf } from '../lib/booking.documentPdf';
import { useOpenBookingDocument } from '../hooks/useOpenBookingDocument';
import { BookingDocumentPaper } from './BookingDocumentPaper';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface BookingDocumentScreenProps {
  type: DocumentType;
}

export function BookingDocumentScreen({ type }: BookingDocumentScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const openDocument = useOpenBookingDocument();
  const [booking, setBooking] = useState<DemoBooking | null>(null);
  const [document, setDocument] = useState<BookingDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const b = await getBookingById(id);
    setBooking(b ?? null);
    if (b && canViewDocument(b, type)) {
      setDocument(await buildBookingDocument(b, type));
    } else {
      setDocument(null);
    }
    setLoading(false);
  }, [id, type]);

  useEffect(() => {
    void load();
  }, [load]);

  const shareDoc = async () => {
    if (!document) return;
    try {
      await Share.share({
        message: documentToShareText(document),
        title: document.type === 'invoice' ? 'QuickMaid Invoice' : 'QuickMaid Receipt',
      });
    } catch {
      // dismissed
    }
  };

  const downloadPdf = async () => {
    if (!document || downloading) return;
    setDownloading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await downloadBookingDocumentPdf(document);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not generate PDF. Please try again.';
      Alert.alert('Download failed', message, [
        { text: 'Share text instead', onPress: () => void shareDoc() },
        { text: 'OK' },
      ]);
    } finally {
      setDownloading(false);
    }
  };

  const title = type === 'invoice' ? 'Invoice' : 'Payment receipt';
  const otherType = type === 'invoice' ? 'receipt' : 'invoice';
  const otherLabel = type === 'invoice' ? 'View receipt' : 'View invoice';

  if (loading) {
    return <BookingDetailSkeleton />;
  }

  if (!booking || !document) {
    return (
      <View style={[styles.empty, { paddingTop: insets.top }]}>
        <Ionicons name="document-outline" size={48} color={colors.muted} />
        <Text style={styles.emptyTitle}>Document unavailable</Text>
        <Text style={styles.emptySub}>
          {type === 'invoice' ? 'Invoice' : 'Receipt'} is not ready for this booking yet
        </Text>
        <Pressable style={styles.emptyBtn} onPress={() => router.back()}>
          <Text style={styles.emptyBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={type === 'invoice' ? ['#1E3A8A', '#175CD3', '#3B82F6'] : ['#7A2E0E', '#B54708', '#F79009']}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>PDF viewer</Text>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
          <Pressable style={styles.backBtn} onPress={() => void shareDoc()} accessibilityRole="button">
            <Ionicons name="share-outline" size={20} color={colors.white} />
          </Pressable>
        </View>
        <Text style={styles.headerSub}>{document.docNumber} · {document.bookingRef}</Text>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
      >
        <View style={styles.viewerHint}>
          <Ionicons name="document-text-outline" size={16} color={colors.primaryDark} />
          <Text style={styles.viewerHintText}>Pinch-style PDF preview · GST compliant format</Text>
        </View>

        <BookingDocumentPaper document={document} />

        {canViewDocument(booking, otherType) ? (
          <Pressable
            style={styles.switchBtn}
            onPress={() => openDocument(booking.id, otherType)}
            accessibilityRole="button"
          >
            <Ionicons
              name={otherType === 'invoice' ? 'document-text-outline' : 'receipt-outline'}
              size={16}
              color={colors.primaryDark}
            />
            <Text style={styles.switchText}>{otherLabel}</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.primary} />
          </Pressable>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <Pressable style={styles.footerBtn} onPress={() => void shareDoc()} accessibilityRole="button">
          <Ionicons name="share-social-outline" size={18} color={colors.primaryDark} />
          <Text style={styles.footerBtnText}>Share</Text>
        </Pressable>
        <Pressable
          style={[styles.footerPrimary, downloading && styles.footerPrimaryOff]}
          onPress={() => void downloadPdf()}
          disabled={downloading}
          accessibilityRole="button"
        >
          <LinearGradient colors={['#0B6E67', '#084F4A']} style={StyleSheet.absoluteFill} />
          {downloading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <Ionicons name="download-outline" size={18} color={colors.white} />
          )}
          <Text style={styles.footerPrimaryText}>{downloading ? 'Generating…' : 'Download PDF'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#E8ECF0' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8ECF0' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: layout.pad,
    backgroundColor: '#E8ECF0',
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
    paddingBottom: spacing.lg,
    gap: spacing.sm,
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
  headerCopy: { flex: 1, alignItems: 'center', gap: 2 },
  headerEyebrow: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  headerTitle: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.white, letterSpacing: -0.3 },
  headerSub: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  scroll: { padding: layout.pad, gap: spacing.md },
  viewerHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  viewerHintText: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  switchText: { fontFamily: fonts.bold, fontSize: 13, color: colors.primaryDark },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  footerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
  },
  footerBtnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.primaryDark },
  footerPrimary: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 14,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  footerPrimaryText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  footerPrimaryOff: { opacity: 0.75 },
});
