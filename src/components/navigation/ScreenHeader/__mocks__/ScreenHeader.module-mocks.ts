import { mockCreateReactElement } from 'testUtils/mockCreateReactElement';

jest.mock('@react-native-community/blur', () => ({
  BlurView: (props: Record<string, unknown>) =>
    mockCreateReactElement('BlurView', { testID: 'blur-view', ...props }),
}));
