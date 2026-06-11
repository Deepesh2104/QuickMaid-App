export function normalizePan(input: string): string {

  return input.replace(/\s/g, '').toUpperCase().slice(0, 10);

}



export function isValidPan(pan: string): boolean {

  return /^[A-Z]{5}\d{4}[A-Z]$/.test(normalizePan(pan));

}



export function normalizeIfsc(input: string): string {

  return input.replace(/\s/g, '').toUpperCase().slice(0, 11);

}



export function isValidIfsc(ifsc: string): boolean {

  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(normalizeIfsc(ifsc));

}



export function normalizeAccountNumber(input: string): string {

  return input.replace(/\D/g, '').slice(0, 18);

}



export function isValidAccountNumber(account: string): boolean {

  const digits = normalizeAccountNumber(account);

  return digits.length >= 9 && digits.length <= 18;

}



export function isValidUpi(upi: string): boolean {

  const trimmed = upi.trim();

  return trimmed.includes('@') && trimmed.length >= 5;

}



export function normalizeAadhaar(input: string): string {

  return input.replace(/\D/g, '').slice(0, 12);

}



export function formatAadhaarDisplay(input: string): string {

  const digits = normalizeAadhaar(input);

  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();

}



export function isValidAadhaar(aadhaar: string): boolean {

  const digits = normalizeAadhaar(aadhaar);

  if (digits.length !== 12) return false;

  if (!/^[2-9]/.test(digits)) return false;

  if (/^(\d)\1{11}$/.test(digits)) return false;

  return true;

}



export function maskAadhaar(aadhaar: string): string {

  const digits = normalizeAadhaar(aadhaar);

  if (digits.length < 4) return '—';

  return `XXXX XXXX ${digits.slice(-4)}`;

}



export function maskPan(pan: string): string {

  const p = normalizePan(pan);

  if (p.length < 10) return '—';

  return `${p.slice(0, 2)}•••••${p.slice(7)}`;

}



export function maskAccount(account: string): string {

  const digits = normalizeAccountNumber(account);

  if (digits.length < 4) return '—';

  return `•••• ${digits.slice(-4)}`;

}


