/* eslint-disable react-native/split-platform-components -- biometric permission is Android-only but service is shared */
import { PermissionsAndroid, Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';

import { getBiometricEnabled, setBiometricEnabled } from 'services';

import { KEYCHAIN_SERVICE_BIOMETRIC_TOKEN } from 'constants';

const KEYCHAIN_USERNAME = 'fintrack';
/** Dummy secret; accessControl enforces biometric, value is not sensitive. */
const BIOMETRIC_TOKEN_VALUE = 'fintrack_biometric_auth';

/**
 * Biometric authentication service (US-204).
 * Uses react-native-keychain: Face ID / Touch ID prompt is triggered by reading
 * a Keychain item stored with accessControl. No separate biometric library.
 * Toggle "biometric enabled" is persisted in secure storage; settings UI comes later.
 */
export class BiometricAuthService {
  /**
   * Request runtime permission for biometrics (Android only).
   * On Android 10+ (API 29) USE_BIOMETRIC is normal and typically already granted.
   * On Android 6–9 (API 23–28) USE_FINGERPRINT is dangerous and shows a system dialog.
   * @returns true if permission granted or not required (e.g. iOS), false if user denied.
   */
  static async requestBiometricPermission(): Promise<boolean> {
    try {
      const apiLevel = Number(Platform.Version) || 0;
      const permission =
        apiLevel >= 29 ? 'android.permission.USE_BIOMETRIC' : 'android.permission.USE_FINGERPRINT';
      const result = await PermissionsAndroid.request(
        permission as (typeof PermissionsAndroid.PERMISSIONS)[keyof typeof PermissionsAndroid.PERMISSIONS],
      );
      const granted = result === PermissionsAndroid.RESULTS.GRANTED;
      return granted;
    } catch (e) {
      console.log('[BiometricAuth] Permission request error:', e);
      return false;
    }
  }

  /** Returns whether the device supports Face ID, Touch ID, or fingerprint. */
  static async isBiometricAvailable(): Promise<boolean> {
    try {
      const type = await Keychain.getSupportedBiometryType();
      return type != null;
    } catch {
      return false;
    }
  }

  /** Whether the user has enabled biometric login (stored in secure storage). */
  static async isBiometricEnabled(): Promise<boolean> {
    return getBiometricEnabled();
  }

  /**
   * Enable biometric login: persist flag and create a Keychain item that requires
   * biometric (or device passcode) to read. Call when user turns on the option (e.g. from settings).
   */
  static async enableBiometric(): Promise<void> {
    await setBiometricEnabled(true);
    try {
      await Keychain.setGenericPassword(KEYCHAIN_USERNAME, BIOMETRIC_TOKEN_VALUE, {
        service: KEYCHAIN_SERVICE_BIOMETRIC_TOKEN,
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
    } catch {
      await setBiometricEnabled(false);
      throw new Error('Biometric setup failed');
    }
  }

  /**
   * Disable biometric login: remove token and clear flag.
   */
  static async disableBiometric(): Promise<void> {
    try {
      await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE_BIOMETRIC_TOKEN });
    } catch {
      // Ignore
    }
    await setBiometricEnabled(false);
  }

  /**
   * Request biometric authentication. System shows Face ID / Touch ID prompt.
   * @returns true if user authenticated successfully, false on cancel or error.
   */
  static async authenticateWithBiometric(): Promise<boolean> {
    try {
      const result = await Keychain.getGenericPassword({
        service: KEYCHAIN_SERVICE_BIOMETRIC_TOKEN,
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
      });
      return result !== false && result != null && result.password === BIOMETRIC_TOKEN_VALUE;
    } catch (e) {
      console.log('[BiometricAuth] authenticateWithBiometric error:', e);
      return false;
    }
  }
}
