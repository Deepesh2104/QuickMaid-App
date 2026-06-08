export const REVIEW_TAGS = [
  { id: 'punctual', label: 'Punctual', icon: 'time-outline' as const },
  { id: 'thorough', label: 'Thorough clean', icon: 'sparkles-outline' as const },
  { id: 'friendly', label: 'Friendly', icon: 'happy-outline' as const },
  { id: 'professional', label: 'Professional', icon: 'shield-checkmark-outline' as const },
  { id: 'rebook', label: 'Would book again', icon: 'refresh-outline' as const },
  { id: 'detail', label: 'Attention to detail', icon: 'search-outline' as const },
] as const;

export type ReviewTagId = (typeof REVIEW_TAGS)[number]['id'];

export interface BookingReviewInput {
  rating: number;
  text?: string;
  tags: string[];
}

export function ratingLabel(rating: number): string {
  const map: Record<number, string> = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Great',
    5: 'Excellent',
  };
  return map[rating] ?? 'Rate your visit';
}

export function canSubmitReview(rating: number): boolean {
  return rating >= 1 && rating <= 5;
}
