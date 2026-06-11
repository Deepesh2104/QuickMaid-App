export const RATING_OVERVIEW = {
  score: 4.9,
  totalReviews: 128,
  onTimeRate: 98,
  repeatCustomers: 76,
  fiveStarPercent: 94,
} as const;

export const RATING_BREAKDOWN = [
  { stars: 5, percent: 94, count: 120 },
  { stars: 4, percent: 4, count: 5 },
  { stars: 3, percent: 1, count: 2 },
  { stars: 2, percent: 1, count: 1 },
  { stars: 1, percent: 0, count: 0 },
] as const;

export const RATING_BADGES = [
  { icon: 'flash-outline' as const, label: 'Fast accept', sub: 'Avg 4 min response' },
  { icon: 'time-outline' as const, label: 'On-time pro', sub: '98% punctuality' },
  { icon: 'heart-outline' as const, label: 'Customer favourite', sub: '76% repeat bookings' },
  { icon: 'shield-checkmark-outline' as const, label: 'Verified partner', sub: 'KYC + selfie on file' },
] as const;

export const RATING_RECENT_REVIEWS = [
  {
    id: 'rv-1',
    customer: 'Priya S.',
    stars: 5,
    date: '3 Jun',
    text: 'Bahut achha kaam — time par aayi aur ghar bilkul saaf kar diya.',
    service: 'Deep clean',
  },
  {
    id: 'rv-2',
    customer: 'Rahul M.',
    stars: 5,
    date: '1 Jun',
    text: 'Professional and polite. Kitchen spotless after visit.',
    service: 'Regular clean',
  },
  {
    id: 'rv-3',
    customer: 'Anita K.',
    stars: 4,
    date: '28 May',
    text: 'Good job overall. Thoda late aayi but quality excellent.',
    service: 'Kitchen focus',
  },
] as const;
