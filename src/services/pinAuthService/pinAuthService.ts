import {
  getPinFailedAttempts,
  getPinLockoutUntil,
  setPin,
  setPinFailedAttempts,
  setPinLockoutUntil,
  verifyPin as verifyPinStorage,
} from 'services';

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 30_000;

export type VerifyPinResult =
  | { success: true }
  | { success: false; locked: true; remainingSeconds: number }
  | { success: false; locked: false; attemptsLeft: number };

/**
 * PIN authentication service: create/verify PIN with lockout after 3 failed attempts (30s).
 * Uses secure storage for hash and for persistent lockout state.
 */
export class PinAuthService {
  static async createPin(pin: string): Promise<void> {
    await setPin(pin);
    await this.resetFailedAttempts();
  }

  static async verifyPin(pin: string): Promise<VerifyPinResult> {
    const remaining = await this.getRemainingLockoutSeconds();
    if (remaining > 0) {
      return { success: false, locked: true, remainingSeconds: remaining };
    }

    const valid = await verifyPinStorage(pin);
    if (valid) {
      await this.resetFailedAttempts();
      return { success: true };
    }

    const attempts = await getPinFailedAttempts();
    const newAttempts = Math.min(attempts + 1, MAX_ATTEMPTS);
    await setPinFailedAttempts(newAttempts);

    if (newAttempts >= MAX_ATTEMPTS) {
      const until = Date.now() + LOCKOUT_DURATION_MS;
      await setPinLockoutUntil(until);
      return {
        success: false,
        locked: true,
        remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
      };
    }

    return { success: false, locked: false, attemptsLeft: MAX_ATTEMPTS - newAttempts };
  }

  static async getRemainingLockoutSeconds(): Promise<number> {
    const until = await getPinLockoutUntil();
    if (until == null) return 0;
    const remaining = Math.ceil((until - Date.now()) / 1000);
    if (remaining <= 0) {
      await this.resetFailedAttempts();
      return 0;
    }
    return remaining;
  }

  static async isLocked(): Promise<boolean> {
    return (await this.getRemainingLockoutSeconds()) > 0;
  }

  static async resetFailedAttempts(): Promise<void> {
    await setPinFailedAttempts(0);
    await setPinLockoutUntil(null);
  }

  static get lockoutDurationSeconds(): number {
    return LOCKOUT_DURATION_MS / 1000;
  }

  static get maxAttempts(): number {
    return MAX_ATTEMPTS;
  }
}
