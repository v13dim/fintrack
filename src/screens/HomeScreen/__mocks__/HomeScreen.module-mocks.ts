/**
 * Co-located mocks for HomeScreen tests.
 * Variables prefixed with "mock" are allowed in jest.mock factories.
 */

import { mockCreateReactElement } from 'testUtils/mockCreateReactElement';

export const mockNavigate = jest.fn();

jest.mock('navigation', () => ({
  AppStackScreens: {
    Home: 'Home',
    Settings: 'Settings',
  },
  AppStackParamList: {},
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('screens/HelloWorld', () => ({
  HelloWorld: () => mockCreateReactElement('HelloWorld', { testID: 'hello-world' }),
}));
