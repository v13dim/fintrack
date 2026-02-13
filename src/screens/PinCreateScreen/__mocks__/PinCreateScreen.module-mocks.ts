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
    t: (key: string) => key,
    i18n: {},
  }),
}));

jest.mock('services', () => ({
  PinAuthService: {
    createPin: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('components/common/GradientBackground', () => ({
  GradientBackground: (props: { children?: unknown }) => props.children,
}));
