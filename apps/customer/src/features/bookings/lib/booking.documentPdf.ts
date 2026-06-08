import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { formatInr } from '@/features/checkout/lib/checkout.utils';

import type { BookingDocument } from './booking.document';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function bookingDocumentToHtml(doc: BookingDocument): string {
  const isInvoice = doc.type === 'invoice';
  const issued = new Date(doc.issuedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const statusColor = doc.status === 'paid' ? '#027A48' : '#B54708';
  const statusBg = doc.status === 'paid' ? '#ECFDF5' : '#FFFAEB';

  const lineRows = doc.lineItems
    .map(
      (line) => `
      <tr>
        <td>${escapeHtml(line.label)}</td>
        <td class="amt">${escapeHtml(formatInr(line.amount))}</td>
      </tr>`,
    )
    .join('');

  const invoiceBody = `
    <table class="table">
      <thead>
        <tr><th>Description</th><th class="amt">Amount</th></tr>
      </thead>
      <tbody>
        ${lineRows}
        <tr class="divider"><td colspan="2"></td></tr>
        <tr class="muted"><td>GST (18%)</td><td class="amt">${escapeHtml(formatInr(doc.tax))}</td></tr>
        <tr class="total"><td>Total</td><td class="amt">${escapeHtml(formatInr(doc.total))}</td></tr>
      </tbody>
    </table>`;

  const receiptBody = `
    <div class="receipt">
      <div class="receipt-amt">${escapeHtml(formatInr(doc.amountPaid))}</div>
      <div class="receipt-label">Amount received</div>
      <p><strong>Payment:</strong> ${escapeHtml(doc.paymentMethod)}</p>
      ${doc.gatewayPaymentId ? `<p><strong>Razorpay:</strong> ${escapeHtml(doc.gatewayPaymentId)}</p>` : ''}
      ${doc.walletUsed > 0 ? `<p><strong>Wallet:</strong> ${escapeHtml(formatInr(doc.walletUsed))}</p>` : ''}
    </div>`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0F1419;
      margin: 0;
      padding: 32px;
      font-size: 13px;
      line-height: 1.45;
    }
    .head { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
    .logo {
      width: 40px; height: 40px; border-radius: 10px;
      background: #E6F4F2; color: #084F4A;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 18px;
    }
    .brand h1 { margin: 0; font-size: 18px; color: #084F4A; }
    .brand p { margin: 2px 0 0; font-size: 10px; color: #667085; }
    .gst { margin-left: auto; font-size: 9px; color: #667085; text-align: right; }
    .title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .doc-title { font-size: 18px; font-weight: 800; letter-spacing: 0.5px; }
    .badge {
      font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 99px;
      background: ${statusBg}; color: ${statusColor};
    }
    .meta { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 18px; }
    .meta div { min-width: 120px; }
    .meta label { display: block; font-size: 10px; color: #667085; margin-bottom: 2px; }
    .meta span { font-size: 12px; font-weight: 700; }
    .section { margin-bottom: 16px; }
    .section h2 {
      margin: 0 0 6px; font-size: 11px; color: #667085;
      text-transform: uppercase; letter-spacing: 0.4px;
    }
    .section p { margin: 2px 0; }
    .detail { display: flex; justify-content: space-between; padding: 2px 0; }
    .detail span:first-child { color: #667085; }
    .detail span:last-child { font-weight: 600; text-align: right; max-width: 55%; }
    .table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    .table th, .table td { padding: 8px 4px; text-align: left; border-bottom: 1px solid #EAECF0; }
    .table th { font-size: 10px; color: #667085; text-transform: uppercase; }
    .table .amt { text-align: right; width: 100px; font-weight: 700; }
    .table .muted td { color: #667085; font-size: 12px; }
    .table .divider td { border: none; height: 4px; padding: 0; }
    .table .total td { border-top: 2px solid #0F1419; font-weight: 800; font-size: 14px; padding-top: 10px; }
    .receipt {
      text-align: center; background: #F8FDFC; border: 1px solid rgba(11,110,103,0.12);
      border-radius: 14px; padding: 24px; margin-top: 8px;
    }
    .receipt-amt { font-size: 28px; font-weight: 800; color: #084F4A; }
    .receipt-label { color: #667085; margin-bottom: 12px; }
    .footer {
      margin-top: 24px; padding-top: 12px; border-top: 1px solid #EAECF0;
      text-align: center; font-size: 10px; color: #667085;
    }
    .footer strong { color: #084F4A; }
  </style>
</head>
<body>
  <div class="head">
    <div class="logo">✦</div>
    <div class="brand">
      <h1>QuickMaid</h1>
      <p>Home services · Raipur, Chhattisgarh</p>
    </div>
    <div class="gst">GSTIN 22AAAAA0000A1Z5</div>
  </div>

  <div class="title-row">
    <div class="doc-title">${isInvoice ? 'TAX INVOICE' : 'PAYMENT RECEIPT'}</div>
    <div class="badge">${escapeHtml(doc.status.toUpperCase())}</div>
  </div>

  <div class="meta">
    <div><label>Document no.</label><span>${escapeHtml(doc.docNumber)}</span></div>
    <div><label>Issued</label><span>${escapeHtml(issued)}</span></div>
    <div><label>Booking ref</label><span>${escapeHtml(doc.bookingRef)}</span></div>
  </div>

  <div class="section">
    <h2>Billed to</h2>
    <p><strong>${escapeHtml(doc.customerName)}</strong></p>
    <p>${escapeHtml(doc.customerPhone)}</p>
    <p>${escapeHtml(doc.customerAddress)}</p>
  </div>

  <div class="section">
    <h2>Service details</h2>
    <div class="detail"><span>Service</span><span>${escapeHtml(doc.service)}</span></div>
    <div class="detail"><span>Visit</span><span>${escapeHtml(doc.visitDate)} · ${escapeHtml(doc.visitTime)}</span></div>
    <div class="detail"><span>Pro</span><span>${escapeHtml(doc.maid)}</span></div>
    ${doc.duration ? `<div class="detail"><span>Duration</span><span>${escapeHtml(doc.duration)}</span></div>` : ''}
  </div>

  ${isInvoice ? invoiceBody : receiptBody}

  <div class="footer">
    <p>This is a computer-generated ${isInvoice ? 'invoice' : 'receipt'} · No signature required</p>
    <p><strong>support@quickmaid.in</strong> · +91 98765 43210</p>
  </div>
</body>
</html>`;
}

export async function downloadBookingDocumentPdf(doc: BookingDocument): Promise<void> {
  const html = bookingDocumentToHtml(doc);
  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    throw new Error('Sharing is not available on this device. PDF was generated but cannot be saved.');
  }

  const filename = `QuickMaid-${doc.docNumber.replace(/[^a-zA-Z0-9-]/g, '')}.pdf`;
  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    dialogTitle: `Save ${filename}`,
    UTI: 'com.adobe.pdf',
  });
}
