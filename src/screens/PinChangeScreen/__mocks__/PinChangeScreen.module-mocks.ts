import { mockCreateReactElement } from 'testUtils/mockCreateReactElement';

jest.mock('screens/PinChangeScreen', () => ({
  PinChangeScreen: () => mockCreateReactElement('PinChangeScreen', { testID: 'pin-change-screen' }),
}));
