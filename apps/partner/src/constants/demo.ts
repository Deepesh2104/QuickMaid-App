import type { PartnerProfile } from './app';

export const RAIPUR_ZONES = [
  'Shankar Nagar',
  'Sector 5',
  'Civil Lines',
  'Pandri',
  'Telibandha',
  'Tatibandh',
] as const;

export const SKILL_OPTIONS = [
  'Cleaning',
  'Deep clean',
  'Cooking',
  'Utensils',
  'Babysit',
] as const;

export const LANGUAGE_OPTIONS = [
  'Hindi',
  'English',
  'Chhattisgarhi',
  'Marathi',
  'Bengali',
  'Tamil',
] as const;

export const EXPERIENCE_OPTIONS = [
  { id: '0-1', label: 'Under 1 yr' },
  { id: '1-3', label: '1–3 yrs' },
  { id: '3-5', label: '3–5 yrs' },
  { id: '5+', label: '5+ yrs' },
] as const;

export const TRAVEL_MODE_OPTIONS = [
  { id: 'walk' as const, label: 'Walk', icon: 'walk-outline' as const },
  { id: 'cycle' as const, label: 'Cycle', icon: 'bicycle-outline' as const },
  { id: 'bus' as const, label: 'Bus', icon: 'bus-outline' as const },
  { id: 'auto' as const, label: 'Auto', icon: 'car-outline' as const },
] as const;

export const MARITAL_OPTIONS = [
  { id: 'single' as const, label: 'Single' },
  { id: 'married' as const, label: 'Married' },
  { id: 'widowed' as const, label: 'Widowed' },
  { id: 'other' as const, label: 'Other' },
] as const;

export const EMERGENCY_RELATION_OPTIONS = [
  'Spouse',
  'Parent',
  'Sibling',
  'Child',
  'Friend',
  'Other',
] as const;

export const WORK_RADIUS_OPTIONS = [3, 5, 8, 10] as const;

export type JobStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'declined';

export interface PartnerJob {
  id: string;
  bookingRef: string;
  customerName: string;
  /** Masked in UI until visit is accepted; used for tel: link */
  customerPhone?: string;
  service: string;
  address: string;
  zone: string;
  pincode?: string;
  landmark?: string;
  slotLabel: string;
  visitDate: string;
  amountPaise: number;
  status: JobStatus;
  distanceKm?: number;
  /** Demo: customer shares this OTP when visit is complete */
  completionOtp?: string;
  /** Why partner declined (demo) */
  declineReason?: string;
  /** Linked customer app booking id (bridge / deep link demo) */
  customerBookingId?: string;
  /** Demo: how many times job re-entered partner pool */
  reassignGeneration?: number;
}

/** Demo: manual Accept / Decline test — auto-assign OFF, Online ON. */
export const DEMO_MANUAL_ACCEPT_TEST_JOB_ID = 'j9';
export const DEMO_MANUAL_DECLINE_TEST_JOB_ID = 'j10';
export const MANUAL_ACCEPT_DECLINE_TEST_IDS = [
  DEMO_MANUAL_ACCEPT_TEST_JOB_ID,
  DEMO_MANUAL_DECLINE_TEST_JOB_ID,
] as const;

