export type TrackPhase = 'assigned' | 'en_route' | 'nearby' | 'arrived';

export const TRACK_STEPS: { id: TrackPhase; label: string; icon: 'person' | 'bicycle' | 'navigate' | 'home' }[] = [
  { id: 'assigned', label: 'Pro assigned', icon: 'person' },
  { id: 'en_route', label: 'On the way', icon: 'bicycle' },
  { id: 'nearby', label: 'Almost there', icon: 'navigate' },
  { id: 'arrived', label: 'At your home', icon: 'home' },
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
    en_route: 'Pro is on the way',
    nearby: 'Pro is nearby',
    arrived: 'Pro has arrived',
  };
  return map[phase];
}

export function etaLabel(minutes: number): string {
  if (minutes <= 1) return 'Arriving now';
  return `~${minutes} min away`;
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
