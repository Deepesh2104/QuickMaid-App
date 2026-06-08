import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { formatInr } from '@/features/checkout/lib/checkout.utils';
import type { BookingDocument } from '../lib/booking.document';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface BookingDocumentPaperProps {
  document: BookingDocument;
}

export function BookingDocumentPaper({ document: doc }: BookingDocumentPaperProps) {
  const isInvoice = doc.type === 'invoice';
  const issued = new Date(doc.issuedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <View style={styles.paper}>
      <View style={styles.letterhead}>
        <View style={styles.logo}>
          <Ionicons name="sparkles" size={18} color={colors.primaryDark} />
        </View>
        <View style={styles.brand}>
          <Text style={styles.brandName}>QuickMaid</Text>
          <Text style={styles.brandSub}>Home services · Raipur, Chhattisgarh</Text>
        </View>
        <View style={styles.gst}>
          <Text style={styles.gstText}>GSTIN 22AAAAA0000A1Z5</Text>
        </View>
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.docTitle}>{isInvoice ? 'TAX INVOICE' : 'PAYMENT RECEIPT'}</Text>
        <View style={[styles.statusBadge, doc.status === 'paid' ? styles.statusPaid : styles.statusOther]}>
          <Text style={[styles.statusText, doc.status === 'paid' ? styles.statusTextPaid : styles.statusTextOther]}>
            {doc.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.metaGrid}>
        <View style={styles.metaCell}>
          <Text style={styles.metaLabel}>Document no.</Text>
          <Text style={styles.metaValue}>{doc.docNumber}</Text>
        </View>
        <View style={styles.metaCell}>
          <Text style={styles.metaLabel}>Issued</Text>
          <Text style={styles.metaValue}>{issued}</Text>
        </View>
        <View style={styles.metaCell}>
          <Text style={styles.metaLabel}>Booking ref</Text>
          <Text style={styles.metaValue}>{doc.bookingRef}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Billed to</Text>
        <Text style={styles.sectionMain}>{doc.customerName}</Text>
        <Text style={styles.sectionSub}>{doc.customerPhone}</Text>
        <Text style={styles.sectionSub}>{doc.customerAddress}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Service details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Service</Text>
          <Text style={styles.detailValue}>{doc.service}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Visit</Text>
          <Text style={styles.detailValue}>{doc.visitDate} · {doc.visitTime}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Pro</Text>
          <Text style={styles.detailValue}>{doc.maid}</Text>
        </View>
        {doc.duration ? (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>{doc.duration}</Text>
          </View>
        ) : null}
      </View>

      {isInvoice ? (
        <View style={styles.table}>
          <View style={styles.tableHead}>
            <Text style={[styles.tableHeadText, styles.colDesc]}>Description</Text>
            <Text style={[styles.tableHeadText, styles.colAmt]}>Amount</Text>
          </View>
          {doc.lineItems.map((line) => (
            <View key={line.label} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colDesc]}>{line.label}</Text>
              <Text style={[styles.tableCell, styles.colAmt, styles.tableAmt]}>
                {formatInr(line.amount)}
              </Text>
            </View>
          ))}
          <View style={styles.tableDivider} />
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.colDesc, styles.tableMuted]}>GST (18%)</Text>
            <Text style={[styles.tableCell, styles.colAmt, styles.tableMuted]}>{formatInr(doc.tax)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatInr(doc.total)}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.receiptBox}>
          <Text style={styles.receiptAmount}>{formatInr(doc.amountPaid)}</Text>
          <Text style={styles.receiptLabel}>Amount received</Text>
          <View style={styles.receiptMeta}>
            <View style={styles.receiptRow}>
              <Ionicons name="card-outline" size={14} color={colors.primaryDark} />
              <Text style={styles.receiptRowText}>{doc.paymentMethod}</Text>
            </View>
            {doc.gatewayPaymentId ? (
              <View style={styles.receiptRow}>
                <Ionicons name="shield-checkmark-outline" size={14} color="#027A48" />
                <Text style={styles.receiptRowText}>Razorpay {doc.gatewayPaymentId}</Text>
              </View>
            ) : null}
            {doc.walletUsed > 0 ? (
              <View style={styles.receiptRow}>
                <Ionicons name="wallet-outline" size={14} color={colors.primaryDark} />
                <Text style={styles.receiptRowText}>Wallet {formatInr(doc.walletUsed)}</Text>
              </View>
            ) : null}
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerNote}>
          This is a computer-generated {isInvoice ? 'invoice' : 'receipt'} · No signature required
        </Text>
        <Text style={styles.footerSupport}>support@quickmaid.in · +91 98765 43210</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  paper: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.08)',
    shadowColor: '#0F1419',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  letterhead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  logo: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: { flex: 1, gap: 2 },
  brandName: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.primaryDark },
  brandSub: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted },
  gst: { alignItems: 'flex-end' },
  gstText: { fontFamily: fonts.semiBold, fontSize: 9, color: colors.muted },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  docTitle: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.ink, letterSpacing: 0.5 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  statusPaid: { backgroundColor: '#ECFDF5' },
  statusOther: { backgroundColor: '#FFFAEB' },
  statusText: { fontFamily: fonts.bold, fontSize: 10 },
  statusTextPaid: { color: '#027A48' },
  statusTextOther: { color: '#B54708' },
  metaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  metaCell: { minWidth: '28%', gap: 2 },
  metaLabel: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted },
  metaValue: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink },
  section: { gap: 4 },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  sectionMain: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  sectionSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, lineHeight: 17 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md, paddingVertical: 2 },
  detailLabel: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
  detailValue: { flex: 1, fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink, textAlign: 'right' },
  table: { gap: spacing.sm },
  tableHead: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.divider, paddingBottom: spacing.sm },
  tableHeadText: { fontFamily: fonts.bold, fontSize: 10, color: colors.muted, textTransform: 'uppercase' },
  tableRow: { flexDirection: 'row', alignItems: 'center' },
  tableCell: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink },
  tableAmt: { textAlign: 'right', fontFamily: fonts.bold },
  colDesc: { flex: 1 },
  colAmt: { width: 80 },
  tableDivider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.xs },
  tableMuted: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1.5,
    borderTopColor: colors.ink,
  },
  totalLabel: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.ink },
  totalValue: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.primaryDark },
  receiptBox: {
    alignItems: 'center',
    backgroundColor: '#F8FDFC',
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  receiptAmount: { fontFamily: fonts.extraBold, fontSize: 32, color: colors.primaryDark, letterSpacing: -0.5 },
  receiptLabel: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
  receiptMeta: { width: '100%', gap: spacing.sm, marginTop: spacing.sm },
  receiptRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  receiptRowText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink },
  footer: { gap: 4, paddingTop: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.divider },
  footerNote: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted, textAlign: 'center' },
  footerSupport: { fontFamily: fonts.semiBold, fontSize: 10, color: colors.primaryDark, textAlign: 'center' },
});
