import { mockCreateReactElement } from 'testUtils';

jest.mock('localization/i18n', () => ({}));

jest.mock('react-native-bootsplash', () => ({
  __esModule: true,
  default: { hide: jest.fn() },
}));

jest.mock('react-native-config', () => ({
  __esModule: true,
  default: {
    SENTRY_DSN: '',
  },
}));

jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  wrap: <T>(Component: T): T => Component,
  mobileReplayIntegration: jest.fn(() => ({})),
}));

jest.mock('react-native', () => ({
  View: (props: Record<string, unknown>) => mockCreateReactElement('View', props),
  TouchableOpacity: (props: Record<string, unknown>) =>
    mockCreateReactElement('TouchableOpacity', props),
  StyleSheet: {
    create: (styles: Record<string, unknown>) => styles,
    flatten: (style: unknown) => style,
  },
  useColorScheme: jest.fn(() => 'light'),
  StatusBar: (props: Record<string, unknown>) =>
    mockCreateReactElement('StatusBar', { ...props, testID: 'status-bar' }),
}));

jest.mock('react-native-svg', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => mockCreateReactElement('Svg', props),
  G: (props: Record<string, unknown>) => mockCreateReactElement('G', props),
  Path: (props: Record<string, unknown>) => mockCreateReactElement('Path', props),
}));

jest.mock('contexts', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) =>
    mockCreateReactElement('Fragment', { children }),
  AuthProvider: ({ children }: { children: React.ReactNode }) =>
    mockCreateReactElement('Fragment', { children }),
  useAuth: () => ({
    isAuthenticated: false,
    signIn: jest.fn(),
    signOut: jest.fn(),
  }),
}));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) =>
    mockCreateReactElement('Fragment', { children }),
}));

jest.mock('navigation', () => ({
  AuthNavigator: () => mockCreateReactElement('View', { testID: 'root-navigator' }),
  AppNavigator: () => mockCreateReactElement('View', { testID: 'root-navigator' }),
}));

jest.mock('screens', () => ({
  HelloWorld: () => mockCreateReactElement('HelloWorld', { testID: 'hello-world' }),
}));

jest.mock('hooks/useAppInit', () => ({
  useAppInit: () => ({
    isReady: true,
    isFirstLaunch: false,
    hasPin: true,
  }),
}));

jest.mock('services', () => ({
  getOnboardingCompleted: jest.fn().mockResolvedValue(false),
  setOnboardingCompleted: jest.fn(),
  getPinHash: jest.fn(),
  setPinHash: jest.fn(),
  getRealmEncryptionKey: jest.fn(),
  setRealmEncryptionKey: jest.fn(),
  getOrCreateRealmEncryptionKey: jest.fn().mockResolvedValue(new ArrayBuffer(64)),
  hasPin: jest.fn().mockResolvedValue(false),
  setPin: jest.fn(),
  verifyPin: jest.fn(),
  clearPinHash: jest.fn(),
}));
