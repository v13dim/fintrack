import * as Keychain from 'react-native-keychain';
import * as bcrypt from 'bcryptjs';

import { REALM_ENCRYPTION_KEY_LENGTH } from 'constants';

import {
  clearPinHash,
  getBiometricEnabled,
  getOrCreateRealmEncryptionKey,
  getPinFailedAttempts,
  getPinHash,
  getPinLockoutUntil,
  getRealmEncryptionKey,
  hasPin,
  setBiometricEnabled,
  setPin,
  setPinFailedAttempts,
  setPinHash,
  setPinLockoutUntil,
  setRealmEncryptionKey,
  verifyPin,
} from '../secureStorageService';

jest.mock('react-native-get-random-values', () => ({}));
jest.mock('react-native-keychain', () => ({
  getGenericPassword: jest.fn(),
  setGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
  ACCESSIBLE: { WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'AccessibleWhenUnlockedThisDeviceOnly' },
  STORAGE_TYPE: { AES_GCM_NO_AUTH: 'KeystoreAESGCM_NoAuth' },
}));
jest.mock('bcryptjs', () => ({
  hashSync: jest.fn((_pin: string) => '$2a$10$mockhash'),
  compareSync: jest.fn(),
}));

describe('secureStorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PIN hash', () => {
    it('should return null from getPinHash when keychain has no value', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);

      const result = await getPinHash();

      expect(result).toBeNull();
      expect(Keychain.getGenericPassword).toHaveBeenCalledWith({
        service: '@fintrack/secure_pin_hash',
      });
    });

    it('should return password from getPinHash when keychain has value', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'fintrack',
        password: '$2a$10$hashed',
      });

      const result = await getPinHash();

      expect(result).toBe('$2a$10$hashed');
    });

    it('should return null from getPinHash when keychain throws', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockRejectedValue(new Error('keychain error'));

      const result = await getPinHash();

      expect(result).toBeNull();
    });

    it('should store hash in keychain via setPinHash', async () => {
      (Keychain.setGenericPassword as jest.Mock).mockResolvedValue(undefined);

      await setPinHash('$2a$10$storedHash');

      expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
        'fintrack',
        '$2a$10$storedHash',
        expect.objectContaining({ service: '@fintrack/secure_pin_hash' }),
      );
    });

    it('should return true from verifyPin when PIN matches stored hash', async () => {
      const pin = '1234';
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'fintrack',
        password: '$2a$10$storedhash',
      });
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

      const result = await verifyPin(pin);

      expect(result).toBe(true);
      expect(bcrypt.compareSync).toHaveBeenCalledWith(pin, '$2a$10$storedhash');
    });

    it('should return false from verifyPin when PIN does not match', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'fintrack',
        password: '$2a$10$storedhash',
      });
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

      const result = await verifyPin('1234');

      expect(result).toBe(false);
    });

    it('should return false from verifyPin when no hash stored', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);

      const result = await verifyPin('1234');

      expect(result).toBe(false);
    });

    it('should hash PIN and store in keychain via setPin', async () => {
      (Keychain.setGenericPassword as jest.Mock).mockResolvedValue(undefined);

      await setPin('5678');

      expect(bcrypt.hashSync).toHaveBeenCalledWith('5678', 10);
      expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
        'fintrack',
        '$2a$10$mockhash',
        expect.objectContaining({ service: '@fintrack/secure_pin_hash' }),
      );
    });

    it('should return true from hasPin when hash is stored', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'fintrack',
        password: '$2a$10$something',
      });

      const result = await hasPin();

      expect(result).toBe(true);
    });

    it('should return false from hasPin when no hash stored', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);

      const result = await hasPin();

      expect(result).toBe(false);
    });

    it('should call resetGenericPassword when clearPinHash is used', async () => {
      (Keychain.resetGenericPassword as jest.Mock).mockResolvedValue(undefined);

      await clearPinHash();

      expect(Keychain.resetGenericPassword).toHaveBeenCalledWith({
        service: '@fintrack/secure_pin_hash',
      });
    });
  });

  describe('PIN lockout', () => {
    it('should return 0 from getPinFailedAttempts when keychain has no value', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);

      const result = await getPinFailedAttempts();

      expect(result).toBe(0);
      expect(Keychain.getGenericPassword).toHaveBeenCalledWith({
        service: '@fintrack/pin_failed_attempts',
      });
    });

    it('should return parsed count from getPinFailedAttempts (capped at 3)', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'fintrack',
        password: '2',
      });

      const result = await getPinFailedAttempts();

      expect(result).toBe(2);
    });

    it('should return 3 from getPinFailedAttempts when stored value is greater than 3', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'fintrack',
        password: '5',
      });

      const result = await getPinFailedAttempts();

      expect(result).toBe(3);
    });

    it('should return 0 from getPinFailedAttempts when stored value is invalid', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'fintrack',
        password: 'not-a-number',
      });

      const result = await getPinFailedAttempts();

      expect(result).toBe(0);
    });

    it('should return 0 from getPinFailedAttempts when keychain throws', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockRejectedValue(new Error('keychain error'));

      const result = await getPinFailedAttempts();

      expect(result).toBe(0);
    });

    it('should store count via setPinFailedAttempts', async () => {
      (Keychain.setGenericPassword as jest.Mock).mockResolvedValue(undefined);

      await setPinFailedAttempts(1);

      expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
        'fintrack',
        '1',
        expect.objectContaining({ service: '@fintrack/pin_failed_attempts' }),
      );
    });

    it('should return null from getPinLockoutUntil when keychain has no value', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);

      const result = await getPinLockoutUntil();

      expect(result).toBeNull();
      expect(Keychain.getGenericPassword).toHaveBeenCalledWith({
        service: '@fintrack/pin_lockout_until',
      });
    });

    it('should return parsed timestamp from getPinLockoutUntil', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'fintrack',
        password: '1700000000000',
      });

      const result = await getPinLockoutUntil();

      expect(result).toBe(1700000000000);
    });

    it('should return null from getPinLockoutUntil when stored value is not integer', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'fintrack',
        password: 'not-a-ts',
      });

      const result = await getPinLockoutUntil();

      expect(result).toBeNull();
    });

    it('should return null from getPinLockoutUntil when keychain throws', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockRejectedValue(new Error('keychain error'));

      const result = await getPinLockoutUntil();

      expect(result).toBeNull();
    });

    it('should reset keychain when setPinLockoutUntil(null)', async () => {
      (Keychain.resetGenericPassword as jest.Mock).mockResolvedValue(undefined);

      await setPinLockoutUntil(null);

      expect(Keychain.resetGenericPassword).toHaveBeenCalledWith({
        service: '@fintrack/pin_lockout_until',
      });
    });

    it('should store timestamp when setPinLockoutUntil(number)', async () => {
      (Keychain.setGenericPassword as jest.Mock).mockResolvedValue(undefined);

      await setPinLockoutUntil(1700000000000);

      expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
        'fintrack',
        '1700000000000',
        expect.objectContaining({ service: '@fintrack/pin_lockout_until' }),
      );
    });
  });

  describe('Biometric enabled', () => {
    it('should return false from getBiometricEnabled when keychain has no value', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);

      const result = await getBiometricEnabled();

      expect(result).toBe(false);
      expect(Keychain.getGenericPassword).toHaveBeenCalledWith({
        service: '@fintrack/biometric_enabled',
      });
    });

    it('should return false from getBiometricEnabled when keychain has password other than "1"', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'fintrack',
        password: '0',
      });

      const result = await getBiometricEnabled();

      expect(result).toBe(false);
    });

    it('should return false from getBiometricEnabled when keychain throws', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockRejectedValue(new Error('keychain error'));

      const result = await getBiometricEnabled();

      expect(result).toBe(false);
    });

    it('should return true from getBiometricEnabled when keychain has "1"', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'fintrack',
        password: '1',
      });

      const result = await getBiometricEnabled();

      expect(result).toBe(true);
    });

    it('should store "1" when setBiometricEnabled(true)', async () => {
      (Keychain.setGenericPassword as jest.Mock).mockResolvedValue(undefined);

      await setBiometricEnabled(true);

      expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
        'fintrack',
        '1',
        expect.objectContaining({ service: '@fintrack/biometric_enabled' }),
      );
    });

    it('should reset keychain when setBiometricEnabled(false)', async () => {
      (Keychain.resetGenericPassword as jest.Mock).mockResolvedValue(undefined);

      await setBiometricEnabled(false);

      expect(Keychain.resetGenericPassword).toHaveBeenCalledWith({
        service: '@fintrack/biometric_enabled',
      });
    });
  });

  describe('Realm encryption key', () => {
    const makeHexKey = (length: number = REALM_ENCRYPTION_KEY_LENGTH) =>
      Array.from({ length }, (_, i) => (i % 256).toString(16).padStart(2, '0')).join('');

    it('should return null from getRealmEncryptionKey when keychain has no value', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);

      const result = await getRealmEncryptionKey();

      expect(result).toBeNull();
      expect(Keychain.getGenericPassword).toHaveBeenCalledWith({
        service: '@fintrack/secure_realm_key',
      });
    });

    it('should return null from getRealmEncryptionKey when password has wrong length', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'fintrack',
        password: 'short', // not 128 hex chars
      });

      const result = await getRealmEncryptionKey();

      expect(result).toBeNull();
    });

    it('should return null from getRealmEncryptionKey when keychain throws', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockRejectedValue(new Error('keychain error'));

      const result = await getRealmEncryptionKey();

      expect(result).toBeNull();
    });

    it('should return ArrayBuffer from getRealmEncryptionKey when key is stored as hex', async () => {
      const hex = makeHexKey();
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'fintrack',
        password: hex,
      });

      const result = await getRealmEncryptionKey();

      expect(result).not.toBeNull();
      expect(result).toBeInstanceOf(ArrayBuffer);
      expect((result as ArrayBuffer).byteLength).toBe(64);
    });

    it('should store Realm key as hex in keychain via setRealmEncryptionKey', async () => {
      (Keychain.setGenericPassword as jest.Mock).mockResolvedValue(undefined);
      const key = new Uint8Array(REALM_ENCRYPTION_KEY_LENGTH).fill(1).buffer;

      await setRealmEncryptionKey(key);

      expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
        'fintrack',
        expect.any(String),
        expect.objectContaining({ service: '@fintrack/secure_realm_key' }),
      );
      const storedHex = (Keychain.setGenericPassword as jest.Mock).mock.calls[0][1];
      expect(storedHex).toHaveLength(REALM_ENCRYPTION_KEY_LENGTH * 2);
    });

    it('should throw from setRealmEncryptionKey when key length is not 64', async () => {
      const key = new ArrayBuffer(32);

      await expect(setRealmEncryptionKey(key)).rejects.toThrow(
        'Realm encryption key must be 64 bytes',
      );
      expect(Keychain.setGenericPassword).not.toHaveBeenCalled();
    });

    it('should throw from setRealmEncryptionKey when keychain fails', async () => {
      (Keychain.setGenericPassword as jest.Mock).mockRejectedValue(new Error('keychain error'));
      const key = new Uint8Array(REALM_ENCRYPTION_KEY_LENGTH).fill(1).buffer;

      await expect(setRealmEncryptionKey(key)).rejects.toThrow(
        'Failed to store Realm encryption key',
      );
    });

    it('should return existing key from getOrCreateRealmEncryptionKey when stored', async () => {
      const hex = makeHexKey();
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'fintrack',
        password: hex,
      });

      const result = await getOrCreateRealmEncryptionKey();

      expect(result).toBeInstanceOf(ArrayBuffer);
      expect(result.byteLength).toBe(64);
      expect(Keychain.setGenericPassword).not.toHaveBeenCalled();
    });

    it('should generate and store key from getOrCreateRealmEncryptionKey when none stored', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);
      (Keychain.setGenericPassword as jest.Mock).mockResolvedValue(undefined);

      const result = await getOrCreateRealmEncryptionKey();

      expect(result).toBeInstanceOf(ArrayBuffer);
      expect(result.byteLength).toBe(64);
      expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
        'fintrack',
        expect.any(String),
        expect.objectContaining({ service: '@fintrack/secure_realm_key' }),
      );
    });
  });
});
