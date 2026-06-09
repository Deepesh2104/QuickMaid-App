import type { DemoBooking } from '@/constants/demo';

export interface MaidReview {
  id: string;
  customer: string;
  area: string;
  rating: number;
  text: string;
  when: string;
  service: string;
}

export interface MaidProfileDetail {
  id: string;
  name: string;
  rating: number;
  jobs: number;
  badge?: string;
  bio: string;
  experienceYears: number;
  languages: string[];
  skills: string[];
  zones: string[];
  memberSince: string;
  onTimeRate: number;
  repeatRate: number;
  ratingBreakdown: { stars: number; pct: number }[];
  verified: { icon: string; label: string }[];
  reviews: MaidReview[];
}

const MAID_PROFILES: MaidProfileDetail[] = [
  {
    id: 'm_sunita',
    name: 'Sunita Devi',
    rating: 4.92,
    jobs: 1284,
    badge: 'Top pro',
    bio: 'Deep-clean specialist with 6+ years in Raipur homes. Known for kitchen, bathroom shine and move-in resets.',
    experienceYears: 6,
    languages: ['Hindi', 'Chhattisgarhi'],
    skills: ['Deep clean', 'Kitchen focus', 'Move-in/out', 'Bathroom shine'],
    zones: ['Shankar Nagar', 'Civil Lines', 'Sector 5', 'Pandri'],
    memberSince: 'Mar 2021',
    onTimeRate: 98,
    repeatRate: 74,
    ratingBreakdown: [
      { stars: 5, pct: 88 },
      { stars: 4, pct: 9 },
      { stars: 3, pct: 2 },
      { stars: 2, pct: 1 },
      { stars: 1, pct: 0 },
    ],
    verified: [
      { icon: 'shield-checkmark', label: 'Background check' },
      { icon: 'id-card', label: 'ID verified' },
      { icon: 'medkit', label: 'Health screened' },
    ],
    reviews: [
      {
        id: 'ms1',
        customer: 'Priya S.',
        area: 'Shankar Nagar',
        rating: 5,
        text: 'Sunita ji ne poora ghar chamka diya. Kitchen tiles bilkul naye jaisi.',
        when: '3 days ago',
        service: 'Deep clean',
      },
      {
        id: 'ms2',
        customer: 'Amit K.',
        area: 'Civil Lines',
        rating: 5,
        text: 'On time, polite, and very thorough. Bathroom sparkle was unreal.',
        when: '1 week ago',
        service: 'Bathroom focus',
      },
      {
        id: 'ms3',
        customer: 'Neha R.',
        area: 'Sector 5',
        rating: 4,
        text: 'Great work overall. Would book again for monthly cleaning.',
        when: '2 weeks ago',
        service: 'Monthly plan',
      },
    ],
  },
  {
    id: 'm_kamla',
    name: 'Kamla Bai',
    rating: 4.88,
    jobs: 956,
    badge: '5★ specialist',
    bio: 'Regular & weekly cleaning expert. Fast, friendly, and great with families and small apartments.',
    experienceYears: 5,
    languages: ['Hindi'],
    skills: ['Regular clean', 'Weekly plan', 'Dusting', 'Mopping'],
    zones: ['Tatibandh', 'Devendra Nagar', 'Shankar Nagar'],
    memberSince: 'Aug 2021',
    onTimeRate: 96,
    repeatRate: 81,
    ratingBreakdown: [
      { stars: 5, pct: 84 },
      { stars: 4, pct: 11 },
      { stars: 3, pct: 3 },
      { stars: 2, pct: 1 },
      { stars: 1, pct: 1 },
    ],
    verified: [
      { icon: 'shield-checkmark', label: 'Background check' },
      { icon: 'id-card', label: 'ID verified' },
    ],
    reviews: [
      {
        id: 'mk1',
        customer: 'Rahul V.',
        area: 'Tatibandh',
        rating: 5,
        text: 'Consistent quality every week. Kamla Bai remembers our preferences.',
        when: '4 days ago',
        service: 'Regular clean',
      },
      {
        id: 'mk2',
        customer: 'Sneha M.',
        area: 'Devendra Nagar',
        rating: 5,
        text: 'Punctual and professional. Kids loved how tidy the rooms looked.',
        when: '10 days ago',
        service: 'Regular clean',
      },
      {
        id: 'mk3',
        customer: 'Vikash P.',
        area: 'Shankar Nagar',
        rating: 4,
        text: 'Good value service. Finished before the slot ended.',
        when: '3 weeks ago',
        service: 'Weekly plan',
      },
    ],
  },
  {
    id: 'm_rekha',
    name: 'Rekha Sahu',
    rating: 4.91,
    jobs: 1102,
    bio: 'Kitchen & appliance cleaning pro. Detail-oriented with eco-friendly supplies on request.',
    experienceYears: 7,
    languages: ['Hindi', 'English'],
    skills: ['Kitchen focus', 'Appliance wipe', 'Cabinet clean', 'Chimney area'],
    zones: ['Pandri', 'Civil Lines', 'Fafadih'],
    memberSince: 'Jan 2020',
    onTimeRate: 97,
    repeatRate: 69,
    ratingBreakdown: [
      { stars: 5, pct: 86 },
      { stars: 4, pct: 10 },
      { stars: 3, pct: 3 },
      { stars: 2, pct: 1 },
      { stars: 1, pct: 0 },
    ],
    verified: [
      { icon: 'shield-checkmark', label: 'Background check' },
      { icon: 'id-card', label: 'ID verified' },
      { icon: 'leaf', label: 'Eco supplies' },
    ],
    reviews: [
      {
        id: 'mr1',
        customer: 'Anjali P.',
        area: 'Pandri',
        rating: 5,
        text: 'Kitchen grease gone completely. Chimney area bhi clean.',
        when: '5 days ago',
        service: 'Kitchen focus',
      },
      {
        id: 'mr2',
        customer: 'Deepak S.',
        area: 'Civil Lines',
        rating: 5,
        text: 'Very detailed work. Cabinets organized perfectly.',
        when: '2 weeks ago',
        service: 'Kitchen focus',
      },
      {
        id: 'mr3',
        customer: 'Kavita L.',
        area: 'Fafadih',
        rating: 4,
        text: 'Professional and quick. Happy with the results.',
        when: '1 month ago',
        service: 'Regular clean',
      },
    ],
  },
  {
    id: 'm_meena',
    name: 'Meena T.',
    rating: 4.86,
    jobs: 743,
    bio: 'Sofa, carpet & upholstery care. Gentle on fabrics, tough on stains.',
    experienceYears: 4,
    languages: ['Hindi', 'Chhattisgarhi'],
    skills: ['Sofa clean', 'Carpet vacuum', 'Fabric care', 'Stain removal'],
    zones: ['Sector 5', 'Shankar Nagar', 'Urla'],
    memberSince: 'Jun 2022',
    onTimeRate: 94,
    repeatRate: 62,
    ratingBreakdown: [
      { stars: 5, pct: 80 },
      { stars: 4, pct: 14 },
      { stars: 3, pct: 4 },
      { stars: 2, pct: 1 },
      { stars: 1, pct: 1 },
    ],
    verified: [
      { icon: 'shield-checkmark', label: 'Background check' },
      { icon: 'id-card', label: 'ID verified' },
    ],
    reviews: [
      {
        id: 'mm1',
        customer: 'Rohit G.',
        area: 'Sector 5',
        rating: 5,
        text: 'Sofa looks brand new. Stains completely removed.',
        when: '6 days ago',
        service: 'Sofa clean',
      },
      {
        id: 'mm2',
        customer: 'Pooja N.',
        area: 'Urla',
        rating: 4,
        text: 'Careful with our fabric sofa. Good communication.',
        when: '2 weeks ago',
        service: 'Sofa clean',
      },
    ],
  },
  {
    id: 'm_anita',
    name: 'Anita Verma',
    rating: 4.89,
    jobs: 867,
    badge: 'Rising star',
    bio: 'Move-in/move-out and deep clean packages. Systematic room-by-room approach.',
    experienceYears: 5,
    languages: ['Hindi', 'English'],
    skills: ['Move-in/out', 'Deep clean', 'Balcony', 'Window wipe'],
    zones: ['Civil Lines', 'Pandri', 'Mowa'],
    memberSince: 'Nov 2021',
    onTimeRate: 95,
    repeatRate: 58,
    ratingBreakdown: [
      { stars: 5, pct: 82 },
      { stars: 4, pct: 13 },
      { stars: 3, pct: 3 },
      { stars: 2, pct: 1 },
      { stars: 1, pct: 1 },
    ],
    verified: [
      { icon: 'shield-checkmark', label: 'Background check' },
      { icon: 'id-card', label: 'ID verified' },
    ],
    reviews: [
      {
        id: 'ma1',
        customer: 'Suresh T.',
        area: 'Mowa',
        rating: 5,
        text: 'Move-in cleaning was flawless. Every corner checked.',
        when: '1 week ago',
        service: 'Move-in clean',
      },
      {
        id: 'ma2',
        customer: 'Divya K.',
        area: 'Civil Lines',
        rating: 5,
        text: 'Balcony and windows spotless. Highly recommend.',
        when: '3 weeks ago',
        service: 'Deep clean',
      },
    ],
  },
  {
    id: 'm_priya_m',
    name: 'Priya Mandal',
    rating: 4.87,
    jobs: 612,
    bio: 'Bathroom & toilet deep sanitization specialist. Quick turnaround for busy households.',
    experienceYears: 4,
    languages: ['Hindi', 'Bengali'],
    skills: ['Bathroom focus', 'Sanitization', 'Tile scrub', 'Regular clean'],
    zones: ['Shankar Nagar', 'Tatibandh', 'Fafadih'],
    memberSince: 'Feb 2022',
    onTimeRate: 93,
    repeatRate: 65,
    ratingBreakdown: [
      { stars: 5, pct: 81 },
      { stars: 4, pct: 12 },
      { stars: 3, pct: 5 },
      { stars: 2, pct: 1 },
      { stars: 1, pct: 1 },
    ],
    verified: [
      { icon: 'shield-checkmark', label: 'Background check' },
      { icon: 'id-card', label: 'ID verified' },
      { icon: 'medkit', label: 'Health screened' },
    ],
    reviews: [
      {
        id: 'mp1',
        customer: 'Arjun B.',
        area: 'Shankar Nagar',
        rating: 5,
        text: 'Bathroom tiles sparkling. Smell fresh for days.',
        when: '4 days ago',
        service: 'Bathroom focus',
      },
      {
        id: 'mp2',
        customer: 'Meera J.',
        area: 'Tatibandh',
        rating: 4,
        text: 'Thorough sanitization. Professional attitude.',
        when: '2 weeks ago',
        service: 'Bathroom focus',
      },
    ],
  },
];

