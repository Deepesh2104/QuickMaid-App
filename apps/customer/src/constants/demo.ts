import { Ionicons } from '@expo/vector-icons';

export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export interface DemoBooking {
  id: string;
  service: string;
  icon: keyof typeof Ionicons.glyphMap;
  date: string;
  time: string;
  maid: string;
  price: string;
  status: BookingStatus;
  address: string;
  bookingRef?: string;
  duration?: string;
  maidId?: string;
  maidRating?: number;
  maidJobs?: number;
  completionOtp?: string;
  maidAssignedAt?: string;
  otpVerifiedAt?: string;
  completedAt?: string;
  visitDate?: string;
  slotId?: string;
  slotLabel?: string;
  rescheduledAt?: string;
  amountPaid?: number;
  walletUsed?: number;
  paymentLabel?: string;
  cancelledAt?: string;
  cancelReason?: string;
  refundAmount?: number;
  refundStatus?: 'processing' | 'completed';
  refundTxnId?: string;
  reviewRating?: number;
  reviewText?: string;
  reviewTags?: string[];
  reviewedAt?: string;
}

export const DEMO_BOOKINGS: DemoBooking[] = [
  {
    id: 'b1',
    service: 'Deep clean',
    icon: 'home-outline',
    date: 'Sat, 8 Jun',
    time: '10:00 AM',
    maid: 'Sunita Devi',
    price: '₹499',
    status: 'upcoming',
    address: 'Sector 5, Shankar Nagar, Raipur',
    bookingRef: 'QM-8JUN-499',
    duration: '3–4 hrs',
    maidId: 'm_sunita',
    maidRating: 4.92,
    maidJobs: 1284,
    completionOtp: '482916',
    maidAssignedAt: new Date().toISOString(),
  },
  {
    id: 'b2',
    service: 'Regular clean',
    icon: 'sparkles-outline',
    date: 'Mon, 27 May',
    time: '2:00 PM',
    maid: 'Kamla Bai',
    price: '₹149',
    status: 'completed',
    address: 'Sector 5, Shankar Nagar, Raipur',
    bookingRef: 'QM-27MAY-149',
    duration: '2 hrs',
  },
  {
    id: 'b3',
    service: 'Kitchen focus',
    icon: 'restaurant-outline',
    date: 'Wed, 15 May',
    time: '11:00 AM',
    maid: 'Rekha Sahu',
    price: '₹299',
    status: 'completed',
    address: 'Sector 5, Shankar Nagar, Raipur',
    bookingRef: 'QM-15MAY-299',
    duration: '1.5 hrs',
  },
  {
    id: 'b4',
    service: 'Bathroom deep',
    icon: 'water-outline',
    date: 'Thu, 2 May',
    time: '9:00 AM',
    maid: 'Meena T.',
    price: '₹199',
    status: 'cancelled',
    address: 'Sector 5, Shankar Nagar, Raipur',
    bookingRef: 'QM-02MAY-199',
    duration: '1 hr',
  },
];

export const PLANS = [
  {
    id: 'plus',
    name: 'QuickMaid Plus',
    price: '₹1,199',
    period: '/month',
    visits: '12 visits',
    savings: 'Save 20%',
    features: ['Same maid every visit', 'Priority slots', 'Free rescheduling', 'Member pricing'],
    popular: true,
  },
  {
    id: 'flex',
    name: 'Flex 6',
    price: '₹699',
    period: '/month',
    visits: '6 visits',
    savings: 'Save 12%',
    features: ['Choose your maid', 'Weekend slots', 'Easy pause plan'],
    popular: false,
  },
  {
    id: 'onetime',
    name: 'Pay per visit',
    price: '₹149',
    period: '/visit',
    visits: 'No commitment',
    savings: 'Best for trying',
    features: ['Book anytime', 'All services available', 'No subscription'],
    popular: false,
  },
];

export const SUPPORT_CONTACT = {
  phone: '+91 77100 22440',
  email: 'support@quickmaid.in',
  whatsapp: '+91 77100 22440',
  hours: '7 AM – 10 PM daily',
  replyTime: 'Typical reply under 5 minutes',
};

export const FAQ_ITEMS = [
  {
    q: 'How are maids verified?',
    a: 'Every partner completes Aadhaar verification, police check, and a trial clean before joining QuickMaid.',
  },
  {
    q: 'Can I reschedule a booking?',
    a: 'Yes — reschedule free up to 4 hours before your slot from the Bookings tab.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'UPI, debit/credit cards, and pay-after-service for verified customers.',
  },
];

export const PLUS_FAQ_ITEMS = [
  {
    q: 'Can I pause or cancel my plan?',
    a: 'Yes — pause anytime from the Plus tab. Unused visits roll over for 30 days. Cancel before your next billing date with no penalty.',
  },
  {
    q: 'Do I get the same maid every visit?',
    a: 'Plus members get priority matching with the same verified pro when available. Flex 6 lets you pick from your favourites.',
  },
  {
    q: 'What if I need more visits in a month?',
    a: 'Add extra visits at member pricing (20% off). Or upgrade from Flex 6 to Plus anytime — we prorate the difference.',
  },
];
