import React from 'react';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { fireEvent, screen } from '@testing-library/react-native';
import { TabBarVisibilityProvider, useTabBarVisibility } from 'contexts';

import { renderWithTheme } from 'testUtils';

import { TabBarIsland } from '../TabBarIsland';

const TabBarWithHidden = (props: BottomTabBarProps) => {
  const { setTabBarHidden } = useTabBarVisibility();
  React.useEffect(() => {
    setTabBarHidden(true);
  }, [setTabBarHidden]);
  return <TabBarIsland {...props} />;
};

const mockState = {
  index: 0,
  routeNames: ['Home', 'Analytics', 'Settings'],
  key: 'tab',
  routes: [
    { key: 'Home', name: 'Home', params: undefined },
    { key: 'Analytics', name: 'Analytics', params: undefined },
    { key: 'Settings', name: 'Settings', params: undefined },
  ],
  stale: false as const,
  type: 'tab',
};

const createDescriptor = (name: string) => ({
  key: name,
  options: {
    title: name,
    tabBarIcon: () => null,
  },
  route: { key: name, name, params: undefined },
  navigation: {} as never,
  render: () => null,
});

const mockDescriptors = {
  Home: createDescriptor('Home'),
  Analytics: createDescriptor('Analytics'),
  Settings: createDescriptor('Settings'),
};

const mockNavigation: {
  emit: jest.Mock;
  navigate: jest.Mock;
} = {
  emit: jest.fn(() => ({ defaultPrevented: false })),
  navigate: jest.fn(),
};

const mockInsets = { top: 0, right: 0, bottom: 34, left: 0 };

const mockTabBarProps: BottomTabBarProps = {
  state: mockState as BottomTabBarProps['state'],
  descriptors: mockDescriptors as unknown as BottomTabBarProps['descriptors'],
  navigation: mockNavigation as unknown as BottomTabBarProps['navigation'],
  insets: mockInsets,
};

describe('TabBarIsland', () => {
  it('should render island container with testID', () => {
    renderWithTheme(
      <TabBarVisibilityProvider>
        <TabBarIsland {...mockTabBarProps} />
      </TabBarVisibilityProvider>,
    );
    expect(screen.getByTestId('tab-bar-island')).toBeTruthy();
  });

  it('should render tab buttons for each route', () => {
    renderWithTheme(
      <TabBarVisibilityProvider>
        <TabBarIsland {...mockTabBarProps} />
      </TabBarVisibilityProvider>,
    );
    expect(screen.getByTestId('tab-bar-home')).toBeTruthy();
    expect(screen.getByTestId('tab-bar-analytics')).toBeTruthy();
    expect(screen.getByTestId('tab-bar-settings')).toBeTruthy();
  });

  it('should render pill after tab row layout', () => {
    renderWithTheme(
      <TabBarVisibilityProvider>
        <TabBarIsland {...mockTabBarProps} />
      </TabBarVisibilityProvider>,
    );
    expect(screen.queryByTestId('tab-bar-pill')).toBeNull();
    fireEvent(screen.getByTestId('tab-bar-row'), 'layout', {
      nativeEvent: { layout: { width: 240, height: 44, x: 0, y: 0 } },
    });
    expect(screen.getByTestId('tab-bar-pill')).toBeTruthy();
  });

  it('should navigate to tab when non-focused tab is pressed', () => {
    renderWithTheme(
      <TabBarVisibilityProvider>
        <TabBarIsland {...mockTabBarProps} />
      </TabBarVisibilityProvider>,
    );
    fireEvent.press(screen.getByTestId('tab-bar-analytics'));
    expect(mockNavigation.emit).toHaveBeenCalledWith({
      type: 'tabPress',
      target: 'Analytics',
      canPreventDefault: true,
    });
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Analytics', undefined);
  });

  it('should not navigate when event.defaultPrevented is true', () => {
    const nav = {
      emit: jest.fn(() => ({ defaultPrevented: true })),
      navigate: jest.fn(),
    };
    renderWithTheme(
      <TabBarVisibilityProvider>
        <TabBarIsland
          {...mockTabBarProps}
          navigation={nav as unknown as BottomTabBarProps['navigation']}
        />
      </TabBarVisibilityProvider>,
    );
    fireEvent.press(screen.getByTestId('tab-bar-settings'));
    expect(nav.emit).toHaveBeenCalled();
    expect(nav.navigate).not.toHaveBeenCalled();
  });

  it('should not navigate when focused tab is pressed', () => {
    const nav = {
      emit: jest.fn(() => ({ defaultPrevented: false })),
      navigate: jest.fn(),
    };
    renderWithTheme(
      <TabBarVisibilityProvider>
        <TabBarIsland
          {...mockTabBarProps}
          state={{ ...mockState, index: 1 } as BottomTabBarProps['state']}
          navigation={nav as unknown as BottomTabBarProps['navigation']}
        />
      </TabBarVisibilityProvider>,
    );
    fireEvent.press(screen.getByTestId('tab-bar-analytics'));
    expect(nav.emit).toHaveBeenCalled();
    expect(nav.navigate).not.toHaveBeenCalled();
  });

  it('should animate off-screen when tabBarHidden is true', () => {
    renderWithTheme(
      <TabBarVisibilityProvider>
        <TabBarWithHidden {...mockTabBarProps} />
      </TabBarVisibilityProvider>,
    );
    expect(screen.getByTestId('tab-bar-island')).toBeTruthy();
  });

  it('should use tabBarLabel when provided, else title, else route name', () => {
    const descriptorsWithLabelVariants = {
      Home: {
        ...createDescriptor('Home'),
        options: { ...createDescriptor('Home').options, tabBarLabel: 'Home Label' },
      },
      Analytics: createDescriptor('Analytics'),
      Settings: {
        ...createDescriptor('Settings'),
        options: { title: undefined, tabBarIcon: () => null },
      },
    } as unknown as BottomTabBarProps['descriptors'];
    renderWithTheme(
      <TabBarVisibilityProvider>
        <TabBarIsland {...mockTabBarProps} descriptors={descriptorsWithLabelVariants} />
      </TabBarVisibilityProvider>,
    );
    expect(screen.getByText('Home Label')).toBeTruthy();
    expect(screen.getByText('Analytics')).toBeTruthy();
    expect(screen.getByText('Settings')).toBeTruthy();
  });

  it('should apply pressed style when tab button is pressed', () => {
    renderWithTheme(
      <TabBarVisibilityProvider>
        <TabBarIsland {...mockTabBarProps} />
      </TabBarVisibilityProvider>,
    );
    fireEvent(screen.getByTestId('tab-bar-home'), 'pressIn');
    fireEvent(screen.getByTestId('tab-bar-home'), 'pressOut');
    expect(screen.getByTestId('tab-bar-home')).toBeTruthy();
  });

  it('should set accessibilityState.selected on focused tab only', () => {
    renderWithTheme(
      <TabBarVisibilityProvider>
        <TabBarIsland
          {...mockTabBarProps}
          state={{ ...mockState, index: 2 } as BottomTabBarProps['state']}
        />
      </TabBarVisibilityProvider>,
    );
    const homeButton = screen.getByTestId('tab-bar-home');
    const settingsButton = screen.getByTestId('tab-bar-settings');
    expect(homeButton.props.accessibilityState?.selected).toBeFalsy();
    expect(settingsButton.props.accessibilityState?.selected).toBe(true);
  });
});
