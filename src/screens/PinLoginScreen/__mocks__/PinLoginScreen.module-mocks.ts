import { mockCreateReactElement } from 'testUtils/mockCreateReactElement';

export const mockSignIn = jest.fn();

jest.mock('contexts', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    signIn: mockSignIn,
    signOut: jest.fn(),
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { seconds?: number }) =>
      key === 'pin.login.locked' && opts?.seconds != null
        ? `Try again in ${opts.seconds} seconds`
        : key,
    i18n: {},
  }),
}));

jest.mock('services', () => ({
  BiometricAuthService: {
    isBiometricEnabled: jest.fn(() => Promise.resolve(false)),
    isBiometricAvailable: jest.fn(() => Promise.resolve(false)),
    requestBiometricPermission: jest.fn(() => Promise.resolve(true)),
    enableBiometric: jest.fn(() => Promise.resolve()),
    authenticateWithBiometric: jest.fn(() => Promise.resolve(false)),
  },
  PinAuthService: {
    verifyPin: jest.fn(),
    getRemainingLockoutSeconds: jest.fn(() => Promise.resolve(0)),
  },
}));

jest.mock('components/common/GradientBackground', () => ({
  GradientBackground: (props: any) =>
    mockCreateReactElement('GradientBackground', { testID: 'gradient-background', ...props }),
}));
