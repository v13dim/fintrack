import { mockCreateReactElement } from 'testUtils';

jest.mock('react-native', () => ({
  Text: () => mockCreateReactElement('Text', { testID: 'hello-world-text' }),
}));
