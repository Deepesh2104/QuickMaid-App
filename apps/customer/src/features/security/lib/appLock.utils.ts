const PIN_LENGTH = 4;

export function isValidPin(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}

/** Demo hash — UI-only; replace with secure hashing in production. */
export function hashPin(pin: string): string {
  let h = 5381;
  for (let i = 0; i < pin.length; i++) {
    h = (h * 33) ^ pin.charCodeAt(i);
  }
  return `qm_${Math.abs(h)}_${pin.length}`;
}

export function verifyPin(pin: string, pinHash?: string): boolean {
  if (!pinHash || !isValidPin(pin)) return false;
  return hashPin(pin) === pinHash;
}

export function biometricLabel(types: number[]): string {
  if (types.includes(2)) return 'Face ID';
  if (types.includes(1)) return 'Fingerprint';
  return 'Biometric';
}

export { PIN_LENGTH };