/** Demo dispatch test: all pending — auto-assign fills one job per free slot window. */
export const DEMO_JOBS: PartnerJob[] = [
  {
    id: 'j9',
    bookingRef: 'QM-79990109',
    customerName: 'Manual Test · Kavya D.',
    service: 'Regular clean · 1.5h · MANUAL',
    address: 'Flat 12, Green Valley, Shankar Nagar',
    zone: 'Shankar Nagar',
    landmark: 'Near City Mall — manual accept test',
    pincode: '492007',
    slotLabel: 'Mon–Sat · 8–11 AM',
    visitDate: 'Today',
    amountPaise: 39900,
    status: 'pending',
    distanceKm: 0.9,
    completionOtp: '123456',
    customerPhone: '9876543210',
  },
  {
    id: 'j10',
    bookingRef: 'QM-79990110',
    customerName: 'Manual Test · Decline · Ramesh K.',
    service: 'Utensils · 1h · DECLINE TEST',
    address: 'House 5, Lake View Colony, Shankar Nagar',
    zone: 'Shankar Nagar',
    landmark: 'Decline test — is par Decline dabao',
    pincode: '492007',
    slotLabel: 'Mon–Sat · 2–5 PM',
    visitDate: 'Today',
    amountPaise: 24900,
    status: 'pending',
    distanceKm: 1.1,
    completionOtp: '123456',
    customerPhone: '9876501234',
  },
  {
    id: 'j1',
    bookingRef: 'QM-74990101',
    customerName: 'Priya S.',
    service: 'Deep clean · 2h',
    address: 'Flat 204, Green Valley, Sector 5',
    zone: 'Shankar Nagar',
    slotLabel: 'Mon–Sat · 8–11 AM',
    visitDate: 'Today',
    amountPaise: 49900,
    status: 'pending',
    distanceKm: 1.2,
    completionOtp: '123456',
    customerPhone: '9827012345',
  },
  {
    id: 'j2',
    bookingRef: 'QM-73490104',
    customerName: 'Neha R.',
    service: 'Regular clean · 1.5h',
    address: 'B-12, Shankar Nagar Main Rd',
    zone: 'Shankar Nagar',
    slotLabel: 'Mon–Sat · 2–5 PM',
    visitDate: 'Today',
    amountPaise: 34900,
    status: 'pending',
    distanceKm: 1.8,
    completionOtp: '123456',
    customerPhone: '9811023456',
  },
  {
    id: 'j3',
    bookingRef: 'QM-71990105',
    customerName: 'Vikram T.',
    service: 'Utensils · 1h',
    address: 'Tower B, Flat 902, Sector 5 Plaza',
    zone: 'Sector 5',
    slotLabel: 'Mon–Sat · 8–11 AM',
    visitDate: 'Tomorrow',
    amountPaise: 19900,
    status: 'pending',
    distanceKm: 2.0,
    completionOtp: '123456',
  },
  {
    id: 'j4',
    bookingRef: 'QM-75990106',
    customerName: 'Sunita P.',
    service: 'Deep clean · 3h',
    address: '42, Green Valley Layout, Sector 5',
    zone: 'Sector 5',
    slotLabel: 'Mon–Sat · 2–5 PM',
    visitDate: 'Tomorrow',
    amountPaise: 59900,
    status: 'pending',
    distanceKm: 2.2,
    completionOtp: '123456',
  },
  {
    id: 'j5',
    bookingRef: 'QM-77390117',
    customerName: 'Rohit B.',
    service: 'Regular clean · 1.5h',
    address: 'Flat 302, City Center, Shankar Nagar',
    zone: 'Shankar Nagar',
    slotLabel: 'Sun · 8–11 AM',
    visitDate: 'Sun 8 Jun',
    amountPaise: 49900,
    status: 'pending',
    distanceKm: 2.5,
    completionOtp: '123456',
    customerPhone: '9834567890',
  },
  {
    id: 'j6',
    bookingRef: 'QM-76190113',
    customerName: 'Deepak S.',
    service: 'Bathroom deep clean · 1.5h',
    address: 'House 22, Lake View Colony, Shankar Nagar',
    zone: 'Shankar Nagar',
    landmark: 'Behind City Mall',
    pincode: '492007',
    slotLabel: 'Mon–Sat · 8–11 AM',
    visitDate: 'Today',
    amountPaise: 34900,
    status: 'pending',
    distanceKm: 1.5,
    completionOtp: '123456',
    customerPhone: '9812345678',
  },
  {
    id: 'j7',
    bookingRef: 'QM-77990119',
    customerName: 'Arjun T.',
    service: 'Kitchen slab degrease · 1.5h',
    address: 'Flat 1102, City Center, Shankar Nagar',
    zone: 'Shankar Nagar',
    landmark: 'Above Reliance Fresh',
    pincode: '492007',
    slotLabel: 'Mon–Sat · 2–5 PM',
    visitDate: 'Today',
    amountPaise: 29900,
    status: 'pending',
    distanceKm: 2.7,
    completionOtp: '123456',
    customerPhone: '9856789012',
  },
  {
    id: 'j8',
    bookingRef: 'QM-77690118',
    customerName: 'Geeta M.',
    service: 'Regular clean · 1h',
    address: 'House 14, Green Park, Sector 5',
    zone: 'Sector 5',
    slotLabel: 'Mon–Sat · 8–11 AM',
    visitDate: 'Tomorrow',
    amountPaise: 24900,
    status: 'pending',
    distanceKm: 1.9,
    completionOtp: '123456',
    customerPhone: '9845678901',
  },
];

export interface EarningRow {
  id: string;
  title: string;
  subtitle: string;
  amountPaise: number;
  kind: 'credit' | 'payout';
  date: string;
}

