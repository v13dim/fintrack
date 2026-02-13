/**
 * Co-located mocks for HomeScreen tests.
 * Variables prefixed with "mock" are allowed in jest.mock factories.
 */

export const mockNavigate = jest.fn();
export const mockGetParent = jest.fn(() => ({ navigate: mockNavigate }));

jest.mock('navigation', () => ({
  MainTabScreens: { Home: 'Home', Analytics: 'Analytics', Settings: 'Settings' },
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    getParent: mockGetParent,
    navigate: mockNavigate,
  }),
}));
