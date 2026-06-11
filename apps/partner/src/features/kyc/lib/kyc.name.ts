/** Normalize person name for ITD / Aadhaar comparison */
export function normalizePersonName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[.,]/g, ' ')
    .replace(/\s+/g, ' ');
}

/** Fuzzy name match — case/spacing insensitive, partial token overlap allowed */
export function namesMatch(expected: string, fromPan: string): boolean {
  const a = normalizePersonName(expected);
  const b = normalizePersonName(fromPan);
  if (!a || !b) return false;
  if (a === b) return true;

  const tokensA = a.split(' ').filter((t) => t.length > 1);
  const tokensB = b.split(' ').filter((t) => t.length > 1);
  if (tokensA.length === 0 || tokensB.length === 0) return false;

  const [shorter, longer] =
    tokensA.length <= tokensB.length ? [tokensA, tokensB] : [tokensB, tokensA];
  return shorter.every((token) => longer.some((l) => l === token || l.startsWith(token)));
}
