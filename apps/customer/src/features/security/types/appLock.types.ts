export interface AppLockSettings {
  enabled: boolean;
  pinHash?: string;
  biometricEnabled: boolean;
}

export const DEFAULT_APP_LOCK_SETTINGS: AppLockSettings = {
  enabled: false,
  biometricEnabled: false,
};
