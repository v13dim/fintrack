import { mockCreateReactElement } from 'testUtils/mockCreateReactElement';

jest.mock('components/common/Switch', () => ({
  Switch: (props: Record<string, unknown>) =>
    mockCreateReactElement('Switch', { testID: 'switch', ...props }),
}));
