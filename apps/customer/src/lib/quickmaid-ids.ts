/** Customer public ID: CU- + last 7 digits of registration timestamp. */
export function generateCustomerId(at: Date = new Date()): string {
  const digits = String(at.getTime() % 10_000_000).padStart(7, '0');
  return `CU-${digits}`;
}

export function isValidCustomerId(publicId: string): boolean {
  return /^CU-\d{7}$/.test(publicId.trim());
}

/** Keep existing ID once assigned; generate when missing or invalid. */
export function syncCustomerPublicId(publicId?: string, at: Date = new Date()): string {
  const trimmed = publicId?.trim();
  if (trimmed && isValidCustomerId(trimmed)) return trimmed;
  return generateCustomerId(at);
}
