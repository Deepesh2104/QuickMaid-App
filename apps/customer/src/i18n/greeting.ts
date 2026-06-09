export type GreetingPeriod = 'morning' | 'afternoon' | 'evening';

export function getGreetingPeriod(): GreetingPeriod {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}