export function listMaidProfiles(): MaidProfileDetail[] {
  return [...MAID_PROFILES];
}

export function getMaidProfileById(id: string): MaidProfileDetail | undefined {
  return MAID_PROFILES.find((m) => m.id === id);
}

export function resolveMaidId(name: string, maidId?: string): string {
  if (maidId) {
    const byId = getMaidProfileById(maidId);
    if (byId) return byId.id;
  }
  const byName = getMaidProfileByName(name);
  if (byName) return byName.id;
  return maidId ?? 'm_unknown';
}

export function getMaidProfileByName(name: string): MaidProfileDetail | undefined {
  const key = name.trim().toLowerCase();
  return MAID_PROFILES.find((m) => m.name.toLowerCase() === key);
}

/** Limited public profile — safe fields only for customer view */
export function resolveMaidProfile(booking: Pick<DemoBooking, 'maidId' | 'maid' | 'maidRating' | 'maidJobs'>): MaidProfileDetail {
  const byId = booking.maidId ? getMaidProfileById(booking.maidId) : undefined;
  const byName = getMaidProfileByName(booking.maid);
  const found = byId ?? byName;

  if (found) {
    return {
      ...found,
      rating: booking.maidRating ?? found.rating,
      jobs: booking.maidJobs ?? found.jobs,
    };
  }

  const rating = booking.maidRating ?? 4.85;
  const jobs = booking.maidJobs ?? 500;

  return {
    id: booking.maidId ?? 'm_unknown',
    name: booking.maid,
    rating,
    jobs,
    badge: 'Verified pro',
    bio: `${booking.maid} is a background-verified QuickMaid professional serving Raipur homes.`,
    experienceYears: 3,
    languages: ['Hindi'],
    skills: ['Home cleaning', 'Deep clean', 'Regular visit'],
    zones: ['Raipur'],
    memberSince: '2023',
    onTimeRate: 95,
    repeatRate: 60,
    ratingBreakdown: [
      { stars: 5, pct: 82 },
      { stars: 4, pct: 12 },
      { stars: 3, pct: 4 },
      { stars: 2, pct: 1 },
      { stars: 1, pct: 1 },
    ],
    verified: [
      { icon: 'shield-checkmark', label: 'Background check' },
      { icon: 'id-card', label: 'ID verified' },
    ],
    reviews: [
      {
        id: 'gen1',
        customer: 'Happy customer',
        area: 'Raipur',
        rating: 5,
        text: 'Professional, punctual and thorough cleaning every visit.',
        when: 'Recently',
        service: 'Home cleaning',
      },
    ],
  };
}
