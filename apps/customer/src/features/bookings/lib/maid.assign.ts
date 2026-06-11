import { DEMO_OTP } from '@/constants/app';

export interface MaidProfile {
  id: string;
  name: string;
  rating: number;
  jobs: number;
  badge?: string;
}

export interface MaidAssignment {
  maidId: string;
  maidName: string;
  maidRating: number;
  maidJobs: number;
  completionOtp: string;
  assignedAt: string;
}

const MAID_POOL: MaidProfile[] = [
  { id: 'm_sunita', name: 'Sunita Devi', rating: 4.92, jobs: 1284, badge: 'Top pro' },
  { id: 'm_kamla', name: 'Kamla Bai', rating: 4.88, jobs: 956, badge: '5★ specialist' },
  { id: 'm_rekha', name: 'Rekha Sahu', rating: 4.91, jobs: 1102 },
  { id: 'm_meena', name: 'Meena T.', rating: 4.86, jobs: 743 },
  { id: 'm_anita', name: 'Anita Verma', rating: 4.89, jobs: 867 },
  { id: 'm_priya_m', name: 'Priya Mandal', rating: 4.87, jobs: 612 },
];

export function generateCompletionOtp(): string {
  return DEMO_OTP;
}

/** Auto-assign best available pro + 6-digit visit completion OTP */
export function autoAssignMaid(favoriteMaidName?: string): MaidAssignment {
  const favorite = favoriteMaidName
    ? MAID_POOL.find((m) => m.name.toLowerCase() === favoriteMaidName.toLowerCase())
    : undefined;

  const sorted = [...MAID_POOL].sort((a, b) => b.rating - a.rating || b.jobs - a.jobs);
  const maid = favorite ?? sorted[0];

  return {
    maidId: maid.id,
    maidName: maid.name,
    maidRating: maid.rating,
    maidJobs: maid.jobs,
    completionOtp: generateCompletionOtp(),
    assignedAt: new Date().toISOString(),
  };
}

export function formatOtpDigits(otp: string): string[] {
  const clean = otp.replace(/\D/g, '').slice(0, 6).padStart(6, '0');
  return clean.split('');
}
