jest.mock('expo-crypto', () => ({
  digestStringAsync: jest.fn(async (_algo: string, data: string) => data),
  CryptoDigestAlgorithm: { SHA256: 'SHA256' },
}));

import { isValidPin } from '../appLock.utils';

describe('appLock.utils', () => {
  it('accepts 4-digit PIN', () => {
    expect(isValidPin('1234')).toBe(true);
  });

  it('rejects non-numeric PIN', () => {
    expect(isValidPin('12a4')).toBe(false);
  });

  it('rejects short PIN', () => {
    expect(isValidPin('123')).toBe(false);
  });
});
