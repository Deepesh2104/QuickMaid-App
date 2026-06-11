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
}

/** Sample accepted visit for testing Start visit → use job id `j11` */
export const DEMO_START_VISIT_JOB_ID = 'j11';

export const DEMO_JOBS: PartnerJob[] = [
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
    distanceKm: 2.4,
    customerPhone: '9827012345',
  },
  {
    id: 'j2',
    bookingRef: 'QM-72990102',
    customerName: 'Rahul M.',
    service: 'Regular clean · 1.5h',
    address: 'House 12, Civil Lines',
    zone: 'Civil Lines',
    slotLabel: 'Mon–Sat · 2–5 PM',
    visitDate: 'Today',
    amountPaise: 14900,
    status: 'in_progress',
    distanceKm: 4.1,
    completionOtp: '482916',
    customerPhone: '9811023456',
  },
  {
    id: 'j3',
    bookingRef: 'QM-77990103',
    customerName: 'Anita K.',
    service: 'Kitchen focus',
    address: 'Villa 8, Shanti Nagar Colony, Pandri',
    zone: 'Pandri',
    landmark: 'Opposite Pandri petrol pump',
    pincode: '492004',
    slotLabel: 'Sun · 8–11 AM',
    visitDate: 'Sun 8 Jun',
    amountPaise: 29900,
    status: 'completed',
    distanceKm: 5.8,
  },
  {
    id: 'j9',
    bookingRef: 'QM-72490109',
    customerName: 'Ravi K.',
    service: 'Regular clean · 1h',
    address: 'Flat 3B, City Center Apartments, Tatibandh',
    zone: 'Tatibandh',
    landmark: 'Beside Magneto Mall',
    pincode: '492099',
    slotLabel: 'Mon–Sat · 2–5 PM',
    visitDate: '1 Jun',
    amountPaise: 24900,
    status: 'completed',
    distanceKm: 6.2,
  },
  {
    id: 'j10',
    bookingRef: 'QM-71990110',
    customerName: 'Pooja N.',
    service: 'Utensils · 1h',
    address: 'House 9, Green Valley Layout, Sector 5',
    zone: 'Sector 5',
    landmark: 'Near Shankar Nagar main road',
    pincode: '492001',
    slotLabel: 'Mon–Sat · 8–11 AM',
    visitDate: '28 May',
    amountPaise: 19900,
    status: 'completed',
    distanceKm: 2.1,
  },
  {
    id: 'j4',
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
  },
  {
    id: 'j5',
    bookingRef: 'QM-71990105',
    customerName: 'Vikram T.',
    service: 'Utensils · 1h',
    address: 'Tower B, Flat 902, Sector 5 Plaza',
    zone: 'Sector 5',
    slotLabel: 'Mon–Sat · 8–11 AM',
    visitDate: 'Today',
    amountPaise: 19900,
    status: 'pending',
    distanceKm: 3.2,
  },
  {
    id: 'j11',
    bookingRef: 'QM-72990111',
    customerName: 'Demo · Start visit test',
    service: 'Regular clean · 1.5h · SAMPLE',
    address: 'Flat 101, Green Valley, Sector 5',
    zone: 'Shankar Nagar',
    slotLabel: 'Mon–Sat · 8–11 AM',
    visitDate: 'Today',
    amountPaise: 29900,
    status: 'accepted',
    distanceKm: 1.2,
    completionOtp: '482916',
  },
  {
    id: 'j6',
    bookingRef: 'QM-75990106',
    customerName: 'Sunita P.',
    service: 'Deep clean · 3h',
    address: '42, Lake View Colony, Civil Lines',
    zone: 'Civil Lines',
    slotLabel: 'Mon–Sat · 2–5 PM',
    visitDate: 'Tomorrow',
    amountPaise: 59900,
    status: 'accepted',
    distanceKm: 4.5,
  },
  {
    id: 'j7',
    bookingRef: 'QM-74490107',
    customerName: 'Karan D.',
    service: 'Cooking · 2h',
    address: 'House 7, Green Park, Telibandha',
    zone: 'Telibandha',
    slotLabel: 'Sun · 11 AM–2 PM',
    visitDate: 'Tomorrow',
    amountPaise: 44900,
    status: 'accepted',
    distanceKm: 2.9,
  },
  {
    id: 'j8',
    bookingRef: 'QM-73990108',
    customerName: 'Meera L.',
    service: 'Bathroom deep clean · 2h',
    address: 'Flat 15, Royal Residency, Pandri',
    zone: 'Pandri',
    slotLabel: 'Mon–Sat · 8–11 AM',
    visitDate: 'Sun 8 Jun',
    amountPaise: 39900,
    status: 'accepted',
    distanceKm: 3.6,
  },
  {
    id: 'j12',
    bookingRef: 'QM-75890112',
    customerName: 'Asha G.',
    service: 'Sofa 3+2 cleaning · 2h',
    address: 'Flat 501, Skyline Towers, Civil Lines',
    zone: 'Civil Lines',
    landmark: 'Near Mahant Ghasidas Memorial',
    pincode: '492001',
    slotLabel: 'Mon–Sat · 2–5 PM',
    visitDate: 'Today',
    amountPaise: 54900,
    status: 'pending',
    distanceKm: 3.4,
    customerPhone: '9823098765',
  },
  {
    id: 'j13',
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
    customerPhone: '9812345678',
  },
  {
    id: 'j14',
    bookingRef: 'QM-76490114',
    customerName: 'Lakshmi R.',
    service: '1BHK deep clean package · 3h',
    address: 'B-204, Green Park Apartments, Sector 5',
    zone: 'Sector 5',
    landmark: 'Opposite Sector 5 bus stand',
    pincode: '492001',
    slotLabel: 'Mon–Sat · 8–11 AM',
    visitDate: 'Today',
    amountPaise: 79900,
    status: 'pending',
    distanceKm: 2.0,
    customerPhone: '9876012345',
  },
  {
    id: 'j15',
    bookingRef: 'QM-76790115',
    customerName: 'Manoj K.',
    service: 'Kitchen chimney clean · 1h',
    address: 'Flat 8A, Royal Heights, Pandri',
    zone: 'Pandri',
    landmark: 'Near Pandri market',
    pincode: '492004',
    slotLabel: 'Mon–Sat · 2–5 PM',
    visitDate: 'Today',
    amountPaise: 39900,
    status: 'pending',
    distanceKm: 4.8,
    customerPhone: '9898123456',
  },
  {
    id: 'j16',
    bookingRef: 'QM-77090116',
    customerName: 'Pallavi N.',
    service: 'Post-party clean · 2h',
    address: 'Villa 3, Telibandha Greens, Telibandha',
    zone: 'Telibandha',
    landmark: '2 km from Telibandha square',
    pincode: '492001',
    slotLabel: 'Mon–Sat · 2–5 PM',
    visitDate: 'Tomorrow',
    amountPaise: 44900,
    status: 'pending',
    distanceKm: 3.1,
    customerPhone: '9765432109',
  },
  {
    id: 'j17',
    bookingRef: 'QM-77390117',
    customerName: 'Rohit B.',
    service: 'Double mattress cleaning · 1.5h',
    address: 'Flat 302, Magneto Residency, Tatibandh',
    zone: 'Tatibandh',
    landmark: 'Beside Magneto Mall',
    pincode: '492099',
    slotLabel: 'Sun · 8–11 AM',
    visitDate: 'Sun 8 Jun',
    amountPaise: 49900,
    status: 'pending',
    distanceKm: 5.5,
    customerPhone: '9834567890',
  },
  {
    id: 'j18',
    bookingRef: 'QM-77690118',
    customerName: 'Geeta M.',
    service: 'Regular clean · 1h',
    address: 'House 14, Shanti Nagar, Civil Lines',
    zone: 'Civil Lines',
    slotLabel: 'Mon–Sat · 8–11 AM',
    visitDate: 'Tomorrow',
    amountPaise: 24900,
    status: 'pending',
    distanceKm: 4.2,
    customerPhone: '9845678901',
  },
  {
    id: 'j19',
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
    customerPhone: '9856789012',
  },
  {
    id: 'j20',
    bookingRef: 'QM-78290120',
    customerName: 'Sneha V.',
    service: '2BHK deep clean package · 4h',
    address: 'Tower C, Flat 904, Sector 5 Plaza',
    zone: 'Sector 5',
    landmark: 'Near Shankar Nagar main road',
    pincode: '492001',
    slotLabel: 'Mon–Sat · 8–11 AM',
    visitDate: 'Tomorrow',
    amountPaise: 129900,
    status: 'pending',
    distanceKm: 1.9,
    customerPhone: '9867890123',
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
  { id: 'e1', title: 'Deep clean · Priya S.', subtitle: 'QM-74990101', amountPaise: 44900, kind: 'credit', date: 'Today' },
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
    q: 'How do I accept or decline a job?',
    a: 'New requests appear on the Jobs tab. Tap a card to view details, then accept before the timer runs out or decline if you cannot make it.',
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
    title: 'New job request',
    body: 'Deep clean · Sector 5 · ₹449 after fee',
    detail:
      'Priya S. booked a 2-hour deep clean in Shankar Nagar. Accept within 15 minutes to keep your priority rating. Customer prefers morning slot.',
    time: '2 min ago',
    createdAt: new Date(Date.now() - 2 * 60_000).toISOString(),
    kind: 'job',
    jobId: 'j1',
  },
  {
    id: 'n2',
    title: 'Visit tomorrow confirmed',
    body: 'Rahul M. · Civil Lines · Mon–Sat 2–5 PM',
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
    body: '12 open requests in Shankar Nagar today — go online to get more jobs',
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
    title: 'Another request nearby',
    body: 'Regular clean · Shankar Nagar · ₹314 after fee',
    detail:
      'Neha R. needs a 1.5h regular clean today afternoon. Only 1.8 km from your work address — fast accept recommended.',
    time: '8 min ago',
    createdAt: new Date(Date.now() - 8 * 60_000).toISOString(),
    kind: 'job',
    jobId: 'j4',
  },
  {
    id: 'n7',
    title: 'Peak hour bonus live',
    body: 'Earn 10% extra on jobs accepted before 11 AM today',
    detail:
      'High demand in Shankar Nagar and Sector 5 this morning. Stay online and accept from your Requests inbox to qualify.',
    time: '30 min ago',
    createdAt: new Date(Date.now() - 30 * 60_000).toISOString(),
    kind: 'system',
  },
  {
    id: 'n8',
    title: 'New job request',
    body: '1BHK deep clean · Sector 5 · ₹719 after fee',
    detail:
      'Lakshmi R. booked a 3-hour 1BHK deep clean package today morning. High-value job — accept within 15 minutes.',
    time: 'Just now',
    createdAt: new Date(Date.now() - 45_000).toISOString(),
    kind: 'job',
    jobId: 'j14',
  },
  {
    id: 'n9',
    title: 'New job request',
    body: 'Sofa cleaning · Civil Lines · ₹494 after fee',
    detail: 'Asha G. needs 3+2 sofa cleaning this afternoon. Only 3.4 km from your zone.',
    time: '5 min ago',
    createdAt: new Date(Date.now() - 5 * 60_000).toISOString(),
    kind: 'job',
    jobId: 'j12',
  },
  {
    id: 'n10',
    title: 'New job request',
    body: 'Bathroom deep · Shankar Nagar · ₹314 after fee',
    detail: 'Deepak S. booked bathroom deep clean for today morning slot. Nearby — 1.5 km.',
    time: '12 min ago',
    createdAt: new Date(Date.now() - 12 * 60_000).toISOString(),
    kind: 'job',
    jobId: 'j13',
  },
  {
    id: 'n11',
    title: '10 open requests today',
    body: 'Shankar Nagar & Sector 5 mein zyada demand — online raho',
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
