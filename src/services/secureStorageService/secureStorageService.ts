import { Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';
import * as bcrypt from 'bcryptjs';

import { initBcryptRandomFallback } from 'utils';

import {
  KEYCHAIN_SERVICE_BIOMETRIC_ENABLED,
  KEYCHAIN_SERVICE_PIN_FAILED_ATTEMPTS,
  KEYCHAIN_SERVICE_PIN_HASH,
  KEYCHAIN_SERVICE_PIN_LOCKOUT_UNTIL,
  KEYCHAIN_SERVICE_REALM_KEY,
  REALM_ENCRYPTION_KEY_LENGTH,
} from 'constants';

initBcryptRandomFallback();

const KEYCHAIN_USERNAME = 'fintrack';

/** Options for Keychain writes so reads do not require per-use auth (avoids UserNotAuthenticatedException on Android). */
function keychainSetOptions(service: string): Parameters<typeof Keychain.setGenericPassword>[2] {
  return {
    service,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    ...(Platform.OS === 'android' && {
      storage: Keychain.STORAGE_TYPE.AES_GCM_NO_AUTH,
    }),
  };
}

/** Salt rounds for bcrypt (balance between security and performance). */
const BCRYPT_ROUNDS = 10;

/**
 * Secure storage service: PIN hash and Realm encryption key in Keychain (iOS) / Keystore (Android).
 * - PIN: never stored in plaintext; only bcrypt hash is persisted. Never log or persist PIN.
 * - Realm key: 64 bytes, generated once and stored in secure storage. Never log or persist the key.
 */
export class SecureStorageService {
  // --- PIN ---

  static async getPinHash(): Promise<string | null> {
    try {
      const result = await Keychain.getGenericPassword({
        service: KEYCHAIN_SERVICE_PIN_HASH,
      });
      if (result && result.password) {
        return result.password;
      }
      return null;
    } catch {
      return null;
    }
  }

  static async setPinHash(hash: string): Promise<void> {
    try {
      await Keychain.setGenericPassword(
        KEYCHAIN_USERNAME,
        hash,
        keychainSetOptions(KEYCHAIN_SERVICE_PIN_HASH),
      );
    } catch {
      // Fail silently; caller can retry
    }
  }

  static hashPin(pin: string): string {
    return bcrypt.hashSync(pin, BCRYPT_ROUNDS);
  }

  static async verifyPin(pin: string): Promise<boolean> {
    const storedHash = await this.getPinHash();
    if (!storedHash) return false;
    return bcrypt.compareSync(pin, storedHash);
  }

  static async setPin(pin: string): Promise<void> {
    const hash = this.hashPin(pin);
    await this.setPinHash(hash);
  }

  static async hasPin(): Promise<boolean> {
    const hash = await this.getPinHash();
    return hash !== null && hash.length > 0;
  }

  static async clearPinHash(): Promise<void> {
    try {
      await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE_PIN_HASH });
    } catch {
      // Ignore
    }
  }

  /** PIN lockout: failed attempts count (0–3). Persisted for 3-strikes logic. */
  static async getPinFailedAttempts(): Promise<number> {
    try {
      const result = await Keychain.getGenericPassword({
        service: KEYCHAIN_SERVICE_PIN_FAILED_ATTEMPTS,
      });
      if (result !== false && result?.password != null) {
        const n = Number.parseInt(result.password, 10);
        if (Number.isInteger(n) && n >= 0) return Math.min(n, 3);
      }
      return 0;
    } catch {
      return 0;
    }
  }

  static async setPinFailedAttempts(count: number): Promise<void> {
    try {
      await Keychain.setGenericPassword(
        KEYCHAIN_USERNAME,
        String(count),
        keychainSetOptions(KEYCHAIN_SERVICE_PIN_FAILED_ATTEMPTS),
      );
    } catch {
      // Ignore
    }
  }

  /** PIN lockout: timestamp (ms) until which PIN entry is disabled. */
  static async getPinLockoutUntil(): Promise<number | null> {
    try {
      const result = await Keychain.getGenericPassword({
        service: KEYCHAIN_SERVICE_PIN_LOCKOUT_UNTIL,
      });
      if (result !== false && result?.password != null) {
        const ts = Number.parseInt(result.password, 10);
        if (Number.isInteger(ts)) return ts;
      }
      return null;
    } catch {
      return null;
    }
  }

  static async setPinLockoutUntil(timestampMs: number | null): Promise<void> {
    try {
      if (timestampMs == null) {
        await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE_PIN_LOCKOUT_UNTIL });
      } else {
        await Keychain.setGenericPassword(
          KEYCHAIN_USERNAME,
          String(timestampMs),
          keychainSetOptions(KEYCHAIN_SERVICE_PIN_LOCKOUT_UNTIL),
        );
      }
    } catch {
      // Ignore
    }
  }

  // --- Realm encryption key ---

  private static hexToArrayBuffer(hex: string): ArrayBuffer {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    return bytes.buffer;
  }

  private static arrayBufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  static async getRealmEncryptionKey(): Promise<ArrayBuffer | null> {
    try {
      const result = await Keychain.getGenericPassword({
        service: KEYCHAIN_SERVICE_REALM_KEY,
      });
      if (!result) return null;
      const { password } = result;
      if (!password || password.length !== REALM_ENCRYPTION_KEY_LENGTH * 2) {
        return null;
      }
      return this.hexToArrayBuffer(password);
    } catch {
      return null;
    }
  }

  static async setRealmEncryptionKey(key: ArrayBuffer): Promise<void> {
    if (key.byteLength !== REALM_ENCRYPTION_KEY_LENGTH) {
      throw new Error(`Realm encryption key must be ${REALM_ENCRYPTION_KEY_LENGTH} bytes`);
    }
    try {
      const hex = this.arrayBufferToHex(key);
      await Keychain.setGenericPassword(
        KEYCHAIN_USERNAME,
        hex,
        keychainSetOptions(KEYCHAIN_SERVICE_REALM_KEY),
      );
    } catch {
      throw new Error('Failed to store Realm encryption key');
    }
  }

  static generateRealmEncryptionKey(): ArrayBuffer {
    const crypto = (globalThis as { crypto?: { getRandomValues: (a: Uint8Array) => void } }).crypto;
    if (!crypto?.getRandomValues) {
      throw new Error('Secure random not available');
    }
    const key = new ArrayBuffer(REALM_ENCRYPTION_KEY_LENGTH);
    crypto.getRandomValues(new Uint8Array(key));
    return key;
  }

  static async getOrCreateRealmEncryptionKey(): Promise<ArrayBuffer> {
    const existing = await this.getRealmEncryptionKey();
    if (existing) return existing;
    const key = this.generateRealmEncryptionKey();
    await this.setRealmEncryptionKey(key);
    return key;
  }

  // --- Biometric enabled flag (for US-204; toggle UI in settings screen later) ---

  static async getBiometricEnabled(): Promise<boolean> {
    try {
      const result = await Keychain.getGenericPassword({
        service: KEYCHAIN_SERVICE_BIOMETRIC_ENABLED,
      });
      return result !== false && result.password === '1';
    } catch {
      return false;
    }
  }

  static async setBiometricEnabled(enabled: boolean): Promise<void> {
    try {
      if (enabled) {
        await Keychain.setGenericPassword(
          KEYCHAIN_USERNAME,
          '1',
          keychainSetOptions(KEYCHAIN_SERVICE_BIOMETRIC_ENABLED),
        );
      } else {
        await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE_BIOMETRIC_ENABLED });
      }
    } catch {
      // Fail silently; caller can retry
    }
  }
}

