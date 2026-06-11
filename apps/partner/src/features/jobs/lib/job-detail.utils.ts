import type { PartnerJob, JobStatus } from '@/constants/demo';
import { netEarningPaise } from '@/features/home/lib/home.greeting';
import { responseMinutesLeft } from '@/features/jobs/lib/requests.utils';

export function serviceIcon(service: string): 'sparkles' | 'restaurant-outline' | 'home-outline' {
  if (service.toLowerCase().includes('deep')) return 'sparkles';
  if (service.toLowerCase().includes('kitchen') || service.toLowerCase().includes('cook')) return 'restaurant-outline';
  return 'home-outline';
}

export function jobStatusMeta(status: JobStatus) {
  const map = {
    pending: {
      label: 'Awaiting response',
      icon: 'flash' as const,
      tone: '#FFFBEB',
      ink: '#B54708',
      accent: '#D97706',
    },
    accepted: {
      label: 'Confirmed',
      icon: 'checkmark-circle' as const,
      tone: '#E6F4F2',
      ink: '#084F4A',
      accent: '#0B6E67',
    },
    in_progress: {
      label: 'In progress',
      icon: 'play-circle' as const,
      tone: '#EEF6FF',
      ink: '#175CD3',
      accent: '#1570EF',
    },
    completed: {
      label: 'Completed',
      icon: 'ribbon' as const,
      tone: '#ECFDF3',
      ink: '#027A48',
      accent: '#039855',
    },
    declined: {
      label: 'Declined',
      icon: 'close-circle' as const,
      tone: '#F4F6F8',
      ink: '#667085',
      accent: '#98A2B3',
    },
  };
  return map[status];
}

export function jobEarningsBreakdown(job: PartnerJob) {
  const gross = job.amountPaise;
  const net = netEarningPaise(gross);
  const fee = gross - net;
  return { gross, net, fee };
}

export function jobDisplayAddress(job: PartnerJob) {
  const locationParts = [job.zone, 'Raipur', 'Chhattisgarh'];
  const locationLine = locationParts.join(', ');
  const pinLine = job.pincode ? `PIN ${job.pincode}` : null;

  return {
    primary: job.landmark ? `${job.address}\nNear ${job.landmark}` : job.address,
    secondary: pinLine ? `${locationLine} · ${pinLine}` : locationLine,
  };
}

export function jobMapsQuery(job: PartnerJob) {
  const parts = [job.address, job.zone, 'Raipur', 'Chhattisgarh', job.pincode].filter(Boolean);
  return encodeURIComponent(parts.join(', '));
}

export function jobResponseWindow(job: PartnerJob) {
  if (job.status !== 'pending') return null;
  return responseMinutesLeft(job.id);
}

export function jobDurationLabel(service: string) {
  const match = service.match(/·\s*([\d.]+h)/i);
  return match?.[1]?.trim() ?? null;
}

export function jobTravelMins(distanceKm?: number) {
  if (distanceKm == null) return null;
  return Math.max(5, Math.round(distanceKm * 3.5));
}

export function jobNextSteps(status: JobStatus) {
  const map = {
    accepted: [
      { icon: 'calendar-outline' as const, text: 'Schedule tab par confirmed visit dikhegi' },
      { icon: 'navigate-outline' as const, text: 'Open Maps — reach the address 10 min early' },
      { icon: 'play-circle-outline' as const, text: 'Pahunch kar Start visit dabao — auto-start nahi hota' },
      { icon: 'wallet-outline' as const, text: 'OTP verify ke baad earning Monday payout mein' },
    ],
    in_progress: [
      { icon: 'key-outline' as const, text: 'Tap Finish visit — customer se 6-digit OTP lein' },
      { icon: 'checkmark-done-outline' as const, text: 'OTP verify hone par visit complete mark hoga' },
      { icon: 'wallet-outline' as const, text: 'Earning next Monday payout mein add hogi' },
    ],
    completed: [
      { icon: 'ribbon-outline' as const, text: 'Visit completed — great work!' },
      { icon: 'wallet-outline' as const, text: 'Amount added to your next Monday payout' },
      { icon: 'star-outline' as const, text: 'Customer rating may update your priority score' },
    ],
    pending: [],
    declined: [],
  };
  return map[status];
}

export const JOB_ASSURANCE = [
  {
    icon: 'shield-checkmark-outline' as const,
    title: 'Secure payout',
    sub: '10% platform fee · credited next Monday',
    topic: null,
  },
  {
    icon: 'headset-outline' as const,
    title: 'Partner support',
    sub: 'Chat with ops for job or payout help',
    topic: 'job' as const,
  },
  {
    icon: 'star-outline' as const,
    title: 'Priority rating',
    sub: 'On-time Start visit & completion boost priority',
    topic: null,
  },
];
