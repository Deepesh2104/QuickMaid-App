/** Canonical partner referral code: QM-{id} (single hyphen) */
export function normalizeReferralCode(raw: string): string {
  const cleaned = raw.trim().toUpperCase().replace(/\s+/g, '');
  if (!cleaned) return '';

  const compact = cleaned.replace(/-/g, '');
  let idPart = compact;

  if (compact.startsWith('QM') || compact.startsWith('MD')) {
    idPart = compact.slice(2);
  }

  idPart = idPart.replace(/\D/g, '');
  if (!idPart) return cleaned.replace(/-+/g, '-');

  return `QM-${idPart}`;
}
