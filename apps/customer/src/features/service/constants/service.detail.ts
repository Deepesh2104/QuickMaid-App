import type { ServiceItem } from '@/constants/services';

export interface ServiceReview {
  id: string;
  name: string;
  area: string;
  rating: number;
  text: string;
  when: string;
}

export const DEMO_SERVICE_REVIEWS: ServiceReview[] = [
  {
    id: 'r1',
    name: 'Priya Sharma',
    area: 'Shankar Nagar',
    rating: 5,
    text: 'Pro arrived on time, every corner was spotless. Will book again for sure.',
    when: '2 days ago',
  },
  {
    id: 'r2',
    name: 'Rahul Verma',
    area: 'Civil Lines',
    rating: 5,
    text: 'Transparent pricing, no hidden charges. Maid was polite and thorough.',
    when: '1 week ago',
  },
  {
    id: 'r3',
    name: 'Anjali Patel',
    area: 'Sector 5',
    rating: 4,
    text: 'Great value for Raipur. Bathroom and kitchen looked brand new.',
    when: '2 weeks ago',
  },
];

export const SERVICE_STEPS = [
  { icon: 'calendar-outline' as const, title: 'Pick slot', sub: 'Choose date & time' },
  { icon: 'person-outline' as const, title: 'Pro assigned', sub: 'Within 30 minutes' },
  { icon: 'navigate-outline' as const, title: 'Live updates', sub: 'Track on visit day' },
  { icon: 'checkmark-done-outline' as const, title: 'Quality check', sub: 'Pay after service' },
];

export function getServiceHighlights(service: ServiceItem) {
  return [
    {
      icon: 'shield-checkmark-outline' as const,
      title: 'Verified pros',
      sub: 'Background-checked & trained',
      tone: '#ECFDF3',
      ink: '#047857',
    },
    {
      icon: 'timer-outline' as const,
      title: service.duration ?? 'Flexible',
      sub: 'Typical visit duration',
      tone: '#EFF6FF',
      ink: '#1D4ED8',
    },
    {
      icon: 'refresh-outline' as const,
      title: 'Free reschedule',
      sub: 'Up to 2 hrs before slot',
      tone: '#FFFBEB',
      ink: '#B45309',
    },
  ];
}

export function getServiceFaqs(service: ServiceItem) {
  return [
    {
      q: `How long does ${service.name} take?`,
      a: `Most visits take ${service.duration ?? '1–3 hours'} depending on home size and add-ons.`,
    },
    {
      q: 'What if I need to reschedule?',
      a: 'Reschedule free up to 2 hours before your slot from the Bookings tab.',
    },
    {
      q: 'Are cleaning products included?',
      a: 'Yes — pros bring eco-friendly supplies. Share allergies in visit instructions.',
    },
    {
      q: 'Can I pay after the service?',
      a: 'UPI, card, wallet, or cash after service — your choice at checkout.',
    },
  ];
}
