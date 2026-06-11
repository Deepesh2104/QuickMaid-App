export function partnerGreeting(firstName?: string): string {
  const h = new Date().getHours();
  const base = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  return firstName ? `${base}, ${firstName}` : base;
}

export function formatRs(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

export function netEarningPaise(grossPaise: number): number {
  return Math.round(grossPaise * 0.9);
}
