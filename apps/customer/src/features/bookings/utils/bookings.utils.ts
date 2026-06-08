import { HOME_SERVICES } from '@/constants/services';

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

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