// Backward-compatible function exports (delegate to class)
export const getPinHash = SecureStorageService.getPinHash.bind(SecureStorageService);
export const setPinHash = SecureStorageService.setPinHash.bind(SecureStorageService);
export const hashPin = SecureStorageService.hashPin.bind(SecureStorageService);
export const verifyPin = SecureStorageService.verifyPin.bind(SecureStorageService);
export const setPin = SecureStorageService.setPin.bind(SecureStorageService);
export const hasPin = SecureStorageService.hasPin.bind(SecureStorageService);
export const clearPinHash = SecureStorageService.clearPinHash.bind(SecureStorageService);
export const getRealmEncryptionKey =
  SecureStorageService.getRealmEncryptionKey.bind(SecureStorageService);
export const setRealmEncryptionKey =
  SecureStorageService.setRealmEncryptionKey.bind(SecureStorageService);
export const generateRealmEncryptionKey =
  SecureStorageService.generateRealmEncryptionKey.bind(SecureStorageService);
export const getOrCreateRealmEncryptionKey =
  SecureStorageService.getOrCreateRealmEncryptionKey.bind(SecureStorageService);
export const getPinFailedAttempts =
  SecureStorageService.getPinFailedAttempts.bind(SecureStorageService);
export const setPinFailedAttempts =
  SecureStorageService.setPinFailedAttempts.bind(SecureStorageService);
export const getPinLockoutUntil =
  SecureStorageService.getPinLockoutUntil.bind(SecureStorageService);
export const setPinLockoutUntil =
  SecureStorageService.setPinLockoutUntil.bind(SecureStorageService);
export const getBiometricEnabled =
  SecureStorageService.getBiometricEnabled.bind(SecureStorageService);
export const setBiometricEnabled =
  SecureStorageService.setBiometricEnabled.bind(SecureStorageService);