export const DEMO_EARNINGS: EarningRow[] = [
  { id: 'e2', title: 'Regular clean · Rahul M.', subtitle: 'QM-72990102', amountPaise: 13400, kind: 'credit', date: 'Yesterday' },
  { id: 'e3', title: 'Kitchen focus · Anita K.', subtitle: 'QM-77990103', amountPaise: 26900, kind: 'credit', date: '5 Jun' },
  { id: 'e4', title: 'Utensils · Vikram T.', subtitle: 'QM-71990105', amountPaise: 17900, kind: 'credit', date: '4 Jun' },
  { id: 'e5', title: 'Weekly payout', subtitle: 'UPI ••••@okaxis', amountPaise: -128000, kind: 'payout', date: '3 Jun' },
  { id: 'e6', title: 'Weekly payout', subtitle: 'UPI ••••@okaxis', amountPaise: -98500, kind: 'payout', date: '27 May' },
];

export const SUPPORT_CONTACT = {
  phone: '+91 98765 43210',
  whatsapp: '919876543210',
  email: 'partners@quickmaid.in',
  hours: '9 AM – 9 PM daily',
  replyTime: 'Typical reply under 5 minutes',
} as const;

export const PARTNER_FAQ_ITEMS = [
  {
    q: 'When do I get paid?',
    a: 'Weekly payouts every Monday to your verified UPI. Completed jobs from the prior week are included after the platform fee.',
  },
  {
    q: 'How do jobs get assigned?',
    a: 'Go online on the Jobs tab. With auto-assign on, matching jobs confirm into your free slot windows on Schedule. Tap Start visit when you arrive, then finish with the customer OTP.',
  },
  {
    q: 'What if a customer is not home?',
    a: 'Call the customer from the job screen. If unreachable after 10 minutes, contact partner support on this Help tab — we will guide you on wait time and compensation.',
  },
  {
    q: 'How do I complete KYC for payouts?',
    a: 'Go to Profile → KYC. Upload Aadhaar and bank/UPI details. Payouts unlock once verification is approved (usually 24–48 hours).',
  },
] as const;

export const WEEKLY_EARNING_GOAL_PAISE = 150_000;

export type PartnerNotificationKind = 'job' | 'payout' | 'kyc' | 'system';

export interface PartnerNotification {
  id: string;
  title: string;
  body: string;
  detail?: string;
  time: string;
  createdAt: string;
  kind: PartnerNotificationKind;
  jobId?: string;
  /** Earnings ledger payout row id — links to /payout/[id] */
  payoutId?: string;
}

