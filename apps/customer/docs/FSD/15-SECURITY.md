# FSD 15 — App Lock (PIN & Biometrics)

**Status:** `UI-DEMO`  
**Domain:** `src/features/security/`  
**Routes:** `app/account/app-lock`, root `AppLockGate` in `_layout`

## Overview

Optional device-level app lock: 4-digit PIN (hashed locally), biometric unlock (Face ID / fingerprint), auto-lock on background. Settings screen under account; gate wraps authenticated app tree.

### User stories

| ID | Story |
|----|-------|
| SEC-1 | Customer enables app lock with PIN |
| SEC-2 | Customer unlocks with PIN or biometrics |
| SEC-3 | Customer changes or disables PIN |
| SEC-4 | App locks when returning from background |
| SEC-5 | Account delete clears lock settings |

## Route & component map

| Route | File | Screen |
|-------|------|--------|
| `/account/app-lock` | `account/app-lock.tsx` | `AppLockSettingsScreen` |

### Key components (global)

| Component | File |
|-----------|------|
| `AppLockSettingsScreen` | `security/components/AppLockSettingsScreen.tsx` |
| `AppLockGate` | `security/components/AppLockGate.tsx` |
| `AppLockOverlay` | `security/components/AppLockOverlay.tsx` |
| `PinKeypad` | `security/components/PinKeypad.tsx` |
| `ProfileSecuritySection` | `profile/components/ProfileSecuritySection.tsx` |

### Lib

| Module | File | Role |
|--------|------|------|
| `appLock.storage` | `lib/appLock.storage.ts` | `@qm/app_lock_settings` |
| `appLock.utils` | `lib/appLock.utils.ts` | `hashPin`, `verifyPin`, `biometricLabel` |
| `appLock.types` | `types/appLock.types.ts` | `AppLockSettings` defaults |

Wired in `app/_layout.tsx` via `AppLockGate` wrapping navigation.

## Data model

| Entity | Storage key | Fields |
|--------|-------------|--------|
| App lock settings | `@qm/app_lock_settings` | `enabled`, `pinHash`, `biometricEnabled`, `lockOnBackground` |

**Not synced to server** — device-only security. Cleared by `deleteUserAccount` (`account.delete.ts`).

## Current demo behaviour

| Function | File | Behaviour |
|----------|------|-----------|
| `getAppLockSettings` | `appLock.storage.ts` | Merge with defaults |
| `saveAppLockSettings` | `appLock.storage.ts` | Persist + notify subscribers |
| `hashPin` / `verifyPin` | `appLock.utils.ts` | Simple local hash (demo) |
| `AppLockSettingsScreen` | Create PIN | Two-step confirm flow |
| `AppLockGate` | AppState background | Shows overlay if enabled |
| `LocalAuthentication` | settings | `expo-local-authentication` for bio |

PIN never stored plaintext — only `pinHash`.

## Phase 4 API

No customer API endpoints. Optional future: enterprise MDM policies only.

Device APIs: `expo-local-authentication`, `AppState`.

## API call site matrix

| Component | User action | Today | Phase 4 |
|-----------|-------------|-------|---------|
| `AppLockSettingsScreen` | Enable lock | `saveAppLockSettings` | Local only |
| `AppLockSettingsScreen` | Biometric toggle | `LocalAuthentication` + save | Device API |
| `AppLockSettingsScreen` | Change PIN | Multi-step `PinKeypad` | Local only |
| `AppLockGate` | Foreground | `verifyPin` / biometric | Local only |
| `AppLockOverlay` | Wrong PIN | Shake + error | — |
| `ProfileSecuritySection` | Navigate | → `/account/app-lock` | — |
| `deleteUserAccount` | Delete | `clearAppLockSettings` via multiRemove | — |

## Errors & edge cases

| Case | Demo | Handling |
|------|------|----------|
| PIN mismatch on confirm | Inline error | Re-enter |
| Biometric not enrolled | Toggle disabled | Alert |
| Forgot PIN | Disable via verify old PIN | Future: account re-auth |
| 5 failed attempts | No lockout (demo) | Consider cooldown |
| Android back on overlay | Consumed | Prevent bypass |

## Migration checklist

- [ ] Use `expo-secure-store` for `pinHash` instead of AsyncStorage  
- [ ] Stronger KDF (PBKDF2) before production  
- [ ] Optional “Forgot PIN” → OTP re-auth flow  
- [ ] Audit `AppLockGate` placement after auth refactor  
- [ ] Document that lock is not server-recoverable  
