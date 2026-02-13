/**
 * Main tab navigator: three tabs, each with its own stack.
 */
export enum MainTabScreens {
  Home = 'Home',
  Analytics = 'Analytics',
  Settings = 'Settings',
}

export type MainTabParamList = {
  [MainTabScreens.Home]: undefined;
  [MainTabScreens.Analytics]: undefined;
  [MainTabScreens.Settings]: undefined;
};
