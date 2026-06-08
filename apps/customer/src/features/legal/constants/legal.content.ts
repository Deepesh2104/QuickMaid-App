import type { LegalDocId, LegalDocument } from '../types/legal.types';

export const LEGAL_DOCUMENTS: Record<LegalDocId, LegalDocument> = {
  terms: {
    id: 'terms',
    title: 'Terms of Service',
    eyebrow: 'Legal',
    updated: '1 June 2026',
    summary: 'Rules for using QuickMaid to book verified home cleaning visits in India.',
    sections: [
      {
        heading: '1. Agreement',
        body:
          'By creating an account or booking a service through QuickMaid, you agree to these Terms of Service and our Privacy Policy. QuickMaid connects customers with independent verified cleaning professionals ("Pros").',
      },
      {
        heading: '2. Bookings & pricing',
        body:
          'Prices shown in the app include applicable taxes unless stated otherwise. Membership plans (Plus, Flex) renew monthly until cancelled. One-time visits are charged per booking. Coupons and wallet credits apply as shown at checkout.',
      },
      {
        heading: '3. Payments',
        body:
          'Payments are processed securely via Razorpay (UPI, cards, net banking, EMI, wallet). Cash-after-service and pay-later options may be offered for eligible bookings. Failed payments do not confirm your booking.',
      },
      {
        heading: '4. Cancellations & reschedules',
        body:
          'Free cancellation and reschedule are available until 2 hours before the visit slot, subject to our Cancellation Policy. Late cancellations may incur a fee. No-shows may be charged up to 50% of the booking value.',
      },
      {
        heading: '5. Service quality',
        body:
          'Pros are background-verified and trained. If you are unsatisfied, contact support within 24 hours of visit completion. QuickMaid may offer a re-visit or partial credit at its discretion.',
      },
      {
        heading: '6. Liability',
        body:
          'QuickMaid is a marketplace platform. We are not liable for indirect damages. Our maximum liability for a single booking is limited to the amount paid for that visit, except where law requires otherwise.',
      },
      {
        heading: '7. Contact',
        body: 'Questions? Email legal@quickmaid.demo or use in-app Help. Governing law: India. Disputes subject to courts in Bengaluru, Karnataka.',
      },
    ],
  },
  privacy: {
    id: 'privacy',
    title: 'Privacy Policy',
    eyebrow: 'Your data',
    updated: '1 June 2026',
    summary: 'How QuickMaid collects, uses, and protects your personal information.',
    sections: [
      {
        heading: '1. Data we collect',
        body:
          'Phone number, name, addresses, payment method tokens (via Razorpay — we do not store full card numbers), booking history, device permissions you grant (location, notifications), and support messages.',
      },
      {
        heading: '2. How we use it',
        body:
          'To confirm bookings, assign Pros, process payments, send visit updates, improve the app, prevent fraud, and comply with law. Marketing messages are opt-in only.',
      },
      {
        heading: '3. Sharing',
        body:
          'We share necessary details with assigned Pros (name, address, slot), payment partners (Razorpay), and cloud providers under strict contracts. We never sell your personal data.',
      },
      {
        heading: '4. Retention & security',
        body:
          'Data is encrypted in transit (TLS) and at rest where applicable. We retain booking records for tax and support purposes. You may request deletion subject to legal retention requirements.',
      },
      {
        heading: '5. Your rights',
        body:
          'Access, correct, or delete your profile data from Account settings. Withdraw notification or location permissions anytime in device settings. Contact privacy@quickmaid.demo for data requests.',
      },
      {
        heading: '6. Children',
        body: 'QuickMaid is not intended for users under 18. We do not knowingly collect data from minors.',
      },
    ],
  },
  cancellation: {
    id: 'cancellation',
    title: 'Cancellation & Refund Policy',
    eyebrow: 'Policies',
    updated: '1 June 2026',
    summary: 'When you can cancel free, how refunds work, and membership rules.',
    sections: [
      {
        heading: 'Free cancellation window',
        body:
          'Cancel or reschedule at no charge up to 2 hours before your scheduled visit. Use Bookings → Reschedule or Cancel in the app.',
      },
      {
        heading: 'Late cancellation',
        body:
          'Cancellations within 2 hours of the slot may incur up to ₹99 or 25% of booking value (whichever is lower) to compensate the assigned Pro.',
      },
      {
        heading: 'Refunds timeline',
        body:
          'Approved refunds return to your original payment method or QuickMaid wallet within 3–5 business days. UPI and wallet refunds are usually faster. EMI refunds follow bank timelines.',
      },
      {
        heading: 'Membership (Plus / Flex)',
        body:
          'Monthly plans auto-renew. Cancel before renewal date to avoid the next charge. Unused visits expire 30 days after renewal. No partial refunds on used membership months except where required by law.',
      },
      {
        heading: 'Pro no-show',
        body:
          'If a verified Pro does not arrive within 30 minutes of the slot, you receive a full refund or free rebooking. Report via Help → Live chat.',
      },
      {
        heading: 'Cash & pay-later',
        body:
          'Cash-after-service bookings can be cancelled free until 2 hours before. Pay-later bookings must be settled within 24 hours or the booking may be auto-cancelled.',
      },
    ],
  },
};

export const LEGAL_HUB_ITEMS: { id: LegalDocId; icon: string; label: string; sub: string }[] = [
  { id: 'terms', icon: 'document-text-outline', label: 'Terms of Service', sub: 'Usage rules & liability' },
  { id: 'privacy', icon: 'shield-checkmark-outline', label: 'Privacy Policy', sub: 'Data & your rights' },
  { id: 'cancellation', icon: 'refresh-outline', label: 'Cancellation & refunds', sub: 'Free window · EMI · Plus' },
];
