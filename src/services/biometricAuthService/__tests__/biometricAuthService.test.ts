import '../__mocks__/biometricAuthService.module-mocks';

import { PermissionsAndroid, Platform } from 'react-native';
import type { BIOMETRY_TYPE, UserCredentials } from 'react-native-keychain';
import * as Keychain from 'react-native-keychain';

import { getBiometricEnabled, setBiometricEnabled } from 'services';

import { BiometricAuthService } from '../biometricAuthService';

describe('BiometricAuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Platform as { Version: unknown }).Version = 28;
    jest.mocked(getBiometricEnabled).mockResolvedValue(false);
    jest.mocked(setBiometricEnabled).mockResolvedValue(undefined);
    (Keychain.getSupportedBiometryType as jest.Mock).mockResolvedValue('FaceID');
    (Keychain.setGenericPassword as jest.Mock).mockResolvedValue({});
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);
    (Keychain.resetGenericPassword as jest.Mock).mockResolvedValue(true);
  });

  describe('requestBiometricPermission', () => {
    it('should return true when permission granted (API 28, USE_FINGERPRINT)', async () => {
      jest.mocked(PermissionsAndroid.request).mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);
      expect(await BiometricAuthService.requestBiometricPermission()).toBe(true);
      expect(PermissionsAndroid.request).toHaveBeenCalledWith('android.permission.USE_FINGERPRINT');
    });

    it('should return true when permission granted (API 29+, USE_BIOMETRIC)', async () => {
      (Platform as { Version: unknown }).Version = 29;
      jest.mocked(PermissionsAndroid.request).mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);
      expect(await BiometricAuthService.requestBiometricPermission()).toBe(true);
      expect(PermissionsAndroid.request).toHaveBeenCalledWith('android.permission.USE_BIOMETRIC');
    });

    it('should return false when permission denied', async () => {
      jest.mocked(PermissionsAndroid.request).mockResolvedValue('denied');
      expect(await BiometricAuthService.requestBiometricPermission()).toBe(false);
    });

    it('should return false and log when request throws', async () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
      jest.mocked(PermissionsAndroid.request).mockRejectedValue(new Error('Permission error'));
      expect(await BiometricAuthService.requestBiometricPermission()).toBe(false);
      expect(logSpy).toHaveBeenCalledWith(
        '[BiometricAuth] Permission request error:',
        expect.any(Error),
      );
    });

    it('should use USE_FINGERPRINT when API level is 0 (Version invalid)', async () => {
      (Platform as { Version: unknown }).Version = '';
      jest.mocked(PermissionsAndroid.request).mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);
      expect(await BiometricAuthService.requestBiometricPermission()).toBe(true);
      expect(PermissionsAndroid.request).toHaveBeenCalledWith('android.permission.USE_FINGERPRINT');
    });
  });

  it('should return true from isBiometricAvailable when device supports biometry', async () => {
    jest.mocked(Keychain.getSupportedBiometryType).mockResolvedValue('TouchID' as BIOMETRY_TYPE);
    expect(await BiometricAuthService.isBiometricAvailable()).toBe(true);
  });

  it('should return false from isBiometricAvailable when device has no biometry', async () => {
    jest.mocked(Keychain.getSupportedBiometryType).mockResolvedValue(null);
    expect(await BiometricAuthService.isBiometricAvailable()).toBe(false);
  });

  it('should return false from isBiometricAvailable on error', async () => {
    jest.mocked(Keychain.getSupportedBiometryType).mockRejectedValue(new Error('err'));
    expect(await BiometricAuthService.isBiometricAvailable()).toBe(false);
  });

  it('should return value from getBiometricEnabled via secure storage', async () => {
    jest.mocked(getBiometricEnabled).mockResolvedValue(true);
    expect(await BiometricAuthService.isBiometricEnabled()).toBe(true);
  });

  it('should call setBiometricEnabled and setGenericPassword when enabling', async () => {
    await BiometricAuthService.enableBiometric();
    expect(setBiometricEnabled).toHaveBeenCalledWith(true);
    expect(Keychain.setGenericPassword).toHaveBeenCalled();
  });

  it('should call setBiometricEnabled(false) when setGenericPassword fails', async () => {
    jest.mocked(Keychain.setGenericPassword).mockRejectedValue(new Error('fail'));
    await expect(BiometricAuthService.enableBiometric()).rejects.toThrow('Biometric setup failed');
    expect(setBiometricEnabled).toHaveBeenCalledWith(false);
  });

  it('should reset token and set disabled when disabling', async () => {
    await BiometricAuthService.disableBiometric();
    expect(Keychain.resetGenericPassword).toHaveBeenCalled();
    expect(setBiometricEnabled).toHaveBeenCalledWith(false);
  });

  it('should return true from authenticateWithBiometric when keychain returns token', async () => {
    jest.mocked(Keychain.getGenericPassword).mockResolvedValue({
      username: 'fintrack',
      password: 'fintrack_biometric_auth',
      service: '',
      storage: 'KeystoreAESCBC',
    } as UserCredentials);
    expect(await BiometricAuthService.authenticateWithBiometric()).toBe(true);
  });

  it('should return false from authenticateWithBiometric when keychain returns false', async () => {
    jest.mocked(Keychain.getGenericPassword).mockResolvedValue(false);
    expect(await BiometricAuthService.authenticateWithBiometric()).toBe(false);
  });

  it('should return false from authenticateWithBiometric on error', async () => {
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
    jest.mocked(Keychain.getGenericPassword).mockRejectedValue(new Error('cancel'));
    expect(await BiometricAuthService.authenticateWithBiometric()).toBe(false);
  });
});