export const DEMO_NOTIFICATIONS: PartnerNotification[] = [
  {
    id: 'n1',
    title: 'Visit auto-confirmed',
    body: 'Deep clean · Shankar Nagar · ₹449 after fee',
    detail:
      'Priya S. ki visit Today morning slot mein confirm ho gayi. Schedule tab kholo aur jab pahuncho Start visit dabao.',
    time: '2 min ago',
    createdAt: new Date(Date.now() - 2 * 60_000).toISOString(),
    kind: 'job',
    jobId: 'j1',
  },
  {
    id: 'n2',
    title: 'Visit auto-confirmed',
    body: 'Regular clean · Shankar Nagar · Today afternoon',
    time: '1 hr ago',
    createdAt: new Date(Date.now() - 60 * 60_000).toISOString(),
    kind: 'job',
    jobId: 'j2',
  },
  {
    id: 'n3',
    title: 'Weekly payout sent',
    body: '₹1,280 credited to your UPI',
    detail: 'Batch QM-PAY-0603 · 5 completed jobs included after platform fee.',
    time: 'Yesterday',
    createdAt: new Date(Date.now() - 24 * 60 * 60_000).toISOString(),
    kind: 'payout',
    payoutId: 'e5',
  },
  {
    id: 'n4',
    title: 'High demand in your zone',
    body: 'Shankar Nagar mein aaj zyada bookings — online raho, free slots auto-fill honge',
    time: 'Today',
    createdAt: new Date(Date.now() - 3 * 60 * 60_000).toISOString(),
    kind: 'system',
  },
  {
    id: 'n5',
    title: 'KYC verified',
    body: 'Your documents are approved. Weekly payouts are fully unlocked.',
    detail:
      'Aadhaar and UPI verification is complete. Your next weekly payout on Monday will include all completed jobs from this week.',
    time: '2 days ago',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60_000).toISOString(),
    kind: 'kyc',
  },
  {
    id: 'n6',
    title: 'Visit auto-confirmed',
    body: 'Deep clean · Sector 5 · Tomorrow afternoon',
    detail: 'Sunita P. ki visit Tomorrow 2–5 PM slot mein confirm ho gayi.',
    time: '8 min ago',
    createdAt: new Date(Date.now() - 8 * 60_000).toISOString(),
    kind: 'job',
    jobId: 'j4',
  },
  {
    id: 'n7',
    title: 'Peak hour bonus live',
    body: 'Morning slots par 10% extra — online raho, auto-assign se fill hoga',
    detail: 'Shankar Nagar aur Sector 5 mein subah zyada demand. Schedule par confirmed visits time par start karo.',
    time: '30 min ago',
    createdAt: new Date(Date.now() - 30 * 60_000).toISOString(),
    kind: 'system',
  },
  {
    id: 'n8',
    title: 'Visit auto-confirmed',
    body: 'Bathroom deep clean · Shankar Nagar · Today morning',
    detail: 'Deepak S. ki visit aaj morning window mein confirm ho gayi.',
    time: 'Just now',
    createdAt: new Date(Date.now() - 45_000).toISOString(),
    kind: 'job',
    jobId: 'j6',
  },
  {
    id: 'n9',
    title: 'Visit auto-confirmed',
    body: 'Kitchen degrease · Shankar Nagar · Today afternoon',
    detail: 'Arjun T. ki visit aaj afternoon slot mein confirm ho gayi.',
    time: '5 min ago',
    createdAt: new Date(Date.now() - 5 * 60_000).toISOString(),
    kind: 'job',
    jobId: 'j7',
  },
  {
    id: 'n10',
    title: 'Visit auto-confirmed',
    body: 'Sunday clean · Shankar Nagar · Sun 8 Jun',
    detail: 'Rohit B. ki Sunday morning visit confirm ho gayi.',
    time: '12 min ago',
    createdAt: new Date(Date.now() - 12 * 60_000).toISOString(),
    kind: 'job',
    jobId: 'j5',
  },
  {
    id: 'n11',
    title: 'Jobs queue active',
    body: 'Shankar Nagar & Sector 5 mein demand — har free slot auto-fill hoga',
    time: '15 min ago',
    createdAt: new Date(Date.now() - 15 * 60_000).toISOString(),
    kind: 'system',
  },
];

export const ZONE_DEMAND_LABEL: Record<string, { level: 'high' | 'medium' | 'low'; jobs: number }> = {
  'Shankar Nagar': { level: 'high', jobs: 18 },
  'Sector 5': { level: 'high', jobs: 14 },
  'Civil Lines': { level: 'high', jobs: 10 },
  Pandri: { level: 'medium', jobs: 7 },
  Telibandha: { level: 'medium', jobs: 5 },
  Tatibandh: { level: 'medium', jobs: 4 },
};

/** Demo login mobile — OTP 123456 */
export const DEMO_PARTNER_PHONE = '9876543210';

export const DEFAULT_PARTNER_PROFILE: PartnerProfile = {
  name: 'Sunita Verma',
  firstName: 'Sunita',
  lastName: 'Verma',
  dateOfBirth: '15/03/1990',
  gender: 'female',
  maritalStatus: 'married',
  email: 'sunita.verma@email.com',
  phone: DEMO_PARTNER_PHONE,
  alternatePhone: '9988776655',
  city: 'Raipur',
  zone: 'Shankar Nagar',
  skills: ['Cleaning', 'Deep clean'],
  languages: ['Hindi', 'Chhattisgarhi'],
  experienceYears: '3-5',
  travelMode: 'bus',
  workRadiusKm: 5,
  bio: 'Experienced home cleaning professional · reliable & punctual',
  emergencyContact: {
    name: 'Ramesh Verma',
    phone: '9876501234',
    relation: 'Spouse',
  },
  addresses: [
    {
      id: 'addr-default',
      label: 'Home',
      line: 'Flat 12, Green Valley Apartments, Sector 5',
      landmark: 'Near City Mall',
      zone: 'Shankar Nagar',
      pincode: '492001',
      isDefault: true,
    },
  ],
  kycStatus: 'verified',
  preferredSlotIds: ['morning', 'afternoon', 'sunday'],
  publicId: 'MD-9032107',
  memberSince: 'Jan 2025',
  upiId: 'demo.partner@okaxis',
};
