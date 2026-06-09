import type { AppNotification } from '../types/notification.types';

const now = Date.now();
const hours = (h: number) => new Date(now - h * 60 * 60 * 1000).toISOString();
const days = (d: number) => new Date(now - d * 24 * 60 * 60 * 1000).toISOString();

export const DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    category: 'pro',
    title: 'Pro on the way',
    body: 'Sunita Devi is heading to your home · Deep clean · Sat 8 Jun',
    detail:
      'Sunita Devi has started her trip and should reach your address in about 18 minutes. You can track live location, call support, or message your pro from the booking screen.',
    createdAt: hours(1),
    read: false,
    action: { type: 'booking', id: 'b1' },
    icon: 'bicycle',
    tone: '#E6F4F2',
    ink: '#084F4A',
  },
  {
    id: 'n2',
    category: 'booking',
    title: 'Completion OTP ready',
    body: 'Share OTP with your pro when the job is done · Ref QM-8JUN-499',
    detail:
      'Your visit completion OTP is active. Share it only when the service is fully done. This OTP confirms job completion and releases payment to your verified pro.',
    createdAt: hours(3),
    read: false,
    action: { type: 'booking', id: 'b1' },
    icon: 'key-outline',
    tone: '#EEF6FF',
    ink: '#175CD3',
  },
  {
    id: 'n3',
    category: 'payment',
    title: 'Payment received',
    body: '₹499 paid via UPI · Deep clean booking confirmed',
    detail:
      'We received ₹499 via UPI for your Deep clean booking. Invoice and receipt are available in your booking documents. Refund policy applies if you cancel before pro dispatch.',
    createdAt: hours(5),
    read: true,
    action: { type: 'booking', id: 'b1' },
    icon: 'card-outline',
    tone: '#ECFDF5',
    ink: '#027A48',
  },
  {
    id: 'n4',
    category: 'offer',
    title: 'SUMMER20 — 20% off',
    body: 'Valid on deep clean & kitchen focus this week. Auto-applies at checkout.',
    detail:
      'Use code SUMMER20 for 20% off deep clean and kitchen focus services this week. Discount auto-applies at checkout when eligible. Plus members get an extra 5% stackable savings.',
    createdAt: hours(8),
    read: false,
    action: { type: 'home' },
    icon: 'pricetag-outline',
    tone: '#FFFAEB',
    ink: '#B54708',
  },
  {
    id: 'n5',
    category: 'booking',
    title: 'Visit completed',
    body: 'Kamla Bai verified your OTP · Regular clean · Rate your visit',
    detail:
      'Your regular clean visit is complete and OTP was verified successfully. Rate Kamla Bai to help other families and unlock loyalty rewards on your next booking.',
    createdAt: days(2),
    read: true,
    action: { type: 'booking', id: 'b2' },
    icon: 'checkmark-done-circle',
    tone: '#ECFDF5',
    ink: '#027A48',
  },
  {
    id: 'n6',
    category: 'pro',
    title: 'Pro auto-assigned',
    body: 'Sunita Devi · 4.92★ · 1,284 jobs matched to your booking',
    detail:
      'We matched Sunita Devi to your booking based on ratings, distance, and availability. She is background-verified with 1,284 completed jobs and a 4.92★ rating.',
    createdAt: days(3),
    read: true,
    action: { type: 'pro', id: 'm_sunita' },
    icon: 'person-circle-outline',
    tone: '#E6F4F2',
    ink: '#084F4A',
  },
  {
    id: 'n7',
    category: 'offer',
    title: 'Plus members save 20%',
    body: 'Upgrade to QuickMaid Plus — priority slots & free reschedule',
    detail:
      'QuickMaid Plus gives you priority booking slots, one free reschedule per month, and up to 20% savings on every visit. Upgrade now and start saving from your next clean.',
    createdAt: days(4),
    read: true,
    action: { type: 'plans' },
    icon: 'diamond-outline',
    tone: '#FFFAEB',
    ink: '#B54708',
  },
  {
    id: 'n8',
    category: 'system',
    title: 'Welcome to QuickMaid',
    body: 'Verified pros in Raipur · Pay after service · OTP-secured visits',
    detail:
      'Welcome to QuickMaid. Book verified home cleaning pros in Raipur with secure UPI payments, live tracking, OTP-secured visits, and premium support whenever you need help.',
    createdAt: days(7),
    read: true,
    action: { type: 'home' },
    icon: 'sparkles-outline',
    tone: '#F4F6F8',
    ink: '#667085',
  },
];
