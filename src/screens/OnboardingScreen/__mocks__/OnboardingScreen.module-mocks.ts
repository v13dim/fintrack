/**
 * Co-located mocks for OnboardingScreen tests.
 * No require() — strategy: use Jest automatic mocking and manual mocks only.
 * Jest allows variables prefixed with "mock" in mock factories.
 */

import { View as MockView } from 'react-native';

export const mockReplace = jest.fn();

jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  default: { View: MockView },
  useSharedValue: (initial: number) => ({ value: initial }),
  useAnimatedStyle: (fn: () => object) => (typeof fn === 'function' ? fn() : {}),
  withTiming: (toValue: number) => toValue,
}));

const onboardingT: Record<string, string> = {
  'onboarding.next': 'Next',
  'onboarding.skip': 'Skip',
  'onboarding.getStarted': 'Get Started',
  'onboarding.screen1.title': 'Take Control of Your Finances',
  'onboarding.screen1.description': 'Track your income and expenses in seconds',
  'onboarding.screen2.title': 'Plan Your Budget',
  'onboarding.screen2.description': 'Set limits by category and get notifications',
  'onboarding.screen3.title': 'Your Data is Protected',
  'onboarding.screen3.description': 'All data is stored only on your device',
};

jest.mock('navigation', () => ({
  AuthStackScreens: {
    Onboarding: 'Onboarding',
    PinCreate: 'PinCreate',
    PinLogin: 'PinLogin',
  },
  AuthStackParamList: {},
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    replace: mockReplace,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => onboardingT[key] ?? key,
    i18n: {},
  }),
}));

jest.mock('services', () => ({
  OnboardingStorageService: {
    setOnboardingCompleted: jest.fn(),
  },
}));

jest.mock('components/common/GradientBackground', () => ({
  GradientBackground: MockView,
}));
