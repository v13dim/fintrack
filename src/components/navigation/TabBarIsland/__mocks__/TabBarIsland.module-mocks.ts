import { mockCreateReactElement } from 'testUtils/mockCreateReactElement';

jest.mock('components/navigation/TabBarIsland', () => ({
  TabBarIsland: (props: Record<string, unknown>) =>
    mockCreateReactElement('TabBarIsland', { testID: 'tab-bar-island', ...props }),
}));
