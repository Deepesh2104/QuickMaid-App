import { Ionicons } from '@expo/vector-icons';

export interface SavedAddress {
  id: string;
  label: string;
  line: string;
  landmark?: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'upi' | 'card' | 'wallet';
  label: string;
  detail: string;
  isDefault: boolean;
  icon: keyof typeof Ionicons.glyphMap;
}

export interface ProfileActivity {
  id: string;
  title: string;
  sub: string;
  time: string;
  icon: keyof typeof Ionicons.glyphMap;
  tone: string;
}

export const PROFILE_STATS = {
  visits: 12,
  rating: '4.9',
  saved: '₹840',
  memberSince: 'Mar 2025',
};

export const SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: 'a1',
    label: 'Home',
    line: 'Flat 204, Green Valley, Sector 5, Shankar Nagar',
    landmark: 'Near City Mall',
    isDefault: true,
  },
  {
    id: 'a2',
    label: 'Office',
    line: '3rd Floor, Magneto Mall, G.E. Road',
    landmark: 'Opposite Telibandha Lake',
    isDefault: false,
  },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'p1',
    type: 'upi',
    label: 'Google Pay',
    detail: 'priya****@okaxis',
    isDefault: true,
    icon: 'phone-portrait-outline',
  },
  {
    id: 'p2',
    type: 'card',
    label: 'HDFC Debit',
    detail: '•••• 4821',
    isDefault: false,
    icon: 'card-outline',
  },
  {
    id: 'p3',
    type: 'wallet',
    label: 'QuickMaid Wallet',
    detail: '₹150 balance',
    isDefault: false,
    icon: 'wallet-outline',
  },
];

export const PROFILE_ACTIVITY: ProfileActivity[] = [
  {
    id: 'act1',
    title: 'Deep clean booked',
    sub: 'Sat, 8 Jun · Sunita Devi',
    time: '2 days ago',
    icon: 'calendar',
    tone: '#E6F4F2',
  },
  {
    id: 'act2',
    title: 'Plus plan renewed',
    sub: '₹1,199 · 12 visits',
    time: '1 week ago',
    icon: 'diamond',
    tone: '#FFF8EE',
  },
  {
    id: 'act3',
    title: 'Invoice downloaded',
    sub: 'QM-27MAY-149 · ₹149',
    time: '2 weeks ago',
    icon: 'receipt',
    tone: '#EEF6FF',
  },
];

export const QUICK_ACTIONS = [
  { id: 'book', icon: 'sparkles' as const, label: 'Book clean', sub: 'New visit' },
  { id: 'address', icon: 'location' as const, label: 'Addresses', sub: '2 saved' },
  { id: 'pay', icon: 'card' as const, label: 'Payments', sub: '3 methods' },
  { id: 'refer', icon: 'gift' as const, label: 'Refer', sub: 'Earn ₹100' },
];

export const SUPPORT_LINKS = [
  { id: 'help', icon: 'chatbubbles-outline' as const, label: 'Help centre', sub: 'Chat or call' },
  { id: 'rate', icon: 'star-outline' as const, label: 'Rate QuickMaid', sub: 'Share feedback' },
  { id: 'terms', icon: 'document-text-outline' as const, label: 'Terms & privacy', sub: 'Legal info' },
  { id: 'about', icon: 'information-circle-outline' as const, label: 'About QuickMaid', sub: 'v1.0.0 demo' },
];
