import { createElement } from 'react';

import { mockCreateReactElement } from 'testUtils';

const mockCreateElement = createElement;
const mockCreateReactElementHelper = mockCreateReactElement;

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
  View: (props: Record<string, unknown>) => mockCreateElement('View', props),
  StyleSheet: {
    create: (styles: Record<string, unknown>) => styles,
    flatten: (style: unknown) => style,
  },
  useColorScheme: jest.fn(() => 'light'),
  StatusBar: (props: Record<string, unknown>) =>
    mockCreateReactElementHelper('StatusBar', { ...props, testID: 'status-bar' }),
}));

jest.mock('screens', () => ({
  HelloWorld: () => mockCreateReactElementHelper('HelloWorld', { testID: 'hello-world' }),
}));
