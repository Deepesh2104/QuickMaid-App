import * as Crypto from 'expo-crypto';

const PIN_LENGTH = 4;
const PBKDF2_ROUNDS = 12_000;
const HASH_PREFIX = 'pbkdf2_v1_';

function legacyHashPin(pin: string): string {
  let h = 5381;
  for (let i = 0; i < pin.length; i++) {
    h = (h * 33) ^ pin.charCodeAt(i);
  }
  return `qm_${Math.abs(h)}_${pin.length}`;
}

export function isValidPin(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}

/** PBKDF2-style iterative SHA-256 — stored in SecureStore, not AsyncStorage. */
export async function hashPin(pin: string): Promise<string> {
  const salt = 'quickmaid_app_lock_v1';
  let derived = `${salt}:${pin}`;
  for (let i = 0; i < PBKDF2_ROUNDS; i++) {
    derived = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, derived);
  }
  return `${HASH_PREFIX}${derived.slice(0, 40)}`;
}

export async function verifyPin(pin: string, pinHash?: string): Promise<boolean> {
  if (!pinHash || !isValidPin(pin)) return false;
  if (pinHash.startsWith(HASH_PREFIX)) {
    return (await hashPin(pin)) === pinHash;
  }
  return legacyHashPin(pin) === pinHash;
}

export function biometricLabel(types: number[]): string {
  if (types.includes(2)) return 'Face ID';
  if (types.includes(1)) return 'Fingerprint';
  return 'Biometric';
}

export { PIN_LENGTH };
