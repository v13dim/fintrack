import {
  getPinFailedAttempts,
  getPinLockoutUntil,
  setPin,
  setPinFailedAttempts,
  setPinLockoutUntil,
  verifyPin,
} from 'services/secureStorageService';

import { PinAuthService } from '../pinAuthService';

jest.mock('services/secureStorageService', () => ({
  getPinFailedAttempts: jest.fn(),
  getPinLockoutUntil: jest.fn(),
  getPinHash: jest.fn(),
  setPin: jest.fn(),
  setPinHash: jest.fn(),
  setPinFailedAttempts: jest.fn(),
  setPinLockoutUntil: jest.fn(),
  verifyPin: jest.fn(),
}));

const mockVerifyPin = verifyPin as jest.Mock;
const mockSetPin = setPin as jest.Mock;
const mockSetPinFailedAttempts = setPinFailedAttempts as jest.Mock;
const mockSetPinLockoutUntil = setPinLockoutUntil as jest.Mock;
const mockGetPinFailedAttempts = getPinFailedAttempts as jest.Mock;
const mockGetPinLockoutUntil = getPinLockoutUntil as jest.Mock;

describe('PinAuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetPinFailedAttempts.mockResolvedValue(0);
    mockGetPinLockoutUntil.mockResolvedValue(null);
  });

  describe('createPin', () => {
    it('should call setPin and reset failed attempts', async () => {
      mockSetPin.mockResolvedValue(undefined);
      mockSetPinFailedAttempts.mockResolvedValue(undefined);
      mockSetPinLockoutUntil.mockResolvedValue(undefined);

      await PinAuthService.createPin('1234');

      expect(mockSetPin).toHaveBeenCalledWith('1234');
      expect(mockSetPinFailedAttempts).toHaveBeenCalledWith(0);
      expect(mockSetPinLockoutUntil).toHaveBeenCalledWith(null);
    });
  });

  describe('verifyPin', () => {
    it('should return success and reset attempts when PIN is valid', async () => {
      mockVerifyPin.mockResolvedValue(true);

      const result = await PinAuthService.verifyPin('1234');

      expect(result).toEqual({ success: true });
      expect(mockSetPinFailedAttempts).toHaveBeenCalledWith(0);
      expect(mockSetPinLockoutUntil).toHaveBeenCalledWith(null);
    });

    it('should return failure and increment attempts when PIN is invalid', async () => {
      mockVerifyPin.mockResolvedValue(false);
      mockGetPinFailedAttempts.mockResolvedValue(0).mockResolvedValueOnce(0);

      const result = await PinAuthService.verifyPin('0000');

      expect(result.success).toBe(false);
      expect((result as { attemptsLeft: number }).attemptsLeft).toBe(2);
      expect(mockSetPinFailedAttempts).toHaveBeenCalledWith(1);
    });

    it('should lock after 3 failed attempts', async () => {
      mockVerifyPin.mockResolvedValue(false);
      mockGetPinFailedAttempts
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(2);

      await PinAuthService.verifyPin('0000');
      await PinAuthService.verifyPin('0000');
      const result = await PinAuthService.verifyPin('0000');

      expect(result).toEqual({
        success: false,
        locked: true,
        remainingSeconds: 30,
      });
      expect(mockSetPinFailedAttempts).toHaveBeenCalledWith(3);
      expect(mockSetPinLockoutUntil).toHaveBeenCalled();
    });

    it('should return locked with remaining seconds when already locked', async () => {
      const future = Date.now() + 15_000;
      mockGetPinLockoutUntil.mockResolvedValue(future);

      const result = await PinAuthService.verifyPin('1234');

      expect(result).toEqual({
        success: false,
        locked: true,
        remainingSeconds: 15,
      });
      expect(mockVerifyPin).not.toHaveBeenCalled();
    });
  });

  describe('getRemainingLockoutSeconds', () => {
    it('should return 0 when no lockout', async () => {
      mockGetPinLockoutUntil.mockResolvedValue(null);

      const result = await PinAuthService.getRemainingLockoutSeconds();

      expect(result).toBe(0);
    });

    it('should return remaining seconds when locked', async () => {
      const until = Date.now() + 10_000;
      mockGetPinLockoutUntil.mockResolvedValue(until);

      const result = await PinAuthService.getRemainingLockoutSeconds();

      expect(result).toBeGreaterThanOrEqual(9);
      expect(result).toBeLessThanOrEqual(10);
    });
  });

  describe('isLocked', () => {
    it('should return false when no lockout', async () => {
      mockGetPinLockoutUntil.mockResolvedValue(null);

      const result = await PinAuthService.isLocked();

      expect(result).toBe(false);
    });

    it('should return true when lockout active', async () => {
      mockGetPinLockoutUntil.mockResolvedValue(Date.now() + 5000);

      const result = await PinAuthService.isLocked();

      expect(result).toBe(true);
    });
  });

  it('should expose lockoutDurationSeconds and maxAttempts', () => {
    expect(PinAuthService.lockoutDurationSeconds).toBe(30);
    expect(PinAuthService.maxAttempts).toBe(3);
  });
});
