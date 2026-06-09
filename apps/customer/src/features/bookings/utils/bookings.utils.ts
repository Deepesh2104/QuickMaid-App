import type { DemoBooking } from '@/constants/demo';
import { HOME_SERVICES } from '@/constants/services';

import type { BookingFilter } from '../components/BookingsFilterRail';

const SERVICE_IMAGE_MAP: Record<string, string> = {
  'Deep clean': 'deep',
  'Regular clean': 'regular',
  'Kitchen focus': 'kitchen',
  'Bathroom deep': 'bathroom',
  'Deep Cleaning': 'deep',
  'Regular Cleaning': 'regular',
  'Kitchen Cleaning': 'kitchen',
  'Bathroom Cleaning': 'bathroom',
};

const PRO_SPECIALTY_MAP: Record<string, string> = {
  'Deep clean': 'deep',
  Regular: 'regular',
  Kitchen: 'kitchen',
  Bathroom: 'bathroom',
};

export function getBookingImageId(service: string): string {
  return resolveServiceIdFromName(service) ?? 'regular';
}

export function resolveServiceIdFromName(name: string): string | undefined {
  if (SERVICE_IMAGE_MAP[name]) return SERVICE_IMAGE_MAP[name];

  const lower = name.toLowerCase();
  const exact = HOME_SERVICES.find((s) => s.name.toLowerCase() === lower);
  if (exact) return exact.id;

  const partial = HOME_SERVICES.find(
    (s) => lower.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(lower),
  );
  return partial?.id;
}

export function resolveServiceIdFromSpecialty(specialty: string): string | undefined {
  return PRO_SPECIALTY_MAP[specialty] ?? resolveServiceIdFromName(specialty);
}

const STATUS_ORDER: Record<DemoBooking['status'], number> = {
  upcoming: 0,
  completed: 1,
  cancelled: 2,
};

export function sortBookings(bookings: DemoBooking[]): DemoBooking[] {
  return [...bookings].sort((a, b) => {
    const byStatus = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    if (byStatus !== 0) return byStatus;
    return b.id.localeCompare(a.id);
  });
}

export function filterBookings(bookings: DemoBooking[], filter: BookingFilter): DemoBooking[] {
  const sorted = sortBookings(bookings);
  if (filter === 'all') return sorted;
  return sorted.filter((b) => b.status === filter);
}

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
