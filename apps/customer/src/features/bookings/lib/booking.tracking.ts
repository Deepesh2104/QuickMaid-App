export type TrackPhase = 'assigned' | 'en_route' | 'nearby' | 'arrived';

export const TRACK_STEPS: {
  id: TrackPhase;
  label: string;
  shortLabel: string;
  icon: 'person' | 'bicycle' | 'navigate' | 'home';
}[] = [
  { id: 'assigned', label: 'Pro assigned', shortLabel: 'Assigned', icon: 'person' },
  { id: 'en_route', label: 'On the way', shortLabel: 'En route', icon: 'bicycle' },
  { id: 'nearby', label: 'Almost there', shortLabel: 'Nearby', icon: 'navigate' },
  { id: 'arrived', label: 'At your home', shortLabel: 'Arrived', icon: 'home' },
];

export function phaseFromProgress(progress: number): TrackPhase {
  if (progress >= 0.92) return 'arrived';
  if (progress >= 0.72) return 'nearby';
  if (progress >= 0.18) return 'en_route';
  return 'assigned';
}

export function phaseLabel(phase: TrackPhase): string {
  const map: Record<TrackPhase, string> = {
    assigned: 'Pro is getting ready',
    en_route: 'Pro is on the way to you',
    nearby: 'Pro is almost at your door',
    arrived: 'Pro has arrived at your home',
  };
  return map[phase];
}

/** Swiggy / Zomato style status line */
export function partnerStatusLine(maid: string, phase: TrackPhase): string {
  const first = maid.split(' ')[0];
  const map: Record<TrackPhase, string> = {
    assigned: `${first} is getting ready for your visit`,
    en_route: `${first} is on the way to your home`,
    nearby: `${first} is nearby — almost at your door`,
    arrived: `${first} has arrived at your home`,
  };
  return map[phase];
}

export function etaMinutesLabel(minutes: number): string {
  if (minutes <= 1) return 'Arriving now';
  return `${minutes}`;
}

export function etaMinutesUnit(minutes: number): string {
  if (minutes <= 1) return '';
  return minutes === 1 ? 'minute' : 'minutes';
}

export function phaseSubtitle(phase: TrackPhase): string {
  const map: Record<TrackPhase, string> = {
    assigned: 'Background verified · Route preparing',
    en_route: 'Live GPS active · Secure trip in progress',
    nearby: 'Get OTP ready · Pro will ring shortly',
    arrived: 'Share OTP only when work is complete',
  };
  return map[phase];
}

export function etaLabel(minutes: number): string {
  if (minutes <= 1) return 'Arriving now';
  return `~${minutes} min`;
}

export function etaHeadline(minutes: number): string {
  if (minutes <= 1) return 'Arriving now';
  return `${minutes} min`;
}

export function distanceRemaining(progress: number): string {
  const km = Math.max(0.2, (1 - progress) * 4.2);
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

export function tripProgressPercent(progress: number): number {
  return Math.round(progress * 100);
}

/** Demo start offset so different bookings feel slightly different */
export function initialTrackState(bookingId: string): { progress: number; etaMin: number } {
  const seed = bookingId.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const progress = 0.28 + (seed % 25) / 100;
  const etaMin = 8 + (seed % 9);
  return { progress, etaMin };
}

export function proMapPosition(progress: number): { x: number; y: number } {
  const x = 14 + progress * 58;
  const y = 78 - progress * 46;
  return { x, y };
}
