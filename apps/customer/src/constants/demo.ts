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
    features: ['Same maid every visit', 'Priority slots', 'Free rescheduling', '24/7 support'],
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
