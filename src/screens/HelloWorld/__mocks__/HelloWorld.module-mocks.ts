import { mockCreateReactElement } from 'testUtils';

const mockDimensions = {
  get: jest.fn(() => ({ width: 390, height: 844, scale: 2, fontScale: 1 })),
};

jest.mock('react-native', () => ({
  Dimensions: mockDimensions,
  StyleSheet: {
    create: (styles: Record<string, unknown>) => styles,
    flatten: (style: unknown) => style,
  },
  Text: () => mockCreateReactElement('Text', { testID: 'hello-world-text' }),
  View: (props: Record<string, unknown>) => mockCreateReactElement('View', props),
}));
