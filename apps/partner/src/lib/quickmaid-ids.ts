/** Booking ref: QM- + last 7 digits of timestamp (e.g. QM-4567890). */
export function generateBookingRef(): string {
  const digits = String(Date.now() % 10_000_000).padStart(7, '0');
  return `QM-${digits}`;
}

export function isValidBookingRef(ref: string): boolean {
  return /^QM-\d{7}$/.test(ref.trim()) || /^QM-7\d{7}$/.test(ref.trim());
}

/** Parse DD/MM/YYYY or DD-MM-YYYY → DDMMYY */
export function dobToCompact(dob: string): string | null {
  const match = dob.trim().match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1940 || year > 2010) return null;
  const yy = String(year % 100).padStart(2, '0');
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${dd}${mm}${yy}`;
}

export function validateDateOfBirth(dob: string): string | null {
  const compact = dobToCompact(dob);
  if (!compact) return 'Enter DOB as DD/MM/YYYY';
  const match = dob.trim().match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/);
  if (!match) return 'Enter DOB as DD/MM/YYYY';
  const birth = new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
  const ageMs = Date.now() - birth.getTime();
  const ageYears = ageMs / (365.25 * 24 * 60 * 60 * 1000);
  if (ageYears < 18) return 'You must be at least 18 years old';
  if (ageYears > 70) return 'Please contact support for registration';
  return null;
}

/** Maid ID: MD-{7-digit timestamp} e.g. MD-4829163 */
export function isValidMaidId(publicId: string): boolean {
  return /^MD-\d{7}$/.test(publicId.trim());
}

/** Pre-2026 demo format — migrate on next profile normalize */
export function isLegacyShortMaidId(publicId: string): boolean {
  return /^MD-\d{6}$/.test(publicId.trim());
}

/** Old format: MD-SV-150390-2501061200 */
export function isLegacyMaidId(publicId: string): boolean {
  return /^MD-[A-Z]{2}-\d{6}-\d{10}$/.test(publicId.trim());
}

let maidIdSequence = 0;

function maidTimestampDigits(at: Date, bump = 0): string {
  const raw = (at.getTime() + bump) % 10_000_000;
  return String(raw).padStart(7, '0');
}

/**
 * Maid ID: MD-{7-digit timestamp} — unique per registration moment.
 * Example: MD-4829163
 */
export function generateMaidId(
  _firstName?: string,
  _lastName?: string,
  _dateOfBirth?: string,
  at: Date = new Date(),
): string {
  maidIdSequence = (maidIdSequence + 1) % 1000;
  return `MD-${maidTimestampDigits(at, maidIdSequence)}`;
}

export function fullNameFromParts(firstName: string, lastName: string): string {
  return `${firstName.trim()} ${lastName.trim()}`.trim();
}

/** DDMMYY → DD/MM/YYYY (19xx if yy ≥ 40, else 20xx) */
export function compactToDobDisplay(compact: string): string | null {
  if (!/^\d{6}$/.test(compact)) return null;
  const dd = compact.slice(0, 2);
  const mm = compact.slice(2, 4);
  const yy = Number(compact.slice(4, 6));
  const day = Number(dd);
  const month = Number(mm);
  const year = yy >= 40 ? 1900 + yy : 2000 + yy;
  if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1940 || year > 2010) return null;
  return `${dd}/${mm}/${year}`;
}

/** Legacy IDs only — new format stores DOB on profile, not in Maid ID */
export function dobFromMaidId(publicId?: string): string | null {
  if (!publicId) return null;
  const match = publicId.trim().match(/^MD-[A-Z]{2}-(\d{6})-\d{10}$/);
  if (!match) return null;
  return compactToDobDisplay(match[1]);
}

export function resolveDateOfBirth(dateOfBirth?: string, publicId?: string): string | null {
  const direct = dateOfBirth?.trim();
  if (direct) return direct;
  return dobFromMaidId(publicId);
}

/** Keep existing Maid ID once assigned; only generate when missing or invalid */
export function syncMaidId(
  publicId: string | undefined,
  _firstName: string,
  _lastName: string,
  _dateOfBirth: string,
): string {
  const trimmed = publicId?.trim();
  if (trimmed && isValidMaidId(trimmed)) return trimmed;
  if (trimmed && !isLegacyMaidId(trimmed) && /^MD-/.test(trimmed)) return trimmed;
  return generateMaidId();
}
