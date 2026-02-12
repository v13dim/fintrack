jest.mock('react-native', () => ({
  Platform: { OS: 'ios' as const, Version: 28, select: (_: unknown) => null },
  PermissionsAndroid: {
    request: jest.fn(),
    RESULTS: { GRANTED: 'granted' },
  },
}));

jest.mock('react-native-keychain', () => ({
  getSupportedBiometryType: jest.fn(),
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
  ACCESS_CONTROL: { BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE: 'BiometryCurrentSetOrDevicePasscode' },
  ACCESSIBLE: { WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'AccessibleWhenUnlockedThisDeviceOnly' },
}));

jest.mock('services', () => ({
  getBiometricEnabled: jest.fn(),
  setBiometricEnabled: jest.fn(),
}));
