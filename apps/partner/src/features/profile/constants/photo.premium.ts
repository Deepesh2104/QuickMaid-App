export const PHOTO_STATS = [
  { value: '4.9★', label: 'Trust boost' },
  { value: '98%', label: 'On-time' },
  { value: 'Verified', label: 'Badge' },
] as const;

export const PHOTO_GUIDELINES = [
  {
    icon: 'sunny-outline' as const,
    title: 'Good lighting',
    sub: 'Natural light ya bright room — face clear dikhe',
  },
  {
    icon: 'scan-outline' as const,
    title: 'Face centre',
    sub: 'Saree dupatta hatao, sirf aap dikho — no group photo',
  },
  {
    icon: 'shield-checkmark-outline' as const,
    title: 'Verified badge',
    sub: 'Photo save hone par profile par green tick dikhega',
  },
] as const;
